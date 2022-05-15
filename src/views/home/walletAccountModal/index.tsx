/**
 * @title the wallet account modal
 */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import close from "@/assets/images/close.png";
import Button from "@/components/buttons/borderButton";
import Notice from "@/components/notice";
import Modal from "@/components/modal";
import { ContractModel, RootStore, UserModel } from "@/store";
import { getUSDTokenName } from "@/config";
import { fck } from "@/utils/utils";
import "./index.less";

interface Iprops {
  close: any,
  setType: any,
  setAddr: any,
  show: any,
}

function WalletAccountModal(props: Iprops) {
  const dispatch = useDispatch();
  const { accountData } = useSelector((state: RootStore) => state.contract);
  const { selectedAddress } = useSelector((state: RootStore) => state.user);
  const loadAccountStatus = useSelector((state: RootStore) => state.app.reloadDataStatus.account);

  useEffect(() => {
    if (selectedAddress) {
      const loadAccountAction = ContractModel.actions.loadAccountData(selectedAddress);
      loadAccountAction(dispatch);
      const onDepositAction = ContractModel.actions.onDeposit(selectedAddress, function() {
        loadAccountAction(dispatch);
      });
      onDepositAction(dispatch);
      const onWithdrawAction = ContractModel.actions.onWithDraw(selectedAddress, function() {
        loadAccountAction(dispatch);
      });
      onWithdrawAction(dispatch);
      const onOpenPositionAction = ContractModel.actions.onOpenPosition(selectedAddress, function() {
        loadAccountAction(dispatch);
      });
      onOpenPositionAction(dispatch);
      const onClosePositionAction = ContractModel.actions.onClosePosition(selectedAddress, function() {
        loadAccountAction(dispatch);
      });
      onClosePositionAction(dispatch);
    }
  }, [selectedAddress, loadAccountStatus]);

  // open withdraw or deposit modal
  const showOperate = (title: string, addr: string) => {
    return () => {
      props.setType(title);
      props.setAddr(addr);
      props.show(true);
      props.close();
    };
  };
  const num1 = fck(accountData?.marginBalance, -8, 2);
  const num1Data = num1.split(".");
  const num2 = fck(accountData?.totalMargin, -8, 2);
  const num2Data = num2.split(".");
  return (
    <Modal className="account-modal">
      <div className="title">Account<img src={close} alt="" onClick={props.close} /></div>
      <div className="list">
        <div className="t">
          Margin Balance <Notice title="Margin Balance" />
        </div>
        <div className="num1">
          <span className="big-num">{num1Data[0]}</span>
          <span className="small-num">.{num1Data[1]}</span>
          <span className="unit">{getUSDTokenName()}</span>
        </div>
        <div className="t t1">
          Available Margin Balance <Notice title="Available Margin Balance" />
        </div>
        <div className="num1">
          <span className="big-num">{num2Data[0]}</span>
          <span className="small-num">.{num2Data[1]}</span>
          <span className="unit">{getUSDTokenName()}</span>
        </div>
        <div className="btns">
          <Button click={showOperate("deposit", "deposit addr")} fill={true} className="deposit" text="Deposit" />
          <Button click={showOperate("withdraw", "")} className="withdraw" text="withdraw" />
        </div>
        <div className="addr">{selectedAddress}</div>
        <div className="tag">MetaMask @ BNB Chain</div>
      </div>
      <Button
        click={() => {
          props.close();
          dispatch(UserModel.actions.logout());
        }}
        className="disconnect"
        text="Disconnect"
      />
    </Modal>
  );
}

export default WalletAccountModal;
