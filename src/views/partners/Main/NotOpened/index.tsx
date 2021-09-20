import React, {useCallback, useEffect, useState} from "react";
import {Row, Col, Button, Modal, Select, Statistic} from "antd";
import {useIntl} from "react-intl";
import {BondAccountType, fromContractUnit, toContractUnit} from "@/utils/contractUtil";
import {BrokerModel, RootStore} from "@/store";
import {ModalProps} from "antd/es/modal";
import {useDispatch, useSelector} from "react-redux";
import {fck} from "@/utils/utils";
import ErrorMessage from "@/components/ErrorMessage";
import {DerifyTradeModal} from "@/views/CommonViews/ModalTips";

const { Option } = Select;
interface NotOpenedProps extends ModalProps {
  onOK:()=>void
  onSumitSuccess?: () => void
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

  const applyBurnAmount = 60000;

  const [accountType, setAccountType] = useState<number>(BondAccountType.DerifyAccount);
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

    const applyBrokerAction = BrokerModel.actions.applyBroker({trader:selectedAddress,accountType:accountType, amount: toContractUnit(applyBurnAmount)});
    DerifyTradeModal.pendding();

    applyBrokerAction(dispatch).then(() => {
      DerifyTradeModal.success();
      dispatch(BrokerModel.actions.getTraderBrokerInfo(selectedAddress));
      setIsModalVisible(false);
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
      <Col>
        <Button
          type="primary"
          size="large"
          onClick={() => setIsModalVisible(true)}
        >
          {$t("Broker.Apply.ApplyBroker")}
        </Button>
      </Col>
      <Modal
        title={$t("Broker.Apply.ApplyBroker")}
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
              <Col className="margin-b-s">{$t("Broker.Apply.GetBrokersPrivilege", [<span className="main-color"><Statistic value={applyBurnAmount}/></span>])}</Col>
            </Row>
          </Col>
          <Col flex="100%" className="margin-b-m">
            <Select defaultValue={accountType} size="large"
                    style={{ width: "100%" }}
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
    </Row>
  );
}

export default NotOpened;
