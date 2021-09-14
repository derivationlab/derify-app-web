import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import IconFont from "@/components/IconFont";
import { ModalProps } from "antd/es/modal";
import { Button, Modal, Form, Input, Row, Col } from "antd";
import { useCallback } from "react";
import * as web3Utils from "@/utils/web3Utils"

import "./Transfer.less";
import {TraderAccount} from "@/utils/types";
import {fck} from "@/utils/utils";
import userModel,{UserState} from "@/store/modules/user";
import {Token} from "@/utils/contractUtil";
import {useDispatch} from "react-redux";

export enum OperateType{
  withdraw = "Trade.Account.Transfer.Withdraw",
  deposit = "Trade.Account.Transfer.Deposit"
}

interface TransferProps extends ModalProps {
  operateType?: OperateType
}

export class TransferData {
  accountData: TraderAccount;
  balanceOfWallet: number;
  balanceOfDerify: number;
  operateType: OperateType;
  amount: string | null;

  constructor() {
    this.accountData = new TraderAccount()
    this.balanceOfWallet = 0
    this.balanceOfDerify = 0
    this.operateType = OperateType.withdraw
    this.amount = ""
  }

  get maxAmount() : number {
    if(this.operateType === OperateType.withdraw) {
      return this.balanceOfDerify
    }else{
      return this.balanceOfWallet
    }
  }
}

const Transfer: React.FC<TransferProps> = props => {
  const { visible, operateType = OperateType.withdraw } = props;
  const [form] = Form.useForm();

  const [transferType, setTransferType] = useState(operateType);
  const [transferData, setTransferData]  = useState<Partial<TransferData>>(new TransferData())
  const [walletInfo, setWalletInfo] = useState<Partial<UserState>>();
  const dispatch = useDispatch()

  const ChangeType = useCallback(() => {
    form.setFieldsValue({
      from: form.getFieldValue("to"),
      to: form.getFieldValue("from"),
    });
    setTransferType(val => {
      return val === OperateType.deposit ? OperateType.deposit : OperateType.withdraw;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTransferData = useCallback(async () => {

    if(!walletInfo?.selectedAddress){
      return
    }

    const trader = walletInfo?.selectedAddress
    const contract = web3Utils.contract(trader)

    const accountData = await contract.getTraderAccount(trader)

    transferData.accountData = accountData
    transferData.balanceOfWallet = await contract.balanceOf(trader, Token.DUSD)
    transferData.balanceOfDerify = accountData.balance
    transferData.operateType = operateType

    setTransferData(transferData)

    dispatch(userModel.actions.getBalanceOfDUSD(trader, Token.DUSD))

  }, [])

  const numberFormat = (value:string) => {
    const reg = /^?\d*(\.\d*)?$/;
    return value.replace(reg, "")
  }

  const checkAmount = ()=>{

    return true
  }

  useEffect(()=>{
    setTransferType(operateType)
    if(visible){

      operateType===OperateType.deposit ? form.setFieldsValue({
        from: "Trade.Account.Transfer.MyWallet",
        to: "Trade.Account.Transfer.MarginAccount",
      }):form.setFieldsValue({
        from: "Trade.Account.Transfer.MyWallet",
        to: "Trade.Account.Transfer.MarginAccount",
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[operateType,visible])


  useEffect(() => {
    loadTransferData()
  }, [])

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
              <Input bordered={false} addonAfter="USDT" value={transferData.amount||""} onChange={e => {
                const {value} = e.target
                transferData.amount = value
              }}/>
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
                    onClick={() => {}}
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
                onClick={() => {}}
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
