import update from "react-addons-update";
// import { Dispatch } from "redux";
import { createReducer } from "redux-create-reducer";

// import * as web3Utils from '@/utils/web3Utils'
// import {Token} from "@/utils/contractUtil";
import { getBrokerIdByTrader } from '@/api/broker'
// import {BIND_PARTNERS, CHANGE_LANG} from "@/store/modules/app/types";


export class ChainEnum {
  static values : ChainEnum[] = []
  chainId:number;
  name:string;
  logo:string;
  disabled:boolean;
  constructor(chainId:number, name:string, logo = require('@/assets/images/Eth.png'), disabled = true){
    this.chainId = chainId
    this.name = name
    this.logo = logo
    this.disabled = disabled
    ChainEnum.values.push(this)
  }

  static get ETH() {
    return new ChainEnum(1, "mainnet", require('@/assets/images/Eth.png'))
  }

  static get Kovan() {
    return new ChainEnum(42, "Kovan", true)
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

const state = {
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

export async function asyncInitWallet() {
  if(!window.ethereum || !!window.ethereum.chainId){
    return {}
  }

  window.ethereum.chainId = await window.ethereum.request({method: 'eth_chainId'})
  window.ethereum.ethAccounts = await window.ethereum.request({method: 'eth_accounts'})

  if(window.ethereum.ethAccounts.length > 0){
    window.ethereum.selectedAddress = window.ethereum.ethAccounts[0]
  }

  window.ethereum.networkVersion = await window.ethereum.request({ method: 'net_version' })

  return window.ethereum
}

export async function getWallet(){

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
    networkVersion: wethereum.networkVersion,
    isMetaMask: wethereum.isMetaMask
  }
}

export const reducers = createReducer(state, {
  setShowWallet (state, showWallet) {
    return update(state, {
      showWallet: {$set: showWallet}
    })
  },
  updateProcessStatus (state, {status = UserProcessStatus.finished, msg = ''}) {
    state.processStatus = status
    state.processStatusMsg = msg

    return update(state, {
      processStatus: {$set: status},
      processStatusMsg: {$set: msg}
    })
  },
  updateState (state, updates) {
    return update(state, {...updates})
  }
});

const effects = {
  // getBalanceOfDUSD () {
  //   return (async ({state}, {call, put}) => {
  //
  //     if (!state.selectedAddress) {
  //       return
  //     }
  //
  //     const balanceOf = await web3Utils.contract(state.selectedAddress).balanceOf(state.selectedAddress, Token.DUSD)
  //     put({type: 'updateState', payload: {balanceOfDUSD: balanceOf}})
  //     return balanceOf;
  //   });
  // },
}

// const userStore = {
//   // namespace: 'user',
//   state,
//   reducers,
//   subscriptions:[],
//   effects,
// }
