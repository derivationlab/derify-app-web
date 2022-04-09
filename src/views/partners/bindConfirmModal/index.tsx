import * as React from "react";
import Modal from "@/components/modal";
import Broker from "@/components/broker";
import close from "@/assets/images/close.png";
import BorderButton from "@/components/buttons/borderButton";
import "./index.less";

export interface BindConfirmModalProps {}

export default function BindConfirmModal(props: BindConfirmModalProps) {
  const data = {};
  return (
    <Modal className="broker-confirm-modal">
      <div className="h1">
        <span>Confirm your broker</span>
        <img src={close} alt="" />
      </div>
      <Broker data={data} className="modal-broker" />

      <BorderButton
          text="submit"
          fill={true}
          className="broker-bottom"
          click={() => {}}
        />
    </Modal>
  );
}
