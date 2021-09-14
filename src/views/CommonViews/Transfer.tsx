import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import IconFont from "@/components/IconFont";
import { ModalProps } from "antd/es/modal";
import { Button, Modal, Form, Input, Row, Col } from "antd";
import { useCallback } from "react";

import "./Transfer.less";
import {TraderAccount} from "@/utils/types";

export enum OperateType{
  withdraw = "Trade.Account.Transfer.Withdraw",
  deposit = "Trade.Account.Transfer.Deposit"
}

interface TransferProps extends ModalProps {
  operateType?: OperateType
}

export type TransferData = {
  accountData: TraderAccount,
  balanceOfWallet: number,
  balanceOfDerify: number,
  maxAmount: number
}

const Transfer: React.FC<TransferProps> = props => {
  const { visible, operateType = "Trade.Account.Transfer.Withdraw" } = props;
  const [form] = Form.useForm();

  const [transferType, setTransferType] = useState(operateType);
  const [transferData, setTransferData]  = useState<TransferData>()

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

  const loadTransferData = useCallback(() => {

  }, [])

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
              <Input bordered={false} addonAfter="USDT" />
            </Form.Item>
            <Form.Item>
              <Row align="middle" justify="space-between">
                <Col>
                  <FormattedMessage id="Trade.Account.Transfer.Max" />
                  ：1234567.00000000 USDT
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
