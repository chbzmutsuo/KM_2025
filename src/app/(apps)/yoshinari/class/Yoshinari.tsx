import {ApRequestConfig} from '@lib/ApprovementRequest/apRequest-types'

export class Yoshinari {
  static constants = () => {
    const getApRequestTypeConfigs = () => {
      const result: ApRequestConfig = {
        休暇申請: {
          cfList: [
            {
              name: '休暇区分',
              options: [
                {value: `振替休日`},
                {value: `有給休暇（1日休）`},
                {value: `有給（時間給）`},
                {value: `特別休暇`},
                {value: `慶弔休暇`},
                {value: `欠勤`},
                {value: `その他:`},
              ],
            },
          ],
        },
        時間外勤務: {},
        私有車: {},
      }
      return result
    }
    const approvementTypes = [
      {value: '却下', color: '#FF0000'},
      {value: '承認', color: '#008000'},
    ]

    const rules = {
      work_startTime: `08:30`,
      work_endTime: `17:00`,
      lunchBreak_startTime: `12:00`,
      lunchBreak_endTime: `13:00`,
      workMins: 450,
      fixedOvertime: `19:10`,
      breakMin: 60,
      workHours: 450 / 60,
    }
    const legalHolidayTypes = ['月', '火', '水', '木', '金', '土', '日']
    return {approvementTypes, rules, legalHolidayTypes, getApRequestTypeConfigs}
  }
}

export const DEFAULT_WORK_HOUR = 8
