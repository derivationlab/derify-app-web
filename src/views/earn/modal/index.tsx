// @ts-nocheck
import React, { useState } from "react";
import Button from "@/components/buttons/borderButton";
import Modal, { ModalWithTitle } from "@/components/modal";
import Input from "@/components/input";
import { fck } from "@/utils/utils";
import "./index.less";

function numFormat(num: any, bit = -8) {
  return num.split(".");
}

interface IEarnModalProps {
  close: () => void;
  confirm: () => void;
  address?: string;
  title: string;
  title2: string;
  label: string;
  btn: string;
  unit: string;
  unit2: string;
  maxAmount: number;
}

export default function EarnModal({
  close,
  confirm,
  address,
  title,
  title2,
  label,
  btn,
  unit,
  unit2,
  maxAmount,
}: IEarnModalProps) {
  const [value, setValue] = useState("");
  const maxAmountArr = numFormat(maxAmount);
  return (
    <ModalWithTitle className="earn-wallet-modal" close={close} title={title}>
      <div className="list">
        <div className="card">
          <div className="t">
            <span className="t1">{title2}</span>
          </div>
          <div className="num">
            <span className="big-num">{maxAmountArr[0]}</span>
            <span className="small-num">.{maxAmountArr[1]}</span>
            <span className="per">{unit}</span>
          </div>
          {address && <div className="addr">{address}</div>}
        </div>
        <Input
          className="trade-wallet-input"
          value={value}
          onChange={(e: any) => setValue(e.target.value)}
          label={label}
          unit={unit2}
          btnName="Max"
          btnClick={() => {
            setValue(maxAmount)
          }}
        />
      </div>
      <Button
        text={btn}
        click={()=>confirm(value)}
        fill={true}
        className="earn-wallet-btn"
      />
    </ModalWithTitle>
  );
}
