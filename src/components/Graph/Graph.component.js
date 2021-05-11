import React from 'react'
import data from '../../assets/jstest.json'
import { Chart } from 'react-google-charts'

export const Graph = ({ type, className }) => {
  const generateHeader = () => ['Entry', ...Object.keys(data)]

  const generateRows = () =>
    [...Array(Object.entries(data)[0][1].length)].map((_, idx) => [
      `Entry ${idx}`,
      Object.entries(data)[0][1][idx],
      Object.entries(data)[1][1][idx],
      Object.entries(data)[2][1][idx],
      Object.entries(data)[3][1][idx],
    ])

  return (
    <Chart
      height='80%'
      width='100%'
      className={className}
      chartType={type}
      data={[generateHeader(), ...generateRows()]}
      options={{
        title: 'CUD (Completely Unidentified Data)',
        hAxis: {
          title: 'Date Range covered??',
        },
        vAxis: { minValue: 0 },
        chartArea: { width: '70%', height: '70%' },
        lineWidth: 2,
        animation: {
          startup: true,
          easing: 'linear',
          duration: 500,
        },
      }}
    />
  )
}
