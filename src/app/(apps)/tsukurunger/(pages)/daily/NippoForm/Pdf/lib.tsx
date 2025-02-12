'use client'
import {DH} from '@class/DH'
import {anyObject} from '@cm/types/types'
import {Days} from '@class/Days'
import {bottomBoldBorder, pdfCellFontSize, PdfCellHeight} from '@app/(apps)/tsukurunger/(pages)/daily/NippoForm/Pdf/constants'

type OptionModelName = `user` | `tsWorkContent` | `tsMaterial` | `tsMachinery` | `tsRegularSubcontractor` | `tsNippoRemarks`
export const initOptionData = ({NippoList}) => {
  const options: {
    [key in OptionModelName]: anyObject
  } = {
    user: {},
    tsWorkContent: {},
    tsMaterial: {},
    tsMachinery: {},
    tsRegularSubcontractor: {},
    tsNippoRemarks: {},
  }
  const deleteKeys = [`id`, `active`, `sortOrder`, `createdAt`, `updatedAt`, `tsConstructionId`]

  NippoList.map(d => {
    deleteKeys.forEach(key => delete d[key])

    //ユーザー
    d.MidTsNippoUser.forEach(item => {
      DH.makeObjectOriginIfUndefined(options.user, item.User.id, {
        dataCount: 0,
        count: 0,
        sum: 0,
        master: item.User,
      })
      options.user[item.User.id].dataCount++
      options.user[item.User.id].count += Number(item.count)
      options.user[item.User.id].sum += Number(item.price)
    })

    //作業内容
    d.MidTsNippoTsWorkContent.forEach(item => {
      DH.makeObjectOriginIfUndefined(options.tsWorkContent, item.TsWorkContent.id, {
        dataCount: 0,
        count: 0,
        sum: 0,
        master: item.TsWorkContent,
      })

      options.tsWorkContent[item.TsWorkContent.id].dataCount++
      options.tsWorkContent[item.TsWorkContent.id].count += Number(item.count)
      options.tsWorkContent[item.TsWorkContent.id].sum += Number(item.price)
    })

    //材料
    d.MidTsNippoTsMaterial.forEach(item => {
      DH.makeObjectOriginIfUndefined(options.tsMaterial, item.TsMaterial.id, {
        dataCount: 0,
        count: 0,
        sum: 0,
        master: item.TsMaterial,
      })

      options.tsMaterial[item.TsMaterial.id].dataCount++
      options.tsMaterial[item.TsMaterial.id].count += Number(item.count)
      options.tsMaterial[item.TsMaterial.id].sum += Number(item.price)
    })

    //機械
    d.MidTsNippoTsMachinery.forEach(item => {
      DH.makeObjectOriginIfUndefined(options.tsMachinery, item.TsMachinery.id, {
        dataCount: 0,
        count: 0,
        sum: 0,
        master: item.TsMachinery,
      })

      options.tsMachinery[item.TsMachinery.id].dataCount++
      options.tsMachinery[item.TsMachinery.id].count += Number(item.count)
      options.tsMachinery[item.TsMachinery.id].sum += Number(item.price)
    })

    //常用下請け
    d.MidTsNippoTsRegularSubcontractor.forEach(item => {
      DH.makeObjectOriginIfUndefined(options.tsRegularSubcontractor, item.TsRegularSubcontractor.id, {
        dataCount: 0,
        count: 0,
        sum: 0,
        master: item.TsRegularSubcontractor,
      })

      options.tsRegularSubcontractor[item.TsRegularSubcontractor.id].dataCount++
      options.tsRegularSubcontractor[item.TsRegularSubcontractor.id].count += Number(item.count)
      options.tsRegularSubcontractor[item.TsRegularSubcontractor.id].sum += Number(item.price)
    })

    //その他
    d.TsNippoRemarks.forEach(item => {
      DH.makeObjectOriginIfUndefined(options.tsNippoRemarks, item.name, {
        dataCount: 0,
        count: 0,
        sum: 0,
        master: item,
      })

      options.tsNippoRemarks[item.name].dataCount++
      options.tsNippoRemarks[item.name].count += Number(item.count ?? 0)
      options.tsNippoRemarks[item.name].sum += Number(item.price)
    })

    //契約内容フリー入力
    d.TsNippMannualWorkContent.forEach(item => {
      const key = item.name
      DH.makeObjectOriginIfUndefined(options.tsWorkContent, key, {
        dataCount: 0,
        count: 0,
        sum: 0,
        master: item,
      })

      const price = (item.price ?? 0) * (item.count ?? 0)

      options.tsWorkContent[key].dataCount++
      options.tsWorkContent[key].count += Number(item.count)
      options.tsWorkContent[key].sum += Number(price)
    })

    return d
  })

  const recordsByOption = Object.fromEntries(
    Object.keys(options).map(key => {
      const optionName = key as OptionModelName
      const itemIds = Object.keys(options[optionName])
      const records = itemIds.map(id => {
        return options[optionName][id]
      })

      return [key, records]
    })
  )

  const rowCountByOption = Object.fromEntries(
    Object.entries(options).map(([key, value]) => {
      return [key, Object.keys(value).length]
    })
  )

  const workContentAndPeopleRowCount = Math.max(
    rowCountByOption[`tsWorkContent`],
    rowCountByOption[`user`] + rowCountByOption[`tsRegularSubcontractor`],
    15
  )

  const materialRowCount = Math.max(rowCountByOption[`tsMaterial`], 12)
  const machineRowCount = Math.max(rowCountByOption[`tsMachinery`], 12)

  const rowCounts = {
    workContentAndPeople: workContentAndPeopleRowCount,
    material: materialRowCount,
    machine: machineRowCount,
  }

  return {
    rowCountByOption,
    options,
    recordsByOption,
    rowCounts,
  }
}

export const separateNippo = ({today, AccumulatedNippoToToday}) => {
  const NippoOnTheDate = AccumulatedNippoToToday.find(d => Days.isSameDate(d.date, today))
  const PreviousNippo = AccumulatedNippoToToday.filter(d => !Days.isSameDate(d.date, today))
  return {NippoOnTheDate, PreviousNippo}
}

export const addColsStyle = ({cols, styles, rowIdx, rowCount}) => {
  const cellStyle = {fontSize: pdfCellFontSize, overflow: `hidden`, padding: `1px 2px`, height: PdfCellHeight}
  return cols.map((d, colIdx) => {
    const theStyle = styles[colIdx]
    const style = {
      ...theStyle,
      ...(rowIdx === rowCount - 1 ? bottomBoldBorder : {}),
      ...cellStyle,
      ...d.style,
    }

    let cellValue = d.cellValue
    if (typeof cellValue === `number`) {
      style.textAlign = `right`
      cellValue = DH.toPrice(cellValue)
    } else {
      style.textAlign = `left`
    }

    delete style.borderTopColor

    return {...d, cellValue, style}
  })
}
