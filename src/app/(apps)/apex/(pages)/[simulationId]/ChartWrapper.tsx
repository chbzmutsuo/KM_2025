import {SPREADSHEET_URLS_TYPE} from '@app/(apps)/apex/(constants)/SPREADSHEET_CONST'
import Chart, {redColor} from '@app/(apps)/apex/(pages)/[simulationId]/Chart'
import {questionType} from '@app/(apps)/apex/(pages)/[simulationId]/page'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import useWindowSize from '@hooks/useWindowSize'
import Image from 'next/image'

import React from 'react'

export default function ChartWrapper(props: {
  questions: questionType[]
  keyName
  chartData
  chartRecords
  SS_CONSTANTS: SPREADSHEET_URLS_TYPE
}) {
  const {keyName, chartData, chartRecords, SS_CONSTANTS} = props
  const {width} = useWindowSize()

  const yatin = props.questions.find(item => item.type === `家賃`)?.answer

  const renderCenterText = ({x, y, value, tspanProps}) => {
    return (
      <text x={x} y={y} textAnchor="middle" dominantBaseline="middle">
        <tspan
          {...{
            ...tspanProps,
          }}
        >
          {value}
        </tspan>
      </text>
    )
  }

  const label =
    keyName === `before` ? `現在の手取り額（${SS_CONSTANTS.title}導入前）` : `${SS_CONSTANTS.title}導入後の手取り額(結果)`
  return (
    <section>
      <C_Stack className="gap-0 ">
        <section>
          <h2 className={`mb-4 text-center text-xl text-gray-600`}>{label}</h2>
          <strong>
            <span>役員報酬（年）：</span>
            <span {...{style: {color: redColor}}}>{chartData?.hoshu?.[keyName]}万円</span>
          </strong>
          {keyName === `before` && yatin && (
            <div>
              <small>※家賃 {yatin ?? 0}万円</small>
            </div>
          )}
        </section>
        <section className={``}>
          <C_Stack>
            {chartRecords.map((item, idx) => {
              const {label, [keyName]: value} = item

              const showDiff = idx >= 2 && keyName === `after`
              const diff = showDiff ? item[`after`] - item[`before`] : null

              return (
                <div key={label}>
                  <div {...{className: `p-3`, style: {backgroundColor: item.colorCode, color: `white`}}}>
                    <R_Stack className="justify-between">
                      <div>{label}</div>
                      <C_Stack className={` items-center gap-0`}>
                        <div>{value}万円</div>
                        {diff && <div>{`(${diff}万円)`}</div>}
                      </C_Stack>
                    </R_Stack>
                  </div>
                </div>
              )
            })}
          </C_Stack>
        </section>
        <section className={` relative mx-auto pb-20`}>
          <Chart
            {...{
              chartData,
              keyName,
              chartRecords,
              renderCenterText,

              width,
            }}
          />

          <div className={` absolute -right-4 bottom-0`}>
            <Image
              src={keyName === `before` ? '/apex/catBefore.png' : '/apex/catAfter.png'}
              width={keyName === `before` ? 100 : 140}
              height={keyName === `before` ? 100 : 140}
              alt="cat"
            />
          </div>
        </section>

        {keyName === `after` && (
          <div>
            <small className={`leading-6`}>
              ※<span>{SS_CONSTANTS.title}</span>のみの概算となります <br />
              ※他規程と合わせるとさらに手取りを増やす事ができます
            </small>
          </div>
        )}
      </C_Stack>
    </section>
  )
}
