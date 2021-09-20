import React, {forwardRef, useCallback, useEffect, useRef, useState} from 'react';

import CommonCharts from '@/components/charts';

import getEchartsOptions, {buildEchartsOptions} from "@/utils/kline";
import {ModalProps} from "antd/es/modal";
import {useLocation} from "react-router-dom";
import {useDebounce} from "react-use";

interface ChartModalProps extends ModalProps {
  token: string;
  bar: string;
  after?: string;
  before?: string;
  limit?: string;
  curPrice: string|number
  closeModal?:()=>void
}
let keyLineChartTime = 0;
const Chart: React.FC<ChartModalProps> = props => {
  const location = useLocation()
  const chartRef = useRef<any>()

  const {token,bar,after,before,limit,curPrice} = props;

  const updateChartKlineData = useCallback((token,bar,after,before,limit,curPrice) => {

    getEchartsOptions({token,bar,after,before,limit,curPrice})
      .then(chartRefoptions => {
        chartRef.current.setCharOptions(chartRefoptions)
      }).catch((e) => {
        console.log(e)
    })
  }, [chartRef])

  useEffect(() => {
    setInterval(() => {

      if(location.pathname !== '/trade'){
        return;
      }
      updateChartKlineData(token,bar,after,before,limit,curPrice)

    }, 15000)
  },[]);

  useEffect(() => {
    updateChartKlineData(token,bar,after,before,limit,curPrice);
  },[token,bar,after,before,limit,curPrice])



  return <div className="charts-container">
    <CommonCharts height={380} ref={chartRef}/>
  </div>;
};
export default Chart;
