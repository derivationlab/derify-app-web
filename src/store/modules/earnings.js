import { Token,SideEnum } from '@/utils/contractUtil'
import * as web3Util from '@/utils/web3Utils'
import { getCache } from '../../utils/cache'
import { getTraderBondBalance, getTraderEDRFBalance, getTraderPMRBalance } from '../../api/trade'

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

const state = {
  get wallet_address () {
     return window.ethereum !== undefined ? ethereum.selectedAddress :  undefined
  },
  account: getCache('account') || null,
  pairs: [
    {key: 'BTC', name: 'BTC / USDT', num: 2030.23, percent: 1.23, enable: true, address: Token.BTC},
    {key: 'ETH', name: 'ETH / USDT', num: 2930.79, percent: -1.23, enable: true, address: Token.ETH},
    {key: 'BNB', name: 'BNB / USDT', num: 0, percent: 0, enable: false, address: '0xf3a6679b266899042276804930b3bfbaf807f15b'},
    {key: 'UNI', name: 'UNI / USDT', num: 0, percent: 0, enable: false, address: '0xf3a6679b266899042276804930b3bfbaf807f15b'}
  ],
  curPairKey: 'ETH',
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

const mutations = {
  updateState (state, palyload) {
    Object.assign(state, {...palyload})
  },
  updateBondInfo(state, palyload) {
    Object.assign(state.bondInfo, {...palyload})
  },
  updateWallet(state, palyload) {
    Object.assign(state.wallet, {...palyload})
  },
}

const actions = {
  loadEarningData ({state, commit, dispatch}) {
    return (async () => {

      if(!state.wallet_address) {
        return
      }

      const contract = web3Util.contract(state.wallet_address)
      const pmrReward = await contract.getPMReward(state.wallet_address)
      const traderVariable = await contract.getTraderVariables(state.wallet_address)
      const bondInfo = await contract.getBondInfo(state.wallet_address)
      const bdrfBalance = await contract.balanceOf(state.wallet_address, Token.bDRF)

      const edrfInfo = await contract.getStakingInfo(state.wallet_address)
      const edrfBalance = await contract.balanceOf(state.wallet_address, Token.eDRF)

      //const edrfBalance = await contract.balanceOf(state.wallet_address, Token.EDRF)

      const earningData = {...pmrReward, accountData: {...traderVariable}, bondInfo, edrfInfo}
      commit('updateState', earningData)
      commit('updateWallet', {bdrfBalance, edrfBalance: edrfBalance})

      return earningData
    })()
  },
  withdrawPMReward ({state, commit, dispatch}, {amount}) {
    const contract = web3Util.contract(state.wallet_address)
    return contract.withdrawPMReward(amount)
  },
  withdrawBond ({state, commit, dispatch}, {amount}) {
    const contract = web3Util.contract(state.wallet_address)
    return contract.withdrawBond(amount)
  },
  exchangeBond ({state, commit, dispatch}, {amount, bondAccountType}) {
    const contract = web3Util.contract(state.wallet_address)
    return contract.exchangeBond({amount, bondAccountType})
  },
  depositBondToBank ({state, commit, dispatch}, {amount, bondAccountType}) {
    const contract = web3Util.contract(state.wallet_address)
    return contract.depositBondToBank({amount, bondAccountType})
  },
  redeemBondFromBank ({state, commit, dispatch}, {amount, bondAccountType }) {
    const contract = web3Util.contract(state.wallet_address)
    return contract.redeemBondFromBank({amount, bondAccountType })
  },
  getTraderPMRBalance ({state, commit, dispatch}, {page = 0, size = 10}) {
    return getTraderPMRBalance(state.wallet_address, page, size)
  },
  getTraderBondBalance ({state, commit, dispatch}, {page = 0, size = 10}) {
    return getTraderBondBalance(state.wallet_address, page, size)
  },
  getTraderEdrfHistory ({state, commit}, {page = 0, size = 10}) {
    return getTraderEDRFBalance(state.wallet_address, page, size)
  },
  getExchangeBondSizeUpperBound ({state, commit, dispatch}, {bondAccountType}) {
    return (async() => {

      if(!state.wallet_address) {
        return
      }

      const contract = web3Util.contract(state.wallet_address)
      const exchangeBondSizeUpperBound = await contract.getExchangeBondSizeUpperBound({trader: state.wallet_address, bondAccountType})
      commit('updateState', { exchangeBondSizeUpperBound })
      return exchangeBondSizeUpperBound
    })();
  },
  getWalletBalance ({state, commit, dispatch}, {tokenName}) {
    return (async () => {
      const contract = web3Util.contract(state.wallet_address)
      if(tokenName === 'bDRF'){
        const bdrfBalance = await contract.balanceOf(state.wallet_address, Token.bDRF)
        commit('updateWallet', {bdrfBalance})
        return bdrfBalance
      }

      if(tokenName === 'DRF'){
        const drfBalance = await contract.balanceOf(state.wallet_address, Token.DRF)
        commit('updateWallet', {drfBalance})
        return drfBalance
      }

      return 0
    })()
  },
  withdrawEdrf({state, commit, dispatch}, {amount}) {
    return (async() => {
      const contract = web3Util.contract(state.wallet_address)

      return contract.withdrawEdrf(amount)
    })()
  },
  stakingDrf({state, commit, dispatch}, {amount}) {
    return (async() => {
      const contract = web3Util.contract(state.wallet_address)

      return contract.stakingDrf(amount)
    })()
  },
  redeemDrf({state, commit, dispatch}, {amount}) {
    return (async() => {
      const contract = web3Util.contract(state.wallet_address)

      return contract.redeemDrf(amount)
    })()
  },
  getStakingInfo ({state, commit, dispatch}) {
    return (async() => {
      const contract = web3Util.contract(state.wallet_address)

      const edrfInfo = await contract.getStakingInfo(state.wallet_address)

      commit('updateState', {edrfInfo})
    })()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
