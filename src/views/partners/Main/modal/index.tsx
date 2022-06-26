import React, { useState,useCallback } from "react";
import Button from "@/components/buttons/borderButton";
import Modal, { ModalWithTitle } from "@/components/modal";
import {useDispatch, useSelector} from "react-redux";
import {AppModel, BrokerModel, RootStore} from "@/store";
import Input from "@/components/input";
import {notification} from 'antd'
import {BondAccountType, fromContractUnit, toContractUnit} from "@/utils/contractUtil";
import {numFormat} from '@/utils/number'
import {useIntl} from "react-intl";
import "./index.less";
import {checkNumber, fck} from "@/utils/utils";

interface IEarnModalProps {
  close: () => void;
  confirm: () => void;
  closeModal: ()=> void;
  address?: string;
}

const unitAmount = 600

export default function EarnModal({
  close,
  confirm,
  address,
  closeModal
}: IEarnModalProps) {
  const [value, setValue] = useState("");
  const {broker,wallet} = useSelector((state:RootStore) => state.broker);
  const {selectedAddress} = useSelector((state:RootStore) => state.user);
  const [errorMsg, setErrorMsg] = useState<string|React.ReactNode>("");
  const dispatch = useDispatch();
  const getMaxSize = useCallback((wallet, accountType) => {
    if(accountType === BondAccountType.DerifyAccount) {
      return fromContractUnit(wallet.derifyEdrfBalance)
    }else{
      return fromContractUnit(wallet.walletEdrfBalance)
    }
  },[]);
  const { formatMessage } = useIntl();
  function intl<T>(id:string,values:T[] = []) {

    const intlValues:{[key:number]:T} = {}

    values.forEach((item, index) => {
      intlValues[index] = item
    })


    return formatMessage({id}, intlValues)
  }

  const $t = intl;
  const accountBalance = getMaxSize(wallet,BondAccountType.WalletAccount)
  const accountBalanceArr = numFormat(accountBalance)
  const checkAmount = (amount:string, wallet:{derifyEdrfBalance:number|string,walletEdrfBalance:number|string},accountType:number) => {

    const chekRet = checkNumber(amount, getMaxSize(wallet,BondAccountType.WalletAccount), unitAmount, true);

    if(chekRet.value != null) {
      setValue(chekRet.value);

      const amountNum = parseFloat(chekRet.value);

      if(amountNum < unitAmount){
        setErrorMsg($t('Broker.Broker.DepositPopup.MinAmountError', [unitAmount]));
        return false;
      }
    }



    if(!chekRet.success){
      setErrorMsg($t("global.NumberError"))
      return false;
    }


    setErrorMsg("")
    return true
  }
  const onSubmit = useCallback(() => {

    if(!selectedAddress){
      return;
    }

    if(!value){
      setErrorMsg($t("global.NumberError"));
      return;
    }

    if(!checkAmount(value, wallet, BondAccountType.WalletAccount)){
      return
    }

    const burnEdrfExtendValidPeriodAction = BrokerModel.actions.burnEdrfExtendValidPeriod({trader:selectedAddress,accountType: BondAccountType.WalletAccount, amount: toContractUnit(value)});
    // pending 
    notification.open({
      description: 'pending...',
      className: 'cunstom_notification'
    })
    if(closeModal){
      closeModal();
    }

    burnEdrfExtendValidPeriodAction(dispatch).then(() => {
      dispatch(BrokerModel.actions.updateBrokerAccountInfo(selectedAddress));
      // success
      notification.open({
        description: 'success',
        className: 'cunstom_notification'
      })
      dispatch(AppModel.actions.updateLoadStatus("broker"));

    }).catch(e => {
      console.error('burnEdrfExtendValidPeriod,e',e);
      // failed
      notification.open({
        description: 'failed',
        className: 'cunstom_notification'
      })
    });

  },[value,selectedAddress,wallet])
  return (
    <ModalWithTitle
      className="broker-take-modal"
      close={close}
      title={"Extend Broker Privilege"}
    >
      <div className="list">
        <div className="card1">
          <div className="t">
            <span className="t1">Wallet Balance</span>
          </div>
          <div className="num">
            <span className="big-num">{accountBalanceArr[0]}</span>
            <span className="small-num">.{accountBalanceArr[0]}</span>
            <span className="per">eDRF</span>
          </div>
          <div className="hline1"></div>
          <div className="t">
            <span className="t1"> Broker privilege price per day</span>
          </div>
          <div className="num">
            <span className="big-num">{unitAmount}</span>
            <span className="small-num">.00</span>
            <span className="per">eDRF</span>
          </div>
          <div className="day">
            <span>{fck(Number(value)/unitAmount, 0, 2)}</span> days
          </div>
        </div>
        <Input
          className="trade-wallet-input"
          value={value}
          onChange={(e: any) => setValue(e.target.value)}
          label={"Amount  to burn"}
          unit={"eDRF"}
          btnName="Max"
          btnClick={() => {
            setValue(String(accountBalance))
          }}
        />
      </div>
      <Button
        text={"Burn eDRF"}
        click={onSubmit}
        fill={true}
        className="earn-wallet-btn"
      />
    </ModalWithTitle>
  );
}
