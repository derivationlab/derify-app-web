import React, { useRef, useEffect } from "react";
import { useWindowSize, useDebounce } from "react-use";
import * as echarts from "echarts/core";
import { CandlestickChart, LineChart } from "echarts/charts";
import {
  ToolboxComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
} from "echarts/components";

import { CanvasRenderer } from "echarts/renderers";

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

interface CommonChartsProps {
  height?: number;
  width?: number;
  options: any;
}

const CommonCharts: React.FC<CommonChartsProps> = props => {
  const { width } = useWindowSize();
  const chartDom = useRef(null);
  let chartInstance: any = null;

  const [,] = useDebounce(
    async () => {
      try {
        chartInstance.resize();
      } catch {}
    },
    500,
    [width]
  );
  const initChart = () => {
    const myChart = echarts.getInstanceByDom(
      chartDom.current as unknown as HTMLDivElement
    );
    if (myChart) chartInstance = myChart;
    else
      chartInstance = echarts.init(
        chartDom.current as unknown as HTMLDivElement
      );
    chartInstance.setOption(props.options);
  };

  useEffect(() => {
    initChart();
  });
  return <div style={{ height: `${props.height || 300}px` }} ref={chartDom} />;
};

export default CommonCharts;
