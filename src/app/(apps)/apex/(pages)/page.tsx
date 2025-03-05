'use client'
const data = [
  {name: 'Group A', value: 400},
  {name: 'Group B', value: 300},
  {name: 'Group C', value: 300},
  {name: 'Group D', value: 200},
]

export const redColor = '#e10c1a'
export const blueColor = '#5271ff'
export const greenColor = '#008000'
import {GoogleSheet_Read} from '@app/api/google/actions/sheetAPI'
import {Button} from '@components/styles/common-components/Button'
import {Absolute, C_Stack, Center, FitMargin, Padding, R_Stack} from '@components/styles/common-components/common-components'
import React, {Fragment, useEffect, useState} from 'react'

import useGlobal from '@hooks/globalHooks/useGlobal'
import ChartWrapper from '@app/(apps)/apex/(pages)/ChartWrapper'
import {ChevronDoubleDownIcon} from '@heroicons/react/20/solid'
import {Paper} from '@components/styles/common-components/paper'

const SS_CONSTANTS = {
  templateSheet: {
    url: `https://docs.google.com/spreadsheets/d/1r8hrgttzgXDMusjdGyVZ9wSzNqajvLwW-iSGFqNHtMY/edit?gid=382509698#gid=382509698`,
  },
}

type questionType = {
  question: string
  unit: string
  answer: string
}

type calcType = {
  title: string
  result: string
  unit: string
}

type ChartDataType = {
  rows: {
    label: string
    before: string
    after: string
    diff: string
    colorCode: string
    type: string
  }[]
  tedori: {
    before: string
    after: string
    diff: string
    colorCode: string
    type: string
  }
  hoshu: {
    before: string
    after: string
    diff: string
    colorCode: string
    type: string
  }
}

export default function Page() {
  const {width} = useGlobal()
  const [questions, setquestions] = useState<questionType[]>([])
  const [calc, setcalc] = useState<calcType[]>([])
  const [chartData, setChartData] = useState<ChartDataType | null>(def)

  const getQuestionsFormSS = async () => {
    const res = await GoogleSheet_Read({range: `質問!B2:D20`, spreadsheetId: SS_CONSTANTS.templateSheet.url})
    if (res.values) {
      setquestions(
        res.values?.map(row => {
          const [question, answer, unit] = row
          return {question, answer: ``, unit}
        }) ?? []
      )
    }
  }

  const getCalculatedResultFormSS = async () => {
    const res = await GoogleSheet_Read({range: `結果!E2:I12`, spreadsheetId: SS_CONSTANTS.templateSheet.url})
    const header = ['手取り額（社長）', `手取り額（法人）`, '税金（社長・法人）', '社会保険資料（社長・法人）']

    let tedori = {}
    let hoshu = {}

    const rows = res.values
      ?.map(item => {
        console.log(item) //////log
        const [before, after, diff, colorCode, type] = item
        if (type === '中央') {
          tedori = {before, after, diff, colorCode, type}
          return {}
        }
        if (type === '報酬') {
          hoshu = {before, after, diff, colorCode, type}
          return {}
        }

        return {before, after, diff, colorCode, type}
      })
      .filter(item => item.type)
      .map((item, index) => {
        const label = header[index]
        return {label, ...item}
      })

    // チャートデータをセット
    setChartData({rows, tedori, hoshu} as ChartDataType)
  }

  useEffect(() => {
    getQuestionsFormSS()
  }, [])

  const chartRecords =
    chartData?.rows.map(d => {
      return {
        ...d,
        before: Number(d.before),
        after: Number(d.after),
        diff: Number(d.diff),
      }
    }) ?? []

  return (
    <div className="bg-gray-100 py-4">
      <FitMargin>
        <C_Stack className="gap-8">
          {/* <section className="rounded-lg bg-gradient-to-r from-blue-300 to-pink-400 p-4 shadow-lg">
            <C_Stack className="gap-4">
              {questions.map((q, index) => (
                <Fragment key={index}>
                  <C_Stack className="rounded-lg border border-blue-300 bg-blue-100 p-4">
                    <div className="text-start text-lg font-bold text-gray-700">{q.question}</div>
                    <R_Stack className="items-center justify-end gap-3">
                      <input
                        className="rounded border border-gray-300 p-2 text-right focus:ring-2 focus:ring-gray-500"
                        type="number"
                        value={q.answer}
                        onChange={e => {
                          const newQuestions = [...questions]
                          newQuestions[index].answer = e.target.value
                          setquestions(newQuestions)
                        }}
                      />
                      <div className="text-sm text-gray-600">{q.unit}</div>
                    </R_Stack>
                  </C_Stack>
                </Fragment>
              ))}
            </C_Stack>
          </section> */}

          <Paper>
            <ChartWrapper {...{keyName: 'before', chartData, chartRecords}} />
          </Paper>

          <Center>
            <R_Stack className={`gap-0.5`}>
              <ChevronDoubleDownIcon className="h-[60px]  text-pink-600" />
              <ChevronDoubleDownIcon className="h-[60px]  text-pink-600" />
              <ChevronDoubleDownIcon className="h-[60px]  text-pink-600" />
            </R_Stack>
          </Center>

          <Paper>
            <ChartWrapper {...{keyName: 'after', chartData, chartRecords}} />
          </Paper>
          <Button onClick={getCalculatedResultFormSS}>
            <span>回答</span>
          </Button>
          <section>
            {calc.length > 0 ? (
              <section className="rounded-lg bg-gradient-to-r from-blue-300 to-pink-400 p-4 shadow-lg">
                <C_Stack className="rounded-lg border border-blue-300 bg-blue-100 p-4">
                  {calc.map((c, index) => {
                    return (
                      <div key={index}>
                        <C_Stack className="rounded-lg border border-blue-300 bg-blue-100 p-4">
                          <div className="text-start text-lg font-bold text-gray-700">{c.title}</div>
                          <R_Stack className="items-center justify-end gap-3">
                            <div className={` text-2xl font-bold text-red-600`}>{c.result}</div>
                            <div>{c.unit}</div>
                          </R_Stack>
                        </C_Stack>
                      </div>
                    )
                  })}
                </C_Stack>
              </section>
            ) : null}
          </section>
        </C_Stack>
      </FitMargin>
    </div>
  )
}

const def = {
  rows: [
    {
      label: '手取り額（社長）',
      before: '670',
      after: '729',
      diff: '58',
      colorCode: '#5271ff',
      type: '項目',
    },
    {
      label: '手取り額（法人）',
      before: '31',
      after: '49',
      diff: '18',
      colorCode: '#4f3ad2',
      type: '項目',
    },
    {
      label: '税金（社長・法人）',
      before: '351',
      after: '310',
      diff: '-41',
      colorCode: '#e10c1a',
      type: '項目',
    },
    {
      label: '社会保険資料（社長・法人）',
      before: '237',
      after: '201',
      diff: '-36',
      colorCode: '#953d45',
      type: '項目',
    },
  ],
  tedori: {
    before: '701',
    after: '777',
    diff: '76',
    colorCode: '',
    type: '中央',
  },
  hoshu: {
    before: '840',
    after: '672',
    diff: '-168',
    colorCode: '#ea5961',
    type: '報酬',
  },
}
