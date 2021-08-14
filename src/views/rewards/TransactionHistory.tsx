import React from "react";
import { Modal, Row, Col } from "antd";
import { ModalProps } from "antd/es/Modal";
import { useIntl } from "react-intl";

import { RewardsType } from "./index";
interface TransactionHistoryProps extends ModalProps {
  type: RewardsType;
}

const listTitle = [
  "操作类型",
  "rewards.amount",
  "rewards.balance",
  "rewards.time",
];

const list = [
  {
    type: "提现",
    amount: "-1234.56",
    amountType: "USDT",
    balance: "7890.12",
    balanceType: "USDT",
    time: "2021-12-31 23:59:59",
  },
  {
    type: "提现",
    amount: "-1234.56",
    amountType: "USDT",
    balance: "7890.12",
    balanceType: "USDT",
    time: "2021-12-31 23:59:59",
  },
  {
    type: "提现",
    amount: "-1234.56",
    amountType: "USDT",
    balance: "7890.12",
    balanceType: "USDT",
    time: "2021-12-31 23:59:59",
  },
  {
    type: "提现",
    amount: "-1234.56",
    amountType: "USDT",
    balance: "7890.12",
    balanceType: "USDT",
    time: "2021-12-31 23:59:59",
  },
];
const TransactionHistory: React.FC<TransactionHistoryProps> = props => {
  const { formatMessage } = useIntl();
  return (
    <Modal
      {...props}
      title={
        (props.type === "USDT"
          ? formatMessage({ id: "rewards.position.mining" })
          : props.type) +
        " " +
        formatMessage({ id: "rewards.transaction.history" })
      }
      width={400}
    >
      <Row>
        <Col flex="100%">
          <Row justify="space-between" style={{ marginBottom: 24 }}>
            {listTitle.map(item => (
              <Col key={item} flex="25%">
                {formatMessage({ id: item })}
              </Col>
            ))}
          </Row>
        </Col>
        {list.map((item, i) => (
          <Col flex="100%">
            <Row justify="space-between" style={{ marginBottom: 10 }}>
              <Col flex="25%">{item.type}</Col>
              <Col flex="25%">
                <div>{item.amount}</div>
                <div>{item.amountType}</div>
              </Col>
              <Col flex="25%">
                <div>{item.balance}</div>
                <div>{item.balanceType}</div>
              </Col>
              <Col flex="25%">{item.time}</Col>
            </Row>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

export default TransactionHistory;
