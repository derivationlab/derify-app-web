import React, { useState, useEffect } from "react";
import {FormattedMessage, useIntl} from "react-intl";
import IconFont from "@/components/IconFont";
import { ModalProps } from "antd/es/modal";
import { Button, Modal, Form, Input, Row, Col } from "antd";
import { useCallback } from "react";
import * as web3Utils from "@/utils/web3Utils"

import "./Transfer.less";
import {TraderAccount, TransferOperateType} from "@/utils/types";
import {fck} from "@/utils/utils";
import userModel,{UserState} from "@/store/modules/user";
import {toContractUnit, Token} from "@/utils/contractUtil";
import {useDispatch, useSelector} from "react-redux";
import {useDispatchAction} from "@/hooks/useDispatchAction"
import {RootStore} from "@/store";
import ErrorMessage from "@/components/ErrorMessage";
import contractModel from "@/store/modules/contract"
import {showTransfer} from "@/store/modules/app/actions";



interface TransferProps extends ModalProps {
  operateType?: TransferOperateType
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

  get maxAmount() : number {
    if(this.operateType === TransferOperateType.deposit) {
      return this.balanceOfDerify
    }else{
      return this.balanceOfWallet
    }
  }
}

const Transfer: React.FC<TransferProps> = props => {
  const { visible, operateType = TransferOperateType.withdraw } = props;
  const [form] = Form.useForm();

  const {formatMessage} = useIntl()

  const [transferType, setTransferType] = useState(operateType);
  const [transferData, setTransferData]  = useState<Partial<TransferData>>(new TransferData())
  const [amount, setAmount]  = useState<Partial<string>>()
  const [errorMsg, setErrorMsg] = useState<Partial<{id:string,value?:string}|undefined>>();

  const walletInfo = useSelector((state:RootStore) => state.user);
  const dispatch = useDispatch()

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

  const ChangeType = useCallback(() => {
    form.setFieldsValue({
      from: form.getFieldValue("to"),
      to: form.getFieldValue("from"),
    });

    if(transferType === TransferOperateType.deposit) {
      setTransferType(TransferOperateType.withdraw)
    }else{
      setTransferType(TransferOperateType.deposit)
    }

    transferData.operateType = transferType
    setTransferData(transferData)

    setTransferType(val => {
      return val === TransferOperateType.deposit ? TransferOperateType.deposit : TransferOperateType.withdraw;
    });

    loadTransferData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadTransferData]);


  useEffect(()=>{
    setTransferType(operateType)
    if(visible){

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
    loadTransferData()
  },[loadTransferData, walletInfo])

  useEffect( () => {
    const res =  dispatch(userModel.actions.loadWallet())
  }, [])

  const checkAmount = useCallback(()=>{

    if(transferData.amount === null || transferData.amount === undefined){
      return false
    }

    if(transferData.maxAmount === undefined) {
      return false
    }

    const amount:string = transferData.amount

    if(parseInt(transferData.amount) <= 0) {
      setErrorMsg({id: "", value: ""})
      return false
    }

    if(parseInt(transferData.amount) > transferData.maxAmount) {
      setAmount(fck(transferData.maxAmount, -8,4))
      return false
    }

    return true
  }, [])

  const onchange = useCallback((e) => {

    let {value} = e.target
    value = value.replace(/-/g, '');

    let reg = /^\d+(.\d+)?$/
    if(!reg.test(value)){
      return
    }

    transferData.amount = value
    setAmount(value)

    checkAmount()

    setTransferData(transferData)

    // return value
  }, [])

  const doTransfer = useCallback(() => {
    if(!walletInfo.selectedAddress){
      return
    }

    if(!checkAmount()) {
      return
    }


    const trader = walletInfo.selectedAddress

    if(transferData.operateType == TransferOperateType.withdraw) {
      //TODO pending
      const action = contractModel.actions.withdrawAccount(trader, toContractUnit(amount));
      action(dispatch).then((data) => {
        dispatch(showTransfer(false,operateType))
      }).catch((e) => {
        console.error(`${transferData.operateType} failed, ${e}`)
      })
    }else{
      //TODO pending
      (contractModel.actions.depositAccount(trader, toContractUnit(amount)))(dispatch).then((data) => {
        dispatch(showTransfer(false,operateType))
      }).catch((e) => {
        console.error(`${transferData.operateType} success, ${e}`)
      })
    }

  }, [walletInfo])

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
          {errorMsg?.id ? <ErrorMessage msg={errorMsg} visible={!!errorMsg} onCancel={() => setErrorMsg(undefined)}/>:''}
          <div className="transfers-wrapper" onClick={ChangeType}>
            <IconFont size={16} type="icon-transfers" />
          </div>
          <Form layout={"vertical"} form={form}>
            <Form.Item label={<FormattedMessage id="Trade.Account.Transfer.From"/>} name="from">
              <Input />
            </Form.Item>
            <Form.Item label={<FormattedMessage id="Trade.Account.Transfer.To"/>} name="to">
              <Input />
            </Form.Item>
            <Form.Item label={<FormattedMessage id="Trade.Account.Transfer.Size"/>}>
              <Input bordered={false} addonAfter="USDT" value={amount} onChange={onchange}/>
            </Form.Item>
            <Form.Item>
              <Row align="middle" justify="space-between">
                <Col>
                  <FormattedMessage id="Trade.Account.Transfer.Max" />
                  ：{fck(transferData?.maxAmount, -8, 4)} USDT
                </Col>
                <Col>
                  <Button
                    size="large"
                    shape="round"
                    block
                    type="link"
                    onClick={() => {

                      if(transferData.maxAmount) {
                        transferData.amount = fck(transferData.maxAmount, -8, 4)
                      }

                      setTransferData(transferData)
                    }}
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
