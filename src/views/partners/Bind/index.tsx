import React, {useCallback, useState} from "react";
import {Row, Col, Button, Input, Tabs, Spin} from "antd";
import {useDispatch, useSelector} from "react-redux";
import { bindPartners } from "@/store/modules/app";
import PartnersList, { Partners } from "./PartnersList";
import { RouteProps } from "@/router/types";
import {useIntl} from "react-intl";
import {RootStore} from "@/store";
import {bindBroker, getBrokerByBrokerId} from "@/api/broker";
import {Dispatch} from "redux";
import {DerifyErrorNotice} from "@/components/ErrorMessage";
import WalletConnectButtonWrapper from "@/views/CommonViews/ButtonWrapper";
import BorderButton from "@/components/buttons/borderButton";
import BindConfirmModal from '../bindConfirmModal'
import "./index.less";

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
  const[showModal, setShowModal] = useState(false);

  const {formatMessage} = useIntl()

  function intl(id:string) {
    return formatMessage({id})
  }

  const doBindBroker = useCallback(async (brokerId) => {
    setLoading(true);
    if(!walletInfo.selectedAddress) {
      DerifyErrorNotice.error('no login');
      setLoading(false);
      return false
    }

    if(!brokerId) {
      DerifyErrorNotice.error(intl('Trade.BrokerBind.BrokerCodes.SelectOrInputBrokerId'));
      setLoading(false);
      return false
    }

    let brokerInfoRes;
    try{
      brokerInfoRes =  await getBrokerByBrokerId(brokerId)
      if(brokerInfoRes == null || brokerInfoRes.broker == null){
        DerifyErrorNotice.error(intl('Trade.BrokerBind.BrokerCodes.BrokerCodeNoExistError'));
        setLoading(false);
        return false
      }
    }catch (e){
      setLoading(false);
      console.error("getBrokerByBrokerId error: ", e);
      return false;
    }


    const trader = walletInfo.selectedAddress;

    try{
      const data = await bindBroker({trader, brokerId});

      if(data.success) {
      dispatch({type: "user/updateState", payload:{hasBroker: true,traderBroker: brokerInfoRes, brokerId: brokerInfoRes.broker}})
        history.push("/trade")
      }else{
        DerifyErrorNotice.error(data.msg);
      }
      setLoading(false);
    }catch (e){
      console.error("bindBroker error", e);
    }finally {
      setLoading(true);
    }

  },[walletInfo]);

  const tabsChange = () => {
    setTabsIndex(val => {
      return val === "1" ? "2" : "1";
    });
  };
  const setPartnersCb = (val: Partners) => {
    setPartners(val);
  };
  const {isLogin} = useSelector((state:RootStore) => state.user);
  return (
    <Row className="bind-partners-container main-block">
      <div className="h1">
        You need a broker first, Please input your broker code.
      </div>
      <div className="h3">
       You can get code from your broker.
      </div>
      <BindConfirmModal />
      <Col flex="100%" className="main-wrapper">
        {!isLogin ? <></> : <Tabs activeKey={tabsIndex} className="margin-b-l">
          <TabPane tab="" key="1">
            <Row align="middle">
               <Col>
                  <Input type='password' className="broker-input" onChange={(e) => {
                    const {value} = e.target
                    setBrokerId(value)
                  }}  />
                </Col>
            </Row>
          </TabPane>
          <TabPane tab="" key="2">
            <PartnersList onSelectBroker={(item) => {
              setBrokerId(item.id);
            }}/>
          </TabPane>
        </Tabs>
        }
        <Row className="broker-btns">
          <WalletConnectButtonWrapper type="primary">
              <Col>
                <Spin spinning={loading}>
                  <Button type="primary" className="broker-submit" onClick={() => doBindBroker(brokerId)}>
                    {intl("Trade.BrokerBind.BrokerCodes.Submit")}
                  </Button>
                </Spin>
              </Col>
              <Col>
                <BorderButton  
                  click={tabsChange} 
                  className="broker-toggle"
                  text=  {tabsIndex === "2" ? intl("Trade.BrokerBind.BrokerBind.HaveBrokerCode") : intl("Trade.BrokerBind.BrokerCodes.NoBrokerCode")}
                />
              </Col>
          </WalletConnectButtonWrapper>
        </Row>
      </Col>
    </Row>
  );
};

export default Bind;
