import React from "react";
import {FormattedMessage, useIntl} from "react-intl";

import { Modal, Row, Col, Input, Radio } from "antd";
import { ModalProps } from "antd/es/modal";

interface CloseModalProps extends ModalProps {}

const plainOptions = ["25%", "50%", "75%", "100%"];
const CloseModal: React.FC<CloseModalProps> = props => {
  const {formatMessage} = useIntl()

  function intl(id:string) {
    return formatMessage({id})
  }

  const $t = intl

  return (
    <Modal
      {...props}
      title={<FormattedMessage id="Trade.MyPosition.ClosePositionPopup.Close" />}
      width={360}
      className="close-modal"
      getContainer={false}
      okText={$t("Trade.MyPosition.ClosePositionPopup.Confirm")}
      cancelText={$t("Trade.MyPosition.ClosePositionPopup.Cancel")}
    >
      <Row>
        <Col flex="100%">
          <Row justify="space-between">
            <Col>
              <FormattedMessage id="Trade.MyPosition.ClosePositionPopup.PositionHeld" />
            </Col>
            <Col>
              <span className="main-white">1.234567890</span> ETH
            </Col>
          </Row>
        </Col>
        <Col flex="100%">
          <Row justify="space-between">
            <Col>
              <FormattedMessage id="Trade.MyPosition.ClosePositionPopup.AveragePrice" />
            </Col>
            <Col>
              <span className="main-white">1.234567890</span> ETH
            </Col>
          </Row>
        </Col>
        <Col flex="100%">
          <Row justify="space-between">
            <Col>
              <FormattedMessage id="Trade.MyPosition.ClosePositionPopup.CurrentPrice" />
            </Col>
            <Col>
              <span className="main-green">2345.67</span> ETH
            </Col>
          </Row>
        </Col>
        <Col flex="100%" style={{ margin: "40px 0 18px" }}>
          {$t("Trade.MyPosition.ClosePositionPopup.Amount")}
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
