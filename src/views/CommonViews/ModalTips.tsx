import React from "react";
import { ModalProps } from "antd/es/modal";
import { Row, Col, Button,Modal } from "antd";

import SuccessImg from "@/assets/images/success.png";
import PendingImg from "@/assets/images/pending.png";
import ErrorImg from "@/assets/images/error.png";
import './ModalTips.less';
import {useIntl} from "react-intl";

interface ModalTipsProps extends ModalProps {
  operaType: "success" | "error" | "pending";
  msg: String;
}

const ModalTips: React.FC<ModalTipsProps> = props => {
  const { formatMessage } = useIntl();

  function intl<T>(id:string,values:T[] = []) {

    const intlValues:{[key:number]:T} = {}

    values.forEach((item, index) => {
      intlValues[index] = item
    })


    return formatMessage({id}, intlValues)
  }

  const $t = intl;

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
          <Button type="ghost" onClick={onCancel}>{$t("global.Confirm")}</Button>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalTips;
