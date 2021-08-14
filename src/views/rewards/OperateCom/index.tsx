import React, { useCallback } from "react";
import { Modal, Row, Col, Input, Button, Select } from "antd";
import { useIntl, FormattedMessage } from "react-intl";
import { ModalProps } from "antd/es/Modal";

import { RewardsType } from "../index";
const { Option } = Select;

export type OperateType =
  | "rewards.withdraw"
  | "rewards.redeem.a"
  | "rewards.redeem"
  | "rewards.staking"
  | "rewards.deposit";

interface OperateComProps extends ModalProps {
  type: OperateType;
  rewardsType: RewardsType;
}

interface RenderModuleProps {
  type: OperateType;
  rewardsType: RewardsType;
}

const RenderModule: React.FC<RenderModuleProps> = ({ type, rewardsType }) => {
  switch (type) {
    case "rewards.withdraw":
      return (
        <Row>
          <Col flex="100%" className="margin-b-m">
            <Row>提现数量</Row>
          </Col>
          <Col flex="100%" className="margin-b-m">
            <Input size="large" addonAfter={rewardsType} defaultValue="0.8" />
          </Col>
          <Col flex="100%">
            <Row justify="space-between" align="middle">
              <Col>可提现：1234567.00000000 {rewardsType}</Col>
              <Col>
                <Button type="link">全部提现</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      );
    case "rewards.redeem.a":
    case "rewards.staking":
    case "rewards.redeem":
    case "rewards.deposit":
      return (
        <Row>
          <Col flex="100%" className="margin-b-m">
            <Select defaultValue="lucy" size="large" style={{ width: "100%" }}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </Col>
          <Col flex="100%" className="margin-b-m">
            <Row>
              <FormattedMessage id={type} /> 数量
            </Row>
          </Col>
          <Col flex="100%" className="margin-b-m">
            <Input size="large" addonAfter={rewardsType} defaultValue="0.8" />
          </Col>
          <Col flex="100%">
            <Row justify="space-between" align="middle">
              <Col>
                <FormattedMessage id={"rewards.max"} />
                <FormattedMessage id={type} />
                ：1234567.00000000 {rewardsType}
              </Col>
              <Col>
                <Button type="link">
                  全部
                  <FormattedMessage id={type} />
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      );
    default:
      return null;
  }
};

const OperateCom: React.FC<OperateComProps> = props => {
  const { formatMessage } = useIntl();
  const { type, rewardsType, ...modalProps } = props;

  const getTitleSuffix = useCallback(() => {
    if (
      rewardsType === "eDRF" &&
      (type === "rewards.staking" || type === "rewards.redeem")
    ) {
      return "DRF";
    }
    return rewardsType;
  }, [rewardsType, type]);
  return (
    <Modal
      {...modalProps}
      title={formatMessage({ id: type }) + " " + getTitleSuffix()}
    >
      <RenderModule rewardsType={rewardsType} type={type} />
    </Modal>
  );
};

export default OperateCom;
