import React, { useState } from "react";
import closeImg from "@/assets/images/close.png";
import Button from "@/components/buttons/borderButton";
import Modal from "@/components/modal";
import Input from "@/components/input";
import "./index.less";

interface IWalletModalProps {
  close: () => void;
  confirm: () => void;
  type: "withdraw" | "deposit";
  address?: string;
}

export default function WalletModal({
  close,
  confirm,
  type,
  address,
}: IWalletModalProps) {
  const [value, setValue] = useState("");
  return (
    <Modal className="trade-wallet-modal">
      <div className="title">
        {type === "deposit" ? "Deposit from Wallet" : "Withdraw to wallet"}
        <img src={closeImg} alt="" onClick={close} />
      </div>
      <div className="list">
        <div className="card">
          <div className="t">
            <span className="t1">BTC-USDT</span>
          </div>
          <div className="num">
            <span className="big-num">22222</span>
            <span className="small-num">.23</span>
            <span className="per">USDT</span>
          </div>
          {type === "deposit" && <div className="addr">{address}</div>}
          {type === "withdraw" && (
            <div className="addr">Margin Usage: 34567.89 USDT ( 12.34%)</div>
          )}
        </div>
        <Input
          className="trade-wallet-input"
          value={value}
          onChange={(e: any) => setValue(e.target.value)}
          label={`Amount to ${type}`}
          unit="BTC"
          btnName="Max"
          btnClick={() => {
            console.log("all");
          }}
        />
      </div>
      <Button
        text="Confirm"
        click={confirm}
        fill={true}
        className="trade-wallet-btn"
      />
    </Modal>
  );
}
