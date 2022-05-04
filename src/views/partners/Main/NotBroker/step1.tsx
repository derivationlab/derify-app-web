import React from "react";
import Broker from "@/components/broker";

export default function Step1(props: { join: any }) {
  const data = {
    name: "broker01",
    id: "broker01",
  };
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
      <div className="apply" onClick={props.join}>
        Join us to be a BROKER !
      </div>
    </div>
  );
}
