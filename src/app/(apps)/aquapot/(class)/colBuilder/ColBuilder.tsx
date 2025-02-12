'use client'

import {aqCustomer} from '@app/(apps)/aquapot/(class)/colBuilder/aqCustomer'
import {aqCustomerRecordCol} from '@app/(apps)/aquapot/(class)/colBuilder/aqCustomerRecordCol'
import {aqCustomerSubscription} from '@app/(apps)/aquapot/(class)/colBuilder/aqCustomerSubscription'
import {aqSaleRecord} from '@app/(apps)/aquapot/(class)/colBuilder/aqSaleRecord'
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

export class ColBuilder {
  static aqCustomerSubscription = aqCustomerSubscription
  static aqInventoryRegister = (props: columnGetterType) => {
    return new Fields([
      {
        id: 'date',
        label: `登録日`,
        form: {},
        type: `date`,
      },
      {id: 'aqProductId', label: `商品 `, form: {...defaultRegister}, forSelect: {}},
      {id: 'aqCustomerId', label: `仕入れ先顧客`, form: {...defaultRegister}, forSelect: {}},
      {id: 'quantity', label: `数量`, form: {...defaultRegister}, type: `number`},
    ]).transposeColumns()
  }
  static aqCustomer = aqCustomer
  static aqSaleRecord = aqSaleRecord
  static aqCustomerRecord = aqCustomerRecordCol
  static aqCustomerRecordAttachment = (props: columnGetterType) => {
    return new Fields([
      //
      {id: `title`, label: `ファイルタイトル`, form: {...defaultRegister}},
      {
        id: `url`,
        label: `ファイル`,
        type: `file`,
        form: {
          // ...defaultRegister,
          descriptionNoteAfter: `JPEG、PNG、PDFに対応`,
          file: {
            accept: {
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/png': ['.png'],
              'application/pdf': ['.pdf'],
            },
            backetKey: `aqCustomerRecordAttachment`,
          },
        },
      },
    ]).transposeColumns()
  }
  static aqSupportGroupMater = (props: columnGetterType) => {
    return new Fields([
      //
      {id: `name`, label: `名称`, form: {...defaultRegister}},
    ]).transposeColumns()
  }
  static aqCustomerSupportGroupMidTable = (props: columnGetterType) => {
    return new Fields([
      //
      // {id: `aqCustomerId`, label: `顧客`, forSelect: {}},
      {id: `aqSupportGroupMasterId`, label: `支援団体`, forSelect: {}},
      {id: `from`, label: `開始日`, type: `date`, form: {...defaultRegister}},
      {id: `to`, label: `終了日`, type: `date`, form: {}},
    ]).transposeColumns()
  }
  static aqCustomerPriceOption = (props: columnGetterType) => {
    return new Fields([
      //
      // {id: `aqCustomerId`, label: `顧客`, forSelect: {}},
      {id: `aqProductId`, label: `商品`, forSelect: {}, form: {...defaultRegister}},
      {
        id: `aqPriceOptionId`,
        label: `価格オプション`,
        form: {...defaultRegister},
        forSelect: {
          dependenceColIds: [`aqProductId`],
          config: {
            select: {price: `number`},
            nameChanger: op => {
              const opName = op ? `${op.name}【${op.price}】` : ''
              return {...op, name: opName}
            },
            where: props => {
              return {
                aqProductId: props.latestFormData['aqProductId'] ?? 0,
              }
            },
          },
        },
      },
    ]).transposeColumns()
  }
  static store = (props: columnGetterType) => {
    return new Fields([{...{id: 'name', label: '名称'}, form: {...defaultRegister}}]).transposeColumns()
  }
  static user = (props: columnGetterType) => {
    return new Fields([
      {id: 'name', label: '名称', form: {...defaultRegister}},
      {id: 'email', label: 'Email', form: {...defaultRegister}},
      {id: 'password', label: 'パスワード', type: `password`, form: {...defaultRegister}},
    ]).transposeColumns()
  }
  static aqPriceOption = (props: columnGetterType) => {
    return new Fields([
      {id: 'name', label: '名称', form: {...defaultRegister}},
      {id: 'price', label: '金額', type: `number`, form: {...defaultRegister}},
    ]).transposeColumns()
  }

  static aqProduct = getAqProduct
}
