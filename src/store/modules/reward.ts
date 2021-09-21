import {BondAccountType, BondInfo, Token} from '@/utils/contractUtil'
import * as web3Util from '@/utils/web3Utils'
import {createReducer} from "redux-create-reducer";
import update from "react-addons-update";
import {Dispatch} from "redux";
import {
  getTraderBondBalance,
  getTraderEDRFBalance,
  getTraderPMRBalance,
  TradePMRBalance,
  TraderBondBalance, TraderEDRFBalance
} from "@/api/trade";
import {ReactNode} from "react";
import {Pagenation} from "@/api/types";

export enum RewardsType{
  USDT = "USDT",
  eDRF = "eDRF",
  bDRF = "bDRF",
}

export class EarningType {
  static get MIN () {
    return 1
  }

  static get EDRF () {
    return 2
  }

  static get BDRF() {
    return 3
  }
}

export declare type ContractUnit = number|string

export declare type RewardsHistoryRecord = {
  id: string|number,
  type:string,
  amount: ContractUnit,
  amoutToken:ReactNode,
  balance: ContractUnit,
  balanceToken:ReactNode,
  time:string
}

export declare type RewardState = {
  accountData: {
    totalPositionAmount: ContractUnit,
  },
  wallet: {
    bdrfBalance: ContractUnit,
    drfBalance: ContractUnit,
    edrfBalance: ContractUnit
  },
  pmrBalance: ContractUnit,
  pmrAccumulatedBalance: ContractUnit,
  bondInfo: BondInfo,
  edrfInfo: {
    drfBalance: ContractUnit,
    edrfBalance: ContractUnit
  },
  exchangeBondSizeUpperBound: ContractUnit
}

const state:RewardState = {
  accountData: {
    totalPositionAmount: 0,
  },
  wallet: {
    bdrfBalance: 0,
    drfBalance: 0,
    edrfBalance: 0
  },
  pmrBalance: 0,
  pmrAccumulatedBalance: 0,
  bondInfo: {
    tx:"",
    /**
     * Convertible bond bDRF
     * Derify account balance (accuracy of 8 digits)
     */
    bondBalance: 0,

    /**
     * Income plan deposit (accuracy of 8 digits)
     */
    bondReturnBalance: 0,

    /**
     * Convertible bond for bDRF
     * Wallet account balance (accuracy of 8 digits)
     */
    bondWalletBalance: 0,

    /**
     * Annualized bond yield(accuracy of 8 digits)
     */
    bondAnnualInterestRatio: 0
  },
  edrfInfo: {
    drfBalance: 0,
    edrfBalance: 0
  },
  exchangeBondSizeUpperBound: 0
}

const reducers = createReducer(state, {
  'reward/updateState' (state, {payload}) {
    return update(state, {$merge:payload})
  },
  'reward/updateBondInfo'(state, {payload}) {
    return update(state, {bondInfo:{$merge: payload}})
  },
  'reward/updateWallet'(state, {payload}) {
    return update(state, {wallet:{$merge:payload}})
  },
})

const actions = {
  loadEarningData (trader:string) {
    return async (commit:Dispatch) => {

      if(!trader) {
        return
      }

      const contract = web3Util.contract(trader)
      const pmrReward = await contract.getPMReward(trader)
      const traderVariable = await contract.getTraderVariables(trader)
      const bondInfo = await contract.getBondInfo(trader)
      const bdrfBalance = await contract.balanceOf(trader, Token.bDRF)

      const edrfInfo = await contract.getStakingInfo(trader)
      const edrfBalance = await contract.balanceOf(trader, Token.eDRF)

      //const edrfBalance = await contract.balanceOf(state.wallet_address, Token.EDRF)

      const earningData = {...pmrReward, accountData: {...traderVariable}, bondInfo, edrfInfo}
      commit({type:'reward/updateState', payload: earningData})
      commit({type:'reward/updateWallet', payload:{bdrfBalance, edrfBalance: edrfBalance}})

      return earningData
    }
  },
  withdrawPMReward (trader:string, amount:string|number) {
    return async (commit:Dispatch) => {
      const contract = web3Util.contract(trader)
      return await contract.withdrawPMReward(amount)
    }

  },
  withdrawBond (trader:string, amount:string|number) {
    return async (commit:Dispatch) => {
      const contract = web3Util.contract(trader)
      return await contract.withdrawBond(amount)
    }
  },
  exchangeBond (trader:string,amount:string|number, bondAccountType:BondAccountType) {
    return async (commit:Dispatch) => {
      const contract = web3Util.contract(trader)
      return await contract.exchangeBond({amount, bondAccountType})
    }
  },
  depositBondToBank (trader:string,amount:string|number, bondAccountType:BondAccountType) {
    return async (commit:Dispatch) => {
      const contract = web3Util.contract(trader)
      return await contract.depositBondToBank({amount, bondAccountType})
    }

  },
  redeemBondFromBank (trader:string,amount:string|number, bondAccountType:BondAccountType) {
    return async (commit:Dispatch) => {
      const contract = web3Util.contract(trader)
      return await contract.redeemBondFromBank({amount, bondAccountType })
    }
  },
  getExchangeBondSizeUpperBound (trader:string,amount:string|number, bondAccountType:BondAccountType) {
    return (async(commit:Dispatch) => {

      if(!trader) {
        return
      }

      const contract = web3Util.contract(trader)
      const exchangeBondSizeUpperBound = await contract.getExchangeBondSizeUpperBound({trader, bondAccountType});

      commit({type:'reward/updateState', payload: {exchangeBondSizeUpperBound}});
      return exchangeBondSizeUpperBound;
    });
  },
  getWalletBalance (trader:string, tokenName:string) {
    return async (commit:Dispatch) => {
      if(!trader) {
        return;
      }

      const contract = web3Util.contract(trader)
      if(tokenName === 'bDRF'){
        const bdrfBalance = await contract.balanceOf(trader, Token.bDRF)
        commit({type:'reward/updateWallet', payload:{bdrfBalance}})
        return bdrfBalance
      }

      if(tokenName === 'DRF'){
        const drfBalance = await contract.balanceOf(trader, Token.DRF)
        commit({type:'reward/updateWallet', payload:{drfBalance}})
        return drfBalance
      }

      if(tokenName === 'eDRF'){
        const drfBalance = await contract.balanceOf(trader, Token.eDRF)
        commit({type:'reward/updateWallet', payload:{drfBalance}})
        return drfBalance
      }

      return 0
    }
  },
  withdrawEdrf(trader:string,amount:string|number) {
    return async(commit:Dispatch) => {
      if(!trader) {
        return;
      }

      const contract = web3Util.contract(trader)

      return  await contract.withdrawEdrf(amount)
    }
  },
  stakingDrf(trader:string,amount:string|number) {
    return (async(commit:Dispatch) => {
      if(!trader) {
        return;
      }

      const contract = web3Util.contract(trader)

      return await contract.stakingDrf(amount)
    })
  },
  redeemDrf(trader:string,amount:string|number) {
    return (async(commit:Dispatch) => {
      if(!trader) {
        return;
      }

      const contract = web3Util.contract(trader)

      return await contract.redeemDrf(amount)
    })
  },
  getStakingInfo (trader:string) {
    return async(commit:Dispatch) => {

      if(!trader) {
        return;
      }

      const contract = web3Util.contract(trader)

      const edrfInfo = await contract.getStakingInfo(trader)

      commit({type:'reward/updateState', payload:{edrfInfo}})

      return edrfInfo;
    }
  },
  getTraderPMRBalance (trader:string, page = 1, size = 10) {
    return async(commit:Dispatch) => {
      if(!trader) {
        return new Pagenation();
      }

      const pagenation = await getTraderPMRBalance(trader, page, size);
      const results:RewardsHistoryRecord[] = [];
      pagenation.records.forEach((item:TradePMRBalance) => {

        results.push({
          id: item.id,
          amount: item.amount,
          amoutToken: "USDT",
          balance: item.balance,
          balanceToken: "USDT",
          time: item.event_time,
          type: item.pmr_update_type === 0 ? "Rewards.Mining.History.Earning" : "Rewards.Mining.History.Withdraw"
        });
      })

      const resultPagenation = new Pagenation();
      resultPagenation.pageSize = pagenation.pageSize;
      resultPagenation.current = pagenation.current;
      resultPagenation.totalPage = pagenation.totalPage;
      resultPagenation.totalItems = pagenation.totalItems;
      resultPagenation.records = results;
      return resultPagenation;
    }
  },
  getTraderBondBalance (trader:string, page = 1, size = 10) {
    return async (commit:Dispatch) => {
      if(!trader) {
        return new Pagenation();
      }

      const pagenation =  await  getTraderBondBalance(trader, page, size);

      const results:RewardsHistoryRecord[] = [];
      pagenation.records.forEach((item:TraderBondBalance) => {
        results.push({
          id: item.id,
          amount: item.amount,
          amoutToken: "USDT",
          balance: item.balance,
          balanceToken: "USDT",
          time: item.event_time,
          type: 'Rewards.Bond.History.Type' + item.bond_update_type
        });
      })

      const resultPagenation = new Pagenation();
      resultPagenation.pageSize = pagenation.pageSize;
      resultPagenation.current = pagenation.current;
      resultPagenation.totalPage = pagenation.totalPage;
      resultPagenation.totalItems = pagenation.totalItems;
      resultPagenation.records = results;
      return resultPagenation;
    }
  },
  getTraderEdrfHistory (trader:string, page = 1, size = 10) {
    return async (commit:Dispatch) => {

      if(!trader) {
        return new Pagenation();
      }

      const typeMap:{[key:number]:string} = {
        0: "Rewards.Staking.History.Earning",
        1: "Rewards.Staking.History.Withdraw",
        6: "Rewards.Staking.History.Burn",
      };
      const pagenation =  await getTraderEDRFBalance(trader, page, size);

      const results:RewardsHistoryRecord[] = [];
      pagenation.records.forEach((item:TraderEDRFBalance) => {
        results.push({
          id: item.id,
          amount: item.amount,
          amoutToken: "USDT",
          balance: item.balance,
          balanceToken: "USDT",
          time: item.event_time,
          type: typeMap[item.update_type] || 'unknow'
        });
      })

      const resultPagenation = new Pagenation();
      resultPagenation.pageSize = pagenation.pageSize;
      resultPagenation.current = pagenation.current;
      resultPagenation.totalPage = pagenation.totalPage;
      resultPagenation.totalItems = pagenation.totalItems;
      resultPagenation.records = results;
      return resultPagenation;
    }

  },
}



export default {
  namespaced: true,
  state,
  reducers,
  actions
}
