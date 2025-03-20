export type meisaiKey =
  | `date`
  | `routeCode`
  | `routeName`
  | `vehicleType`
  | `productCode`
  | `productName`
  | `customerCode`
  | `customerName`
  | `vehicleTypeCode`
  | `plateNumber`
  | `driverCode`
  | `driverName`
  | `N_postalFee`
  | `O_postalHighwayFee`
  | `P_generalFee`
  | `Q_generalHighwayFee`
  | `U_jomuinFutan`
  | `S_driverFee`
  | `T_JomuinUnchin`
  | `U_jomuinFutan`
  | `V_thirteenPercentOfPostalHighway`
  | `W_general`
  | `X_highwayExcess`
  | `Y_remarks`
  | `Z_orderNumber`

export type MonthlyTbmDriveData = {
  rows: {
    schedule: TbmDriveSchedule & {User: User}
    ConfigForRoute: TbmMonthlyConfigForRouteGroup | undefined
    keyValue: {
      [key in meisaiKey]: {
        type?: any
        label: string
        value?: number | string | Date | null
        style?: {
          width?: number
          minWidth?: number
          backgroundColor?: string
        }
      }
    }
  }[]
}

import prisma from '@lib/prisma'
import {TbmDriveSchedule, TbmMonthlyConfigForRouteGroup, User} from '@prisma/client'

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
    orderBy: [{date: 'asc'}, {createdAt: 'asc'}, {userId: 'asc'}],
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
      const O_postalHighwayFee = schedule.O_postalHighwayFee ?? 0

      const P_generalFee = ConfigForRoute?.generalFee ?? 0
      const Q_generalHighwayFee = schedule.Q_generalHighwayFee ?? 0

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
            value: schedule.TbmVehicle.type,
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
            value: schedule.TbmVehicle.vehicleNumber,
          },
          driverCode: {
            label: '運転手CD',
            value: 'コード',
          },
          driverName: {
            label: '運転手',
            value: schedule.User.name,
          },
          N_postalFee: {
            label: '通行料(郵便)',
            value: N_postalFee,
            style: {backgroundColor: '#fcdede'},
          },
          O_postalHighwayFee: {
            label: '高速代（郵便）',
            value: O_postalHighwayFee,
            style: {backgroundColor: '#fcdede'},
          },
          P_generalFee: {
            label: '通行料(一般)',
            value: P_generalFee,
            style: {backgroundColor: '#deebfc'},
          },
          Q_generalHighwayFee: {
            label: '高速代（一般）',
            value: Q_generalHighwayFee,
            style: {backgroundColor: '#deebfc'},
          },
          R_KosokuShiyu: {
            label: '高速使用代',
            value: U_jomuinFutan,
          },
          S_driverFee: {
            label: '運賃',
            value: S_driverFee,
          },
          T_JomuinUnchin: {
            label: '給与算定運賃',
            value: T_JomuinUnchin,
            style: {backgroundColor: '#defceb'},
          },
          U_jomuinFutan: {
            label: ['乗務員負担', '高速代-(通行量+30％)'].join(`\n`),
            value: U_jomuinFutan,
            style: {backgroundColor: '#defceb'},
          },
          V_thirteenPercentOfPostalHighway: {
            label: ['運賃から負担', '高速代の30％'].join(`\n`),
            value: V_thirteenPercentOfPostalHighway,
            style: {backgroundColor: '#defceb'},
          },
          W_general: {
            label: '高速代-通行料',
            value: W_general,
            style: {backgroundColor: '#9ec1ff'},
          },
          X_highwayExcess: {
            label: '高速超過分',
            value: 0,
          },
          Y_remarks: {
            label: '備考',
            value: '要検討',
          },
          Z_orderNumber: {
            label: '発注書NO',
            value: '要検討',
          },
        },
      }
    }),
  }

  const userList = monthlyTbmDriveData.rows
    .reduce((acc, row) => {
      const {schedule, ConfigForRoute} = row
      const {User} = schedule
      if (acc.find(user => user.id === User.id)) {
        return acc
      }
      acc.push(User)
      return acc
    }, [] as User[])
    .sort((a, b) => String(a.code ?? '').localeCompare(String(b.code ?? '')))

  return {monthlyTbmDriveData, ConfigForMonth, userList}
}
