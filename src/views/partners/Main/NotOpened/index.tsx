import React, {useCallback, useEffect, useState} from "react";
import {Row, Col, Button, Modal, Select, Statistic, Space} from "antd";
import {useIntl} from "react-intl";
import {BondAccountType, fromContractUnit, toContractUnit} from "@/utils/contractUtil";
import {BrokerModel, RootStore} from "@/store";
import {ModalProps} from "antd/es/modal";
import {useDispatch, useSelector} from "react-redux";
import {fck} from "@/utils/utils";
import ErrorMessage from "@/components/ErrorMessage";
import ModalTips, {DerifyTradeModal} from "@/views/CommonViews/ModalTips";
import WalletConnectButtonWrapper from "@/views/CommonViews/ButtonWrapper";
import {Link} from "react-router-dom";

const { Option } = Select;
interface NotOpenedProps extends ModalProps {
  onOK:()=>void
}


const NotOpened:React.FC<NotOpenedProps> = (props)=>{
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();

  const {formatMessage} = useIntl();
  function intl<T>(id:string,values:T[] = []) {

    const intlValues:{[key:number]:T} = {}

    values.forEach((item, index) => {
      intlValues[index] = item
    })


    return formatMessage({id}, intlValues)
  }

  const $t = intl;
  const accountOptions = [
    {label:$t("Broker.Apply.eDRFAccount"), value: BondAccountType.DerifyAccount},
    {label:$t("Broker.Apply.MyWallet"), value: BondAccountType.WalletAccount},
  ];

  const applyBurnAmount = 60000;

  const [accountType, setAccountType] = useState<number>(accountOptions[1].value);
  const [showAddInfo, setShowAddInfo] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string|React.ReactNode>("");


  const {selectedAddress} = useSelector((state:RootStore) => state.user);
  const {broker,wallet} = useSelector((state:RootStore) => state.broker);

  const getMaxSize = useCallback((wallet, accountType) => {
    if(accountType === BondAccountType.DerifyAccount) {
      return fromContractUnit(wallet.derifyEdrfBalance)
    }else{
      return fromContractUnit(wallet.walletEdrfBalance)
    }
  },[]);

  const onSubmit = useCallback(() => {

    if(!selectedAddress){
      return;
    }

    if(applyBurnAmount > getMaxSize(wallet,accountType)){
      setErrorMsg($t('Broker.Apply.InsufficientAccountBalanceError'));
      return;
    }

    setErrorMsg("");
    setIsModalVisible(false);

    const applyBrokerAction = BrokerModel.actions.applyBroker({trader:selectedAddress,accountType:accountType, amount: toContractUnit(applyBurnAmount)});
    DerifyTradeModal.pendding();

    applyBrokerAction(dispatch).then(() => {
      DerifyTradeModal.success();
      setShowAddInfo(true);
      dispatch(BrokerModel.actions.getTraderBrokerInfo(selectedAddress));
    }).catch(e => {
      DerifyTradeModal.failed();
      console.error('applyBrokerAction,e',e)
    });

  },[selectedAddress,accountType,wallet])

  useEffect(() => {
    if(!selectedAddress || !isModalVisible){
      return;
    }

    dispatch(BrokerModel.actions.getBrokerBalance({trader: selectedAddress, accountType: accountType}));
  }, [isModalVisible,selectedAddress, accountType])

  return (
    <Row className="not-opened-container" justify="center">
      <Col className="margin-b-m">{$t("Broker.Apply.NotBrokerMessage")}</Col>
      <Col className="margin-b-m">{$t("Broker.Apply.GetBrokersPrivilege", [<span className="main-color">&nbsp;<Statistic style={{fontSize: "15px", "display": "inline-block"}} value={applyBurnAmount}/>&nbsp;</span>])}</Col>

      <Col>
        <WalletConnectButtonWrapper type="primary"
                                    size="large">
          <Space>
            <Row>
              <Col><Button
                type="primary"
                size="large"
                onClick={() => setIsModalVisible(true)}
              >
                {$t("Broker.Apply.ApplyBroker")}
              </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  type="ghost"
                  size="large"
                >
                  <a href="https://form.jotform.com/213133802570042" target={"_blank"}>{$t("Broker.Apply.GetTestEDRF")}</a>
                </Button>
              </Col>
            </Row>
          </Space>
        </WalletConnectButtonWrapper>
      </Col>
      <Modal
        title={<></>}
        width={300}
        getContainer={false}
        visible={isModalVisible}
        onOk={onSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        <ErrorMessage style={{margin: "10px 0"}} msg={errorMsg} visible={!!errorMsg} onCancel={() => setErrorMsg("")}/>
        <Row >
          <Col flex="100%" className="margin-b-m">
            <Row className="column-flex">
              <Col className="margin-b-s">{$t("Broker.Apply.GetBrokersPrivilege", [<span className="main-color"><Statistic style={{fontSize: "30px"}} value={applyBurnAmount}/></span>])}</Col>
            </Row>
          </Col>
          <Col flex="100%" className="margin-b-m">
            <Select defaultValue={accountType} size="large"
                    style={{ width: "100%" }}
                    options={accountOptions}
                    onChange={(val) => {
                      setAccountType(val);
                      setErrorMsg("");
                    }}
                    getPopupContainer={trigger => trigger.parentNode}>
              <Option value={BondAccountType.DerifyAccount}>{$t("Broker.Apply.eDRFAccount")}</Option>
              <Option value={BondAccountType.WalletAccount}>{$t("Broker.Apply.MyWallet")}</Option>
            </Select>
          </Col>
          <Col flex="100%" className="margin-b-m">
            <Row justify="space-between">
              <Col>{$t("Broker.Apply.AccountBalance")}：</Col>
              <Col>{fck(getMaxSize(wallet,accountType), 0,4)} eDRF</Col>
            </Row>
          </Col>
        </Row>
      </Modal>

      <ModalTips visible={showAddInfo} msg={$t("global.TradeSuccessMsg")} operaType={"success"} confirmable={false} okButton={
        <Button type="primary" onClick={() => props.onOK()}>{$t('Broker.Apply.AddInfo')}</Button>
      }>

      </ModalTips>
    </Row>
  );
}

export default NotOpened;
