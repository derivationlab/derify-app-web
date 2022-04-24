import React, {useRef, useEffect, useImperativeHandle, forwardRef} from "react";
import { useWindowSize, useDebounce } from "react-use";
import * as echarts from "echarts/core";
import { CandlestickChart, LineChart } from "echarts/charts";

import ContractModel from "@/store/modules/contract"

import {
  ToolboxComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
} from "echarts/components";

import { CanvasRenderer } from "echarts/renderers";
import {ModalProps} from "antd/es/modal";
import {EChartsType} from "echarts/types/dist/shared";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  CandlestickChart,
  LineChart,
  CanvasRenderer,
]);

interface CommonChartsProps extends React.PropsWithChildren<any> {
  height?: number;
  width?: number;
  options?: any;
}

const CommonCharts: React.FC<CommonChartsProps> = forwardRef((props,ref) => {
  const { width } = useWindowSize();
  const chartDom = useRef(null);
  let chartInstance:any = null;

  const [,] = useDebounce(
    async () => {
      try {
        chartInstance.resize();
      } catch {}
    },
    500,
    [width]
  );

  const setCharOptions = (options:any) => {
    initChart(options);
  }

  useImperativeHandle(ref,() =>({
    setCharOptions: setCharOptions
  }))

  const initChart = (options:any) => {
    const myChart = echarts.getInstanceByDom(
      chartDom.current as unknown as HTMLDivElement
    );
    if (myChart) {
      chartInstance = myChart
    }
    else{
      chartInstance = echarts.init(
        chartDom.current as unknown as HTMLDivElement
      );
    }

    if(options){
      chartInstance.setOption(options);
    }
  };

  useEffect(() => {
    initChart(props.options);
  });
  return <div style={{ height: `${props.height || 300}px` }} ref={chartDom} />;
});

export default CommonCharts;
