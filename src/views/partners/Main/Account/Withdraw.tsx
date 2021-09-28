import React, {useCallback, useState} from "react";
import { Modal, Row, Col, Input, Button, Select } from "antd";
import { useIntl, FormattedMessage } from "react-intl";
import { ModalProps } from "antd/es/modal";
import {useDispatch, useSelector} from "react-redux";
import {BrokerModel, RootStore} from "@/store";
import {checkNumber, fck} from "@/utils/utils";
import ErrorMessage from "@/components/ErrorMessage";
import {BrokerAccountInfo} from "@/store/modules/broker";
import {fromContractUnit, toContractUnit} from "@/utils/contractUtil";
import {DerifyTradeModal} from "@/views/CommonViews/ModalTips";

const { Option } = Select;

interface WithdrawProps extends ModalProps {
  onSumitSuccess?: () => void
  closeModal?: () => void
}


const Withdraw: React.FC<WithdrawProps> = props => {
  const dispatch = useDispatch();
  const {...modalProps } = props;
  const {broker,wallet} = useSelector((state:RootStore) => state.broker);
  const {selectedAddress} = useSelector((state:RootStore) => state.user);
  const [errorMsg, setErrorMsg] = useState<string>("")
  const [amout, setAmount] = useState<string>("")
  const { formatMessage } = useIntl();

  function intl(id:string) {
    return formatMessage({id})
  }

  const $t = intl;

  const getMaxSize = useCallback((broker) => {
    return broker.rewardBalance;
  },[]);

  const checkAmount = (amount:string, broker:BrokerAccountInfo) => {

    const chekRet = checkNumber(amount, fromContractUnit(getMaxSize(broker)), 0, false);

    if(chekRet.value != null) {
      setAmount(chekRet.value)
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

    if(!amout){
      setErrorMsg($t("global.NumberError"));
      return;
    }

    if(!checkAmount(amout, broker)){
      return
    }

    const brokerWithdrawAction = BrokerModel.actions.withdrawBrokerReward({trader:selectedAddress, amount: toContractUnit(amout)});
    DerifyTradeModal.pendding();

    if(props.closeModal){
      props.closeModal();
    }

    brokerWithdrawAction(dispatch).then(() => {
      dispatch(BrokerModel.actions.updateBrokerAccountInfo(selectedAddress));
      DerifyTradeModal.success();
    }).catch(e => {
      DerifyTradeModal.failed();
    });

  },[])

  return (
    <Modal
      {...modalProps}
      title={$t("Broker.Broker.WithdrawPopup.Title")}
      okText={$t("Broker.Broker.WithdrawPopup.Withdraw")}
      onOk={onSubmit}
      cancelText={$t("Broker.Broker.WithdrawPopup.Cancel")}
    >
      <ErrorMessage style={{margin: "10px 0"}} msg={errorMsg} visible={!!errorMsg} onCancel={() => setErrorMsg("")}/>
      <Row>
        <Col flex="100%" className="margin-b-m">
          <Row>{$t("Broker.Broker.WithdrawPopup.Amount")}</Row>
        </Col>
        <Col flex="100%" className="margin-b-m">
          <Input size="large" addonAfter="USDT" value={amout} onChange={({target:{value}}) => checkAmount(value, broker)} />
        </Col>
        <Col flex="100%">
          <Row justify="space-between" align="middle">
            <Col>{$t("Broker.Broker.WithdrawPopup.Max")}：{fck(getMaxSize(broker),-8,4)} USDT</Col>
            <Col>
              <Button type="link" onClick={() => {
                setAmount(fck(getMaxSize(broker),-8,4))
              }}>{$t("Broker.Broker.WithdrawPopup.All")}</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

export default Withdraw;
