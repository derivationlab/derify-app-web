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
import {RootStore} from "@/store";
import ErrorMessage from "@/components/ErrorMessage";
import contractModel from "@/store/modules/contract"
import {showTransfer} from "@/store/modules/app/actions";
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
  const { visible, operateType = TransferOperateType.withdraw } = props;
  const [form] = Form.useForm();

  const {formatMessage} = useIntl()

  const [transferType, setTransferType] = useState(operateType);
  const [transferData, setTransferData]  = useState<TransferData>(new TransferData())
  const [amount, setAmount]  = useState<Partial<string>>("")
  const [errorMsg, setErrorMsg] = useState("");

  const walletInfo = useSelector((state:RootStore) => state.user);
  const dispatch = useDispatch();
  function intl(id:string) {
    return formatMessage({id})
  }

  const $t = intl

  const getMaxAmount = (transferData:TransferData, operateType:TransferOperateType) => {
    if(operateType === TransferOperateType.deposit) {
      return transferData.balanceOfWallet
    }else{
      return transferData.balanceOfDerify
    }
  }

  const loadTransferData = useCallback(async () => {

    if(!walletInfo.isLogin){
      return
    }

    const trader = walletInfo?.selectedAddress
    const contract = web3Utils.contract(trader)

    const accountData = await contract.getTraderAccount(trader)

    transferData.accountData = accountData
    transferData.balanceOfWallet = await contract.balanceOf(trader, Token.DUSD)
    transferData.balanceOfDerify = accountData.balance
    transferData.operateType = transferType

    setTransferData(transferData)

  }, [walletInfo, transferType])

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

  const ChangeType = useCallback(() => {
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

    setTransferType(val => {
      return val === TransferOperateType.deposit ? TransferOperateType.deposit : TransferOperateType.withdraw;
    });

    loadTransferData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadTransferData,checkAmount,transferType]);

  useEffect(()=>{
    if(visible){
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
  },[operateType,visible,checkAmount])

  useEffect(() => {
    loadTransferData()
  },[loadTransferData, walletInfo])

  const onchange = useCallback((e) => {

    let {value} = e.target
    checkAmount(value, transferData,transferType);
    setTransferData(transferData)

    // return value
  }, [transferData,transferType]);

  const onTransferAll = useCallback((maxAmount) => {
    setAmount(maxAmount);
  }, []);

  const doTransfer = useCallback(() => {
    if(!walletInfo.selectedAddress){
      return
    }

    if(!checkAmount(amount,transferData,transferType)) {
      return
    }

    const trader = walletInfo.selectedAddress;
    if(transferData.operateType == TransferOperateType.withdraw) {
      DerifyTradeModal.pendding();
      props.closeModal();
      const action = contractModel.actions.withdrawAccount(trader, toContractUnit(amount));
      action(dispatch).then((data) => {
        DerifyTradeModal.success();
        dispatch(showTransfer(false,operateType))
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
          <div className="transfers-wrapper" onClick={ChangeType}>
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
                  ：{fck(getMaxAmount(transferData,transferType), -8, 4)} USDT
                </Col>
                <Col>
                  <Button
                    size="large"
                    shape="round"
                    block
                    type="link"
                    onClick={() => onTransferAll(fck(getMaxAmount(transferData,transferType), -8, 4))}
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
