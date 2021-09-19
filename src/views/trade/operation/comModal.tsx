import React, { useEffect, useState } from "react";
import { Row, Col, Modal } from "antd";
import { ModalProps } from "antd/es/modal";
import {FormattedMessage, useIntl} from "react-intl";
import { useToggle } from "react-use";
import { OpenType, RateType } from "./index";
import classNames from "classnames";
import ModalTips from "@/views/CommonViews/ModalTips";
import {FormatXMLElementFn, PrimitiveType} from "intl-messageformat";

enum typeColor {
  "trade.modal.buy" = "main-green",
  "trade.modal.sell" = "main-red",
  "trade.two.way" = "main-color",
}
export interface ComModalProps extends ModalProps {
  type: OpenType;
  rate: RateType;
  closeModal:()=>void
}

const ComModal: React.FC<ComModalProps> = props => {
  const {formatMessage} = useIntl();

  function intl<T = PrimitiveType | FormatXMLElementFn<string, string>>(id:string,values:T[] = []) {

    const intlValues:{[key:number]:T} = {}

    values.forEach((item, index) => {
      intlValues[index] = item
    })


    return formatMessage({id}, intlValues)
  }

  const $t = intl;


  const [isModalShow, setModalShow] = useState(false);
  const { type, rate,closeModal, ...others } = props;
  const [error, toggle] = useToggle(false);
  const data = [
    {
      key: "trade.price",
      val: "2000.00",
      suffix: "USDT",
    },
    {
      key: "trade.type",
      val: props.type,
      rate: rate,
      suffix: "",
    },
    {
      key: "trade.amount",
      val: "1.23",
      suffix: "ETH",
    },
    {
      key: "trade.pcf",
      val: "0.00",
      suffix: "ETH",
    },
    {
      key: "trade.trad.fee",
      val: "2.34",
      suffix: "USDT",
    },
  ];

  useEffect(() => {
    props.visible && toggle(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible]);

  const checkInfo = () => {
    if (type === "trade.modal.buy") {
      setModalShow(true);
    } else {
      toggle();
    }
  };

  return (
    <>
      <Modal
        width={300}
        title={$t("Trade.OpenPosition.OpenPopup.OpenConfirm")}
        getContainer={false}
        focusTriggerAfterClose={false}
        {...others}
        onOk={checkInfo}
      >
        <Row>
          {error && (
            <Col className="error-wrapper">
              双向对冲仓位默认市价开仓，无需担心，您的开仓量不受价格波动的影响
            </Col>
          )}

          {data.map((item, i) => (
            <Col flex="100%" key={i} style={{ marginBottom: "12px" }}>
              <Row justify="space-between">
                <Col>
                  <FormattedMessage id={item.key} />
                </Col>
                <Col>
                  <span
                    className={classNames(
                      item.rate ? typeColor[type] : "main-white"
                    )}
                  >
                    {item.rate ? <FormattedMessage id={item.val} /> : item.val}
                  </span>
                  {item.rate && `${item.rate} x`}
                  {item.suffix}
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
      </Modal>
      <ModalTips
        visible={isModalShow}
        operaType="success"
        msg="您已成功开通经纪商身份"
        onCancel={() => {
          setModalShow(false);
          closeModal()
        }}
      />
    </>
  );
};

export default ComModal;
