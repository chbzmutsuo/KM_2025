import {TsNippo} from '@app/(apps)/tsukurunger/(models)/Nippo'
import {TsConstructionClass} from '@app/(apps)/tsukurunger/(models)/TsConstructionClass'
import {taxRate} from '@app/(apps)/tsukurunger/class/constants'
import { formatDate} from '@class/Days'
import {DH} from '@class/DH'
import {bodyRecordsType} from '@components/styles/common-components/CsvTable/CsvTable'
import useLoader from '@hooks/globalHooks/useLoader'

import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import { useState} from 'react'

const MonthcolSpan = 3
export type monthObejectType = {
  [part: string]: {
    [name: string]: {
      quantitySum: number
      priceSum: number
      countSum: number
      accumulated: {
        quantitySum: number
        priceSum: number
        countSum: number
      }
    }
  }
}

type total_discount_taxRate_ByMonthList = {
  [monthStr: string]: {
    totalPrice: number
    discount: number
    accumulatedDiscount: number
    restPrice: number
    taxRate: number
    taxedPrice: number
  }
}

export const getProgressSheetRecords = (
  constructionCl: TsConstructionClass,
  {tsConstructionDiscountList, settsConstructionDiscountList}
) => {
  if (!constructionCl.TsConstruction.TsNippo) throw new Error(`TsNippo が存在しません`)
  if (!constructionCl.TsConstruction.TsWorkContent) throw new Error(`TsWorkContent が存在しません`)

  //必要なデータの取得
  const {accumulated, allWorkContent, MonthsObject, monthList, detailCsvTableProps} = initData({constructionCl})

  //上部テーブルデータを取得
  const {summaryCsvTableProps} = getSummaryCsvTableProps({
    constructionCl,
    monthList,
    MonthsObject,
    tsConstructionDiscountList,
    settsConstructionDiscountList,
  })

  return {
    allWorkContent,
    summaryCsvTableProps,
    detailCsvTableProps,
    MonthsObject,
    monthList,
  }
}

const initData = ({constructionCl}) => {
  const MonthsObject: monthObejectType = {}

  const allWorkContent = constructionCl.TsConstruction.TsWorkContent.sort((a, b) => (a.sortOrder > b.sortOrder ? 1 : -1))

  const activeNippo = constructionCl.TsConstruction.TsNippo.filter(d => new TsNippo(d).filterActiveNippo())

  const accumulated = {total: {quantitySum: 0, priceSum: 0, countSum: 0}}

  activeNippo.forEach(nippo => {
    const NippoClass = new TsNippo(nippo)
    const date = NippoClass.Nippo.date

    const monthStr = formatDate(new Date(date), `YYYY/MM`)

    //月オブジェクトの作成
    DH.makeObjectOriginIfUndefined(MonthsObject, monthStr, {
      total: {quantitySum: 0, priceSum: 0, countSum: 0, accumulated: {quantitySum: 0, priceSum: 0, countSum: 0}},
    })

    // 合計金額、値引きの箱を作成

    nippo.MidTsNippoTsWorkContent.forEach(d => {
      const {price, TsWorkContent, count: quantitySum} = d
      const {part, name, unit} = TsWorkContent
      DH.makeObjectOriginIfUndefined(MonthsObject[monthStr], part, {})
      DH.makeObjectOriginIfUndefined(MonthsObject[monthStr][part], name, {
        quantitySum: 0,
        priceSum: 0,
        countSum: 0,
        accumulated: {
          quantitySum: 0,
          priceSum: 0,
          countSum: 0,
        },
      })

      //===== 各月の計算======
      MonthsObject[monthStr][part][name].quantitySum += quantitySum
      MonthsObject[monthStr][part][name].priceSum += price
      MonthsObject[monthStr][part][name].countSum += 1

      //===== TOTALの計算======
      MonthsObject[monthStr].total.quantitySum += quantitySum
      MonthsObject[monthStr].total.priceSum += price
      MonthsObject[monthStr].total.countSum += 1

      // ============================accumulated ========================

      DH.makeObjectOriginIfUndefined(accumulated, part, {})
      DH.makeObjectOriginIfUndefined(accumulated[part], name, {
        quantitySum: 0,
        priceSum: 0,
        countSum: 0,
      })

      accumulated[part][name].quantitySum += quantitySum
      accumulated[part][name].priceSum += price
      accumulated[part][name].countSum += 1
      accumulated[`total`].quantitySum += quantitySum
      accumulated[`total`].priceSum += price
      accumulated[`total`].countSum += 1

      MonthsObject[monthStr][part][name].accumulated.quantitySum = accumulated[part][name].quantitySum
      MonthsObject[monthStr][part][name].accumulated.priceSum = accumulated[part][name].priceSum
      MonthsObject[monthStr][part][name].accumulated.countSum = accumulated[part][name].countSum

      MonthsObject[monthStr].total.accumulated.quantitySum = accumulated[`total`].quantitySum
      MonthsObject[monthStr].total.accumulated.priceSum = accumulated[`total`].priceSum
      MonthsObject[monthStr].total.accumulated.countSum = accumulated[`total`].countSum
    })
  })

  const monthStrings = Object.keys(MonthsObject)
    .filter(d => d !== `accumulated`)
    .sort((a, b) => (a > b ? 1 : -1))
  const monthList = monthStrings.map(d => {
    return new Date(d + `/01`)
  })

  const {detailCsvTableProps} = getDetailCsvTableProps({
    accumulated,
    allWorkContent,
    MonthsObject,
    monthList,
  })

  return {
    accumulated,
    MonthsObject,
    allWorkContent,
    monthList,
    detailCsvTableProps,
  }
}

const getSummaryCsvTableProps = ({
  constructionCl,
  monthList,
  MonthsObject,
  tsConstructionDiscountList,
  settsConstructionDiscountList,
}) => {
  const getAllPriceObj = () => {
    const allPriceObj: any = {
      monthStr: `all`,
      totalPrice: constructionCl.TsConstruction.TsWorkContent.reduce((acc, d) => {
        const {unitPrice, contractAmount} = d

        return acc + Number(unitPrice * contractAmount)
      }, 0),
      discount: tsConstructionDiscountList.find(d => d.monthStr === `all`)?.price ?? 0,
    }

    allPriceObj[`restPrice`] = allPriceObj.totalPrice - allPriceObj.discount
    allPriceObj[`taxedPrice`] = Math.round(allPriceObj.restPrice * (1 + taxRate / 100))
    allPriceObj[`taxRate`] = taxRate

    return allPriceObj
  }

  let accumulatedDiscount = 0
  const discountsByMonth = tsConstructionDiscountList.reduce((acc, d) => {
    const {monthStr, price} = d
    if (monthStr !== `all`) {
      accumulatedDiscount += price
    }

    acc[monthStr] = {
      discount: price,
      accumulated: {
        discount: accumulatedDiscount,
      },
    }

    return acc
  }, {})

  const total_discount_taxRate_ByMonthList: total_discount_taxRate_ByMonthList = Object.fromEntries([
    [`all`, getAllPriceObj()],
    ...monthList.map((month, i) => {
      const monthStr = formatDate(new Date(month), 'YYYY/MM')
      const totalPrice = MonthsObject[monthStr]?.total?.[`accumulated`]?.priceSum ?? 0
      const discount = tsConstructionDiscountList.find(d => d.monthStr === monthStr)?.price ?? 0

      const accumulatedDiscount = discountsByMonth[monthStr]?.accumulated?.discount ?? 0
      const restPrice = totalPrice - accumulatedDiscount
      const taxedPrice = Math.round(restPrice * (1 + taxRate / 100))
      return [
        monthStr,
        {
          accumulatedDiscount,
          totalPrice,
          discount,
          restPrice,
          taxRate,
          taxedPrice,
        },
      ]
    }),
  ])

  const Input = ({discount, monthStr}) => {
    const {toggleLoad} = useLoader()
    const [value, setvalue] = useState(discount ?? '')

    return (
      <div className={` text-end`}>
        <input
          type={`number`}
          className={`w-[80px] rounded border bg-gray-200 text-end shadow`}
          value={value}
          onChange={e => setvalue(e.target.value)}
          onBlur={async e => {
            const value = e.target.value
            const newDiscount = Number(value)
            const data = {
              monthStr,
              tsConstructionId: constructionCl.TsConstruction.id,
              price: newDiscount,
            }

            await fetchUniversalAPI(`tsConstructionDiscount`, `upsert`, {
              where: {
                unique_monthStr_tsConstructionId: {
                  monthStr: monthStr,
                  tsConstructionId: data.tsConstructionId,
                },
              },
              ...data,
            })
            settsConstructionDiscountList(prev => {
              const value = e.target.value
              const newDiscount = Number(value)
              const newtsConstructionDiscountList = prev.map(d => {
                if (d.monthStr === monthStr) {
                  return {...d, price: newDiscount}
                }
                return d
              })
              return newtsConstructionDiscountList
            })
          }}
        />
      </div>
    )
  }

  const nullCell = {cellValue: '', colSpan: 4, style: {background: `white`, opacity: 0, border: `0px`}}

  const TDTR_ALL = total_discount_taxRate_ByMonthList[`all`]

  const bodyRecords = [
    {
      csvTableRow: [
        nullCell,
        {cellValue: '小計', colSpan: 2},
        {cellValue: TDTR_ALL?.totalPrice, colSpan: 2},
        ...monthList
          .map((month, i) => {
            const monthStr = formatDate(new Date(month), 'YYYY/MM')
            const {totalPrice} = total_discount_taxRate_ByMonthList[monthStr]

            return [{cellValue: totalPrice, colSpan: MonthcolSpan}]
          })
          .flat(),
      ],
    },
    {
      csvTableRow: [
        nullCell,
        {cellValue: '値引き', colSpan: 2},
        {
          cellValue: (
            <div>
              <Input discount={TDTR_ALL?.discount} monthStr={`all`} />
            </div>
          ),
          colSpan: 2,
        },
        ...monthList
          .map((month, i) => {
            const monthStr = formatDate(new Date(month), 'YYYY/MM')
            const {discount, accumulatedDiscount} = total_discount_taxRate_ByMonthList[monthStr]

            return [
              {
                cellValue: (
                  <div>
                    <Input discount={discount} monthStr={monthStr} />

                    {/* <div>
                      {accumulatedDiscount ? (
                        <div>
                          (<small>累積:{accumulatedDiscount ?? '-'}</small>)
                        </div>
                      ) : (
                        <>-</>
                      )}
                    </div> */}
                  </div>
                ),
                colSpan: MonthcolSpan,
              },
            ]
          })
          .flat(),
      ],
    },
    {
      csvTableRow: [
        nullCell,
        {cellValue: '改め計', colSpan: 2},
        {cellValue: TDTR_ALL?.restPrice, colSpan: 2},
        ...monthList
          .map((month, i) => {
            const monthStr = formatDate(new Date(month), 'YYYY/MM')

            const {restPrice} = total_discount_taxRate_ByMonthList[monthStr]
            return [{cellValue: restPrice, colSpan: MonthcolSpan}]
          })
          .flat(),
      ],
    },
    {
      csvTableRow: [
        nullCell,
        {cellValue: '消費税', colSpan: 2},
        {cellValue: TDTR_ALL?.taxRate, colSpan: 2},
        ...monthList
          .map((month, i) => {
            const monthStr = formatDate(new Date(month), 'YYYY/MM')
            const {taxRate} = total_discount_taxRate_ByMonthList[monthStr]
            return [{cellValue: taxRate, colSpan: MonthcolSpan}]
          })
          .flat(),
      ],
    },
    {
      csvTableRow: [
        nullCell,
        {cellValue: '合計', colSpan: 2},
        {cellValue: TDTR_ALL?.taxedPrice, colSpan: 2},
        ...monthList
          .map((month, i) => {
            const monthStr = formatDate(new Date(month), 'YYYY/MM')
            const {taxRate, restPrice, taxedPrice} = total_discount_taxRate_ByMonthList[monthStr]
            return [{cellValue: taxedPrice, colSpan: MonthcolSpan}]
          })
          .flat(),
      ],
    },

    {csvTableRow: [], className: `h-[30px]`},
  ]

  const summaryCsvTableProps = {
    headerRecords: [
      {
        csvTableRow: [
          nullCell,
          {cellValue: '契約金額', colSpan: 4},
          ...monthList
            .map((month, i) => {
              const monthStr = formatDate(new Date(month), 'YYYY/MM')
              return [{cellValue: `${monthStr}\n出来高累計`, colSpan: MonthcolSpan}]
            })
            .flat(),
        ],
      },
    ],

    bodyRecords,
  }

  return {summaryCsvTableProps}
}

const getDetailCsvTableProps = ({allWorkContent, MonthsObject, accumulated, monthList}) => {
  const headerRecords: bodyRecordsType = [
    {
      csvTableRow: [
        //
        {cellValue: '#'},
        {cellValue: '基本情報', colSpan: 7},

        ...monthList
          .map((month, i) => {
            const monthStr = formatDate(new Date(month), 'YYYY/MM')
            return [{cellValue: monthStr, colSpan: MonthcolSpan}]
          })
          .flat(),
      ],
    },
    {
      csvTableRow: [
        {cellValue: 'No'},
        {cellValue: '部位'},
        {cellValue: '名称', style: {width: 150}},
        {cellValue: '摘要', style: {width: 400}},
        {cellValue: '単位', style: {width: 35}},
        {cellValue: '数量', style: {width: 35}},
        {cellValue: '単価', style: {width: 35}},
        {cellValue: '金額', style: {width: 35}},
        ...monthList
          .map((month, i) => {
            return [
              {cellValue: '当月金額', style: {width: 70}},
              {cellValue: '数量累計', style: {width: 70}},
              {cellValue: '金額累計', style: {width: 70}},
            ]
          })
          .flat(),
      ],
    },
  ]

  const bodyRecords: bodyRecordsType = allWorkContent.map((work, i) => {
    const {part, name, unit} = work

    const basicCols = [
      {cellValue: i + 1},
      {cellValue: work.part},
      {cellValue: work.name},
      {cellValue: work.remarks, className: `w-[200px] text-xs leading-3`},
      {cellValue: work.unit},
      {cellValue: work.contractAmount},
      {cellValue: work.unitPrice ?? 0},
      {cellValue: work.contractAmount * (work.unitPrice ?? 0)},
    ]

    const monthCols = monthList
      .map((month, i) => {
        const monthStr = formatDate(new Date(month), 'YYYY/MM')

        const accumulatedQuantity = MonthsObject[monthStr]?.[part]?.[name]?.accumulated?.quantitySum ?? 0
        const accumulatedPrice = MonthsObject[monthStr]?.[part]?.[name]?.accumulated?.priceSum ?? 0
        const priceOnMonth = MonthsObject[monthStr]?.[part]?.[name]?.priceSum ?? 0

        return [{cellValue: priceOnMonth}, {cellValue: accumulatedQuantity}, {cellValue: accumulatedPrice}]
      })
      .flat()
    return {
      csvTableRow: [...basicCols, ...monthCols],
    }
  })
  const detailCsvTableProps = {
    headerRecords,
    bodyRecords,
  }
  return {detailCsvTableProps}
}
