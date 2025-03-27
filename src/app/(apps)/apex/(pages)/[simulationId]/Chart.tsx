import React from 'react'

import {PieChart, Pie, Cell} from 'recharts'
export const redColor = '#e10c1a'
export const blueColor = '#5271ff'
export const greenColor = '#008000'

export default function Chart({keyName, renderCenterText, chartData, chartRecords, width}) {
  const sum = chartData?.tedori[keyName]

  const chartWidth = Math.min(350, width - 5)

  const outerRadius = chartWidth - 240
  const innerRadius = outerRadius * 0.85
  return (
    <PieChart width={chartWidth} height={chartWidth}>
      {renderCenterText({
        x: '50%',
        y: '42%',
        value: `手取り合計`,
        tspanProps: {fontSize: 16},
      })}
      {renderCenterText({
        x: '50%',
        y: '50%',
        value: sum + '万円',
        tspanProps: {
          fill: keyName === 'before' ? redColor : blueColor,
          fontSize: 24,

          fontWeight: 'bold',
        },
      })}
      {renderCenterText({
        x: '50%',
        y: '58%',
        value: `法人+社長合わせて`,
        tspanProps: {fontSize: 16},
      })}
      {keyName === `after` &&
        renderCenterText({
          x: '50%',
          y: '65%',
          value: '+' + (chartData?.tedori[`after`] - chartData?.tedori[`before`]) + '万円',
          tspanProps: {
            fill: greenColor,
            fontSize: 24,
            fontWeight: 'bold',
          },
        })}

      <Pie
        {...{
          startAngle: 90,
          endAngle: -270,
          data: chartRecords,
          innerRadius,
          outerRadius,

          dataKey: keyName,
          nameKey: `label`,
          label: props => {
            const {x, y, value, name, index} = props

            const sum = chartRecords.reduce((acc, curr) => acc + curr[keyName], 0)
            const ratio = Math.round((value / (sum ?? 0)) * 1000) / 10

            return (
              <>
                <text
                  {...{
                    x,
                    y: y,
                    fontSize: 9,
                    textAnchor: 'middle',
                  }}
                >
                  {name}
                </text>
                <text
                  {...{
                    x,
                    y: y + 15,
                    fontSize: 9,
                    textAnchor: 'middle',
                  }}
                >
                  {value}万円
                </text>
                <text
                  {...{
                    x,
                    y: y + 30,
                    fontSize: 9,
                    textAnchor: 'middle',
                  }}
                >
                  {ratio}%
                </text>
              </>
            )
          },
        }}
      >
        {chartRecords.map((entry, index) => {
          return <Cell key={index} fill={entry.colorCode}></Cell>
        })}
      </Pie>
    </PieChart>
  )
}
