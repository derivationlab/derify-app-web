import * as React from "react";
import Modal from "@/components/modal";
import Broker from "@/components/broker";
import closeImg from "@/assets/images/close.png";
import BorderButton from "@/components/buttons/borderButton";
import "./index.less";

interface Iprops {
  close: () => void;
  ok: () => void;
  data: any;
}

export default function BindConfirmModal({ close, data, ok }: Iprops) {
  return (
    <Modal className="broker-confirm-modal">
      <div className="h1">
        <span>Confirm your broker</span>
        <img src={closeImg} alt="" onClick={close} />
      </div>
      <Broker data={data} className="modal-broker" />

      <BorderButton
        text="submit"
        fill={true}
        className="broker-bottom"
        click={ok}
      />
    </Modal>
  );
}
