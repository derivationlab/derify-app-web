import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "antd";
import { useIntl } from "react-intl";
import CommonCharts from "@/components/charts";
import { DataModel } from "@/store";
import { useDispatch } from "react-redux";
import generateDataEchartsOptions from "@/utils/data-chart";
import { fck } from "@/utils/utils";
import { getUSDTokenName } from "@/config";
import TimeSelect from "./components/timeSelect";

function SafePool() {
  const { formatMessage } = useIntl();
  const [time1, setTime1] = useState("1D");
  const chartRef = useRef<any>(null);
  const dispatch = useDispatch();
  const [currentData, setCurrentData] = useState<{ insurance_pool: number }>({
    insurance_pool: 0,
  });

  const color = ["#fae247"];
  useEffect(() => {
    const loadInsuranceDataAction = DataModel.actions.loadInsuranceData();
    loadInsuranceDataAction(dispatch)
      .then(data => {
        const xaxis: string[] = [];
        setCurrentData(data.current);
        const insuranceSeriers: { stack: string; data: number[] } = {
          stack: "insurance pool",
          data: [],
        };
        const seriers = [insuranceSeriers];
        data.history.forEach(item => {
          xaxis.push(item.day_time);
          insuranceSeriers.data.push(item.insurance_pool);
        });
        if (xaxis.length < 1) {
          return;
        }
        const options = generateDataEchartsOptions(color, xaxis, seriers);
        chartRef.current.setCharOptions(options);
      })
      .catch(e => {
        console.error("loadInsuranceDataAction", e);
      });
  }, []);

  let val = fck(currentData.insurance_pool, 0, 7);
  let arr = (val + "").split(".");
  return (
    <div className="safe-pool-wrapper trading-data-wrapper">
      <div className="head">
        <div className="t">
          <span>
            {formatMessage({ id: "Data.Data.Insurance.InsurancePool" })}:
          </span>
          <span className="big-num">{arr[0]}</span>
          {arr[1] && <span className="small-num">.{arr[1]}</span>}
          <span className="unit">{getUSDTokenName()}</span>
        </div>
        <div className="opts">
          <TimeSelect onChange={setTime1} />
        </div>
      </div>
      <Row className="main-block safe-pool-container">
        <Col className='chart-out-wrapper'>
          <CommonCharts ref={chartRef} height={330} />
        </Col>
      </Row>
    </div>
  );
}

export default SafePool;
