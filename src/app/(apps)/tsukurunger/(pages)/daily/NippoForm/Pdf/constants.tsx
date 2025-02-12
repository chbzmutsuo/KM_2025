import {formatDate} from '@class/Days'
import {DH} from '@class/DH'
import {Text} from '@react-pdf/renderer'

export const PdfCellHeight = 13
export const pdfCellFontSize = 6
export const rightBoldBorder = {borderRight: `1.5px solid black`}
export const topBoldBorder = {borderTop: `1.5px solid black`}
export const bottomBoldBorder = {borderBottom: `1.5px solid black`}
export const getHeaders = ({NippoOnDay, TsConstruction, priceSumToday, PriceSumAccumulated}) => {
  return {
    firstRow: [
      {cellValue: `工事日報`, style: {width: 160}},
      {cellValue: `累計金額`, style: {width: 50, fontSize: 8}},
      {cellValue: DH.toPrice(PriceSumAccumulated), style: {width: 150}},
      {cellValue: `現場名`, style: {width: 40}},
      {cellValue: TsConstruction.name, style: {width: 160}},
    ],

    secondRow: [
      {cellValue: `${formatDate(NippoOnDay.date, 'YYYY年MM月DD日(ddd)')}`, style: {width: 160}},
      {cellValue: `本日の金額`, style: {width: 50, fontSize: 8}},
      {cellValue: DH.toPrice(priceSumToday), style: {width: 150}},
      {
        cellValue: (
          <>
            <Text>{TsConstruction?.TsMainContractor?.name}</Text>
          </>
        ),
        style: {width: 100},
      },
      {cellValue: `工事担当者`, style: {width: 100}},
    ].map(d => {
      return {...d, style: {...d.style}}
    }),

    thirdRow_WorkContentAndPeople: [
      {cellValue: `工種`, style: {width: 40}},
      {cellValue: `施工範囲`, style: {width: 85}},
      {cellValue: `単位`, style: {width: 30}},
      {cellValue: `当日出来高`, style: {width: 45}},
      {cellValue: `累計出来高`, style: {width: 45, ...rightBoldBorder}},

      //
      {cellValue: `作業員（人）`, style: {width: 330}},
    ].map(d => {
      const style = {
        textAlign: `center`,
        ...d.style,
        ...topBoldBorder,
      } as any
      return {...d, style}
    }),

    thirdRow_WorkContentAndPeople_2: [
      {cellValue: ``, style: {width: 40, borderTopColor: `white`}},
      {cellValue: ``, style: {width: 85, borderTopColor: `white`}},
      {cellValue: ``, style: {width: 30}},
      {cellValue: `計`, style: {width: 20}},
      {cellValue: `金額`, style: {width: 25}},
      {cellValue: `計`, style: {width: 20}},
      {cellValue: `金額`, style: {width: 25, ...rightBoldBorder}},
      //
      {cellValue: `当日人数`, style: {width: 35}},
      {cellValue: `当日時間`, style: {width: 35}},
      {cellValue: `単価`, style: {width: 50, ...rightBoldBorder}},
      {cellValue: `当日金額`, style: {width: 35}},
      {cellValue: `累計時間`, style: {width: 35}},
      {cellValue: `累計金額`, style: {width: 50}},
      {cellValue: `常用業者名/名前`, style: {width: 90}},
    ].map(d => {
      const style = {
        ...d.style,
        textAlign: `center`,
      } as any
      return {
        ...d,

        style,
      }
    }),
    fourthRow_Material: [
      {cellValue: `区分`, style: {width: 20}},
      {cellValue: `品名`, style: {width: 110}},
      {cellValue: `摘要`, style: {width: 80, ...rightBoldBorder}},
      {cellValue: `当日数量`, style: {width: 50}},
      {cellValue: `当日金額`, style: {width: 50, ...rightBoldBorder}},
      {cellValue: `累計数量`, style: {width: 50}},
      {cellValue: `累計金額`, style: {width: 50, ...rightBoldBorder}},
      {cellValue: `業者名`, style: {width: 80, ...rightBoldBorder}},
      {cellValue: `備考`, style: {width: 70}},
    ].map(d => {
      const style = {
        ...d.style,
        textAlign: `center`,
      } as any

      return {...d, style}
    }),
    fifthRow_Machine: [
      {cellValue: `区分`, style: {width: 20}},
      {cellValue: `機種`, style: {width: 130}},
      {cellValue: `業者名`, style: {width: 90}},
      {cellValue: `日計`, style: {width: 35}},
      {cellValue: `単価`, style: {width: 35}},
      {cellValue: `当日金額`, style: {width: 35}},
      {cellValue: `累計数量`, style: {width: 35}},
      {cellValue: `累計金額`, style: {width: 50}},
      {cellValue: `備考`, style: {width: 60, ...rightBoldBorder}},
      {cellValue: `その他`, style: {width: 45}},
      {cellValue: `累計金額`, style: {width: 35}},
    ].map(d => {
      const style = {
        ...d.style,
        textAlign: `center`,
      } as any
      return {...d, style}
    }),

    sixthRow_Comment: [
      {
        cellValue: '現場内容',
        style: {width: 40},
      },
      {
        cellValue: (
          <>
            <Text style={{borderBottom: `1px solid gray`, height: PdfCellHeight}}></Text>
            <Text style={{borderBottom: `1px solid gray`, height: PdfCellHeight}}></Text>
            <Text style={{borderBottom: `0px solid gray`, height: PdfCellHeight}}></Text>
          </>
        ),
        style: {width: 520, padding: 0},
      },
    ],
    seventhRow_Comment: [
      {
        cellValue: '社内連絡',
        style: {width: 40},
      },
      {
        cellValue: (
          <>
            <Text style={{borderBottom: `1px solid gray`, height: PdfCellHeight}}></Text>
            <Text style={{borderBottom: `1px solid gray`, height: PdfCellHeight}}></Text>
            <Text style={{borderBottom: `0px solid gray`, height: PdfCellHeight}}></Text>
          </>
        ),
        style: {width: 520, padding: 0},
      },
    ],
  }
}
