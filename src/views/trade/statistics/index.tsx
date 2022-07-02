/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Row } from "antd";
import Position from "./index.position"
import Order from "./index.order"
import History from "./index.history"

const tabs = ['My Position', 'My Order', 'Trade History'];

function Statistics() {
  const [index, setIndex] = useState<number>(0);
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
