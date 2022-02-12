import React, {useEffect, useRef, useState} from "react";
import { useIntl } from "react-intl";
import {Row, Col, Select, Badge, Spin} from "antd";
import CommonCharts from "@/components/charts";
import {useDispatch, useSelector} from "react-redux";
import {DataModel, RootStore} from "@/store";
import {Token} from "@/utils/contractUtil";
import generateDataEchartsOptions from "@/utils/data-chart";
import {fck} from "@/utils/utils";
import {getUSDTokenName} from "@/config";
const color = ['#00C49A', '#EA446B']

function PositionHeld() {
  const dispatch = useDispatch();

  const chartRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { formatMessage } = useIntl();

  function intl<T>(id:string,values:T[] = []) {

    const intlValues:{[key:number]:T} = {}

    values.forEach((item, index) => {
      intlValues[index] = item
    })


    return formatMessage({id}, intlValues)
  }

  const $t = intl;

  const [currentData, setCurrentData] = useState<{long_position_amount: number, short_position_amount: number}>();



  const tokenOptions = [
    {label: $t('Data.Data.Trade.All'), value: 'all'},
    {label: `BTC/${getUSDTokenName()}`, value: Token.BTC},
    {label: `ETH/${getUSDTokenName()}`, value: Token.ETH},
  ];

  const onOptionChange = (value:string) => {
    setLoading(true);
    const loadHeldDataAction = DataModel.actions.loadHeldData(value);
    loadHeldDataAction(dispatch).then((data) => {

      setCurrentData(data.current);

      const xaxis:string[] = [];

      const longSeries:{stack:string,data:number[]} = {stack: 'long', data: []}
      const shortSeries:{stack:string,data:number[]} = {stack: 'short', data: []}
      const seriers = [longSeries, shortSeries]

      //{long_position_amount: number, short_position_amount: number, day_time: string}
      data.history.forEach((item) => {
        xaxis.push(item.day_time)
        longSeries.data.push(item.long_position_amount)
        shortSeries.data.push(item.short_position_amount)
      })

      if(xaxis.length < 1) {
        return;
      }

      const options = generateDataEchartsOptions(color, xaxis, seriers)

      chartRef.current.setCharOptions(options);
    }).catch((e) => {
      console.error("getHistoryTradingData error", e);
    }).finally(() => setLoading(false))
  };

  useEffect(() => {
    onOptionChange(tokenOptions[0].value)
  }, [])

  return (
    <Spin spinning={loading}>
      <Row className="main-block amount-container">
        <Col flex="100%">
          <Row justify="space-between" align="middle">
            <Col className="title">{formatMessage({ id: "Data.Data.Held.PositionVolume" })}</Col>
            <Col>
              <Select
                defaultValue={tokenOptions[0].value}
                options={tokenOptions}
                size={"large"}
                style={{ width: 140 }}
                bordered={false}
                onChange={onOptionChange}
              >
              </Select>
            </Col>
          </Row>
        </Col>
        <Col flex="100%">
          <Row>
            <Col flex="50%">
              <div>
                <Badge color="#00C49A" />
                {formatMessage({ id: "Data.Data.Held.TotalLong" })}
              </div>
              <div style={{ margin: "4px 0", paddingLeft: "14px" }}>
                <span className="white-color">{fck(currentData?.long_position_amount,0,2)}</span> {getUSDTokenName()}
              </div>
            </Col>
            <Col flex="50%">
              <div>
                <Badge color="#EA446B" />
                {formatMessage({ id: "Data.Data.Held.TotalShort" })}
              </div>
              <div style={{ margin: "4px 0", paddingLeft: "14px" }}>
                <span className="white-color">{fck(currentData?.short_position_amount,0,2)}</span> {getUSDTokenName()}
              </div>
            </Col>
          </Row>
        </Col>
        <Col flex="100%">
          <CommonCharts ref={chartRef} height={330} />
        </Col>
      </Row>
    </Spin>
  );
}

export default PositionHeld;
