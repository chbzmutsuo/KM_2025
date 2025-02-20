import {CalendarHolidayClass} from '@app/(apps)/yoshinari/class/CalendarHolidayClass'
import {formatDate} from '@class/Days'
import {Fields} from '@class/Fields/Fields'
import {Button} from '@components/styles/common-components/Button'
import useGlobal from '@hooks/globalHooks/useGlobal'
import useBasicFormProps from '@hooks/useBasicForm/useBasicFormProps'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

export const DateEditor = ({dateEditModalOpen, handleClose, workType}) => {
  const {toggleLoad} = useGlobal()
  const {date, calendarRecord} = dateEditModalOpen

  const columns = new Fields([
    {
      id: `type`,
      label: `区分`,
      forSelect: {
        optionsOrOptionFetcher: CalendarHolidayClass.holidayTypes.map(d => ({value: d.label, color: d.color})),
      },
    },
    {id: `remarks`, label: `備考`, form: {}},
  ]).transposeColumns()
  const {BasicForm, latestFormData} = useBasicFormProps({columns, formData: calendarRecord})
  const handleOnSubmit = async data => {
    toggleLoad(async () => {
      await fetchUniversalAPI(`ysCalendarHoliday`, `upsert`, {
        where: {
          unique_date_workTypeId: {date, workTypeId: workType.id},
        },
        date,
        workTypeId: workType.id,
        type: data.type,
        remarks: data.remarks,
      })

      handleClose()
    })
  }

  return (
    <div>
      <strong>{formatDate(date)}</strong>
      <BasicForm onSubmit={handleOnSubmit} latestFormData={latestFormData}>
        <Button>更新</Button>
      </BasicForm>
    </div>
  )
}
