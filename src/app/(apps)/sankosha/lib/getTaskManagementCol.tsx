import {Fields} from '@class/Fields/Fields'

export const getTaskManagementCol = () => {
  const cols1 = new Fields([
    //aggregate
    ...new Fields([
      {...{id: 'estimateIssueDate', label: '見積書発行日'}, type: 'date'},
      {...{id: 'estimateIssueDateIsEmpty', label: '見積書なし'}, type: 'boolean'},
      {...{id: 'orderFormArrivalDate', label: '発注書到着日'}, type: 'date'},
      {...{id: 'orderFormArrivalDateisEmpty', label: '発注書なし'}, type: 'boolean'},
      {...{id: 'orderFormNumber', label: '発注書No'}},
    ]).aggregateOnSingleTd().plain,

    // //aggregate
    // ...new Fields([
    //   {...{id: 'processStartedAt', label: '着工日'}, type: 'date'},
    //   {...{id: 'confirmationDate', label: '確認日'}, type: 'date'},
    // ]).aggregateOnSingleTd().plain,
  ])

  const cols2 = new Fields([
    //aggregate
    ...new Fields([
      {...{id: 'notes', label: '注意事項'}, type: 'textarea'},
      {...{id: 'completionDate', label: '洗浄完了日'}, type: 'date'},
      {...{id: 'shipmentCompletionDate', label: '出荷日'}, type: 'date'},
    ]).aggregateOnSingleTd().plain,
  ])
  return [
    ...cols1.buildFormGroup({groupName: `その他タスク1`}).plain,
    ...cols2.buildFormGroup({groupName: `その他タスク2`}).plain,
  ]
}
