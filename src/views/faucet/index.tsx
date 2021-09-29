import React, {useCallback, useEffect, useState} from "react";
import {Row, Col, Button, Space, Input, Tabs, message, Spin, Statistic} from "antd";
import {useDispatch, useSelector} from "react-redux";
import { RouteProps } from "@/router/types";
import {useIntl} from "react-intl";
import {RootStore} from "@/store";
import {Dispatch} from "redux";
import Link from "antd/lib/typography/Link";
import {sendUSDT} from "@/api/trade";
import {DerifyTradeModal} from "@/views/CommonViews/ModalTips";
import ErrorMessage, {DerifyErrorNotice} from "@/components/ErrorMessage";
import "./index.less"

interface FaucetProps extends RouteProps {}

const Faucet: React.FC<FaucetProps> = props => {
  const { history } = props;
  const {trader} = useSelector((state:RootStore) => state.user);
  const [traderInputVal,setTraderInputValue] = useState("");
  const [loading,setLoading] = useState(false);
  const defaultUSDTAmount = 100000;

  const dispatch = useDispatch();

  const {formatMessage} = useIntl();

  function intl<T>(id:string,values:T[] = []) {

    const intlValues:{[key:number]:T} = {}

    values.forEach((item, index) => {
      intlValues[index] = item
    })


    return formatMessage({id}, intlValues)
  }

  useEffect(() => {
    if(trader){
      setTraderInputValue(trader);
    }
  }, [trader])

  const $t = intl;

  const onSendUSDT = useCallback(() => {
    setLoading(true);
    if(!traderInputVal){
      setLoading(false);
      DerifyTradeModal.failed({msg: "error input!"});
      return;
    }

    sendUSDT(traderInputVal, defaultUSDTAmount).then((data) => {

      if(data.code === 0){
        DerifyTradeModal.success();
      }else{
        DerifyTradeModal.failed({msg: data.msg});
      }

    }).catch(e => {
      DerifyTradeModal.failed({msg: e});
    }).finally(() => {
      setLoading(false);
    })
  },[traderInputVal]);


  return (
    <Row className="faucet-container main-block" gutter={[20,20]} justify={"center"}>
      <Col flex="100%" className="main-wrapper">
        <Row gutter={[20,20]} align={"middle"}  justify={"center"}>
          <Col >
            {$t("Faucet.Address")}
          </Col>
          <Col>
            <Input  size="large" style={{width: "400px"}} value={trader} onChange={({target:{value}}) => setTraderInputValue(value)}/>
          </Col>
        </Row>
      </Col>
      <Col flex="100%">
        <Row justify={"center"}>
          <Col>
            <Spin spinning={loading}>
              <Button type="primary" onClick={onSendUSDT}>
                {$t("Faucet.GetUSDT", [<Statistic prefix={" "} suffix={" "} style={{display: "inline-block"}} valueStyle={{color:"none"}} value={defaultUSDTAmount}/>])}
              </Button>
            </Spin>
          </Col>
        </Row>
      </Col>
      <Col flex="100%">
        <Row justify={"center"}>
          <Col>
            <Link target="_blank" href="https://www.rinkeby.io/#faucet">
              <Button type="link">
                {$t("Faucet.GetETH")}
              </Button>
            </Link>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Faucet;
