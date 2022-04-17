/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Row, Col, Tabs } from "antd";
import MyPosition from "./MyPosition";
import { TradePosition } from "@/components/trade";
import CurrentOrder from "./CurrentOrder";
import TradeHistory from "@/views/trade/statistics/TradeHistory";
const { TabPane } = Tabs;

function Statistics() {
  const [index, setIndex] = useState<number>(1);
  function callback(key: any) {
    console.log(key);
  }

  const { formatMessage } = useIntl();

  function intl(id: string) {
    return formatMessage({ id });
  }

  const $t = intl;

  function tabChange(e: any) {
    let a = e.target.id;
    if (a) {
      let index = a.slice(a.length - 1);
      setIndex(+index);
    }
  }

  return (
    <div className="statistic-wrapper">
      <div className="tabs" onClick={tabChange}>
        <div
          className={`tab tab1 ${index === 1 ? "tab-active" : ""}`}
          id="tab1"
        >
          My Position
          {index === 1 && <div className="bot" />}
        </div>
        <div
          className={`tab tab2 ${index === 2 ? "tab-active" : ""}`}
          id="tab2"
        >
          My Order
          {index === 2 && <div className="bot" />}
        </div>
        <div
          className={`tab tab3 ${index === 3 ? "tab-active" : ""}`}
          id="tab3"
        >
          Trade History
          {index === 3 && <div className="bot" />}
        </div>
      </div>
      <Row className="main-block statistics-container">
        {index === 1 && (
          <div className="pos-list">
            <TradePosition />
            <TradePosition />
            <TradePosition />
          </div>
        )}

        {index === 2 && (
          <div className="order-list">
            <CurrentOrder />
          </div>
        )}

        {index === 3 && (
          <div className="history-list">
            <TradeHistory />
          </div>
        )}
      </Row>
    </div>
  );
}

export default Statistics;
