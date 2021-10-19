import {
  bindBroker,
  BrokerInfo, getbrokerBindTraders,
  getBrokerByBrokerId,
  getBrokerByTrader,
  getBrokerList, getBrokerRewardHistory,
  getBrokerTodayReward,
  updateBroker
} from '@/api/broker'
import * as web3Utils from '@/utils/web3Utils'
import {BondAccountType, fromContractUnit, toContractNum, toContractUnit, Token} from '@/utils/contractUtil'
import { getWebroot } from '@/config'
import {createReducer} from "redux-create-reducer";
import update from 'react-addons-update';
import {Dispatch} from "redux";

export class BrokerAccountInfo{
  id:string = "";
  broker:string = "";
  name:string = "";
  logo:string = "";
  update_time:string = "";
  referencePage:string = "";
  rewardBalance: number|string = 0;
  accumulatedReward: number|string = 0;
  validPeriodInDay:number = 0;
  expireDate:Date = new Date('1970-01-01');
  todayReward:number|string = 0;
  reference:string = "";
}

export declare type BrokerState = {
  isBroker: boolean,
  webroot: string,
  broker: BrokerAccountInfo,
  wallet: {
    derifyEdrfBalance: number|string,
    walletEdrfBalance: number|string
  },
}


const brokerInfo = new BrokerAccountInfo()
const state:BrokerState = {
  isBroker: false,
  webroot: getWebroot(),
  broker: brokerInfo,
  wallet: {
    derifyEdrfBalance: 0,
    walletEdrfBalance: 0
  },
}

export const reducers = createReducer(state, {
  'broker/updateBrokerState' (state, {payload}) {
    return update(state,{$merge: payload})
  },
  'broker/updateBroker'(state, {payload}) {

    return update(state,{broker:{
        $merge: payload
      }});
  },
  'broker/updateWallet'(state, {payload}) {
    return update(state, {
      wallet:{
        $merge: payload
      }
    })
  }
});

const actions = {
  getTraderBrokerInfo(trader:string) {

    return async (commit:Dispatch) => {
      if (!trader) {
        return
      }

      const contract = web3Utils.contract(trader);

      const data:any = {}
      const brokerAccountInfo:BrokerAccountInfo = new BrokerAccountInfo();

      data.broker = brokerAccountInfo;

      let accountInfo = {}
      try{
        const accountInfo = await contract.getBrokerInfo(trader)
        if(accountInfo){
          const expireDate = new Date()
          expireDate.setTime(expireDate.getTime() + 1000*60*60*24 * fromContractUnit(accountInfo.validPeriodInDay))
          brokerAccountInfo.expireDate = expireDate
          data.broker = Object.assign(data.broker, accountInfo)
          data.isBroker = true
        }else{
          data.isBroker = false
        }
      }catch (e){
        data.isBroker = false
      }

      try{
        const brokerInfo = await getBrokerByTrader(trader);

        if(brokerInfo !== null){
          brokerAccountInfo.reference = getWebroot() + "/broker/" + brokerInfo.id
          Object.assign(brokerAccountInfo, brokerInfo);
        }
        try{
          brokerAccountInfo.todayReward = toContractNum(await getBrokerTodayReward(trader));
        }catch (e){
          console.error("getBrokerTodayReward", e)
        }

        data.broker = Object.assign({}, accountInfo, brokerAccountInfo);

      }catch (e){
        console.warn('error: getBrokerByTrader=' + trader, e)
      }

      commit({type:'broker/updateBrokerState', payload: data});

      return data
    }
  },
  updateBrokerAccountInfo(trader:string) {
    return async (commit:Dispatch) => {
      if (!trader) {
        return
      }

      const contract = web3Utils.contract(trader);
      const accountInfo = await contract.getBrokerInfo(trader);

      commit({type: 'broker/updateBroker', payload: accountInfo})
      return accountInfo;
    }
  },
  applyBroker ({trader, accountType, amount}:{trader:string, accountType:BondAccountType, amount:number|string}) {
    return (async (commit:Dispatch) => {
      if (!trader) {
        return
      }

      const contract = web3Utils.contract(trader);
      return await contract.applyBroker(accountType, amount+"")
    })
  },
  burnEdrfExtendValidPeriod({trader, accountType, amount}:{trader:string, accountType:BondAccountType, amount:number|string}) {
    return (async (commit:Dispatch) => {
      if (!trader) {
        return
      }

      const contract = web3Utils.contract(trader);
      return await contract.burnEdrfExtendValidPeriod(accountType, amount)
    })
  },
  withdrawBrokerReward({trader, amount}:{trader:string, amount:number|string}) {
    return (async (commit:Dispatch) => {
      if (!trader) {
        return
      }

      const contract = web3Utils.contract(trader);
      return await contract.withdrawBrokerReward(amount)
    })
  },
  getBrokerBalance({trader,accountType}:{trader:string, accountType:number|string}) {
    return (async (commit:Dispatch) => {
      if (!trader) {
        return
      }

      const contract = web3Utils.contract(trader);
      if(accountType === BondAccountType.WalletAccount) {
        const amount = await contract.balanceOf(trader, Token.eDRF)

        commit({type:'broker/updateWallet', payload:{walletEdrfBalance: amount}})
      }else{
        const accountInfo = await contract.getStakingInfo(trader)
        commit({type:'broker/updateWallet', payload:{derifyEdrfBalance: accountInfo.edrfBalance}})
      }

    })
  }
}


export default {
  namespace: 'broker',
  state,
  reducers,
  actions
}
