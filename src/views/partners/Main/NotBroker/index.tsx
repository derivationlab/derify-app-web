/**
 * this page show the user has a broker but he is not a broker
 */
import React from "react";
import {useSelector} from "react-redux";
import {RootStore} from "@/store";
import Step1 from "./step1";
import "./index.less";
import { useHistory } from "react-router-dom";

export default function NotBroker(props: any) {
  const history = useHistory()
  const user = useSelector((state: RootStore) => state.user);

  return (
    <Step1
      id={user.brokerId}
      join={() => {
        history.push('/broker/apply')
      }}
    />
  );
}
