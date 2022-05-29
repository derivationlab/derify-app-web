/**
 * this page show the user has a broker but he is not a broker
 */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootStore } from "@/store";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import "./index.less";

export default function NotBroker(props: any) {
  const user = useSelector((state: RootStore) => state.user);
  const [step, setStep] = useState(4);
  if (step === 1) {
    return (
      <Step1
        id={user.brokerId}
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
          setStep(1);
        }}
        confirm={() => {
          setStep(3);
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
          props.history.push("/trade");
        }}
      />
    );
  }
  return null;
}
