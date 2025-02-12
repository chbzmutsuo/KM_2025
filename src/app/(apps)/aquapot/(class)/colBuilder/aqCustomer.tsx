'use client'

import {aqCustomerRecordCol} from '@app/(apps)/aquapot/(class)/colBuilder/aqCustomerRecordCol'
import {aqCustomerSubscription} from '@app/(apps)/aquapot/(class)/colBuilder/aqCustomerSubscription'
import {getAqProduct} from '@app/(apps)/aquapot/(class)/colBuilder/getAqProduct'

import {AQCUSTOMER_STATUS_LIST, CUSTOMER_MODEL_CONST, TAX_TYPE} from '@app/(apps)/aquapot/(constants)/options'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {DH} from '@class/DH'

import {defaultMultipleSelectFormat} from '@class/Fields/lib/defaultFormat'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'
import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'

import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import {Paper} from '@components/styles/common-components/paper'

import GlobalModal from '@components/utils/modal/GlobalModal'
import MyPopover from '@components/utils/popover/MyPopover'

export const aqCustomer = (props: columnGetterType) => {
  const alignTdWidth = () => ({
    td: {
      withLabel: true,
      style: {maxWidth: 240, minWidth: 100},
    },
  })

  // const {router} = props.useGlobalProps
  // const HK_USE_RECORDS = props.ColBuilderExtraProps?.HK_USE_RECORDS as HK_USE_RECORDS_TYPE

  return new Fields([
    ...new Fields([
      ...new Fields([
        {id: 'customerNumber', label: '顧客番号', type: 'string', form: {}, search: {}},
        {id: 'name', label: '氏名', type: 'string', form: {}, search: {}},
      ])
        .customAttributes(alignTdWidth)
        .aggregateOnSingleTd().plain,
      ...new Fields([
        {id: 'companyName', label: '会社名', type: 'string', form: {}, search: {}},
        {id: 'jobTitle', label: '役職', type: 'string', form: {}},
      ])
        .customAttributes(alignTdWidth)
        .aggregateOnSingleTd().plain,
      ...new Fields([
        {id: 'email', label: 'メール', type: 'string', form: {}},
        {id: 'fax', label: 'FAX', type: 'string', form: {}, search: {}},
      ])
        .customAttributes(alignTdWidth)
        .aggregateOnSingleTd().plain,
      ...new Fields([
        {id: 'tel', label: '電話番号1', type: 'string', form: {}, search: {}},
        {id: 'tel2', label: '電話番号2', type: 'string', form: {}, search: {}},
        {id: 'invoiceNumber', label: '適格事業者番号', type: 'string', form: {}, search: {}},
      ])
        .customAttributes(alignTdWidth)
        .aggregateOnSingleTd().plain,
    ]).buildFormGroup({groupName: `基本情報①`}).plain,
    ...new Fields([
      ...new Fields([
        {
          id: 'defaultPaymentMethod',
          label: '支払方法',
          forSelect: {
            optionsOrOptionFetcher: CUSTOMER_MODEL_CONST.PAYMENT_METHOD_LIST,
          },
        },
        {id: `firstVisitDate`, label: `サービス利用開始日`, type: `date`, form: {}},
        {id: `lastVisitDate`, label: `サービス利用終了日`, type: `date`, form: {}},
      ])
        .customAttributes(alignTdWidth)
        .aggregateOnSingleTd().plain,
      ...new Fields([
        {
          id: `maintananceYear`,
          label: `メンテ年`,
          type: `number`,
          form: {},
          search: {},

          inputProps: {min: 1},
        },
        {
          id: `maintananceMonth`,
          label: `メンテ月`,
          type: `number`,
          form: {},
          search: {},
          inputProps: {min: 1, max: 12},
        },
        {
          id: `status`,
          label: `ステータス`,
          form: {defaultValue: `継続`},
          forSelect: {
            optionsOrOptionFetcher: AQCUSTOMER_STATUS_LIST,
          },
        },
      ])
        .customAttributes(alignTdWidth)
        .aggregateOnSingleTd().plain,
    ]).buildFormGroup({groupName: `基本情報②`}).plain,

    ...new Fields([
      ...new Fields([
        {id: 'domestic', label: '国内', type: 'boolean', form: {}},
        {id: 'postal', label: '郵便番号', type: 'string', form: {}},
        {id: 'state', label: '都道府県', type: 'string', form: {}},
      ])
        .customAttributes(alignTdWidth)
        .aggregateOnSingleTd().plain,

      ...new Fields([
        {id: 'city', label: '市区町村', type: 'string', form: {}},
        {id: 'street', label: '町名', type: 'string', form: {}},
        {id: 'building', label: '建物名', type: 'string', form: {}},
      ])
        .customAttributes(alignTdWidth)
        .aggregateOnSingleTd().plain,
    ]).buildFormGroup({groupName: `住所`}).plain,

    ...new Fields([
      ...new Fields([
        {
          id: `aqCustomerServiceTypeMidTable`,
          label: `ご利用サービス`,
          multipleSelect: {
            models: {
              parent: `aqCustomer`,
              mid: `aqCustomerServiceTypeMidTable`,
              option: `aqServiecTypeMaster`,
              uniqueWhereKey: `unique_aqCustomerId_aqServiecTypeMasterId`,
            },
          },
          format: defaultMultipleSelectFormat,
          form: {},
        },
        {
          id: `aqCustomerDealerMidTable`,
          label: `担当販売店`,
          multipleSelect: {
            models: {
              parent: `aqCustomer`,
              mid: `aqCustomerDealerMidTable`,
              option: `aqDealerMaster`,
              uniqueWhereKey: `unique_aqCustomerId_aqDealerMasterId`,
            },
          },
          format: defaultMultipleSelectFormat,
          form: {},
        },
        {
          id: `aqCustomerDeviceMidTable`,
          label: `ご利用機種`,
          multipleSelect: {
            models: {
              parent: `aqCustomer`,
              mid: `aqCustomerDeviceMidTable`,
              option: `aqDeviceMaster`,
              uniqueWhereKey: `unique_aqCustomerId_aqDeviceMasterId`,
            },
          },
          format: defaultMultipleSelectFormat,
          form: {},
        },
      ])
        .customAttributes(({col}) => ({
          ...col,
          td: {...col.td, style: {width: 120}},
          form: {...col.form, style: {width: 500}},
        }))
        .aggregateOnSingleTd().plain,
      {id: 'remarks', label: '備考', type: 'textarea', form: {}, td: {style: {minWidth: 250}}, search: {}},
    ]).buildFormGroup({groupName: `その他`}).plain,

    {
      id: `AqCustomerPriceOption`,
      label: `設定価格一覧`,
      form: {hidden: true},
      format: (value, row) => {
        return CsvTable({
          headerRecords: [],
          bodyRecords: row.AqCustomerPriceOption.map(d => {
            const {AqProduct, AqPriceOption} = d ?? {}
            const truncate = `truncate w-[60px] text-xs`
            return {
              csvTableRow: [AqProduct?.name, AqPriceOption?.name, AqPriceOption?.price].map(d => ({
                cellValue: <div {...{className: truncate}}>{d} </div>,
              })),
            }
          }),
        }).WithWrapper({...{className: `max-h-[200px]`}})
      },
    },
  ]).transposeColumns()
}
