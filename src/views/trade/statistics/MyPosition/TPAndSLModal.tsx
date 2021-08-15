import React from "react";
import { Modal, Row, Col, Input } from "antd";
import { ModalProps } from "antd/es/modal";

interface TPAndSLModalProps extends ModalProps {}

const TPAndSLModal: React.FC<TPAndSLModalProps> = props => {
  return (
    <Modal
      {...props}
      title={"设置止盈止损"}
      width={360}
      className="close-modal"
      getContainer={false}
    >
      <Row>
        <Col flex="100%" className="margin-b-max">
          <Row justify="space-between">
            <Col>
              <div>开仓价格</div>
              <div>当前价格</div>
            </Col>
            <Col>
              <div>
                <span className="main-white">2345.67</span>USDT
              </div>
              <div>
                <span className="main-green">2345.67</span>USDT
              </div>
            </Col>
          </Row>
        </Col>
        <Col flex="100%" className="margin-b-max">
          <Row>止盈设置</Row>
          <Row className="margin-b-m">
            <Input size="large" addonAfter="ETH" defaultValue="0.8" />
          </Row>
          <Row>
            当指数价格达到<span className="main-white">2345.67</span>
            USDT时，将会触发市价平仓当前仓位，预计盈利
            <span className="main-green">89.10</span> USDT
          </Row>
        </Col>
        <Col flex="100%">
          <Row>止损设置</Row>
          <Row className="margin-b-m">
            <Input size="large" addonAfter="ETH" defaultValue="0.8" />
          </Row>
          <Row>
            当指数价格达到 - USDT时，将会触发市价平仓当前仓位，预计亏损 - USDT
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

export default TPAndSLModal;
