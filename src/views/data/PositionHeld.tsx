import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { Row, Col, Select, Badge, Spin } from "antd";
import CommonCharts from "@/components/charts";
import { useDispatch, useSelector } from "react-redux";
import { DataModel, RootStore } from "@/store";
import { Token } from "@/utils/contractUtil";
import generateDataEchartsOptions from "@/utils/data-chart";
import { fck } from "@/utils/utils";
import { getUSDTokenName } from "@/config";
import TimeSelect from "./components/timeSelect";
import TypeSelect from "./components/typeSelect";
const color = ["#00C49A", "#EA446B"];

function PositionHeld() {
  const [time1, setTime1] = useState("1D");
  const dispatch = useDispatch();
  const chartRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { formatMessage } = useIntl();

  function intl<T>(id: string, values: T[] = []) {
    const intlValues: { [key: number]: T } = {};
    values.forEach((item, index) => {
      intlValues[index] = item;
    });
    return formatMessage({ id }, intlValues);
  }

  const $t = intl;

  const [currentData, setCurrentData] = useState<{
    long_position_amount: number;
    short_position_amount: number;
  }>();

  const tokenOptions = [
    { label: $t("Data.Data.Trade.All"), value: "all" },
    { label: `BTC/${getUSDTokenName()}`, value: Token.BTC },
    { label: `ETH/${getUSDTokenName()}`, value: Token.ETH },
  ];

  const onOptionChange = (value: string) => {
    setLoading(true);
    const loadHeldDataAction = DataModel.actions.loadHeldData(value);
    loadHeldDataAction(dispatch)
      .then(data => {
        setCurrentData(data.current);
        const xaxis: string[] = [];
        const longSeries: { stack: string; data: number[] } = {
          stack: "long",
          data: [],
        };
        const shortSeries: { stack: string; data: number[] } = {
          stack: "short",
          data: [],
        };
        const seriers = [longSeries, shortSeries];

        //{long_position_amount: number, short_position_amount: number, day_time: string}
        data.history.forEach(item => {
          xaxis.push(item.day_time);
          longSeries.data.push(item.long_position_amount);
          shortSeries.data.push(item.short_position_amount);
        });

        if (xaxis.length < 1) {
          return;
        }
        const options = generateDataEchartsOptions(color, xaxis, seriers);
        chartRef.current.setCharOptions(options);
      })
      .catch(e => {
        console.error("getHistoryTradingData error", e);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    onOptionChange(tokenOptions[0].value);
  }, []);

  let total = "0.00";
  if (currentData && currentData.long_position_amount !== undefined) {
    total = fck(
      currentData.long_position_amount + currentData.short_position_amount,
      0,
      2
    );
  }

  return (
    <div className="position-volume-wrapper trading-data-wrapper">
      <div className="head">
        <div className="t">
          <span>{formatMessage({ id: "Data.Data.Held.PositionVolume" })}:</span>
          <span className="big-num">{total.split(".")[0]}</span>
          <span className="small-num">.{total.split(".")[1]}</span>
          <span className="unit">{getUSDTokenName()}</span>
        </div>
        <div className="opts">
          <TimeSelect onChange={setTime1} />
          <TypeSelect onChange={onOptionChange} options={tokenOptions} />
        </div>
      </div>

      <Spin spinning={loading}>
        <Row className="main-block amount-container">
          <Col className="chart-out-wrapper">
            <Row>
              <Col flex="50%">
                <div>
                  <Badge color="#00C49A" />
                  {formatMessage({ id: "Data.Data.Held.TotalLong" })}
                </div>
                <div style={{ margin: "4px 0", paddingLeft: "14px" }}>
                  <span>{fck(currentData?.long_position_amount, 0, 2)}</span>{" "}
                  {getUSDTokenName()}
                </div>
              </Col>
              <Col flex="50%">
                <div>
                  <Badge color="#EA446B" />
                  {formatMessage({ id: "Data.Data.Held.TotalShort" })}
                </div>
                <div style={{ margin: "4px 0", paddingLeft: "14px" }}>
                  <span>{fck(currentData?.short_position_amount, 0, 2)}</span>{" "}
                  {getUSDTokenName()}
                </div>
              </Col>
            </Row>
          </Col>
          <Col className="chart-out-wrapper">
            <CommonCharts ref={chartRef} height={330} />
          </Col>
        </Row>
      </Spin>
    </div>
  );
}

export default PositionHeld;
