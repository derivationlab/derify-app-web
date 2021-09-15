import React from 'react';
import { Row, Col } from 'antd'

import './index.less'

import Operation from './operation';
import DataPanel from './dataPanel';
import Statistics from './statistics';
function Trade() {

  return (
    <div className="trade-page">
      <Row gutter={24}  wrap={false}>
        <Col flex="auto" ><DataPanel /></Col>
        <Col flex="387px">
          <Operation />
        </Col>
      </Row>
      <Row >
        <Col flex="100%">
          <Statistics/>
        </Col>
      </Row>
    </div>
  );
}

export default Trade;
