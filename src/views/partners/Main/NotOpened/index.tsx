import React, { useState } from "react";
import { Row, Col, Button, Modal, Select } from "antd";

const { Option } = Select;
interface NotOpenedProps  {
  onOK:()=>void
}
const NotOpened:React.FC<NotOpenedProps> = ({onOK})=>{
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <Row className="not-opened-container" justify="center">
      <Col></Col>
      <Col className="margin-b-m">您尚未开通经纪商身份</Col>
      <Col>
        <Button
          type="primary"
          size="large"
          onClick={() => setIsModalVisible(true)}
        >
          申请成为经纪商
        </Button>
      </Col>
      <Modal
        title="开通经纪商"
        width={300}
        getContainer={false}
        visible={isModalVisible}
        onOk={() =>{
          setIsModalVisible(false);
          onOK()
        }}
        onCancel={() => setIsModalVisible(false)}
      >
        <Row >
          <Col flex="100%" className="margin-b-m">
            <Row className="column-flex">
              <Col className="margin-b-s">您需要燃烧</Col>
              <Col className="margin-b-s">
                <span className="main-color">60,000</span>
                <span>eDRF</span>
              </Col >
              <Col className="margin-b-s">以成为经纪商</Col>
            </Row>
          </Col>
          <Col flex="100%" className="margin-b-m">
            <Select
              defaultValue="Derify"
              size="large"
              style={{ width: "100%" }}
            >
              <Option value="Derify">Derify 账户</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </Col>
          <Col flex="100%" className="margin-b-m">
            <Row justify="space-between">
              <Col>可用余额：</Col>
              <Col>1234567.00000000 eDRF</Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    </Row>
  );
}

export default NotOpened;
