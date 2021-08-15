import React, { useState } from "react";
import { Modal, Row, Col, Select, Input } from "antd";
import { ModalProps } from "antd/es/modal";
import ErrorMessage from "@/components/ErrorMessage";
const { Option } = Select;

interface DepositProps extends ModalProps {}
const Deposit: React.FC<DepositProps> = props => {
  const [errorVis,setVis] = useState(true)
  return (
    <Modal {...props} title="燃烧" width={400}>
      <Row>
        <Col flex="100%" className="margin-b-s">
          <ErrorMessage msg={"错误提示"} visible={errorVis} onCancel={()=>{setVis(false)}} />
        </Col>

        <Col flex="100%" className="margin-b-s">
          <Row justify="space-between">
            <Col>当前余额</Col>
            <Col>1.234567890 eDRF</Col>
          </Row>
        </Col>
        <Col flex="100%" className="margin-b-max">
          <Row justify="space-between">
            <Col>单价</Col>
            <Col>600.00 eDRF</Col>
          </Row>
        </Col>
        <Col flex="100%" className="margin-b-l">
          <Select defaultValue="Derify" size="large" style={{ width: "100%" }}>
            <Option value="Derify">Derify 账户</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </Col>
        <Col flex="100%" className="margin-b-s">
          <Row justify="space-between">
            <Col>燃烧数量</Col>
            <Col>有效期 + 20 天</Col>
          </Row>
        </Col>
        <Col flex="100%">
          <Input size="large" addonAfter={"eDRF"} defaultValue="1200.00" />
        </Col>
      </Row>
    </Modal>
  );
};

export default Deposit;
