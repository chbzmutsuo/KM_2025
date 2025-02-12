import {getMidnight} from '@class/Days'
import {Fields} from '@class/Fields/Fields'
import BasicCarousel from '@components/utils/Carousel/BasicCarousel'
import {differenceInDays} from 'date-fns'

export const getInspectionCols = () => {
  const cols1 = new Fields([
    ...new Fields([
      {
        ...{id: 'photo', label: '写真撮影'},
        type: 'file',
        form: {hidden: true},
        format: (value, row) => {
          const Images = row.SankoshaProductImage?.map((d: any) => {
            return {title: ``, description: ``, imageUrl: d.url}
          })
          return <BasicCarousel {...{Images, imgStyle: {width: 140, height: 100}}}>画像</BasicCarousel>
        },
        // form: {file: {backetKey: 'sankoshaProcess'}},
        // td: {style: {height: 80, width: 100}},
      },
    ]).aggregateOnSingleTd().plain,
    ...new Fields([
      {
        ...{id: 'sankoshaProductMasterId', label: '商品名'},
        forSelect: {allowCreateOptions: {}, config: {modelName: `sankoshaProductMaster`}},
      },
      {
        ...{id: `sankoshaSizeMasterId`, label: '詳細・サイズ'},
        forSelect: {allowCreateOptions: {}, config: {modelName: `sankoshaSizeMaster`}},
      },
      {
        ...{id: 'quantity', label: '数量'},
        type: 'number',
        td: {},
      },
    ]).aggregateOnSingleTd().plain,
  ])

  const cols2 = new Fields([
    ...new Fields([
      {...{id: 'requestFormNumber', label: '依頼書No'}},
      {
        ...{id: 'plannedDeliveryDate', label: '予定納期', type: `date`},
        td: {
          getRowColor: (value, row) => {
            const today = getMidnight()

            const finished = row.completionDate !== null
            const haShipped = row.shipmentCompletionDate !== null
            const daysBefore7 = differenceInDays(new Date(value), today) <= 7
            const overDeadLine = new Date(value) <= today

            if (value) {
              return haShipped ? `#D3D3D3` : finished ? `#90EE90` : overDeadLine ? `#ffbdbd` : daysBefore7 ? `#f8f8b4` : ``
            }

            // return new Date(value) < new Date() ? `red` : ``
          },
        },
      },
      {...{id: 'isTestProduct', label: 'テスト品？'}, type: `boolean`},
    ]).aggregateOnSingleTd().plain,
    ...new Fields([{...{id: 'inspectionOk', label: '検品OK'}, type: `boolean`}]).aggregateOnSingleTd().plain,
  ])

  return [
    ...cols1.buildFormGroup({groupName: `検品（商品）`}).plain,
    ...cols2.buildFormGroup({groupName: `検品（その他）`}).plain,
  ]
}
