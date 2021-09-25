import React, {useEffect, useRef} from "react";
import { Row, Col } from "antd";
import { useIntl } from "react-intl";
import CommonCharts from "@/components/charts";
import {DataModel} from "@/store";
import {useDispatch} from "react-redux";
import generateDataEchartsOptions from "@/utils/data-chart";
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

      if(xaxis.length < 1) {
        return;
      }
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
        <CommonCharts ref={chartRef} height={330} />
      </Col>
    </Row>
  );
}

export default SafePool;
