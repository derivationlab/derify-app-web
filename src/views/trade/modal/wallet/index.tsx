/**
 * the wallet modal to withdraw or deposit
 */
// @ts-nocheck
import React, { useEffect, useState } from "react";
import * as web3Utils from "@/utils/web3Utils"
import Button from "@/components/buttons/borderButton";
import { ModalWithTitle } from "@/components/modal";
import ErrorMessage from "@/components/ErrorMessage";
import Input from "@/components/input";
import {getUSDTokenName} from "@/config";
import {TraderAccount, TransferOperateType} from "@/utils/types";
import {fromContractUnit, toContractUnit, Token} from "@/utils/contractUtil";
import {checkNumber, fck} from "@/utils/utils";
import contractModel from "@/store/modules/contract"
import { useSelector } from "react-redux";
import { RootStore } from "@/store";
import "./index.less";

interface IWalletModalProps {
  close: () => void;
  confirm: () => void;
  type: "withdraw" | "deposit";
  address?: string;
}

export class TransferData {
  accountData: TraderAccount;
  balanceOfWallet: number;
  balanceOfDerify: number;
  operateType: TransferOperateType;
  amount: string | null;

  constructor() {
    this.accountData = new TraderAccount()
    this.balanceOfWallet = 0
    this.balanceOfDerify = 0
    this.operateType = TransferOperateType.withdraw
    this.amount = ""
  }
}

export default function WalletModal(props: IWalletModalProps) {
  const { close, type } = props;
  const loadAccountStatus = useSelector((state:RootStore) => state.app.reloadDataStatus.account);
  const walletInfo = useSelector((state:RootStore) => state.user);
  const { accountData } = useSelector((state: RootStore) => state.contract);
  const trader = walletInfo.selectedAddress;

  const [maxAmount, setMaxAmount]  = useState(0)
  const [transferData, setTransferData]  = useState<TransferData>(new TransferData())
  const [amount, setAmount] = useState("");
  const [errorMsg, setErrorMsg] = useState("");


  const loadTransferData = async () => {
    const contract = web3Utils.contract(trader)
    const accountData = new TraderAccount();
    transferData.operateType = type === "deposit"  ? TransferOperateType.deposit : TransferOperateType.withdraw ;
    try{
      Object.assign(accountData, await contract.getTraderAccount(trader));
      transferData.accountData = accountData
      transferData.balanceOfDerify = accountData.availableMargin
    }catch (e){
      console.log('getTraderAccount error:')
    }
    try{
      transferData.balanceOfWallet = await contract.balanceOf(trader, Token.DUSD)
    }catch (e) {
      console.log('balanceOf error:')
    }
    console.log(transferData);
    setTransferData(transferData)
    setMaxAmount(fck(type === "deposit" ? transferData.balanceOfWallet : transferData.balanceOfDerify, -8, 4))
  };

  // check the number of input
  const checkAmount = (amount: any)=>{
    const checkRet = checkNumber(amount, fromContractUnit(type === "deposit" ? transferData.balanceOfWallet : transferData.balanceOfDerify));
    if(checkRet.value !== null) {
      setAmount(checkRet.value)
    }
    return checkRet.success;
  }

  const amountChange = (e : any) => {
    let {value} = e.target
    checkAmount(value);
    setTransferData(transferData)
  }

  const submit = () => {
    if(!checkAmount(amount)){
      setErrorMsg("The input value is incorrect, please re-enter it")
      return;
    }
    const fn = type === "deposit" ? 'depositAccount' : 'withdrawAccount';
    const action = contractModel.actions[fn](trader, toContractUnit(amount));
    action(dispatch).then((data) => {
      dispatch(AppModel.actions.updateLoadStatus("account"))
      close();
    }).catch((e) => {
      console.log(e)
    })
  }

  useEffect(() => {
    loadTransferData();
  }, [walletInfo, loadAccountStatus])

  const unit = getUSDTokenName();

  const fn1 = () => {
    const data = transferData.accountData
    return data.marginBalance - data.availableMargin;
  }

  const fn2 = () => {
    const data = transferData.accountData
    if(data.marginBalance){
      let v =  data.marginBalance - data.availableMargin;
      return ((v/data.marginBalance) * 100).toFixed(2) + '%'
    }else {
      return '0%'
    }
  }

  function setMaxDom(){
    let str = maxAmount + '';
    if(str.includes(".")){
      let arr = str.split(".");
      return (
       <>
         <span className="big-num">{arr[0]}</span>
         <span className="small-num">.{arr[1]}</span>
       </>
      )
    }else {
      return (
        <span className="big-num">{str}</span>
      )
    }
  }
  return (
    <ModalWithTitle
      className="trade-wallet-modal"
      close={close}
      title={type === "deposit" ? "Deposit from Wallet" : "Withdraw to wallet"}
    >
      <ErrorMessage
        msg={errorMsg}
        visible={!!errorMsg}
        onCancel={() => setErrorMsg("")}
      />
      <div className="list">
        <div className="card">
          <div className="t">
            <span className="t1">
              {type === "deposit" ? 'Wallet Balance' : 'Withdrawable'}
            </span>
          </div>
          <div className="num">
            {setMaxDom()}
            <span className="per">{unit}</span>
          </div>
          {type === "deposit" && <div className="addr">{walletInfo.selectedAddress}</div>}
          {type === "withdraw" && (
            <div className="addr">Margin Usage: {transferData.accountData.marginBalance ? fn1() : 0} {unit} {fn2()}</div>
          )}
        </div>
        <Input
          className="trade-wallet-input"
          value={amount}
          onChange={(e: any) => amountChange(e)}
          label={`Amount to ${type}`}
          unit={unit}
          btnName="Max"
          btnClick={() => {
            setAmount(fck(type === "deposit" ? transferData.balanceOfWallet : transferData.balanceOfDerify,  -8, 4));
          }}
        />
      </div>
      <Button
        text="Confirm"
        click={submit}
        fill={true}
        className="trade-wallet-btn"
      />
    </ModalWithTitle>
  );
}
