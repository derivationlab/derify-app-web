import React, { useState } from "react";
import { Row, Col, Button } from "antd";
import FundsDetails from "./FundsDetail";
import Transfer,{OperateType}from "@/views/CommonViews/Transfer";
const Account: React.FC<Partial<{ account: string; blance: string }>> = ({
  account,
  blance,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [operateType,setType] = useState<Partial<OperateType>>()
  return (
    <Row style={{ width: 500 }}>
      <Col flex="100%" className="margin-b-m">
        <Row justify="space-between">
          <Col>账户余额</Col>
          <Col>
            <Button type="link" onClick={() => setIsModalVisible(true)}>
              资金明细
            </Button>
            <Button type="link">断开连接</Button>
          </Col>
        </Row>
      </Col>
      <Col flex="100%" className="margin-b-max">
        <Row align="bottom">
          {/* <Space > */}
          <Col
            className="main-color"
            style={{ fontSize: 30, fontWeight: 700, marginRight: "10px" }}
          >
            {blance}
          </Col>
          <Col>ETH</Col>
          <Col
            className="main-green"
            style={{
              background: "rgba(0,196,154,1)",
              color: "#000",
              borderRadius: "12px",
              padding: "0px 1px",
              marginLeft: "10px",
            }}
          >
            +1,234.56
          </Col>
          {/* </Space> */}
        </Row>
      </Col>
      <Col flex="100%" className="margin-b-max">
        <Row justify="space-between">
          <Col>
            <div>保证金余额</div>
            <div>
              <span>24.691.34</span>USDT
            </div>
          </Col>
          <Col>
            <div>占用保证金</div>
            <div>
              <span>24.691.34</span>USDT(52%)
            </div>
          </Col>
        </Row>
      </Col>
      <Col flex="100%">
        <Row gutter={20}>
          <Col flex="25">
            <Button
              block
              type="ghost"
              onClick={() => {
                setModalVisible(true);
                setType('trade.withdraw')
              }}
            >
              提现
            </Button>
          </Col>
          <Col flex="25">
            <Button
              block
              type="primary"
              onClick={() => {
                setModalVisible(true);
                setType('trade.deposit')
              }}
            >
              充值
            </Button>
          </Col>
        </Row>
      </Col>
      <FundsDetails
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
      />
      <Transfer
        visible={modalVisible}
        operateType={operateType}
        onCancel={() => setModalVisible(false)}
      />
    </Row>
  );
};

export default Account;
