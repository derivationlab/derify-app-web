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
  // after?: string;
  // before?: string;
  // limit?: string;
  curPrice: string|number
  closeModal?:()=>void
}
let keyLineChartTime:NodeJS.Timeout|null = null;
const Chart: React.FC<ChartModalProps> = props => {
  const location = useLocation()
  const chartRef = useRef<any>()
  const chartContainer = useRef<any>()

  let { token, bar, curPrice } = props;
  const [limit, setLimit] = useState(35)
  const nowStr =  (new Date()).getTime()
  const [after, setAfter] = useState(nowStr)
  const timeGap = timeOptions.find((item) => item.value === bar) || timeOptions[0] ;

  const beforeStr = (after - timeGap.time * (limit || 1))
  const [before, setBefore] = useState(beforeStr)

  const updateChartKlineData = (token: string, bar: string, after: number, before: number, limit: number, curPrice: string | number) => {
    getEchartsOptions({token,bar,after,before,limit,curPrice})
      .then(chartRefoptions => {
        chartRef.current.setCharOptions(chartRefoptions)
      }).catch((e) => {
        console.log(e)
    })
  }

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

  useDebounce(
    () => {
      updateChartKlineData(token,bar,after,before,limit,curPrice);
    },
    500,
    [token,bar,after,before,limit,curPrice]
  );


  const onWheel = (e: WheelEvent) => {
    if(e.deltaY > 1){
      if(limit > 300){
        return;
      }

      setLimit(limit + 1)
      setBefore(after - timeGap.time * (limit || 1))
    }else if(e.deltaY < -1){
      if(limit < 10){
        return;
      }

      setLimit(limit -1)
    }else{
      return;
    }
  }

  let dragStartEvent:MouseEvent|null = null;
  const onMouseDown = (e:MouseEvent) => {
    if(e.buttons > 1){
      return;
    }

    dragStartEvent = e;
  }
  const chartEle:HTMLDivElement = chartContainer.current;

  const onMouseMove = (e: MouseEvent) => {
    if(dragStartEvent == null){
      return;
    }
    const deltaX = e.pageX - dragStartEvent.pageX;

    if(deltaX < 10){
      return;
    }


    const timeOption = timeOptions.find((item) => item.value == bar);

    if(!timeOption){
      return;
    }

    let afterTimestamp = after ? after : (new Date()).getTime();

    afterTimestamp = afterTimestamp - Math.ceil(deltaX / chartEle.clientWidth * limit * timeOption.time);

    setAfter(afterTimestamp)

    // updateChartKlineData(token,bar,after,before,limit,curPrice);
    dragStartEvent = e;
  }

  const onMouseUp = (e: MouseEvent) => {
    // dragStartEvent = null
    const endX = e.pageX
    const startX = dragStartEvent?.pageX || endX
    const deltaX = endX - startX
    if (deltaX <= 10) return;

    const deltaTime = Math.ceil(deltaX / chartEle.clientWidth * limit * timeGap.time);
    setBefore(before - deltaTime);
    setAfter(after - deltaTime);
  }

  return (
    <div className="charts-container" ref={chartContainer}
        onWheelCapture={onWheel}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
    >
      <CommonCharts height={380} ref={chartRef} />
    </div>);
};
export default Chart;
