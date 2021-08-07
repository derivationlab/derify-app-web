import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import IconFont from "@/components/IconFont";

import { Button, Modal, Form, Input, Row, Col } from "antd";
import { useCallback } from "react";

function Transfers() {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transferType, setTransferType] = useState("trade.withdraw");
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

  useEffect(() => {
    isModalVisible&&form.setFieldsValue({
      from: "Derify Account",
      to: "Metamask Wallet",
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Button type="link" onClick={() => setIsModalVisible(true)}>
        <FormattedMessage id="trade.transfer" />
      </Button>
      <Modal
        title={<FormattedMessage id="trade.transfers" />}
        footer={null}
        getContainer={false}
        focusTriggerAfterClose={false}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
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
    </>
  );
}

export default Transfers;
