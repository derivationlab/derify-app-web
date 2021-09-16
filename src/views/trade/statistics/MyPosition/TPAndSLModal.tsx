import React from "react";
import { Modal, Row, Col, Input } from "antd";
import { ModalProps } from "antd/es/modal";
import {useIntl} from "react-intl";
import {FormatXMLElementFn, PrimitiveType} from "intl-messageformat";

interface TPAndSLModalProps extends ModalProps {}

const TPAndSLModal: React.FC<TPAndSLModalProps> = props => {

  const {formatMessage} = useIntl()

  function intl<T = PrimitiveType | FormatXMLElementFn<string, string>>(id:string,values:T[] = []) {

    const intlValues:{[key:number]:T} = {}

    values.forEach((item, index) => {
      intlValues[index] = item
    })


    return formatMessage({id}, intlValues)
  }

  const $t = intl

  return (
    <Modal
      {...props}
      title={$t("Trade.MyPosition.SetStopPricePopup.SetTPSL")}
      width={360}
      className="close-modal"
      getContainer={false}
    >
      <Row>
        <Col flex="100%" className="margin-b-max">
          <Row justify="space-between">
            <Col>
              <div>{$t("Trade.MyPosition.SetStopPricePopup.AveragePrice")}</div>
              <div>{$t("Trade.MyPosition.SetStopPricePopup.CurrentPrice")}</div>
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
          <Row>{$t("Trade.MyPosition.SetStopPricePopup.TakeProfit")}</Row>
          <Row className="margin-b-m">
            <Input size="large" addonAfter="ETH" defaultValue="0.8" />
          </Row>
          <Row>
            {$t("Trade.MyPosition.SetStopPricePopup.StopPriceProfitNotice",[<span className="main-white">2345.67</span>,<span className="main-green">89.10</span>])}
          </Row>
        </Col>
        <Col flex="100%">
          <Row>{$t("Trade.MyPosition.SetStopPricePopup.StopLoss")}</Row>
          <Row className="margin-b-m">
            <Input size="large" addonAfter="ETH" defaultValue="0.8" />
          </Row>
          <Row>
            {$t("Trade.MyPosition.SetStopPricePopup.StopPriceLossNotice",[<span className="main-white">2345.67</span>,<span className="main-green">89.10</span>])}
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

export default TPAndSLModal;
