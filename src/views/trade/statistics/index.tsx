/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useIntl, FormattedMessage} from "react-intl";
import { Row } from "antd";
import Position from "./index.position"
import Order from "./index.order"
import History from "./index.history"

function Statistics() {
  const { formatMessage } = useIntl();
  const $t = (id: string) => formatMessage({ id });
  const tabs = [
    $t("Trade.MyPosition.List.MyPosition"),
    $t("Trade.CurrentOrder.List.CurrentOrder"),
    $t("Trade.TradeHistory.List.TradeHistory"),
  ];
  const [index, setIndex] = useState<number>(1);
  return (
    <div className="statistic-wrapper">
      <div className="tabs">
        {
          tabs.map((item, _index) => (
            <div className={`tab tab${_index} ${index === _index ? "tab-active" : ""}`}
                 onClick={() => setIndex(_index)} key={item}>
              {item}
              {_index === index && <div className="bot" />}
            </div>
          ))
        }
      </div>
      <Row className="main-block statistics-container">
        {index === 0 && <Position />}
        {index === 1 && <Order />}
        {index === 2 && <History />}
      </Row>
    </div>
  );
}

export default Statistics;
