import React, { useState } from "react";
import { Row, Col, Button, Space, Input, Tabs, message } from "antd";
import { useDispatch } from "react-redux";
import { bindPartners } from "@/store/modules/app/actions";
import PartnersList, { Partners } from "./PartnersList";
import { RouteProps } from "@/router/types";

interface BindProps extends RouteProps {}
const { TabPane } = Tabs;

const Bind: React.FC<BindProps> = props => {
  const { history } = props;
  const dispatch = useDispatch();
  const [tabsIndex, setTabsIndex] = useState("1");
  const [partners, setPartners] = useState<Partial<Partners>>();
  const submit = () => {
    if (!partners) {
      message.error("绑定失败");
      return false
    }
    dispatch(bindPartners(true))
    history.push("home/partners/main");
  };
  const tabsChange = () => {
    setTabsIndex(val => {
      return val === "1" ? "2" : "1";
    });
  };
  const setPartnersCb = (val: Partners) => {
    setPartners(val);
  };
  return (
    <Row className="bind-partners-container main-block">
      <Col className="title margin-b-l">新增经纪商</Col>
      <Col flex="100%" className="main-wrapper">
        <Tabs activeKey={tabsIndex} className="margin-b-l">
          <TabPane tab="" key="1">
            <Row align="middle">
              <Space size={24}>
                <Col className="main-white">邀请码</Col>
                <Col>
                  <Input placeholder="请输入邀请码" size="large" />
                </Col>
              </Space>
            </Row>
          </TabPane>
          <TabPane tab="" key="2">
            <PartnersList selectParners={setPartnersCb} />
          </TabPane>
        </Tabs>
        <Row>
          <Col flex="100%">
            <Row>
              <Space size={24}>
                <Col>
                  <Button type="primary" onClick={submit}>
                    提交
                  </Button>
                </Col>
                <Col>
                  <Button type="link" onClick={tabsChange}>
                    {tabsIndex === "2" ? "我有邀请码..." : "还没有邀请码..."}
                  </Button>
                </Col>
              </Space>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col flex="100%"></Col>
    </Row>
  );
};

export default Bind;
