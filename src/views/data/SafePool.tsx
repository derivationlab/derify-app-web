import React, {useEffect, useRef} from "react";
import { Row, Col } from "antd";
import { useIntl } from "react-intl";
import CommonCharts from "@/components/charts";
import {DataModel} from "@/store";
import {useDispatch} from "react-redux";
import generateDataEchartsOptions from "@/utils/data-chart";


const options1 = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985",
      },
    },
  },


  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    },
  ],
  yAxis: [
    {
      type: "value",
      position: "right",
      offset: -10,
      splitLine: {
        lineStyle: {
          color: ["rgba(255,255,255,0.10)"],
          width: 1,
          type: "solid",
        },
      },
    },
  ],

  series: [
    {
      name: "视频广告",
      type: "line",
      stack: "总量",
      symbol: "none",
      itemStyle: {
        normal: {
          lineStyle: {
              width: 1,
            color: "#475FFA",
          },
        },
      },
      areaStyle: {
        opacity: 0.2,
        color: "#475FFA",
      },
      emphasis: {
        focus: "series",
      },
      data: [150, 232, 201, 154, 190, 330, 410],
    },

    {
      name: "搜索引擎",
      type: "line",
      stack: "总量",
      symbol: "none",
      areaStyle: {
        opacity: 0.2,
        color: "#FAE247",
      },
      itemStyle: {
        normal: {
          lineStyle: {
              width: 1,
            color: "#FAE247",
          },
        },
      },

      emphasis: {
        focus: "series",
      },
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
  ],
};
function SafePool() {
  const {formatMessage} = useIntl();
  const chartRef = useRef<any>(null);
  const dispatch = useDispatch();

  const color = ['#fae247']
  useEffect(() => {
    const loadInsuranceDataAction = DataModel.actions.loadInsuranceData();
    loadInsuranceDataAction(dispatch).then((data) => {

      const xaxis:string[] = []

      const insuranceSeriers:{stack:string, data:number[]} = {stack: 'insurance pool', data: []}
      const seriers = [insuranceSeriers]

      data.history.forEach((item) => {
        xaxis.push(item.day_time)
        insuranceSeriers.data.push(item.insurance_pool)
      })

      const options = generateDataEchartsOptions(color, xaxis, seriers);
      chartRef.current.setCharOptions(options);
    }).catch((e) => {
      console.error('loadInsuranceDataAction',e)
    });

  }, [])

  return (
    <Row className="main-block safe-pool-container">
      <Col flex="100%">
        <Row justify="space-between" align="middle">
          <Col className="title">{formatMessage({id:'Data.Data.Insurance.InsurancePool'})}</Col>
          <Col>
              <span>{formatMessage({id:'Data.Data.Insurance.InsurancePoolBalance'})}：</span>
            <span className="yellow-text">123131.211</span> USDT
          </Col>
        </Row>
      </Col>
      <Col flex="100%">
        <CommonCharts ref={chartRef} options={generateDataEchartsOptions(color,[],[])} height={330} />
      </Col>
    </Row>
  );
}

export default SafePool;
