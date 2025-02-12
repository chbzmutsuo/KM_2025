import {TsNippo} from '@app/(apps)/tsukurunger/(models)/Nippo'
import {TsConstructionClass} from '@app/(apps)/tsukurunger/(models)/TsConstructionClass'

import {formatDate} from '@class/Days'
import {DH} from '@class/DH'
import {bodyRecordsType} from '@components/styles/common-components/CsvTable/CsvTable'
import {CSSProperties} from 'react'

export const getExpenseSheetRecordsOrigin = (constructionCl: TsConstructionClass) => {
  // 月ごとの支払い金額をカテゴリごとに集計
  const calcPricesGroupedByCategory = () => {
    type monthObjectType = {
      [monthStr: string]: {
        priceSum: number
        countSum: number
      }
    }

    type ItemInGroup = {
      [sourceItemName: string]: {
        sourceItemId: number
        PriceCountSumByMonth: monthObjectType
      }
    }

    type PRICE_OBJECT_TYPE = {
      [groupLabel: string]: ItemInGroup
    }
    const MonthsObject: monthObjectType = {}

    const result: PRICE_OBJECT_TYPE = {
      ...Object.fromEntries(
        TsNippo.optionKeys.map(d => {
          const {groupLabel, relationalModelName} = d

          return [groupLabel, {}]
        })
      ),
      その他費用: {},
    }
    if (!constructionCl.TsConstruction.TsNippo) {
      throw new Error(`TsNippo が存在しません`)
    }
    constructionCl.TsConstruction.TsNippo.filter(nippo => {
      const TheNippoCL = new TsNippo(nippo)

      return TheNippoCL.getTotalPrice().sum > 0
    }).forEach(nippo => {
      const NippoClass = new TsNippo(nippo)
      const date = NippoClass.Nippo.date
      const monthStr = formatDate(date, `YYYY/MM`)

      //月オブジェクトの作成
      DH.makeObjectOriginIfUndefined(MonthsObject, monthStr, {})

      const {prices, sum} = NippoClass.getTotalPrice()
      prices.forEach(d => {
        const {groupLabel, sourceItemName, sourceItemId, price, vendor, midTableName} = d

        let displayItemName = sourceItemName
        if ([`作業員`].includes(groupLabel)) {
          displayItemName = `ツクルンジャー`
        } else if ([`機械`, `材料`].includes(groupLabel)) {
          displayItemName = vendor
        }

        DH.makeObjectOriginIfUndefined(result[groupLabel], displayItemName, {sourceItemId, ['PriceCountSumByMonth']: {}})

        DH.makeObjectOriginIfUndefined(result[groupLabel][displayItemName][`PriceCountSumByMonth`], monthStr, {
          priceSum: 0,
          countSum: 0,
        })

        result[groupLabel][displayItemName][`PriceCountSumByMonth`][monthStr].priceSum += price
        result[groupLabel][displayItemName][`PriceCountSumByMonth`][monthStr].countSum += 1
      })
    })

    const monthStrings = Object.keys(MonthsObject).sort((a, b) => (a > b ? 1 : -1))
    const monthList = monthStrings.map(d => {
      return new Date(d + `-01`)
    })

    return {PRICE_OBJECT: result, MonthsObject, monthList}
  }

  const {PRICE_OBJECT, monthList} = calcPricesGroupedByCategory()

  const headerRecords: bodyRecordsType = [
    {
      csvTableRow: [
        {cellValue: `工事費目`},
        {cellValue: `支払い先`},
        ...monthList.map((month, i) => {
          return {cellValue: formatDate(month, 'YYYY/MM')}
        }),
        {cellValue: `全期間計`},
      ],
    },
  ]

  const groups = [
    ...TsNippo.midTables,
    {groupLabel: `その他費用`, modelName: `TsNippoRemarks`, relationalModelName: `MidTsNippoRemarks`},
  ]

  let TOTAL_SUM = 0

  const GroupSumRowProps: {
    style: CSSProperties
  } = {
    style: {
      background: `#fff5cb`,
      fontWeight: `bold`,
      borderBottomColor: `black`,
      borderBottomWidth: 2,
      fontSize: 16,
    },
  }

  const bodyTrList = groups
    .filter((d, mdIdx) => {
      // return mdIdx === 3
      return d.groupLabel !== `作業内容` //作業内容は出来高のため原価に含まない
    })
    .map(({groupLabel}, mdIdx) => {
      let GROUP_RIGHT_SUM = 0
      const itemsInGroup = PRICE_OBJECT[groupLabel]
      const itemNames = Object.keys(itemsInGroup)

      const groupSum = itemNames.reduce((acc, itemName) => {
        const price = monthList.reduce((acc, month) => {
          const monthStr = formatDate(month, 'YYYY/MM')
          const price = itemsInGroup[itemName][`PriceCountSumByMonth`][monthStr]?.priceSum || 0
          return acc + price
        }, 0)
        return acc + price
      }, 0)
      GROUP_RIGHT_SUM += groupSum

      return [
        // //==========グループ合計==========
        // {
        //   ...GroupSumRowProps,
        //   csvTableRow: [
        //     {cellValue: groupLabel + '計', colSpan: 2},
        //     // {cellValue: ``},
        //     ...monthList.map((month, m) => {
        //       const monthStr = formatDate(month, 'YYYY/MM')
        //       const groupSum = itemNames.reduce((acc, itemName) => {
        //         const price = itemsInGroup[itemName][`PriceCountSumByMonth`][monthStr]?.priceSum || 0
        //         return acc + price
        //       }, 0)
        //       return {cellValue: groupSum}
        //     }),

        //     {cellValue: GROUP_RIGHT_SUM},
        //   ].map(d => ({...d, style: {...GroupSumRowProps.style}})),
        // },

        //=========== 明細============
        ...itemNames.map((itemName, i) => {
          let RIGHT_SUM = 0
          return {
            csvTableRow: [
              {cellValue: groupLabel},
              {cellValue: itemName},

              ...monthList.map((month, m) => {
                const monthStr = formatDate(month, 'YYYY/MM')
                const price = itemsInGroup[itemName][`PriceCountSumByMonth`][monthStr]?.priceSum || 0
                RIGHT_SUM += price
                return {cellValue: price ?? 0, className: `w-[100px]`}
              }),

              {cellValue: RIGHT_SUM},
            ],
          }
        }),
      ]
    })
    .flat()

  const footerTrList = [
    //合計
    {
      style: {background: `#fce89a`, fontWeight: `bold`},
      csvTableRow: [
        {cellValue: `当月合計`, colSpan: 2},
        // {cellValue: `合計`},
        ...monthList.map((month, m) => {
          const monthStr = formatDate(month, 'YYYY/MM')
          const total = Object.keys(PRICE_OBJECT).reduce((acc, groupLabel) => {
            const group = PRICE_OBJECT[groupLabel]
            const groupTotal = Object.keys(group).reduce((acc, itemName) => {
              const price = group[itemName][`PriceCountSumByMonth`][monthStr]?.priceSum || 0
              return acc + price
            }, 0)
            return acc + groupTotal
          }, 0)

          TOTAL_SUM += total

          return {cellValue: total}
        }),

        {cellValue: TOTAL_SUM},
      ],
    },
  ]

  const bodyRecords: bodyRecordsType = [...bodyTrList, ...footerTrList]

  return {headerRecords, bodyRecords}
}
