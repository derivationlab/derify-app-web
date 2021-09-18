import React, {forwardRef, useCallback, useEffect, useRef, useState} from 'react';

import CommonCharts from '@/components/charts';

import getEchartsOptions, {buildEchartsOptions} from "@/utils/kline";
import {ModalProps} from "antd/es/modal";
import {OpenType, RateType} from "@/views/trade/operation";
import {useDebounce} from "react-use";
import {useLocation} from "react-router-dom";

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

const mapParamCache:{[key:string]:string} = {}
let keyLineChartTime = 0;
const Chart: React.FC<ChartModalProps> = props => {
  const location = useLocation()
  const chartRef = useRef<any>()

  const options1 = buildEchartsOptions({categoryData:[(new Date()).Format('hh:mm')]
    , values:[[0,0,0,0]], curPrice:0
    , bar:'15m'})

  const updateChartKlineData = useCallback(() => {
    const {token,bar,after,before,limit,curPrice} = props
    const chartOptionKey = [token,bar,after,before,limit,curPrice,keyLineChartTime].join("_")



    if(mapParamCache.keyLineChart == chartOptionKey) {
      return
    }

    mapParamCache.keyLineChart = chartOptionKey

    getEchartsOptions({token,bar,after,before,limit,curPrice})
      .then(chartRefoptions => {

        if(!chartRef){
          return
        }

        chartRef.current.setCharOptions(chartRefoptions)
      }).catch((e) => {
        console.log(e)
    })
  }, [props])

  useEffect(() => {
    keyLineChartTime = 0;
    setInterval(() => {

      if(location.pathname !== '/home/trade'){
        return;
      }

      updateChartKlineData()
      keyLineChartTime++
    }, 5000)
  },[])

  return <div className="charts-container">
    <CommonCharts  options={options1} height={380} ref={chartRef}/>
  </div>;
};
export default Chart;
