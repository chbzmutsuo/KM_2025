'use client'
import {YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'
import {Yoshinari} from '@app/(apps)/yoshinari/class/Yoshinari'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {Calc} from '@class/Calc'
import {Fields} from '@cm/class/Fields/Fields'
import {colType, columnGetterType} from '@cm/types/types'
import {Button} from '@components/styles/common-components/Button'
import {T_LINK} from '@components/styles/common-components/links'
import {HREF} from '@lib/methods/urls'

export class ColBuilder {
  static apRequestTypeMaster = (props: columnGetterType) => {
    return new Fields([
      //
      {id: `name`, label: `名称`, form: {}},
      {id: `description`, label: `説明`, form: {}, type: `textarea`},
    ]).transposeColumns()
  }
  static userWorkTimeHistoryMidTable = (props: columnGetterType) => {
    const {userId, workTypeId} = props.ColBuilderExtraProps ?? {}

    return new Fields([
      {
        id: `userId`,
        label: `ユーザー`,
        form: {
          defaultValue: userId,
          disabled: !!userId,
        },
        forSelect: {},
      },
      {
        id: `workTypeId`,
        label: `勤務タイプ`,
        td: {style: {width: 200, fontSize: 10}},
        form: {},
        forSelect: {},
      },
      {
        id: `workMins`,
        label: `勤務時間`,
        form: {hidden: true},
        format: (value, row) => {
          const workMins = row[`WorkType`]?.workMins
          return workMins
        },
      },
      {id: `from`, label: `開始`, form: {}, type: `date`},
    ]).transposeColumns()
  }
  static userPayedLeaveTypeMidTable = (props: columnGetterType) => {
    const {userId, workTypeId} = props.ColBuilderExtraProps ?? {}

    return new Fields([
      {
        id: `userId`,
        label: `ユーザー`,
        form: {
          defaultValue: userId,
          disabled: !!userId,
        },
        forSelect: {},
      },
      {
        id: `payedLeaveTypeId`,
        label: `有給タイプ`,
        td: {
          style: {width: 200, fontSize: 10},
        },
        form: {},
        forSelect: {},
      },
      {id: `from`, label: `開始`, form: {}, type: `date`},
    ]).transposeColumns()
  }
  static payedLeaveAssignmentCount = (props: columnGetterType) => {
    return new Fields([
      //
      {id: `monthsAfter`, label: `Nヶ月後`, form: {}, type: `number`},
      {id: `payedLeaveCount`, label: `付与日数`, form: {}, type: `number`},
    ]).transposeColumns()
  }
  static payedLeaveGrant = (props: columnGetterType) => {
    const {User} = props.ColBuilderExtraProps ?? {}
    if (!User) throw new Error(`User is required for payedLeaveGrant`)

    return new Fields([
      //
      {id: `grantedAt`, label: `付与日`, form: {}, type: `date`},
      {
        id: `mins`,
        label: `付与量(日 / 時間 / 分)`,
        form: {},
        type: `number`,
        format: (value, row) => {
          const today = row[`grantedAt`]
          const hour = value / 60

          const {rules} = YoshinariUserClass.getUserWorkRules({user: User, today})

          const day = (hour * (24 / rules.workHours)) / 24

          return [Calc.round(day), Calc.round(hour), Calc.round(value)].join(` / `)
        },
      },
      {id: `expiresAt`, label: `期限`, form: {}, type: `date`},
      {id: `remarks`, label: `備考`, form: {}, type: `textarea`},
    ]).transposeColumns()
  }

  static workType = (props: columnGetterType) => {
    return new Fields([
      {id: `name`, label: `名称`},
      ...new Fields([
        {id: `work_startTime`, label: '始業', type: `time`},
        {id: `work_endTime`, label: '終業', type: `time`},
      ]).aggregateOnSingleTd().plain,
      ...new Fields([
        {id: `lunchBreak_startTime`, label: '休憩開始', type: `time`},
        {id: `lunchBreak_endTime`, label: '休憩終了', type: `time`},
      ]).aggregateOnSingleTd().plain,

      ...new Fields([
        {id: `workMins`, label: '勤務時間（分）', type: `number`},
        {
          id: `legalHoliday`,
          label: '法定休日',
          form: {...defaultRegister},
          forSelect: {optionsOrOptionFetcher: Yoshinari.constants().legalHolidayTypes},
        },
      ]).aggregateOnSingleTd().plain,
      ...new Fields([
        {
          id: `calendar-edit`,
          label: 'カレンダー編集',
          form: {hidden: true},
          format: (value, row) => {
            return (
              <T_LINK {...{href: HREF(`/yoshinari/workTypeCalendar/${row.id}`, {}, props.useGlobalProps.query)}}>
                カレンダー
              </T_LINK>
            )
          },
        },
      ]).aggregateOnSingleTd().plain,
    ])
      .customAttributes(({col}) => ({
        form: {...col.form, style: {width: 300}},
      }))
      .transposeColumns()
  }
  static apReceiver = (props: columnGetterType) => {
    return new Fields([
      ...new Fields([
        {id: 'status', label: 'ステータス', forSelect: {optionsOrOptionFetcher: Yoshinari.constants().approvementTypes}},
        {id: 'comment', label: 'コメント', form: {}},
      ]).plain,
    ]).transposeColumns()
  }
  static ysWorkRecord = (props: columnGetterType) => {
    return new Fields([
      {
        ...{id: 'userId', label: '社員名', search: {}},
        forSelect: {},
        form: {defaultValue: props.useGlobalProps.session.id, disabled: true},
      },
      ...new Fields([
        {...{id: 'date', label: '日付'}, type: `date`},
        {...{id: 'from', label: '出勤時刻'}, type: `time`},
        {...{id: 'to', label: '退勤時刻'}, type: `time`},
      ]).showSummaryInTd({
        labelWidthPx: 40,
      }).plain,
      {...{id: 'breakTime', label: '休憩時間'}, type: `float`, form: {defaultValue: 60}, inputProps: {step: 30}},
    ])
      .customAttributes(({col}) => ({...col, form: {...col?.form}}))
      .transposeColumns()
  }

  static user = (props: columnGetterType) => {
    const {userListWithYukyu} = props.ColBuilderExtraProps ?? {}
    const {admin} = props.useGlobalProps.accessScopes()

    const colSource = [
      {...{id: 'code', label: 'コード'}, form: {}, type: `number`},
      {...{id: 'name', label: '名称'}, form: {...defaultRegister}},
      {...{id: 'email', label: 'Email'}, form: {...defaultRegister}},
      {...{id: 'password', label: 'パスワード', type: `password`}, form: {}},
      {...{id: 'hiredAt', label: '入社日', type: `date`}, form: {...defaultRegister}},
      admin
        ? {
            id: 'otherInfo',
            label: 'その他',
            form: {hidden: true},
            format: (value, row) => {
              const theYukyuAgg = userListWithYukyu.find(d => {
                return d.userId === row.id
              })

              const {
                userId,
                totalGrantedMinutes,
                remainingGrantedMinutes,
                totalConsumedMinutes,
                totalRemainingMinutes,
                consumeList,
                grantList,
              } = theYukyuAgg ?? {}
              const myId = props.useGlobalProps.session.id

              if (isNaN(totalRemainingMinutes)) {
                return null
              }
              return <Button>{totalRemainingMinutes}</Button>
            },
          }
        : undefined,
    ].filter(Boolean) as colType[]
    return new Fields(colSource).transposeColumns()
  }
}
