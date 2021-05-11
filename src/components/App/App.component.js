import React, { useState } from 'react'
import { Graph } from '../Graph'

const chartType = [
  { label: 'Pie Chart', value: 'PieChart' },
  { label: 'Line Chart', value: 'LineChart' },
  { label: 'Area Chart', value: 'AreaChart' },
]

export const App = () => {
  const [currentChartType, setCurrentChartType] = useState(chartType[0].value)

  return (
    <>
      <div className='main-container'>
        <div className='header'>
          <div className='title'>Ebiquity Dev Test</div>
          <div className='menu'>
            <select
              className='select'
              name='chart-type'
              value={currentChartType}
              onChange={(e) => setCurrentChartType(e.target.value)}
            >
              {chartType.map((el) => {
                return (
                  <option value={el.value} key={el.value}>
                    {el.label}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
        <Graph className={'graph'} type={currentChartType} />
      </div>
      <style>{`
        /* 
              embedded scoped CSS, normally i would use something like styled-components
        */

        :root {
          --main-font-color: #6194ED;
          --main-dark-color: #2D2F34;
          --main-light-color: #EDEDEE;
        }
        
        .main-container {
          height: 100%;
          width: 100%;
        }

        .header {
          border-bottom: 2px solid var(--main-dark-color); 
          display: grid;
          grid-template-columns: auto max-content;
          background: var(--main-light-color)
        }

        .title {
          padding: 10px;
          color: var(--main-font-color);
          font-weight: 600;
          font-size: 46px;
          text-align: center
        }

        .menu {
          border-left: 1px dashed var(--main-dark-color);
          padding: 10px;
          display: flex;
        }
        
        .graph {
          margin: auto;
        }

        .select {
          font-size: 24px;
          padding: 5px 10px;
          color: var(--main-font-color);
        }
      `}</style>
    </>
  )
}
