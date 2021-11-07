import React, {useCallback, useEffect, useState} from "react";
import { Modal, Row, Col, Select, Input } from "antd";
import { ModalProps } from "antd/es/modal";
import ErrorMessage from "@/components/ErrorMessage";
import {useDispatch, useSelector} from "react-redux";
import {AppModel, BrokerModel, RootStore} from "@/store";
import {useIntl} from "react-intl";
import {BondAccountType, fromContractUnit, toContractUnit} from "@/utils/contractUtil";
import {BrokerAccountInfo} from "@/store/modules/broker";
import {checkNumber, fck} from "@/utils/utils";
import {DerifyTradeModal} from "@/views/CommonViews/ModalTips";
const { Option } = Select;

interface DepositProps extends ModalProps {
  onSumitSuccess?: () => void
  closeModal?: () => void
}
const Deposit: React.FC<DepositProps> = props => {
  const [errorVis,setVis] = useState(true)

  const dispatch = useDispatch();
  const {...modalProps } = props;
  const {broker,wallet} = useSelector((state:RootStore) => state.broker);
  const {selectedAddress} = useSelector((state:RootStore) => state.user);
  const [errorMsg, setErrorMsg] = useState<string|React.ReactNode>("");
  const [amount, setAmount] = useState<string>("");
  const [accountType, setAccountType] = useState<number>(BondAccountType.WalletAccount);

  const { formatMessage } = useIntl();
  const unitAmount = 600;

  function intl<T>(id:string,values:T[] = []) {

    const intlValues:{[key:number]:T} = {}

    values.forEach((item, index) => {
      intlValues[index] = item
    })


    return formatMessage({id}, intlValues)
  }

  const $t = intl;

  useEffect(() => {
    if(!selectedAddress || !props.visible){
      return;
    }

    dispatch(BrokerModel.actions.getBrokerBalance({trader: selectedAddress, accountType: accountType}));
  }, [props.visible,selectedAddress, accountType])

  const getMaxSize = useCallback((wallet, accountType) => {
    if(accountType === BondAccountType.DerifyAccount) {
      return fromContractUnit(wallet.derifyEdrfBalance)
    }else{
      return fromContractUnit(wallet.walletEdrfBalance)
    }
  },[]);

  const validatePeriod = (amount:string) => {

    if(!amount){
      return 0;
    }

    const amountNum = parseFloat(amount);
    if(amountNum < 1){
      return 0
    }

    return Math.floor(amountNum / unitAmount)
  }

  const checkAmount = (amount:string, wallet:{derifyEdrfBalance:number|string,walletEdrfBalance:number|string},accountType:number) => {

    const chekRet = checkNumber(amount, getMaxSize(wallet,accountType), unitAmount, true);

    if(chekRet.value != null) {
      setAmount(chekRet.value);

      const amountNum = parseFloat(chekRet.value);

      if(amountNum < unitAmount){
        setErrorMsg($t('Broker.Broker.DepositPopup.MinAmountError', [unitAmount]));
        return false;
      }
    }



    if(!chekRet.success){
      setErrorMsg($t("global.NumberError"))
      return false;
    }


    setErrorMsg("")
    return true
  }

  const onSubmit = useCallback(() => {

    if(!selectedAddress){
      return;
    }

    if(!amount){
      setErrorMsg($t("global.NumberError"));
      return;
    }

    if(!checkAmount(amount, wallet, accountType)){
      return
    }

    const burnEdrfExtendValidPeriodAction = BrokerModel.actions.burnEdrfExtendValidPeriod({trader:selectedAddress,accountType:accountType, amount: toContractUnit(amount)});
    DerifyTradeModal.pendding();

    if(props.closeModal){
      props.closeModal();
    }

    burnEdrfExtendValidPeriodAction(dispatch).then(() => {
      dispatch(BrokerModel.actions.updateBrokerAccountInfo(selectedAddress));
      DerifyTradeModal.success();
      dispatch(AppModel.actions.updateLoadStatus("broker"));
      if(props.onSumitSuccess){
        props.onSumitSuccess();
      }

    }).catch(e => {
      console.error('burnEdrfExtendValidPeriod,e',e);
      DerifyTradeModal.failed();
    });

  },[amount,selectedAddress,accountType,wallet])


  return (
    <Modal {...props} title={$t("Broker.Broker.DepositPopup.Burn")}
           width={400}
           onOk={onSubmit}
    >
      <ErrorMessage style={{margin: "10px 0"}} msg={errorMsg} visible={!!errorMsg} onCancel={() => setErrorMsg("")}/>

      <Row>
        <Col flex="100%" className="margin-b-s">
          <Row justify="space-between">
            <Col>{$t("Broker.Broker.DepositPopup.Balance")}</Col>
            <Col>{fck(getMaxSize(wallet,accountType),0,4)} eDRF</Col>
          </Row>
        </Col>
        <Col flex="100%" className="margin-b-max">
          <Row justify="space-between">
            <Col>{$t("Broker.Broker.DepositPopup.UnitPrice")}</Col>
            <Col>{fck(unitAmount,0,2)} eDRF</Col>
          </Row>
        </Col>
        <Col flex="100%" className="margin-b-l">
          <Select defaultValue={accountType} size="large"
                  style={{ width: "100%" }}
                  onChange={(val) => setAccountType(val)}
                  getPopupContainer={trigger => trigger.parentNode}>
            <Option value={BondAccountType.WalletAccount}>{$t("Broker.Broker.DepositPopup.MyWallet")}</Option>
            <Option value={BondAccountType.DerifyAccount}>{$t("Broker.Broker.DepositPopup.eDRFAccount")}</Option>
          </Select>
        </Col>
        <Col flex="100%" className="margin-b-s">
          <Row justify="space-between">
            <Col>{$t("Broker.Broker.DepositPopup.BurnAmount")}</Col>
            <Col>{$t("Broker.Broker.DepositPopup.ValidPeriod", [<span className="ant-statistic-content">{validatePeriod(amount)}</span>])}</Col>
          </Row>
        </Col>
        <Col flex="100%">
          <Input size="large" addonAfter={"eDRF"} value={amount} onChange={({target:{value}}) => checkAmount(value, wallet,accountType)}/>
        </Col>
      </Row>
    </Modal>
  );
};

export default Deposit;
