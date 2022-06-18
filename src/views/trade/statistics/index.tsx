/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { Row } from "antd";
import Position from "./index.position"
import Order from "./index.order"
import History from "./index.history"

function Statistics() {
  const [index, setIndex] = useState<number>(0);
  const { formatMessage } = useIntl();
  function intl(id: string) {
    return formatMessage({ id });
  }
  const $t = intl;

  return (
    <div className="statistic-wrapper">
      <div className="tabs">
        {
          ['My Position', 'My Order', 'Trade History'].map((item, _index) => (
            <div className={`tab tab${_index} ${index === _index ? "tab-active" : ""}`} onClick={() => setIndex(_index)}>
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
