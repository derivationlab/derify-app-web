import React, { useState, useEffect } from "react";
import {FormattedMessage, useIntl} from "react-intl";
import IconFont from "@/components/IconFont";
import { ModalProps } from "antd/es/modal";
import { Button, Modal, Form, Input, Row, Col } from "antd";
import { useCallback } from "react";
import * as web3Utils from "@/utils/web3Utils"

import "./Transfer.less";
import {TraderAccount, TransferOperateType} from "@/utils/types";
import {checkNumber, fck} from "@/utils/utils";
import userModel,{UserState} from "@/store/modules/user";
import {fromContractUnit, toContractUnit, Token} from "@/utils/contractUtil";
import {useDispatch, useSelector} from "react-redux";
import {useDispatchAction} from "@/hooks/useDispatchAction"
import {AppModel, RootStore} from "@/store";
import ErrorMessage from "@/components/ErrorMessage";
import contractModel from "@/store/modules/contract"
import {showTransfer} from "@/store/modules/app";
import {DerifyTradeModal} from "@/views/CommonViews/ModalTips";



interface TransferProps extends ModalProps {
  operateType?: TransferOperateType;
  closeModal: () => void;
}

export class TransferData {
  accountData: TraderAccount;
  balanceOfWallet: number;
  balanceOfDerify: number;
  operateType: TransferOperateType;
  amount: string | null;

  constructor() {
    this.accountData = new TraderAccount()
    this.balanceOfWallet = 0
    this.balanceOfDerify = 0
    this.operateType = TransferOperateType.withdraw
    this.amount = ""
  }
}

const Transfer: React.FC<TransferProps> = props => {
  const loadAccountStatus = useSelector((state:RootStore) => state.app.reloadDataStatus.account);

  const { visible, operateType = TransferOperateType.withdraw } = props;
  const [form] = Form.useForm();

  const {formatMessage} = useIntl()

  const [transferType, setTransferType] = useState(operateType);
  const [transferData, setTransferData]  = useState<TransferData>(new TransferData())
  const [amount, setAmount]  = useState<Partial<string>>("")
  const [maxAmount, setMaxAmount]  = useState<number>(0)
  const [errorMsg, setErrorMsg] = useState("");

  const walletInfo = useSelector((state:RootStore) => state.user);

  const dispatch = useDispatch();
  function intl(id:string) {
    return formatMessage({id})
  }

  const $t = intl

  const getMaxAmount = useCallback((transferData:TransferData, operateType:TransferOperateType) => {
    if(operateType === TransferOperateType.deposit) {
      return transferData.balanceOfWallet
    }else{
      return transferData.balanceOfDerify
    }
  }, [operateType, transferData.balanceOfDerify, transferData.balanceOfWallet]);

  const loadTransferData = useCallback(async (transferType) => {

    if(!walletInfo.isLogin || !walletInfo.selectedAddress){
      return
    }

    const trader = walletInfo?.selectedAddress
    const contract = web3Utils.contract(trader)

    const accountData = new TraderAccount();
    transferData.operateType = transferType

    try{
      Object.assign(accountData, await contract.getTraderAccount(trader));
      transferData.accountData = accountData
      transferData.balanceOfDerify = accountData.availableMargin
    }catch (e){
      console.log('getTraderAccount error:', e)
    }

    try{
      transferData.balanceOfWallet = await contract.balanceOf(trader, Token.DUSD)
    }catch (e) {
      console.log('balanceOf error:', e)
    }


    setTransferData(transferData)
    setMaxAmount(fck(getMaxAmount(transferData, transferType), -8, 4))

  }, [walletInfo, transferType, visible, loadAccountStatus])

  const checkAmount = useCallback((amount,transferData,transferType)=>{

    const checkRet = checkNumber(amount, fromContractUnit(getMaxAmount(transferData,transferType)));
    if(checkRet.value !== null) {
      setAmount(checkRet.value)
    }

    if(!checkRet.success) {
      setErrorMsg($t("global.NumberError"))
      return false
    }

    return true
  }, [transferData, amount]);

  const changeTransferType = useCallback(() => {
    form.setFieldsValue({
      from: form.getFieldValue("to"),
      to: form.getFieldValue("from"),
    });

    let newTransferType: TransferOperateType.withdraw | TransferOperateType.deposit;

    if(transferType === TransferOperateType.deposit) {
      newTransferType = TransferOperateType.withdraw;
    }else{
      newTransferType = TransferOperateType.deposit;
    }
    setTransferType(newTransferType)

    transferData.operateType = newTransferType
    setTransferData(transferData);

    checkAmount(amount, transferData,newTransferType);
     loadTransferData(newTransferType)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadTransferData,checkAmount,transferType]);

  useEffect(()=>{
    if(visible){
      setTransferType(operateType);
      checkAmount(amount,transferData,transferType);

      operateType===TransferOperateType.deposit ? form.setFieldsValue({
        from: formatMessage({id: "Trade.Account.Transfer.MyWallet"}),
        to: formatMessage({id: "Trade.Account.Transfer.MarginAccount"}),
      }):form.setFieldsValue({
        from: formatMessage({id: "Trade.Account.Transfer.MarginAccount"}),
        to: formatMessage({id: "Trade.Account.Transfer.MyWallet"}),
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[operateType,visible])

  useEffect(() => {
    if(visible){
      console.log(`loadTransferData ${transferType}, ${visible}`);
      loadTransferData(transferType)
    }
  },[transferType, visible, walletInfo])

  const onchange = useCallback((e) => {

    let {value} = e.target
    checkAmount(value, transferData,transferType);
    setTransferData(transferData)

    // return value
  }, [transferData,transferType]);

  const onTransferAll = useCallback(() => {
    setAmount(fck(getMaxAmount(transferData,transferType), -8, 4));
  }, [transferData,transferType]);

  const doTransfer = useCallback(() => {
    if(!walletInfo.selectedAddress){
      return
    }

    if(!checkAmount(amount,transferData,transferType)) {
      return
    }

    const trader = walletInfo.selectedAddress;
    if(transferType == TransferOperateType.withdraw) {
      DerifyTradeModal.pendding();
      props.closeModal();
      const action = contractModel.actions.withdrawAccount(trader, toContractUnit(amount));
      action(dispatch).then((data) => {
        DerifyTradeModal.success();
        dispatch(showTransfer(false,operateType));
        dispatch(AppModel.actions.updateLoadStatus("account"))
      }).catch((e) => {
        DerifyTradeModal.failed();
        console.error(`${transferData.operateType} failed, ${e}`)
      })
    }else{
      props.closeModal();
      DerifyTradeModal.pendding();
      const action = contractModel.actions.depositAccount(trader, toContractUnit(amount));
      action(dispatch).then((data) => {
        dispatch(showTransfer(false,operateType));
        DerifyTradeModal.success();
        dispatch(AppModel.actions.updateLoadStatus("account"))
      }).catch((e) => {
        console.error(`${transferData.operateType} success, ${e}`);
        DerifyTradeModal.failed();
      })
    }

  }, [walletInfo,amount,transferData])

  return (
    <Modal
      title={<FormattedMessage id="Trade.Account.Transfer.Transfers" />}
      footer={null}
      width={400}
      getContainer={false}
      focusTriggerAfterClose={false}
      {...props}
    >
      <Row>
        <Col flex="100%">
          <ErrorMessage msg={errorMsg} visible={!!errorMsg} onCancel={() => setErrorMsg("")}/>
          <div className="transfers-wrapper" onClick={changeTransferType}>
            <IconFont size={16} type="icon-transfers" />
          </div>
          <Form layout={"vertical"} form={form}>
            <Form.Item label={<FormattedMessage id="Trade.Account.Transfer.From"/>} name="from">
              <Input readOnly={true} />
            </Form.Item>
            <Form.Item label={<FormattedMessage id="Trade.Account.Transfer.To"/>} name="to">
              <Input  readOnly={true}/>
            </Form.Item>
            <Form.Item label={<FormattedMessage id="Trade.Account.Transfer.Size"/>}>
              <Input bordered={false} addonAfter="USDT" value={amount} onChange={onchange}/>
            </Form.Item>
            <Form.Item>
              <Row align="middle" justify="space-between">
                <Col>
                  <FormattedMessage id="Trade.Account.Transfer.Max" />
                  ：{maxAmount} USDT
                </Col>
                <Col>
                  <Button
                    size="large"
                    shape="round"
                    block
                    type="link"
                    onClick={() => onTransferAll()}
                  >
                    <FormattedMessage id="Trade.Account.Transfer.All" />
                  </Button>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item>
              <Button
                size="large"
                shape="round"
                block
                type="primary"
                onClick={() => doTransfer()}
              >
                <FormattedMessage id={transferType} />
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default Transfer;
