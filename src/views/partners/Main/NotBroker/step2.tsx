/**
 * this page show when the user is not a broker
 * and he want burn edrf to be
 */
// @ts-nocheck
import React, { useCallback, useState } from "react";
import {notification} from 'antd'
import Notice from "@/components/notice";
import ErrorMessage from "@/components/ErrorMessage";
import Button from "@/components/buttons/borderButton";
import { useDispatch, useSelector } from "react-redux";
import { BrokerModel, RootStore } from "@/store";
import { fck } from "@/utils/utils";
import {
  BondAccountType,
  fromContractUnit,
  toContractUnit,
} from "@/utils/contractUtil";

interface Step2Props {
  confirm: any;
  cancel: any;
}

const Step2: React.FC<Step2Props> = props => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootStore) => state.user);
  const broker = useSelector((state: RootStore) => state.broker);
  const [errorMsg, setErrorMsg] = useState("");
  const accountType = BondAccountType.WalletAccount;

  const getMaxSize = useCallback((wallet, accountType) => {
    if (accountType === BondAccountType.DerifyAccount) {
      return fromContractUnit(wallet.derifyEdrfBalance);
    } else {
      return fromContractUnit(wallet.walletEdrfBalance);
    }
  }, []);

  // click confirm
  function confirmFn() {
    if (getMaxSize(broker.wallet, accountType) < 60000) {
      setErrorMsg("Insufficient account balance!");
      return;
    }
    const applyBrokerAction = BrokerModel.actions.applyBroker({
      trader: user.selectedAddress as any,
      accountType: accountType,
      amount: toContractUnit(60000),
    });
    notification.open({
      description: 'pending...',
      className: 'cunstom_notification'
    })
    applyBrokerAction(dispatch)
      .then(() => {
        notification.open({
          description: 'success',
          className: 'cunstom_notification'
        })
        dispatch(
          BrokerModel.actions.getTraderBrokerInfo(user.selectedAddress as any)
        );
        props.confirm();
      })
      .catch(e => {
        notification.open({
          description: 'failed',
          className: 'cunstom_notification'
        })
        setErrorMsg("applyBrokerAction error!");
      });
  }

  return (
    <div className="not-a-broker-burn">
      <div className="t" style={{ height: "120px" }}>
        Burn eDRF to get broker privilege
        <Notice title="Burn eDRF to get broker privilege" />
      </div>
      <div className="data">
        <div className="t1">Getting broker privilege will cost you</div>
        <div className="num">
          <span>60,000</span>
          <span className="unit">eDRF</span>
        </div>
        <div className="hr"></div>
        <div className="wallet">
          Wallet Balance : {fck(getMaxSize(broker.wallet, accountType), 0, 4)}
          eDRF
        </div>
        <div className="addr">{user.selectedAddress}</div>
      </div>
      <ErrorMessage
        style={{ margin: "10px 0" }}
        msg={errorMsg}
        visible={!!errorMsg}
        onCancel={() => setErrorMsg("")}
      />
      <div className="btns">
        <Button text="Confirm" fill={true} className="btn1" click={confirmFn} />
        <Button text="Cancel" className="btn2" click={props.cancel} />
      </div>
    </div>
  );
};

export default Step2;
