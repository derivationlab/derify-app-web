import React, { useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import "./index.less";

export interface INotBrokerProps {}

export default function NotBroker(props: INotBrokerProps) {
  const [step, setStep] = useState(4);
  if (step === 1) {
    return (
      <Step1
        join={() => {
          setStep(2);
        }}
      />
    );
  }
  if (step === 2) {
    return (
      <Step2
        cancel={() => {
          console.log("cancel");
        }}
        confirm={() => {
          console.log("confirm");
        }}
      />
    );
  }
  if (step === 3) {
    return (
      <Step3
        cancel={() => {
          console.log("cancel");
        }}
        confirm={() => {
          console.log("confirm");
        }}
      />
    );
  }
  if (step === 4) {
    return (
      <Step4
        confirm={() => {
          console.log("confirm");
        }}
      />
    );
  }
  return null;
}
