'use client'
import {GoogleSheet_Read} from '@app/api/google/actions/sheetAPI'
import {Button} from '@components/styles/common-components/Button'
import {C_Stack, FitMargin, Padding, R_Stack} from '@components/styles/common-components/common-components'
import React, {Fragment, useEffect, useState} from 'react'

const SS_CONSTANTS = {
  templateSheet: {
    url: `https://docs.google.com/spreadsheets/d/1Vm8mNfCpRuqXLU9R2TH8PnjbGetNH_6c-si9xLgdf70/edit?gid=1857786614#gid=1857786614`,
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
export default function Page() {
  const [questions, setquestions] = useState<questionType[]>([])
  const [calc, setcalc] = useState<calcType[]>([])
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
    const res = await GoogleSheet_Read({range: `結果!B2:D20`, spreadsheetId: SS_CONSTANTS.templateSheet.url})
    setcalc(
      res.values?.map(row => {
        const [title, result, unit] = row
        return {title, result, unit}
      }) ?? []
    )
  }

  useEffect(() => {
    getQuestionsFormSS()
  }, [])

  return (
    <Padding className="bg-gray-100 ">
      <FitMargin>
        <C_Stack className="gap-8">
          <section className="rounded-lg bg-gradient-to-r from-blue-300 to-pink-400 p-4 shadow-lg">
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
          </section>

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
            ) : (
              <Button onClick={getCalculatedResultFormSS}>
                <span>読み込む</span>
              </Button>
            )}
          </section>
        </C_Stack>
      </FitMargin>
    </Padding>
  )
}
