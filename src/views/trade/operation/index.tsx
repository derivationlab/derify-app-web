import React, { useState } from "react";
import { Row, Col, Select, Button, Slider, Input } from "antd";
import { FormattedMessage } from "react-intl";

import Transfers from "@/views/CommonViews/Transfer";
import ComModal from "./ComModal";
const { Option } = Select;

export type OpenType = "trade.modal.buy" | "trade.modal.sell" | "trade.two.way";
export type RateType = "1" | "3" | "5" | "10";
const selectAfter = (
  <Select defaultValue="USTD" className="select-after">
    <Option value="USTD">USTD</Option>
    <Option value="ETH">ETH</Option>
    <Option value="%">%</Option>
  </Select>
);

function Operation() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [openType, setOpenType] = useState<OpenType>("trade.modal.buy");
  const [rate, setRate] = useState<RateType>("10");
  return (
    <Row className="main-block operation-container">
      <Col flex="100%">
        <Row wrap={false} gutter={12}>
          <Col flex="230px">
            <Select
              defaultValue="market"
              size={"large"}
              style={{ width: "100%" }}
            >
              <Option value="market">
                <FormattedMessage id="trade.market" />
              </Option>
              <Option value="fixed1">
                <FormattedMessage id="trade.limit" />
              </Option>
            </Select>
          </Col>
          <Col flex="auto">
            <Select
              defaultValue={rate}
              size={"large"}
              style={{ width: "100%" }}
              onChange={val => setRate(val)}
            >
              <Option value="10">10x</Option>
              <Option value="5">5x</Option>
              <Option value="3">3x</Option>
              <Option value="2">2x</Option>
              <Option value="1">1x</Option>
            </Select>
          </Col>
        </Row>
      </Col>
      <Col flex="100%">
        <Row gutter={[0, 10]}>
          <Col flex="100%">
            <FormattedMessage id="trade.price" />
          </Col>
          <Col flex="100%">
            <Button
              disabled
              shape="round"
              style={{ width: "100%" }}
              size={"large"}
            >
              <FormattedMessage id="trade.market.price" />
            </Button>
          </Col>
        </Row>
      </Col>
      <Col flex="100%">
        <Row gutter={[0, 10]}>
          <Col flex="100%">
            <Row justify={"space-between"} align={"middle"}>
              <Col>
                <FormattedMessage id="trade.amount" />
              </Col>
              <Col>
                <Row gutter={2} align={"middle"}>
                  <Col>
                    <FormattedMessage id="trade.max" />
                    ：2.00000000 ETH
                  </Col>
                  <Col>
                    <Button type="link" onClick={() => setModalVisible(true)}>
                      <FormattedMessage id="trade.transfer" />
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col flex="100%" className="select-input">
            <Input size="large" addonAfter={selectAfter} defaultValue="0" />
          </Col>
        </Row>
      </Col>
      <Col flex="100%">
        <Slider defaultValue={30} />
      </Col>
      <Col flex="100%">
        <Button
          className="special-btn"
          shape="round"
          block
          size="large"
          onClick={() => {
            setIsModalVisible(true);
            setOpenType("trade.modal.buy");
          }}
        >
          <FormattedMessage id="trade.buy" />
        </Button>
      </Col>
      <Col flex="100%">
        <Button
          type="primary"
          danger
          shape="round"
          block
          size="large"
          onClick={() => {
            setIsModalVisible(true);
            setOpenType("trade.modal.sell");
          }}
        >
          <FormattedMessage id="trade.sell" />
        </Button>
      </Col>
      <Col flex="100%">
        <Button
          type="primary"
          shape="round"
          block
          size="large"
          onClick={() => {
            setIsModalVisible(true);
            setOpenType("trade.two.way");
          }}
        >
          <FormattedMessage id="trade.two.way" />
        </Button>
      </Col>
      <ComModal
        visible={isModalVisible}
        type={openType}
        rate={rate}
        closeModal={()=>{setIsModalVisible(false)}}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      />
      <Transfers visible={modalVisible}  onCancel={()=>setModalVisible(false)}/>
      
    </Row>
  );
}

export default Operation;
