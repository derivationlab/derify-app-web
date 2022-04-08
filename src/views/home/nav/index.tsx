import React from "react";
import { Row, Col } from "antd";
import Menu from "./menu";
import Tool from "./tool";
import Icon from "@/assets/images/logo.png";
import "./index.less";

const NavBar: React.FC<any> = () => {
  return (
    <Row align={"middle"} justify="space-between" className="nav">
      <Col>
        <Row>
          <a href="https://derify.finance/" target="_blank" className="logo">
            <img src={Icon} alt="logo" />
          </a>
        </Row>
      </Col>
      <Col className="menus">
        <Menu />
      </Col>
      <Col>
        <Tool />
      </Col>
    </Row>
  );
};

export default NavBar;
