import React from "react";
import { ModalProps } from "antd/es/Modal";
import { Row, Col, Button,Modal } from "antd";

import SuccessImg from "@/assets/images/success.png";
import PendingImg from "@/assets/images/pending.png";
import ErrorImg from "@/assets/images/error.png";
import './ModalTips.less';
interface ModalTipsProps extends ModalProps {
  operaType: "success" | "error" | "pending";
  msg: String;
}
const ModalTips: React.FC<ModalTipsProps> = props => {
  const { msg = "success",onCancel, operaType, ...others } = props;
  return (
    <Modal {...others} width={300} footer={null} closable={false}>
      <Row justify="center" className="modal-tips">
        <Col className="margin-b-max">
          <img
            src={
              (operaType === "success" && SuccessImg) ||
              (operaType === "pending" && PendingImg) ||
              (operaType === "error" && ErrorImg)||''
            }
            alt=""
          />
        </Col>
        <Col className="margin-b-max">{msg}</Col>
        <Col>
          <Button type="ghost" onClick={onCancel}>关闭</Button>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalTips;
