import React, { useState } from "react";
import { Row, Col, Button, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

import IconFont from "@/components/IconFont";
import Edit from "./Edit";
function Info() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <Row justify="space-between" align="middle" className="info-container">
      <Col>
        <Row gutter={20} align="middle">
          <Col>
            <Avatar size={64} icon={<UserOutlined />} />
          </Col>
          <Col>
            <div className="name-wrapper">Coinbaby's Playground</div>
            <div>0x8503ea9bB20b74a0c8287ed225cEe82d58648882</div>
            <div>@coinbaby</div>
          </Col>
        </Row>
      </Col>
      <Col>
        <Button
          type="primary"
          icon={<IconFont type="icon-bianji" />}
          onClick={() => setIsModalVisible(true)}
        >
          编辑
        </Button>
      </Col>
      <Edit visible={isModalVisible} onCancel={() => setIsModalVisible(false)} />
    </Row>
  );
}

export default Info;
