'use client'

import {MasterKeyClient} from '@app/(apps)/masterKey/class/colbuilders/masterKeyClient'
import {Days, formatDate} from '@class/Days'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'
import {LabelValue} from '@components/styles/common-components/ParameterCard'
export class ColBuilder {
  static masterKeyClient = MasterKeyClient
  static masterKeyJob = (props: columnGetterType) => {
    return new Fields([
      {id: 'projectNumber', label: '案件番号', form: {}, type: 'text'},
      {id: 'projectName', label: '案件名', form: {}, type: 'text'},
      {id: 'jobTitle', label: '求人名', form: {}, type: 'text'},
      {id: 'jobType', label: '職種名', form: {}, type: 'text'},
      {id: 'workLocation', label: '勤務地', form: {}, type: 'text'},
    ]).transposeColumns()
  }

  static masterKeyApplicant = (props: columnGetterType) => {
    const labelValueProps = {
      className: `text-sm`,
      styling: {classes: {label: `w-[45px] text-gray-500 font-bold text-xs`}},
    }

    const basics = new Fields([
      ...new Fields([
        {
          id: `showOnly1`,
          label: `基本①`,
          format: (value, row) => {
            const {name, kana, gender, birthDate} = row
            const age = Days.calcAge(birthDate)
            return (
              <div>
                <LabelValue {...labelValueProps} label={`氏名`}>
                  {name}
                </LabelValue>
                <LabelValue {...labelValueProps} label={`カナ`}>
                  {kana}
                </LabelValue>
                <LabelValue {...labelValueProps} label={`性別`}>
                  {gender}
                </LabelValue>
                <LabelValue {...labelValueProps} label={`誕生日`}>
                  {formatDate(birthDate)} <span>({age}歳)</span>
                </LabelValue>
              </div>
            )
          },
        },
      ])
        .customAttributes(({col}) => ({...col, td: {style: {minWidth: 180}, form: {hidden: true}}}))
        .aggregateOnSingleTd().plain,

      ...new Fields([
        {
          id: `showOnly2`,
          label: `基本②`,
          format: (value, row) => {
            const {address, tel, email} = row

            return (
              <div>
                <LabelValue {...labelValueProps} label={`住所`}>
                  {address}
                </LabelValue>
                <LabelValue {...labelValueProps} label={`TEL`}>
                  {tel}
                </LabelValue>
                <LabelValue label={`email`} {...labelValueProps}>
                  {email}
                </LabelValue>
              </div>
            )
          },
        },
      ])
        .customAttributes(({col}) => ({...col, td: {style: {minWidth: 300}, form: {hidden: true}}}))
        .aggregateOnSingleTd().plain,
      // ...new Fields([
      //   {...{id: 'address', label: '住所', type: 'text'}, form: {}},
      //   {...{id: 'tel', label: 'TEL', type: 'text'}, form: {}},
      //   {...{id: 'email', label: 'Mail', type: 'email'}, form: {}},
      // ]).aggregateOnSingleTd().plain,

      ...new Fields([
        {
          id: `showOnly3`,
          label: `基本③`,
          format: (value, row) => {
            const {remarks, jobInfo} = row

            return (
              <div>
                <LabelValue {...labelValueProps} label={`備考`}>
                  {remarks}
                </LabelValue>
                <LabelValue {...labelValueProps} label={`当該求人情報`}>
                  {jobInfo}
                </LabelValue>
              </div>
            )
          },
        },
      ])
        .customAttributes(({col}) => ({...col, td: {style: {minWidth: 300}, form: {hidden: true}}}))
        .aggregateOnSingleTd().plain,

      //   ...new Fields([
      //     {...{id: 'remarks', label: '備考・メッセージ・職歴など', type: 'text'}, form: {}},
      //     {
      //       id: 'jobInfo',
      //       label: '当該求人情報',
      //       type: 'text',
      //       form: {hidden: true},
      //       format: () => {
      //         return (
      //           <div>
      //             ここに求人情報を表示します
      //             <br />
      //             案件番号、案件名、求人名、勤務地など・・・
      //           </div>
      //         )
      //       },
      //     },
      //   ]).aggregateOnSingleTd().plain,
    ]).plain

    const kpis = new Fields([
      //KPI
      ...new Fields([
        {id: 'validApplications', label: '有効応募数', type: 'boolean', form: {}},
        {id: 'absent', label: '不在', type: 'boolean', form: {}},
        {id: 'connected', label: '通電', type: 'boolean', form: {}},
        {id: 'interviewConfirmed', label: '面談確定', type: 'boolean', form: {}},
        {id: 'seated', label: '着席数', type: 'boolean', form: {}},
        {id: 'rejected', label: '不採用', type: 'boolean', form: {}},
        {id: 'offer', label: '内定', type: 'boolean', form: {}},
        {id: 'offerDeclined', label: '内定後辞退', type: 'boolean', form: {}},
        {id: 'joined', label: '入社', type: 'boolean', form: {}},
        {id: 'resigned', label: '退職', type: 'boolean', form: {}},
      ]).customAttributes(({col}) => ({
        ...col,
        td: {
          ...col.td,
          style: {width: 55},
          editable: {},
        },
      })).plain,
    ]).plain

    return new Fields([...basics, ...kpis]).transposeColumns()
  }
  static user = (props: columnGetterType) => {
    return new Fields([
      {...{id: 'name', label: '名称'}, form: {}},
      {...{id: 'email', label: 'Email'}, form: {}},
      {...{id: 'password', label: 'パスワード', type: `password`}, form: {}},
    ]).transposeColumns()
  }
}
