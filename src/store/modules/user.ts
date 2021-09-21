import update from "react-addons-update";
import { createReducer } from "redux-create-reducer";

import * as web3Utils from '@/utils/web3Utils'
import {Token} from "@/utils/contractUtil";
import { getBrokerIdByTrader } from '@/api/broker'
// import {BIND_PARTNERS, CHANGE_LANG} from "@/store/modules/app/types";

import Eth from "@/assets/images/Eth.png";
import HECO from "@/assets/images/huobi-token-ht-logo.png";
import Binance from "@/assets/images/binance-coin-bnb-logo.png";
import Solana from "@/assets/images/Solana.png";
import Wallet from "@/assets/images/Metamask.png";
import EnIcon from "@/assets/images/en.png";
import ZhIcon from "@/assets/images/zh.png";
import {Dispatch} from "redux";

export class ChainEnum {
  static values : ChainEnum[] = []
  chainId:number;
  name:string;
  logo:string;
  disabled:boolean;

  constructor(chainId:number, name:string, logo = Eth, disabled = true){
    this.chainId = chainId
    this.name = name
    this.logo = logo
    this.disabled = disabled
    ChainEnum.values.push(this)
  }

  static get ETH() {
    return new ChainEnum(1, "mainnet", Eth)
  }

  static get Kovan() {
    return new ChainEnum(42, "Kovan", HECO)
  }

  static get Goerli() {
    return new ChainEnum(5, "Goerli")
  }

  static get Rinkeby() {
    return new ChainEnum(4, "Rinkeby")
  }

  static get Ropsten() {
    return new ChainEnum(3, "Ropsten")
  }

  static get Morden() {
    return new ChainEnum(2, "Morden")
  }
}

const networkMap:{[key:number]:ChainEnum} = {
  1: ChainEnum.ETH,
  2: ChainEnum.Morden,
  3: ChainEnum.Ropsten,
  4: ChainEnum.Rinkeby,
  5: ChainEnum.Goerli,
  42: ChainEnum.Kovan,
  // 1337: "Geth private chains (default)",
}

export class WalletEnum {
  static get MetaMask () {
    return 'MetaMask'
  }
}

/**
 * user wait pop box
 * 0(finished)->1(waiting)->2(success)->0(finished)
 * 0(finished)->1(waiting)->3(failed)->0(finished)
 *
 */
export class UserProcessStatus {
  static get finished() {
    return 0
  }

  static get waiting() {
    return 1
  }

  static get success() {
    return 2
  }

  static get failed() {
    return 3
  }
}

export const mainChain = ChainEnum.Rinkeby

export type UserState = {
  selectedAddress?: string|null,
  showWallet?: boolean,
  isLogin?: boolean,
  chainEnum?: ChainEnum,
  chainId?: string,
  isEthum?: boolean,
  networkVersion?: string | null,
  isMetaMask?: boolean,
  processStatus?: number,
  processStatusMsg?: string,
  balanceOfDUSD?: number,
  brokerId?: string|null,
  hasBroker?: boolean
}

export type WalletInfo ={

}

const state : UserState = {
  selectedAddress: "",
  showWallet: false,
  isLogin: false,
  chainEnum: mainChain,
  isEthum: false,
  networkVersion: "",
  isMetaMask: false,
  processStatus: UserProcessStatus.finished,
  processStatusMsg: '',
  balanceOfDUSD: 0,
  brokerId: null
};

export async function asyncInitWallet() : Promise<UserState> {
  if(!window.ethereum || !!window.ethereum.chainId){
    return state
  }

  window.ethereum.chainId = await window.ethereum.request({method: 'eth_chainId'})
  window.ethereum.ethAccounts = await window.ethereum.request({method: 'eth_accounts'})

  if(window.ethereum.ethAccounts.length > 0){
    window.ethereum.selectedAddress = window.ethereum.ethAccounts[0]
  }

  window.ethereum.networkVersion = await window.ethereum.request({ method: 'net_version' })

  return window.ethereum
}

export async function getWallet() : Promise<UserState>{

  if(!window.ethereum){
    return {selectedAddress: null, chainId: "1", networkVersion: null, isMetaMask: false, isLogin: false}
  }


  let wethereum = window.ethereum
  const isEthum = mainChain.chainId === parseInt(wethereum.chainId)

  const chainId = parseInt(wethereum.chainId)

  const chainEnum = networkMap.hasOwnProperty(chainId) ? networkMap[chainId] : new ChainEnum(chainId, 'unkown');
  const brokerId = await getBrokerIdByTrader(wethereum.selectedAddress)

  return {
    selectedAddress: wethereum.selectedAddress,
    isLogin: wethereum.selectedAddress && isEthum,
    hasBroker: !!brokerId,
    showWallet: false,
    chainEnum: chainEnum,
    brokerId: brokerId,
    isEthum,
    processStatus: 0,
    balanceOfDUSD: 0,
    networkVersion: wethereum.networkVersion,
    isMetaMask: wethereum.isMetaMask
  }
}

export const reducers = createReducer(state, {
  'user/setShowWallet': (state, showWallet) => {
    return update(state, {
      showWallet: {$set: showWallet}
    })
  },
  'user/updateState': (state, {payload})=>{
    return update(state, {$set: payload})
  }
});

const actions = {
  getBalanceOfDUSD (trader:string, token:string) {
    return async (commit: Dispatch) => {

      if (!trader) {
        return
      }

      const balanceOf = await web3Utils.contract(trader).balanceOf(trader, token)
      commit({type: 'user/updateState', payload: {balanceOfDUSD: balanceOf}})
      return balanceOf;
    };
  },
  loadWallet() {
    return async(commit: Dispatch) => {
      const initRes = await asyncInitWallet()

      const walletInfo = await getWallet()

      commit({type: "user/updateState", payload: walletInfo})
      return walletInfo
    }
  },

  loginWallet () {
    return async (commit: Dispatch) => {
      return await web3Utils.enable();
    }
  }

}

export default {
  namespace: 'user',
  state,
  reducers,
  actions
}
