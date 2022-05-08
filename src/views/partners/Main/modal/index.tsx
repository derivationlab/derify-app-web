import React, { useState } from "react";
import Button from "@/components/buttons/borderButton";
import Modal, { ModalWithTitle } from "@/components/modal";
import Input from "@/components/input";
import "./index.less";

interface IEarnModalProps {
  close: () => void;
  confirm: () => void;
  address?: string;
}

export default function EarnModal({
  close,
  confirm,
  address,
}: IEarnModalProps) {
  const [value, setValue] = useState("");
  return (
    <ModalWithTitle
      className="broker-take-modal"
      close={close}
      title={"Extend Broker Privilege"}
    >
      <div className="list">
        <div className="card1">
          <div className="t">
            <span className="t1">Wallet Balance</span>
          </div>
          <div className="num">
            <span className="big-num">22222</span>
            <span className="small-num">.23</span>
            <span className="per">eDRF</span>
          </div>
          <div className="hline1"></div>
          <div className="t">
            <span className="t1"> Broker privilege price per day</span>
          </div>
          <div className="num">
            <span className="big-num">500</span>
            <span className="small-num">.23</span>
            <span className="per">eDRF</span>
          </div>
          <div className="day">
            <span>+20</span> days
          </div>
        </div>
        <Input
          className="trade-wallet-input"
          value={value}
          onChange={(e: any) => setValue(e.target.value)}
          label={"Amount  to burn"}
          unit={"eDRF"}
          btnName="Max"
          btnClick={() => {
            console.log("all");
          }}
        />
      </div>
      <Button
        text={"Burn eDRF"}
        click={confirm}
        fill={true}
        className="earn-wallet-btn"
      />
    </ModalWithTitle>
  );
}
