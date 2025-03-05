import {MonthlyTbmDriveData} from '@app/(apps)/tbm/(pages)/DriveDetail/page'
import prisma from '@lib/prisma'

export const getMonthlyTbmDriveData = async ({whereQuery, tbmBaseId}) => {
  const ConfigForMonth = await prisma.tbmMonthlyConfigForRouteGroup.findFirst({
    where: {
      yearMonth: whereQuery.gte,
      TbmRouteGroup: {
        tbmBaseId: tbmBaseId,
      },
    },
  })
  const tbmDriveSchedule = await prisma.tbmDriveSchedule.findMany({
    where: {date: whereQuery, tbmBaseId},
    orderBy: [{date: 'asc'}, {userId: 'asc'}],
    include: {
      TbmRouteGroup: {
        include: {
          TbmMonthlyConfigForRouteGroup: {
            where: {yearMonth: whereQuery.gte},
          },
          Mid_TbmRouteGroup_TbmCustomer: {include: {TbmCustomer: {}}},
          Mid_TbmRouteGroup_TbmProduct: {include: {TbmProduct: {}}},
        },
      },
      TbmVehicle: {},
      User: {},
    },
  })

  const monthlyTbmDriveData: MonthlyTbmDriveData = {
    rows: tbmDriveSchedule.map(schedule => {
      const ConfigForRoute = schedule.TbmRouteGroup.TbmMonthlyConfigForRouteGroup.find(
        config => config.tbmRouteGroupId === schedule.TbmRouteGroup.id
      )

      const S_driverFee = ConfigForRoute?.driverFee ?? 0
      const billingFee = ConfigForRoute?.billingFee ?? 0
      const tollFee = ConfigForRoute?.tollFee ?? 0

      const N_postalFee = ConfigForRoute?.postalFee ?? 0
      const O_postalHighwayFee = schedule.postalHighwayFee ?? 0

      const P_generalFee = ConfigForRoute?.generalFee ?? 0
      const Q_generalHighwayFee = schedule.generalHighwayFee ?? 0

      const V_thirteenPercentOfPostalHighway = O_postalHighwayFee * 0.3
      const U_jomuinFutan = O_postalHighwayFee - (N_postalFee + V_thirteenPercentOfPostalHighway)
      const W_general = Q_generalHighwayFee - P_generalFee
      const T_JomuinUnchin = S_driverFee - (V_thirteenPercentOfPostalHighway + W_general)

      const Customer = schedule.TbmRouteGroup?.Mid_TbmRouteGroup_TbmCustomer?.TbmCustomer
      const Product = schedule.TbmRouteGroup?.Mid_TbmRouteGroup_TbmProduct?.TbmProduct

      return {
        schedule: schedule,
        ConfigForRoute,
        keyValue: {
          date: {
            type: 'date',
            label: '運行日',
            value: schedule.date,
          },
          routeCode: {
            label: '便CD',
            value: schedule.TbmRouteGroup.code,
          },
          routeName: {
            label: '便名',
            value: schedule.TbmRouteGroup.name,
            style: {minWidth: 160},
          },
          vehicleType: {
            label: '車種',
            value: schedule.TbmVehicle.name,
          },
          productCode: {
            label: '品名CD',
            value: Product?.code,
          },
          productName: {
            label: '品名',
            value: Product?.name,
            style: {minWidth: 120},
          },
          customerCode: {
            label: '取引先CD',
            value: Customer?.code,
          },
          customerName: {
            label: '取引先',
            value: Customer?.name,
            style: {minWidth: 240},
          },
          vehicleTypeCode: {
            label: '車種CD',
            value: 'コード',
          },
          plateNumber: {
            label: '車番',
            value: schedule.TbmVehicle.plate,
          },
          driverCode: {
            label: '運転手CD',
            value: 'コード',
          },
          driverName: {
            label: '運転手',
            value: schedule.User.name,
          },
          postalFee: {
            label: '通行料(郵便)',
            value: N_postalFee,
            style: {backgroundColor: '#fcdede'},
          },
          postalHighwayFee: {
            label: '高速代（郵便）',
            value: O_postalHighwayFee,
            style: {backgroundColor: '#fcdede'},
          },
          generalFee: {
            label: '通行料(一般)',
            value: P_generalFee,
            style: {backgroundColor: '#deebfc'},
          },
          generalHighwayFee: {
            label: '高速代（一般）',
            value: Q_generalHighwayFee,
            style: {backgroundColor: '#deebfc'},
          },
          highwayUsageFee: {
            label: '高速使用代',
            value: U_jomuinFutan,
          },
          fare: {
            label: '運賃',
            value: S_driverFee,
          },
          salaryFare: {
            label: '給与算定運賃',
            value: T_JomuinUnchin,

            style: {backgroundColor: '#defceb'},
          },
          highwayFeeWithSurcharge: {
            label: ['乗務員負担', '高速代-(通行量+30％)'].join(`\n`),
            value: U_jomuinFutan,
            style: {backgroundColor: '#defceb'},
          },
          highwaySurcharge: {
            label: ['運賃から負担', '高速代の30％'].join(`\n`),
            value: V_thirteenPercentOfPostalHighway,
            style: {backgroundColor: '#defceb'},
          },
          highwayFeeDiff: {
            label: '高速代-通行料',
            value: W_general,
            style: {backgroundColor: '#9ec1ff'},
          },
          highwayExcess: {
            label: '高速超過分',
            value: '要検討',
          },
          remarks: {
            label: '備考',
            value: '要検討',
          },
          orderNumber: {
            label: '発注書NO',
            value: '要検討',
          },
        },
      }
    }),
  }
  return {monthlyTbmDriveData, ConfigForMonth}
}
