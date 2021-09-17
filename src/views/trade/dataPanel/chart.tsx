import React, {forwardRef, useEffect, useRef, useState} from 'react';

import CommonCharts from '@/components/charts';

import getEchartsOptions, {buildEchartsOptions} from "@/utils/kline";
import {ModalProps} from "antd/es/modal";
import {OpenType, RateType} from "@/views/trade/operation";

function splitData(rawData: any) {
  var categoryData = [];
  var values = []
  for (var i = 0; i < rawData.length; i++) {
    categoryData.push(rawData[i].splice(0, 1)[0]);
    values.push(rawData[i])
  }
  return {
    categoryData: categoryData,
    values: values
  };
}


var data0 = splitData([]);

// const options1 = {
//   tooltip: {
//     trigger: 'axis',
//     axisPointer: {
//       type: 'cross'
//     }
//   },
//   xAxis: {
//     type: 'category',
//     data: data0.categoryData,
//     scale: true,
//     boundaryGap: false,
//     axisLine: { onZero: false },
//     splitLine: { show: false },
//     splitNumber: 20,
//     min: 'dataMin',
//     max: 'dataMax'
//   },
//   yAxis: {
//     // show: false,
//     position: 'right',
//     splitLine:{
//       show: true,
//       lineStyle:{
//         color:'rgba(255,255,255,0.3)'
//       }
//     },
//     scale: true,
//   },
//
//   series: [
//     {
//       name: '1d',
//       type: 'candlestick',
//       data: data0.values,
//       itemStyle: {
//         color: '#E7446B',
//         color0: '#00C49A',
//         borderColor: '#E7446B',
//         borderColor0: '#00C49A'
//       },
//     },
//   ]
// };

interface ChartModalProps extends ModalProps {
  token: string;
  bar: string;
  after?: string;
  before?: string;
  limit?: string;
  curPrice: string|number
  closeModal?:()=>void
}

const Chart: React.FC<ChartModalProps> = props => {

  const chartRef = useRef<any>()

  const options1 = buildEchartsOptions({categoryData:[(new Date()).Format('hh:mm')]
    , values:[[0,0,0,0]], curPrice:0
    , bar:'15m'})
  useEffect(() => {
    const {token,bar,after,before,limit,curPrice} = props

    getEchartsOptions({token,bar,after,before,limit,curPrice})
      .then(chartRefoptions => {

        if(!chartRef){
          return
        }

        chartRef.current.setCharOptions(chartRefoptions)
      }).catch((e) => {
        console.log(e)
    })
  } ,[props,chartRef])

  return <div className="charts-container">
    <CommonCharts  options={options1} height={380} ref={chartRef}/>
  </div>;
};
export default Chart;
