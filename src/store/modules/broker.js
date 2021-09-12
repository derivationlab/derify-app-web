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
import { BondAccountType, fromContractUnit, toContractNum, Token } from '@/utils/contractUtil'
import { getWebroot } from '@/config'

const brokerInfo = new BrokerInfo()
const state = {
  isBroker: false,
  webroot: getWebroot(),
  broker: {
    referencePage: getWebroot() + "/",
    rewardBalance:  0,
    accumulatedReward: 0,
    validPeriodInDay: 0,
    expireDate: new Date('1970-01-01'),
    todayReward: 0,
    ...brokerInfo
  },
  wallet: {
    derifyEdrfBalance: 0,
    walletEdrfBalance: 0
  },
}

const mutations = {
  updateState (state, payload) {
    Object.assign(state, payload)
  },
  updateBroker(state, payload) {
    state.broker = Object.assign({},state.broker, payload)
  },
  updateWallet(state, payload) {
    state.wallet = Object.assign({},state.wallet, payload)
  }
}

const actions = {
  getBrokerList({state, commit, dispatch}, {page = 0, size=10}) {
    return (async () => {
      return await getBrokerList(page, size)
    })()
  },
  bindBroker ({state, commit, dispatch}, {trader, brokerId}) {
    return (async () => {
      return await bindBroker({
        brokerId,
        trader
      })
    })()
  },
  getBrokerByBrokerId({state, commit, dispatch}, brokerId) {
    return (async () => {
      return await getBrokerByBrokerId(brokerId)
    })()
  },
  getBrokerByTrader({state, commit, dispatch}, trader) {
    return (async () => {
      return await getBrokerByTrader(trader)
    })()
  },
  getTraderBrokerInfo({state, commit, dispatch}, trader) {

    return (async () => {
      const contract = web3Utils.contract(trader);

      const payload = {broker:{}};
      let accountInfo = {}
      try{
        const accountInfo = await contract.getBrokerInfo(trader)
        if(accountInfo){
          const expireDate = new Date()
          expireDate.setTime(expireDate.getTime() + 1000*60*60*24 * fromContractUnit(accountInfo.validPeriodInDay))
          accountInfo.expireDate = expireDate
          payload.broker = Object.assign(state.broker, accountInfo)
          payload.isBroker = true
        }else{
          payload.isBroker = false
        }
      }catch (e){
        payload.isBroker = false
      }

      try{
        const brokerInfo = await getBrokerByTrader(trader)
        brokerInfo.todayReward = await getBrokerTodayReward(trader)

        brokerInfo.reference = getWebroot() + "/home/" + brokerInfo.id
        payload.broker = Object.assign({}, accountInfo, brokerInfo)
        payload.broker = Object.assign({}, state.broker, payload.broker)
      }catch (e){
        console.warn('error: getBrokerByTrader=' + trader, e)
      }

      commit('updateState', {...payload});

      return payload
    })()
  },
  updateBroker({state, commit, dispatch}, {broker, id, name, logo}) {
    return (async () => {
      return await updateBroker({broker, id, name, logo})
    })()
  },
  applyBroker ({state, commit, dispatch}, {trader, accountType, amount}) {
    return (async () => {
      const contract = web3Utils.contract(trader);
      return await contract.applyBroker(accountType, toContractNum(amount))
    })()
  },
  burnEdrfExtendValidPeriod({state, commit, dispatch}, {trader, accountType, amount}) {
    return (async () => {
      const contract = web3Utils.contract(trader);
      return await contract.burnEdrfExtendValidPeriod(accountType, toContractNum(amount))
    })()
  },
  withdrawBrokerReward({state, commit, dispatch}, {trader, amount}) {
    return (async () => {
      const contract = web3Utils.contract(trader);
      return await contract.burnEdrfExtendValidPeriod(toContractNum(amount))
    })()
  },
  getBrokerBalance({state, commit, dispatch}, {trader,accountType}) {
    return (async () => {
      const contract = web3Utils.contract(trader);
      if(accountType === BondAccountType.WalletAccount) {
        const amount = await contract.balanceOf(trader, Token.eDRF)

        commit('updateWallet', {walletEdrfBalance: amount})
      }else{
        const accountInfo = await contract.getStakingInfo(trader)
        commit('updateWallet', {derifyEdrfBalance: accountInfo.edrfBalance})
      }

    })()
  },
  getBrokerRewardHistory({state, commit, dispatch}, {broker, page = 0, size = 10}) {
    return (async() => {
      return await getBrokerRewardHistory(broker, page, size)
    })()
  },
  getBrokerBindTraders({state, commit, dispatch}, {broker, page = 0, size = 10}) {
    return (async() => {
      return await getbrokerBindTraders(broker, page, size)
    })()
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
