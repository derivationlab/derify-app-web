import React, {EventHandler, forwardRef, MouseEvent, useCallback, useEffect, useRef, useState, WheelEvent} from 'react';

import CommonCharts from '@/components/charts';

import getEchartsOptions, {buildEchartsOptions} from "@/utils/kline";
import {ModalProps} from "antd/es/modal";
import {useLocation} from "react-router-dom";
import {useDebounce} from "react-use";

export const timeOptions: Array<{ label: string; value: string, time: number }> = [
  {value: '1m', label: '1m', time: 60 * 1000},
  {value: '5m', label: '5m', time: 5 * 60 * 1000},
  {value: '15m', label: '15m', time: 15 * 60 * 1000},
  {value: '1h', label: '1h', time: 60 * 60 * 1000},
  {value: '4h', label: '4h', time: 4 * 60 * 60 * 1000},
  {value: '1D', label: 'D', time: 24 * 60 * 60 * 1000},
  {value: '1W', label: 'W', time: 7 * 24 * 60 * 60 * 1000},
  {value: '1M', label: 'M', time: 30 * 24 * 60 * 60 * 1000},
]

interface ChartModalProps extends ModalProps {
  token: string;
  bar: string;
  after?: string;
  before?: string;
  limit?: string;
  curPrice: string|number
  closeModal?:()=>void
}
let keyLineChartTime:NodeJS.Timeout|null = null;
const Chart: React.FC<ChartModalProps> = props => {
  const location = useLocation()
  const chartRef = useRef<any>()
  const chartContainer = useRef<any>()

  let {token,bar,after,before,limit,curPrice} = props;

  const updateChartKlineData = useCallback((token,bar,after,before,limit,curPrice) => {

    getEchartsOptions({token,bar,after,before,limit,curPrice})
      .then(chartRefoptions => {
        chartRef.current.setCharOptions(chartRefoptions)
      }).catch((e) => {
        console.log(e)
    })
  }, []);


  const updateCandleLine = useCallback(() => {

    if(location.pathname !== '/trade'){
      return;
    }
    updateChartKlineData(token,bar,after,before,limit,curPrice)

  },[token,bar,after,before,limit,curPrice,location.pathname]);

  useEffect(() => {

    if(keyLineChartTime !== null){
      clearInterval(keyLineChartTime)
    }

    keyLineChartTime = setInterval(updateCandleLine, 15000);
  },[token,bar,after,before,limit,curPrice,updateCandleLine]);



  useEffect(() => {
    updateChartKlineData(token,bar,after,before,limit,curPrice);
  },[token,bar,after,before,limit,curPrice])


  const [updateTicket, setUpdateTicket] = React.useState(Date.now());
  useDebounce(
    () => {
      updateChartKlineData(token,bar,after,before,limit,curPrice);
    },
    2000,
    [updateTicket]
  );

  const onWheel = (e: WheelEvent) => {
    // e.stopPropagation();
    if(!limit){
      limit = (35).toString();
    }

    if(e.deltaY > 1){

      if(parseInt(limit) > 300){
        return;
      }

      limit = (parseInt(limit) + 1).toString();
    }else if(e.deltaY < -1){
      if(parseInt(limit) < 10){
        return;
      }

      limit = (parseInt(limit) -1 ).toString();
    }else{
      return;
    }
    setUpdateTicket(Date.now())
  }

  let dragStartEvent:MouseEvent|null = null;
  const onMouseDown = (e:MouseEvent) => {

    if(e.buttons > 1){
      return;
    }

    dragStartEvent = e;
  }
  const chartEle:HTMLDivElement = chartContainer.current;

  const onMouseMove = (e:MouseEvent) => {
    if(dragStartEvent == null){
      return;
    }
    if(!limit){
      limit = (35).toString();
    }

    const deltaX = e.pageX - dragStartEvent.pageX;

    if(deltaX < 10){
      return;
    }


    const timeOption = timeOptions.find((item) => item.value == bar);

    if(!timeOption){
      return;
    }

    let afterTimestamp = after ? parseInt(after) : (new Date()).getTime();

    afterTimestamp = afterTimestamp - Math.ceil(deltaX / chartEle.clientWidth * parseInt(limit) * timeOption.time);

    after = afterTimestamp.toString();

    updateChartKlineData(token,bar,after,before,limit,curPrice);
    dragStartEvent = e;
  }

  const onMouseUp = (e:MouseEvent) => {
    dragStartEvent = null;
  }


  return (
    <div className="charts-container" ref={chartContainer} onWheelCapture={onWheel}
         onMouseUp={onMouseUp}
         onMouseMove={onMouseMove}
         onMouseDown={onMouseDown}>
      <CommonCharts height={380} ref={chartRef}/>
    </div>);
};
export default Chart;
