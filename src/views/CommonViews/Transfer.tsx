import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import IconFont from "@/components/IconFont";
import { ModalProps } from "antd/es/Modal";
import { Button, Modal, Form, Input, Row, Col } from "antd";
import { useCallback } from "react";

import "./Transfer.less";

 export type OperateType = "trade.withdraw" | "trade.deposit";
interface TransferProps extends ModalProps {
  operateType?: OperateType
}
const Transfer: React.FC<TransferProps> = props => {
  const { visible, operateType = "trade.withdraw" } = props;
  const [form] = Form.useForm();

  const [transferType, setTransferType] = useState(operateType);
  const ChangeType = useCallback(() => {
    form.setFieldsValue({
      from: form.getFieldValue("to"),
      to: form.getFieldValue("from"),
    });
    setTransferType(val => {
      return val === "trade.withdraw" ? "trade.deposit" : "trade.withdraw";
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(()=>{
    setTransferType(operateType)
    if(visible){
      operateType==='trade.deposit'?form.setFieldsValue({
        from: "Derify Account",
        to: "Metamask Wallet",
      }):form.setFieldsValue({
        from: "Metamask Wallet",
        to: "Derify Account",
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[operateType,visible])
  
  return (
    <Modal
      title={<FormattedMessage id="trade.transfers" />}
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
            <Form.Item label="From" name="from">
              <Input />
            </Form.Item>
            <Form.Item label="To" name="to">
              <Input />
            </Form.Item>
            <Form.Item label={<FormattedMessage id="trade.volume" />}>
              <Input bordered={false} addonAfter="USDT" />
            </Form.Item>
            <Form.Item>
              <Row align="middle" justify="space-between">
                <Col>
                  <FormattedMessage id="trade.transfer.max" />
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
                    <FormattedMessage id="trade.all" />
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
