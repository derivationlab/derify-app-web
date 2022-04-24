import React from "react";
import { Row, Col } from "antd";
import Operation from "./operation";
import DataPanel from "./dataPanel";
import Statistics from "./statistics";
import "./index.less";

function Trade() {
  return (
    <div className="trade-page">
      <Row wrap={false}>
        <Col flex="auto" className="trade-wrapper">
          <DataPanel />
        </Col>
        <Col className="side-wrapper">
          <Operation />
        </Col>
      </Row>
      <Statistics />
    </div>
  );
}

export default Trade;
