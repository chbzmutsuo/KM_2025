'use client'
const data = [
  {name: 'Group A', value: 400},
  {name: 'Group B', value: 300},
  {name: 'Group C', value: 300},
  {name: 'Group D', value: 200},
]

import {GoogleSheet_Read} from '@app/api/google/actions/sheetAPI'
import {Button} from '@components/styles/common-components/Button'
import {C_Stack, Center, FitMargin, R_Stack} from '@components/styles/common-components/common-components'
import React, {Fragment, useEffect, useState} from 'react'

import {ChevronDoubleDownIcon} from '@heroicons/react/20/solid'
import {Paper} from '@components/styles/common-components/paper'
import ChartWrapper from '@app/(apps)/apex/(pages)/[simulationId]/ChartWrapper'
import {useParams} from 'next/navigation'
import {SPREADSHEET_URLS, SPREADSHEET_URLS_TYPE} from '@app/(apps)/apex/(constants)/SPREADSHEET_CONST'
import PlaceHolder from '@components/utils/loader/PlaceHolder'
import useGlobal from '@hooks/globalHooks/useGlobal'
import Link from 'next/link'
import {handleGetResult} from '@app/(apps)/apex/(pages)/[simulationId]/server-actions/handleGetResult'
import {handlePutHistory} from '@app/(apps)/apex/(pages)/[simulationId]/server-actions/handlePutHistory'

export default function Page() {
  const {toggleLoad} = useGlobal()
  const simulationId = Number(useParams()?.simulationId)
  const SS_CONSTANTS = SPREADSHEET_URLS.find(item => item.simulationId === simulationId) as SPREADSHEET_URLS_TYPE

  const {url: spreadsheetId = ''} = SS_CONSTANTS.templateSheet ?? {}

  const [questions, setquestions] = useState<questionType[] | null>(null)
  // const [calc, setcalc] = useState<calcType[]>([])
  const [chartData, setChartData] = useState<ChartDataType | null>(null)

  const getQuestionsFormSS = async () => {
    const res = await GoogleSheet_Read({range: `質問!B2:F20`, spreadsheetId})
    if (res.values) {
      setquestions(
        res.values?.map(row => {
          const [question, answer, unit, _, type] = row
          return {question, answer: ``, unit, type}
        }) ?? []
      )
    }
  }

  const getCalculatedResultFormSS = async () => {
    toggleLoad(async () => {
      await handlePutHistory({SS_CONSTANTS, questions})
      await handleGetResult({SS_CONSTANTS, spreadsheetId, questions, setChartData})
    })
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

  if (questions === null) {
    return <PlaceHolder />
  }
  return (
    <FitMargin>
      <C_Stack className=" items-center gap-[30px] py-4">
        <h1 className="text-center text-2xl font-bold text-blue-600">{SS_CONSTANTS.title}シミュレーション</h1>

        <FitMargin>
          <C_Stack className="gap-8">
            {!chartData ? (
              <section className="rounded-lg bg-white  p-4 shadow">
                <C_Stack className="gap-4">
                  {questions.map((q, index) => (
                    <Fragment key={index}>
                      <C_Stack className="rounded-lg border border-blue-300  p-4">
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
                  <div className={` text-center`}>
                    <Button className={` bg-green-600 text-2xl font-bold `} onClick={getCalculatedResultFormSS}>
                      <span>今の手取り額を計算する</span>
                    </Button>
                  </div>
                </C_Stack>
              </section>
            ) : (
              <div>
                <Paper>
                  <ChartWrapper
                    {...{
                      questions,
                      keyName: 'before',
                      chartData,
                      chartRecords,
                      SS_CONSTANTS,
                    }}
                  />
                </Paper>

                <Center>
                  <R_Stack className={`gap-0.5`}>
                    <ChevronDoubleDownIcon className="h-[60px]  text-pink-600" />
                    <ChevronDoubleDownIcon className="h-[60px]  text-pink-600" />
                    <ChevronDoubleDownIcon className="h-[60px]  text-pink-600" />
                  </R_Stack>
                </Center>

                <Paper>
                  <ChartWrapper
                    {...{
                      questions,
                      keyName: 'after',
                      chartData,
                      chartRecords,
                      SS_CONSTANTS,
                    }}
                  />
                </Paper>
              </div>
            )}

            <C_Stack className={`  items-center gap-8`}>
              <Link href={`/apex`} className={`t-link`}>
                トップへ戻る
              </Link>
              <Button
                {...{
                  onClick: item => {
                    toggleLoad(async item => {
                      getQuestionsFormSS()
                      setChartData(null)
                    })
                  },
                }}
              >
                シミュレーションをやり直す
              </Button>
            </C_Stack>

            {/* <section>
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
            </section> */}
          </C_Stack>
        </FitMargin>
      </C_Stack>
    </FitMargin>
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

export type questionType = {
  question: string
  unit: string
  answer: string
  type: string
}

type calcType = {
  title: string
  result: string
  unit: string
}

export type ChartDataType = {
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
