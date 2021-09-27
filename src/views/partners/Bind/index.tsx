import React, {useCallback, useState} from "react";
import {Row, Col, Button, Space, Input, Tabs, message, Spin} from "antd";
import {useDispatch, useSelector} from "react-redux";
import { bindPartners } from "@/store/modules/app/actions";
import PartnersList, { Partners } from "./PartnersList";
import { RouteProps } from "@/router/types";
import {useIntl} from "react-intl";
import {RootStore} from "@/store";
import {bindBroker, getBrokerByBrokerId} from "@/api/broker";
import {Dispatch} from "redux";

interface BindProps extends RouteProps {}
const { TabPane } = Tabs;

const Bind: React.FC<BindProps> = props => {
  const { history } = props;
  const walletInfo = useSelector((state:RootStore) => state.user);
  const dispatch = useDispatch();
  const [tabsIndex, setTabsIndex] = useState("1");
  const [partners, setPartners] = useState<Partial<Partners>>();
  const [brokerId, setBrokerId] = useState<Partial<string>>();
  const[loading, setLoading] = useState(false);

  const {formatMessage} = useIntl()

  function intl(id:string) {
    return formatMessage({id})
  }

  const doBindBroker = useCallback(async (brokerId) => {
    setLoading(true);
    if(!walletInfo.selectedAddress) {
      message.error('no login');
      setLoading(false);
      return false
    }

    if(!brokerId) {
      message.error(intl('Trade.BrokerBind.BrokerCodes.SelectOrInputBrokerId'));
      setLoading(false);
      return false
    }

    try{
      const brokerInfoRes =  await getBrokerByBrokerId(brokerId)
      if(brokerInfoRes == null || brokerInfoRes.broker == null){
        message.error(intl('Trade.BrokerBind.BrokerCodes.BrokerCodeNoExistError'));
        setLoading(false);
        return false
      }
    }catch (e){
      setLoading(false);
      console.error("getBrokerByBrokerId error: ", e);
    }


    const trader = walletInfo.selectedAddress;

    const data = await bindBroker({trader, brokerId});

    if(data.success) {
      history.push("/trade")
    }else{
      message.error(data.msg);
    }
    setLoading(false);
  },[walletInfo]);

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
      <Col className="title margin-b-l">{intl('Trade.BrokerBind.BrokerCodes.BindBrokerPrivilege')}</Col>
      <Col flex="100%" className="main-wrapper">
        <Tabs activeKey={tabsIndex} className="margin-b-l">
          <TabPane tab="" key="1">
            <Row align="middle">
              <Space size={24}>
                <Col className="main-white">{intl('Trade.BrokerBind.BrokerCodes.BrokerCode')}</Col>
                <Col>
                  <Input placeholder="" onChange={(e) => {
                    const {value} = e.target
                    setBrokerId(value)
                  }} size="large" />
                </Col>
              </Space>
            </Row>
          </TabPane>
          <TabPane tab="" key="2">
            <PartnersList onSelectBroker={(item) => {
              setBrokerId(item.id);
            }} />
          </TabPane>
        </Tabs>
        <Row>
          <Col flex="100%">
            <Row>
              <Space size={24}>
                <Col>
                  <Spin spinning={loading}>
                    <Button type="primary" onClick={() => doBindBroker(brokerId)}>
                      {intl("Trade.BrokerBind.BrokerCodes.Submit")}
                    </Button>
                  </Spin>
                </Col>
                <Col>
                  <Button type="link" onClick={tabsChange}>
                    {tabsIndex === "2" ? intl("Trade.BrokerBind.BrokerBind.HaveBrokerCode") : intl("Trade.BrokerBind.BrokerCodes.NoBrokerCode")}
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
