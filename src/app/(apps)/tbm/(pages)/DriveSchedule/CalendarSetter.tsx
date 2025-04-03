'use client'
import {Days, formatDate} from '@class/Days'
import {TextRed} from '@components/styles/common-components/Alert'
import {Button} from '@components/styles/common-components/Button'
import {C_Stack, Center, R_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import {ChevronDoubleRightIcon} from '@heroicons/react/20/solid'
import React, {useState} from 'react'

export default function CalendarSetter({days, defaultSelectedDays, onConfirm}) {
  const weekDays = [`月`, `火`, `水`, `木`, `金`, `土`, `日`, `祝`]
  const [selectedDays, setselectedDays] = useState<Date[]>(defaultSelectedDays)
  const setSelectedDays = (selectedWeekDay: string, mode: 'on' | 'off') => {
    const daysToSetDisabled: Date[] = []
    const daysToSetActive: Date[] = []
    days.filter(day => {
      const hit = formatDate(day, 'ddd') === selectedWeekDay

      if (hit) {
        if (mode === 'on') {
          daysToSetActive.push(day)
        } else {
          daysToSetDisabled.push(day)
        }
      }
    })
    setselectedDays(prev => {
      const next = [...prev]
      daysToSetActive.forEach(item => {
        if (!next.some(d => Days.isSameDate(d, item))) {
          next.push(item)
        }
      })

      daysToSetDisabled.forEach(item => {
        if (next.some(d => Days.isSameDate(d, item))) {
          next.splice(
            next.findIndex(d => Days.isSameDate(d, item)),
            1
          )
        }
      })

      return next
    })
  }

  return (
    <C_Stack className={` relative  gap-2 `}>
      {/* 曜日選択 */}

      <div className={` absolute right-0 top-0 text-center`}></div>
      <C_Stack className={` gap- items-center`}>
        <div className={``}>
          <Button
            size="lg"
            color="green"
            className={` !p-2 !text-[24px]  font-bold`}
            {...{
              onClick: async () => await onConfirm({selectedDays}),
            }}
          >
            変更を反映する
          </Button>
        </div>

        <C_Stack className={`gap-0.5`}>
          <small>選択した曜日を一括で、ON / OFFできます。その場合、個別に設定した値も上書きされます。 </small>
          <small>一括反映後、個別で修正を実施することも可能です。</small>
        </C_Stack>
      </C_Stack>

      <section>
        <R_Stack className={` relative items-start  justify-between`}>
          <div className={``}>
            <C_Stack className={` items-center`}>
              {CsvTable({
                SP: true,
                records: [
                  {
                    csvTableRow: [
                      ...weekDays.map(wd => ({
                        label: (
                          <Center>
                            <strong className={` text-center text-lg`}>{wd}</strong>
                          </Center>
                        ),
                        cellValue: (
                          <div key={wd}>
                            <C_Stack className={` items-center   gap-1 `}>
                              <Button
                                {...{
                                  color: 'blue',
                                  className: `w-[60px] `,
                                  onClick: () => setSelectedDays(wd, 'on'),
                                }}
                              >
                                ON
                              </Button>
                              <Button
                                {...{
                                  color: 'gray',
                                  className: `w-[60px] `,
                                  onClick: () => setSelectedDays(wd, 'off'),
                                }}
                              >
                                OFF
                              </Button>
                            </C_Stack>
                          </div>
                        ),
                      })),
                    ],
                  },
                ],
              }).WithWrapper({className: `t-paper  min-w-[160px] border-2 `})}
            </C_Stack>
          </div>
          <div>
            <ChevronDoubleRightIcon className={`h-[100px] w-[100px]  text-blue-700 `} />
            <ChevronDoubleRightIcon className={`h-[100px] w-[100px]  text-blue-700 `} />
            <ChevronDoubleRightIcon className={`h-[100px] w-[100px]  text-blue-700 `} />
            <ChevronDoubleRightIcon className={`h-[100px] w-[100px]  text-blue-700 `} />
            <ChevronDoubleRightIcon className={`h-[100px] w-[100px]  text-blue-700 `} />
          </div>
          <div>
            {/* 日付選択 */}
            {CsvTable({
              records: [
                ...days.map(day => ({
                  csvTableRow: [
                    {
                      style: {fontSize: 18, width: 160},
                      cellValue: <Center>{formatDate(day, 'YYYY/M/D(ddd)')}</Center>,
                    },
                    {
                      style: {fontSize: 18, width: 20},
                      cellValue: (
                        <Center>
                          <input
                            {...{
                              type: 'checkbox',
                              className: `h-[24px] w-[24px] onHover`,
                              checked: selectedDays.some(d => Days.isSameDate(d, day)),
                              onChange: e => {
                                setselectedDays(prev => {
                                  const nextData = [...prev]
                                  if (nextData.some(d => Days.isSameDate(d, day))) {
                                    nextData.splice(
                                      nextData.findIndex(d => Days.isSameDate(d, day)),
                                      1
                                    )
                                  } else {
                                    nextData.push(day)
                                  }
                                  return nextData
                                })
                              },
                            }}
                          />
                        </Center>
                      ),
                    },
                    // {
                    //   style: {fontSize: 20},
                    //   cellValue: <textarea {...{className: `h-6 w-6  w-full`}} />,
                    // },
                  ],
                })),
              ],
            }).WithWrapper({className: `  min-w-[300px] t-paper border-2  max-h-[650px]`})}
          </div>
        </R_Stack>
      </section>
    </C_Stack>
  )
}
