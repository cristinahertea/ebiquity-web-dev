import React from 'react'
import data from '../../assets/jstest.json'
import { Chart } from 'react-google-charts'

export const Graph = ({ type }) => {
  const fabricateColumns = () => {
    return ['Entry', ...Object.keys(data)]
  }

  const fabricateArray = () => {
    return [...Array(Object.entries(data)[0][1].length)].map((_, idx) => {
      return [
        `Entry ${idx}`,
        Object.entries(data)[0][1][idx],
        Object.entries(data)[1][1][idx],
        Object.entries(data)[2][1][idx],
        Object.entries(data)[3][1][idx],
      ]
    })
  }

  console.log(fabricateArray())
  return (
    <Chart
      width='90%'
      height='90%'
      chartType={type}
      data={[fabricateColumns(), ...fabricateArray()]}
      options={{
        title: 'CUD (Completely Unidentified Data)',
        hAxis: {
          title: 'Date Range covered??',
        },
        vAxis: { minValue: 0 },
        chartArea: { width: '80%', height: '70%' },
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
