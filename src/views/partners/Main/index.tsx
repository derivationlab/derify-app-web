import React, { useState } from "react";
import { Row, Col } from "antd";

import Info from './Info'
import Record from "./Record";
import Account from "./Account";
import NotOpened from "./NotOpened";
function Main() {
  const [opened, setOpened] = useState<Boolean>(false);
  const set = ()=>{
    setOpened(true)
  }
  return (
    <>
      {opened ? (
        <Row className="opended-container" gutter={[0, 20]}>
          <Col flex="100%">
            <Info />
          </Col>
          <Col flex="100%">
            <Account />
          </Col>
          <Col flex="100%">
            <Record />
          </Col>
        </Row>
      ) : (
        <NotOpened onOK={set}/>
      )}
    </>
  );
}

export default Main;
