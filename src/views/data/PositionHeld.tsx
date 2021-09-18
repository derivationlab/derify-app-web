import React from "react";
import { useIntl } from "react-intl";
import { Row, Col, Select, Badge } from "antd";
import CommonCharts from "@/components/charts";
import {useSelector} from "react-redux";
import {RootStore} from "@/store";
const { Option } = Select;

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
            color: "#EA446B",
          },
        },
      },
      areaStyle: {
        opacity: 0.2,
        color: "#EA446B",
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
        color: "#00C49A",
      },
      itemStyle: {
        normal: {
          lineStyle: {
            width: 1,
            color: "#00C49A",
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

function PositionHeld() {
  const { formatMessage } = useIntl();

  const tokenPairs = useSelector<RootStore>(state => state.contract.pairs)

  return (
    <Row className="main-block amount-container">
      <Col flex="100%">
        <Row justify="space-between" align="middle">
          <Col className="title">{formatMessage({ id: "trade.position.held" })}</Col>
          <Col>
            <Select
              defaultValue="market"
              size={"large"}
              style={{ width: 140 }}
              bordered={false}
            >
              <Option value="market">
                {formatMessage({ id: "data.all" })}
              </Option>
              <Option value="fixed1">ETH / USDT</Option>
              <Option value="fixed2">BTC / USDT</Option>
              <Option value="fixed3">ETH / BTC</Option>
              <Option value="fixed4">DRF / USDT</Option>
            </Select>
          </Col>
        </Row>
      </Col>
      <Col flex="100%">
        <Row>
          <Col flex="50%">
            <div>
              <Badge color="#00C49A" />
              {formatMessage({ id: "data.total.long" })}
            </div>
            <div style={{ margin: "4px 0", paddingLeft: "14px" }}>
              <span className="white-color">123456780.12</span> USDT
            </div>
          </Col>
          <Col flex="50%">
            <div>
              <Badge color="#EA446B" />
              {formatMessage({ id: "data.total.short" })}
            </div>
            <div style={{ margin: "4px 0", paddingLeft: "14px" }}>
              <span className="white-color">123456780.12</span> USDT
            </div>
          </Col>
        </Row>
      </Col>
      <Col flex="100%">
        <CommonCharts options={options1} height={330} />
      </Col>
    </Row>
  );
}

export default PositionHeld;
