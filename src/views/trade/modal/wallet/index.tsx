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
  const { close, confirm, type, address } = props;
  const loadAccountStatus = useSelector((state:RootStore) => state.app.reloadDataStatus.account);
  const walletInfo = useSelector((state:RootStore) => state.user);
  const { accountData } = useSelector((state: RootStore) => state.contract);
  const trader = walletInfo.selectedAddress;

  const [maxAmount, setMaxAmount]  = useState(0)
  const [transferData, setTransferData]  = useState<TransferData>(new TransferData())
  const [amount, setAmount] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // format the wallet balance
  const num1 = fck(maxAmount, -8, 2);
  const num1Data = num1.split(".");

  const loadTransferData = async () => {
    const contract = web3Utils.contract(trader)
    const accountData = new TraderAccount();
    transferData.operateType = TransferOperateType.deposit;
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
    setTransferData(transferData)
    setMaxAmount(fck(transferData.balanceOfWallet, -8, 4))
  };

  // check the number of input
  const checkAmount = (amount: any)=>{
    const checkRet = checkNumber(amount, fromContractUnit(transferData.balanceOfWallet));
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
    if(type === "deposit"){
      if(checkAmount(amount)) {
        const action = contractModel.actions.depositAccount(trader, toContractUnit(amount));
        action(dispatch).then((data) => {
          dispatch(AppModel.actions.updateLoadStatus("account"))
        }).catch((e) => {
           console.log(e)
        })
      }else {
        setErrorMsg("please input valid number")
      }
    }
  }

  useEffect(() => {
    loadTransferData();
  }, [walletInfo])

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
            <span className="big-num">{num1Data[0]}</span>
            <span className="small-num">.{num1Data[1]}</span>
            <span className="per">{getUSDTokenName()}</span>
          </div>
          {type === "deposit" && <div className="addr">{walletInfo.selectedAddress}</div>}
          {type === "withdraw" && (
            <div className="addr">Margin Usage: 34567.89 USDT ( 12.34%)</div>
          )}
        </div>
        <Input
          className="trade-wallet-input"
          value={amount}
          onChange={(e: any) => amountChange(e)}
          label={`Amount to ${type}`}
          unit={getUSDTokenName()}
          btnName="Max"
          btnClick={() => {
            // deposit
            setAmount(fck(transferData.balanceOfWallet,  -8, 4));
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
