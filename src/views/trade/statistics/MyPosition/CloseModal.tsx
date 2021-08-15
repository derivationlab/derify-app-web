import React from "react";
import { FormattedMessage } from "react-intl";

import { Modal, Row, Col, Input, Radio } from "antd";
import { ModalProps } from "antd/es/modal";

interface CloseModalProps extends ModalProps {}

const plainOptions = ["25%", "50%", "75%", "100%"];
const CloseModal: React.FC<CloseModalProps> = props => {
  return (
    <Modal
      {...props}
      title={<FormattedMessage id="trade.close" />}
      width={360}
      className="close-modal"
      getContainer={false}
    >
      <Row>
        <Col flex="100%">
          <Row justify="space-between">
            <Col>
              <FormattedMessage id="trade.amount" />
            </Col>
            <Col>
              <span className="main-white">1.234567890</span> ETH
            </Col>
          </Row>
        </Col>
        <Col flex="100%">
          <Row justify="space-between">
            <Col>
              <FormattedMessage id="trade.price" />
            </Col>
            <Col>
              <span className="main-white">1.234567890</span> ETH
            </Col>
          </Row>
        </Col>
        <Col flex="100%">
          <Row justify="space-between">
            <Col>
              <FormattedMessage id="trade.current.price" />
            </Col>
            <Col>
              <span className="main-green">2345.67</span> ETH
            </Col>
          </Row>
        </Col>
        <Col flex="100%" style={{ margin: "40px 0 18px" }}>
          平仓量
        </Col>
        <Col flex="100%" style={{ marginBottom: "12px" }}>
          <Input size="large" addonAfter="ETH" defaultValue="0.8" />
        </Col>
        <Col flex="100%">
          <Radio.Group options={plainOptions} optionType="button" />
        </Col>
      </Row>
    </Modal>
  );
};

export default CloseModal;
