const PAYMENT_METHOD_LIST = [`現金`, `クレジットカード`, `銀行振込`, `自動口座引落`, `その他`]
const AQCUSTOMER_STATUS_LIST = [`継続`, `単発`, `解約`]

const AQCUSTOMER_RECORD_TYPE_LIST = [`新規`, `メンテナンス`, `契約`, `FAX`, `その他`]
const AQCUSTOMER_RECORD_STATUS_LIST = [`処理済`, `対応中`, `キャンセル`]

const TAX_TYPE = [0, 8, 10]

const BANK_LIST = [
  {
    value: '群馬銀行',
    detail: {
      bankName: '群馬銀行',
      branchName: '前橋北支店',
      accountType: '普通預金',
      accountNumber: '0895568',
      accountHolder: 'ユ）アクアポット',
    },
  },
  {
    value: '住信SBIネット銀行',
    detail: {
      bankName: '住信SBIネット銀行',
      branchName: '法人第一支店（106）',
      accountType: '普通口座',
      accountNumber: '2126002',
      accountHolder: 'ユ）アクアポット',
    },
  },
]

const CUSTOMER = {
  AQCUSTOMER_STATUS_LIST,
  AQCUSTOMER_RECORD_STATUS_LIST,
  AQCUSTOMER_RECORD_TYPE_LIST,
}

export const AQ_CONST = {
  PAYMENT_METHOD_LIST,
  TAX_TYPE,
  CUSTOMER,
}
