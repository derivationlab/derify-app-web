import React, {useEffect, useRef, useState} from "react";
import {Row, Col, Select, Badge, Spin} from "antd";
import CommonCharts from "@/components/charts";
import { useIntl } from "react-intl";
import {Token} from "@/utils/contractUtil";
import {getHistoryTradingData} from "@/api/data";
import generateDataEchartsOptions from "@/utils/data-chart";
import {DataModel} from "@/store";
import {useDispatch} from "react-redux";
import {fck} from "@/utils/utils";
import {getUSDTokenName} from "@/config";
const { Option } = Select;

const color = ['#fae247', '#475FFA']

const TradingVolume: React.FC = () => {
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

  const [currentData, setCurrentData] = useState<{trading_fee: number, day_time: string, trading_amount: number}>();


  const tokenOptions = [
    {label: $t('Data.Data.Trade.All'), value: 'all'},
    {label: `BTC/${getUSDTokenName()}`, value: Token.BTC},
    {label: `ETH/${getUSDTokenName()}`, value: Token.ETH},
  ];

  const onOptionChange = (value:string) => {
    setLoading(true);
    const loadTradeDataAction = DataModel.actions.loadTradeData(value);
    loadTradeDataAction(dispatch).then((data) => {

      //updare echarts

      setCurrentData(data.current);

      //trading_fee: number, day_time: string, trading_amount: number
      //trading_amount trading_fee
      const xaxis = []

      const tradAmSeries:{stack:string,data:number[]} = {stack: 'trading amount', data: []}
      const tradFeeSeries:{stack:string,data:number[]} = {stack: 'trading fee', data: []}
      const seriers = [tradAmSeries, tradFeeSeries]

      //{long_position_amount: number, short_position_amount: number, day_time: string}
      for(let i = 0; i < data.history.length; i++) {
        const item = data.history[i];
        xaxis.push(item.day_time)
        tradAmSeries.data.push(item.trading_amount)
        tradFeeSeries.data.push(item.trading_fee)
      }

      if(xaxis.length < 1) {
        return;
      }

      const options = generateDataEchartsOptions(color, xaxis, seriers)

      chartRef.current.setCharOptions(options);
    }).catch((e) => {
      console.error("getHistoryTradingData error", e);
    }).finally(() => {
      setLoading(false);
    })
  };

  useEffect(() => {
    onOptionChange(tokenOptions[0].value)
  }, [])

  return (
    <Spin spinning={loading}>
      <Row className="main-block trading-volume-container">
        <Col flex="100%">
          <Row justify="space-between" align="middle">
            <Col className="title">
              {formatMessage({ id: "Data.Data.Trade.TradingVolume" })}
            </Col>
            <Col>
              <Select
                defaultValue={tokenOptions[0].value}
                size={"large"}
                style={{ width: 140 }}
                bordered={false}
                options={tokenOptions}
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
                <Badge color="#FAE247" />
                {formatMessage({ id: "Data.Data.Trade.TradingVolume" })}（24h）
              </div>
              <div style={{ margin: "4px 0", paddingLeft: "14px" }}>
                <span className="white-color">{fck(currentData?.trading_amount,0,2)}</span> {getUSDTokenName()}
              </div>
            </Col>
            <Col flex="50%">
              <div>
                <Badge color="#475FFA" />
                {formatMessage({ id: "Data.Data.Trade.TradFeeEarning" })}（24h）
              </div>
              <div style={{ margin: "4px 0", paddingLeft: "14px" }}>
                <span className="white-color">{fck(currentData?.trading_fee,0,2)}</span> {getUSDTokenName()}
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
};
export default TradingVolume;
