import {Dispatch} from "redux";

declare global {
  interface Window {
    web3: any,
    ethereum: any,
    localStorage: Storage
  }

  interface Date {
    Format(format:string):string
  }

  interface Contract {
    getTraderAccount(trader:string): Promise<TraderAccount>
    getTraderVariables (trader:string): Promise<TraderVariable>
  }
}

export enum TransferOperateType{
  withdraw = "Trade.Account.Transfer.Withdraw",
  deposit = "Trade.Account.Transfer.Deposit"
}

export class TraderAccount {
  balance:number;
  marginBalance: number;
  totalMargin: number;
  marginRate?: number;
  totalPositionAmount?: number;
  availableMargin: number;

  constructor() {
    this.balance = 0
    this.marginBalance = 0
    this.totalMargin = 0
    this.availableMargin = 0
  }
}

export class TraderVariable {
  marginBalance:number;
  totalPositionAmount: number;
  marginRate: number;

  constructor() {
    this.marginBalance = 0;
    this.totalPositionAmount = 0;
    this.marginRate = 0;
  }
}

export declare class DerifyAction<T> {
  execute(dispatch:Dispatch):Promise<T>
}
