/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {FormattedMessage, useIntl} from "react-intl";

import { Row, Col, Tabs } from "antd";

import MyPosition from "./MyPosition";
import CurrentOrder from "./CurrentOrder";
import TradeHistory from "@/views/trade/statistics/TradeHistory";
const { TabPane } = Tabs;

function Statistics() {
  function callback(key: any) {
    console.log(key);
  }

  const {formatMessage} = useIntl()

  function intl(id:string) {
    return formatMessage({id})
  }

  const $t = intl

  return (
    <Row className="main-block statistics-container">
      <Col flex="100%">
        <Tabs defaultActiveKey="1" onChange={callback} className="derify-trade-tab">
          <TabPane tab={<FormattedMessage id="Trade.MyPosition.List.MyPosition" />} key="1">
            <MyPosition />
          </TabPane>
          <TabPane tab={<FormattedMessage id="Trade.CurrentOrder.List.CurrentOrder" />} key="2">
            <CurrentOrder/>
          </TabPane>
          <TabPane tab={<FormattedMessage id="Trade.TradeHistory.List.TradeHistory" />} key="3">
            <TradeHistory/>
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
}

export default Statistics;
