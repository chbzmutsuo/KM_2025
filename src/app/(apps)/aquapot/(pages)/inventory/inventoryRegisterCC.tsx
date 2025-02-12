'use client'

import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {getMidnight} from '@class/Days'
import {Fields} from '@class/Fields/Fields'
import {TextGreen, TextRed} from '@components/styles/common-components/Alert'
import {Button} from '@components/styles/common-components/Button'
import {R_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import useGlobal from '@hooks/globalHooks/useGlobal'
import useBasicFormProps from '@hooks/useBasicForm/useBasicFormProps'
import {fetchTransactionAPI, toastByResult} from '@lib/methods/api-fetcher'
import {AqInventoryRegister, Prisma} from '@prisma/client'
import {useState} from 'react'

export const InventoryRegisterCC = ({history}) => {
  const {toggleLoad} = useGlobal()
  const [records, setrecords] = useState<AqInventoryRegister[]>([])

  const errors = records.map(record => {
    const filled = requiredCols.every(col => !!record?.[col.id])
    const error = record && !filled
    return error
  })

  const handleBatchRegister = async () => {
    if (disabled) {
      alert(`必須項目が入力されていないデータがあります。`)
      return
    }

    toggleLoad(async () => {
      const res = await fetchTransactionAPI({
        transactionQueryList: records.map(d => {
          const {aqCustomerId, aqProductId, date = getMidnight(), quantity} = d

          const queryObject: Prisma.AqInventoryRegisterCreateArgs = {
            data: {
              aqCustomerId,
              aqProductId,
              date,
              quantity,
            },
          }

          return {
            model: `aqInventoryRegister`,
            method: `create`,
            queryObject,
          }
        }),
      })

      toastByResult(res)
    })
  }

  const disabled = errors.some(error => error)

  return (
    <div>
      <RegisterTable {...{records, setrecords, errors}} />
      <Button color="blue" onClick={handleBatchRegister}>
        一括登録
      </Button>
    </div>
  )
}

const RegisterTable = ({records, setrecords, errors}) => {
  const Control = ({record, idx, setrecords, errors}) => {
    const hasError = errors?.[idx]

    const {BasicForm, ReactHookForm} = useBasicFormProps({
      onFormItemBlur: props => {
        const {newlatestFormData, name, value} = props

        setrecords(previous => {
          const newRecords = [...previous]
          const prevItem = newRecords[idx]

          const newItem = {...prevItem, [name]: value}
          const validData = requiredCols.some(col => !!newItem?.[col.id])

          newRecords[idx] = validData ? {...prevItem, [name]: value} : null

          return newRecords
        })
      },
      formData: record,
      columns,
    })

    return (
      <R_Stack>
        <BasicForm
          {...{
            alignMode: `row`,
            ControlOptions: {ControlStyle: {width: 200}},
          }}
        />
        {hasError ? <TextRed>必須項目未入力</TextRed> : record ? <TextGreen>入力OK</TextGreen> : null}
      </R_Stack>
    )

    // return
  }

  return CsvTable({
    records: new Array(records.length + 1).fill(null).map((_, idx) => {
      return {
        csvTableRow: [
          {
            label: (
              <R_Stack>
                {[`日付`, `商品名`, `入荷先`, `数量`].map((d, idx) => {
                  return (
                    <div key={idx} className={`w-[195px]`}>
                      {d}
                    </div>
                  )
                })}
              </R_Stack>
            ),
            cellValue: <Control {...{record: records[idx], idx, setrecords, errors}} />,
          },
        ],
      }
    }),
  }).WithWrapper({})
}

const columns = new Fields([
  {
    id: 'date',
    label: ``,
    form: {},
    type: `date`,
  },
  {id: 'aqProductId', label: ``, form: {...defaultRegister}, forSelect: {}},
  {id: 'aqCustomerId', label: ``, form: {...defaultRegister}, forSelect: {}},
  {id: 'quantity', label: ``, form: {...defaultRegister}, type: `number`},
]).transposeColumns()
const requiredCols = columns.flat().filter(col => col.form?.register?.required)
