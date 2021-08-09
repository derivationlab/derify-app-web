import React,{useEffect} from "react";
import { Row, Col, Modal } from "antd";
import { ModalProps } from "antd/es/modal";
import { FormattedMessage } from "react-intl";
import { useToggle } from "react-use";
import { OpenType, RateType } from "./index";
import classNames from "classnames";
enum typeColor {
  "trade.modal.buy" = "main-green",
  "trade.modal.sell" = "main-red",
  "trade.two.way" = "main-color",
}
interface ComModalProps extends ModalProps {
  type: OpenType;
  rate: RateType;
}

const ComModal: React.FC<ComModalProps> = props => {
  const { type, rate, ...others } = props;
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
    props.visible&&toggle(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible]);

  return (
    <Modal
      width={320}
      title={"开仓确认"}
      getContainer={false}
      focusTriggerAfterClose={false}
      {...others}
      onOk={toggle}
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
  );
};

export default ComModal;
