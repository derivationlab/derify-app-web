import React from 'react';
import { Row, Col } from 'antd';
import Menu from './menu';
import Tool from './tool';
import './index.less'
import Icon from '@/assets/images/logo.png';

const NavBar: React.FC<any> = props => {
  return (
    <Row align={'middle'} justify="space-between" className="nav">
      <Col>
        <Row>
          <a href="https://derify.finance/" target="_blank"><img height={48}  className="logo" src={Icon} alt="" /></a>
          <Menu />
        </Row>
      </Col>
      <Col >
        <Tool />
      </Col>
    </Row>

  )
}


export default NavBar
