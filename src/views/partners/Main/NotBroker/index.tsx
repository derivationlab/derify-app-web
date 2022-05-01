import React, { useState } from "react";
import Broker from "@/components/broker";
import Notice from "@/components/notice";
import Button from "@/components/buttons/borderButton";
import "./index.less";

export interface INotBrokerProps {}

export default function NotBroker(props: INotBrokerProps) {
  const [step, setStep] = useState(2);
  const data = {
    name: "broker01",
    id: "broker01",
  };
  if (step === 1) {
    return (
      <div className="not-a-broker">
        <div className="main-panel">
          <Broker data={data} className="list-broker" />
          <div className="desc">
            introduction text introduction text introduction text introduction
            text introduction text introduction text introduction text
            introduction text introduction text introduction text introduction
            text introduction text introduction text introduction text
            introduction text introduction text introduction introduction text
            introduction text introduction text introduction text introduction
            text introduction text introduction text introduction text
            introduction text introduction text introduction text
          </div>
          <div className="data">
            <div className="data1">
              <div className="line1">You've registered</div>
              <div className="num">234</div>
              <div className="unit">days</div>
            </div>
            <div className="data2">
              <div className="line1">You've made</div>
              <div className="num">2324</div>
              <div className="unit">transactions</div>
            </div>
            <div className="vr" />
          </div>
        </div>
        <div
          className="apply"
          onClick={() => {
            setStep(2);
          }}
        >
          Join us to be a BROKER !
        </div>
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className="not-a-broker-burn">
        <div className="t">
          Burn eDRF to get broker privilege
          <Notice title="Burn eDRF to get broker privilege" />
        </div>
        <div className="data">
          <div className="t1">Getting broker privilege will cost you</div>
          <div className="num">
            <span>600</span>
            <span className="unit">eDRF</span>
          </div>
          <div className="hr"></div>
          <div className="wallet">Wallet Balance : 45,644.23 eDRF</div>
          <div className="addr">0x40d276e6a7C80562BB1848e3ACB7B7629234C5a6</div>
        </div>
        <div className="btns">
          <Button
            text="Confirm"
            fill={true}
            className="btn1"
            click={() => {
              console.log(1);
            }}
          />
          <Button
            text="Cancel"
            className="btn2"
            click={() => {
              console.log(1);
            }}
          />
        </div>
      </div>
    );
  }
  return null;
}
