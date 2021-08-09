/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { FormattedMessage } from "react-intl";

import { Row, Col, Tabs } from "antd";

import MyPosition from "./myPosition";
const { TabPane } = Tabs;

function Statistics() {
  function callback(key: any) {
    console.log(key);
  }

  return (
    <Row className="main-block statistics-container">
      <Col flex="100%">
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab={<FormattedMessage id="trade.my.position" />} key="1">
            <MyPosition />
          </TabPane>
          <TabPane tab={<FormattedMessage id="trade.current.order" />} key="2">
            {/* <Table dataSource={dataSource} columns={columns} pagination={false}/> */}
          </TabPane>
          <TabPane tab={<FormattedMessage id="trade.trade.history" />} key="3">
            {/* <Table dataSource={dataSource} columns={columns} pagination={false}/> */}
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
}

export default Statistics;
