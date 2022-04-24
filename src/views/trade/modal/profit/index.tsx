import React, { useState } from "react";
import Button from "@/components/buttons/borderButton";
import { ModalWithTitle } from "@/components/modal";
import Input from "@/components/input";
import Type from "@/components/type";
import "./index.less";

interface IProfitModalProps {
  close: () => void;
  confirm: () => void;
}

export default function ProfitModal({ close, confirm }: IProfitModalProps) {
  const [value, setValue] = useState("");
  const [value1, setValue1] = useState("");

  return (
    <ModalWithTitle className="trade-profit-modal" close={close} title={'Take Profit / Stop Loss'}>
      <div className="list">
        <div className="card">
          <div className="t">
            <span className="t1">BTC-USDT</span>
            <Type t={"Long"} />
          </div>
          <div className="num">
            <span className="big-num">22222</span>
            <span className="small-num">.23</span>
            <span className="per">USDT</span>
          </div>
          <div className="line line0">
            Position Average Price : <span className="line-num">56789.12</span>
          </div>
        </div>
        <Input
          className="trade-profit-input1"
          value={value}
          onChange={(e: any) => setValue(e.target.value)}
          label={`Take Profit`}
          unit="USDT"
        />
        <div className="intro">
          When market price reaches <span className="n0">34567.89</span> USDT,
          it will trigger Take Profit order to close this position. Estimated
          profit will be <span className="n1">12345.67</span> USDT.
        </div>
        <Input
          className="trade-profit-input2"
          value={value1}
          onChange={(e: any) => setValue1(e.target.value)}
          label={`Stop Loss`}
          unit="USDT"
        />
        <div className="intro">
          When market price reaches - USDT, it will trigger Stop Loss order to
          close this position. Estimated loss will be - USDT.
        </div>
      </div>

      <Button
        text="Confirm"
        click={confirm}
        fill={true}
        className="trade-profit-btn"
      />
    </ModalWithTitle>
  );
}
