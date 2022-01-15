import {Dispatch} from "redux";
import Eth from "@/assets/images/Eth.png";
import HECO from "@/assets/images/huobi-token-ht-logo.png";
import Binance from "@/assets/images/binance-coin-bnb-logo.png";

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

export class ChainEnum {
  static values : ChainEnum[] = []
  chainId:number;
  name:string;
  logo:string;
  disabled:boolean;
  rpc:string;
  explorer:string;

  constructor(chainId:number, name:string, logo = Eth, disabled = true, rpcUrl= '', explorerUrl=''){
    this.chainId = chainId
    this.name = name
    this.logo = logo
    this.disabled = disabled
    this.rpc = rpcUrl;
    this.explorer = explorerUrl;
    ChainEnum.values.push(this)
  }

  static get ETH() {
    return new ChainEnum(1, "mainnet", Eth, true)
  }

  static get Kovan() {
    return new ChainEnum(42, "Kovan", HECO)
  }

  static get Goerli() {
    return new ChainEnum(5, "Goerli", Binance)
  }

  static get Rinkeby() {
    return new ChainEnum(4, "Rinkeby", Eth, false)
  }

  static get Ropsten() {
    return new ChainEnum(3, "Ropsten")
  }

  static get Morden() {
    return new ChainEnum(2, "Morden")
  }

  static get BSC() {
    return new ChainEnum(0x61, "BSC-TEST", '', false, 'https://data-seed-prebsc-1-s1.binance.org:8545/', 'https://testnet.bscscan.com/')
  }
}

ChainEnum.values.push(ChainEnum.BSC);
ChainEnum.values.push(ChainEnum.Kovan);
ChainEnum.values.push(ChainEnum.Goerli);
ChainEnum.values.push(ChainEnum.Rinkeby);
ChainEnum.values.push(ChainEnum.Ropsten);
ChainEnum.values.push(ChainEnum.Morden);
ChainEnum.values.push(ChainEnum.BSC);
