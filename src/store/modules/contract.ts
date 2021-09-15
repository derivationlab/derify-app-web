import * as web3Utils from '@/utils/web3Utils'
import { getTradeList, getTradeBalanceDetail, getTraderEDRFBalance } from '@/api/trade'
import {
  Token,
  SideEnum,
  toHexString,
  toContractUnit,
  fromContractUnit,
  UnitTypeEnum,
  PositionView, OpenType
} from '@/utils/contractUtil'
import { amountFormt, fck } from '@/utils/utils'
import { createTokenPriceChangeEvenet } from '@/api/trade'
import {createReducer} from "redux-create-reducer";
import {TraderAccount} from "@/utils/types";
import {Dispatch} from "redux";

const tokenPriceRateEnventMap = {};
export declare type TokenPair = {
  key: string,
  name: string,
  num: number,
  percent: number,
  enable: boolean,
  address: string
}

export declare type ContractData = {
  positionChangeFeeRatio: string,
  traderOpenUpperBound: {size: number, amount: number},
  sysOpenUpperBound: {size: number, amount: number},
  closeUpperBound: {size: number, amount: number},
  longPmrRate: string,
  shortPmrRate: string,
  tokenPriceRate: string,
  curSpotPrice: number
}

export declare type ContractState = {
  pairs: TokenPair[],
  curPairKey: string,
  contractData: ContractData,
  accountData: TraderAccount,
  positionData: {positions: PositionView[], orderPositions: []},
  limitPositionData: [],
  curSpotPrice: number
}

const state : ContractState = {
  pairs: [
    {key: 'BTC', name: 'BTC / USDT', num: 0, percent: 0, enable: true, address: Token.BTC},
    {key: 'ETH', name: 'ETH / USDT', num: 0, percent: 0, enable: true, address: Token.ETH},
    {key: 'BNB', name: 'BNB / USDT', num: 0, percent: 0, enable: false, address: '0xf3a6679b266899042276804930b3bfbaf807f15b'},
    {key: 'UNI', name: 'UNI / USDT', num: 0, percent: 0, enable: false, address: '0xf3a6679b266899042276804930b3bfbaf807f15b'}
  ],
  curPairKey: 'BTC',
  contractData: {
    positionChangeFeeRatio: '-',
    traderOpenUpperBound: {size: 0, amount: 0},
    sysOpenUpperBound: {size: 0, amount: 0},
    closeUpperBound: {size: 0, amount: 0},
    longPmrRate: '-',
    shortPmrRate: '-',
    tokenPriceRate: '-',
    curSpotPrice: 0
  },
  accountData: {
    balance: 0,
    marginBalance: 0,
    totalMargin: 0,
    marginRate: 0,
    availableMargin: 0
  },
  positionData: {positions: [], orderPositions: []},
  limitPositionData: [],
  curSpotPrice: 0
}

const mutations = {
  UPDATE_PAIRS (state : ContractState, pairs:TokenPair[]) {
    const pairMap:{[key:string]:{item:TokenPair, index: number}} = {};
    state.pairs.forEach((item, index) => {
      pairMap[item.key] = {item, index};
    })

    pairs.forEach((item) => {
      const oldItem = pairMap[item.key]
      if(!oldItem) {
        return
      }

      state.pairs[oldItem.index] = Object.assign(oldItem.item, item)
    })
  },
  SET_ACCOUNT (state : ContractState, account:TraderAccount) {
    state.accountData = account
  },
  SET_CURPAIRKEY (state : ContractState, key:string) {
    state.curPairKey = key
  },
  SET_CURSPOTPRICE (state : ContractState, price:number) {
    state.curSpotPrice = price
  },
  SET_CONTRACT_DATA (state : ContractState, updates:ContractData) {
    state.contractData = Object.assign({}, state.contractData, {...updates})
  },
  SET_ACCOUNT_DATA (state : ContractState, accountData:TraderAccount) {
    state.accountData = Object.assign(state.accountData, accountData)
  },
  RESET_POSITION_DATA (state : ContractState) {
    state.positionData.positions.splice(0)
    state.positionData.orderPositions.splice(0)
  },
  // ADD_POSITION_DATA (state : ContractState, {positionData, pair:TokenPair}) {
  //   if(!positionData) {
  //     return
  //   }
  //
  //   if(positionData.positions) {
  //     const positionsMap:{[key:string]:PositionView} = {};
  //
  //     state.positionData.positions.forEach((position, index) => {
  //       const key = position.token + '.' + position.side
  //       positionsMap[key] = position
  //     })
  //
  //
  //     positionData.positions.forEach((position) => {
  //       const key = position.token + '.' + position.side
  //       positionsMap[key] = position
  //     })
  //
  //     state.positionData.positions.splice(0)
  //
  //     for(var key in positionsMap) {
  //       state.positionData.positions.push(positionsMap[key])
  //     }
  //
  //
  //   }
  //
  //   if(positionData.orderPositions) {
  //     const positionsMap = {};
  //
  //     state.positionData.orderPositions.forEach((position, index) => {
  //       const key = position.timestamp + '.' + position.token + '.' + position.side + '.' + position.orderType
  //       positionsMap[key] = position
  //     })
  //
  //     positionData.orderPositions.forEach((position, index) => {
  //       const key = position.timestamp + '.' + position.token + '.' + position.side + '.' + position.orderType
  //       positionsMap[key] = position
  //     })
  //
  //     state.positionData.orderPositions.splice(0)
  //
  //     for(key in positionsMap) {
  //       state.positionData.orderPositions.push(positionsMap[key])
  //     }
  //   }
  // },
  // SET_LIMIT_POSITION_DATA (state, positionData) {
  //   state.limitPositionData = positionData
  // },
  // SET_POSITION_DATA (state, positionData) {
  //   state.positionData = positionData
  // }

}

const reducers = createReducer(state, {})

const actions = {

  depositAccount (trader:string, amount:string|number) {
    return async (dispatch:Dispatch) => {
      return await web3Utils.contract(trader).deposit(amount)
    }
  },
  withdrawAccount (trader:string, amount:string|number) {
    return async (dispatch:Dispatch) => {
      return await web3Utils.contract(trader).withdraw(amount);
    }
  },
  getSpotPrice (trader:string,token:string) {
    return async (dispatch:Dispatch) => {
      const spotPrice = web3Utils.contract(trader).getSpotPrice(token)

      dispatch({type: 'SET_CURSPOTPRICE', payload: spotPrice})
    }
  },
  getCloseUpperBound (trader:string, token:string, side:SideEnum) {

    return async (dispatch:Dispatch) => {

      if(!trader || token === undefined || side === undefined){
        return
      }
      let closeUpperBound = { size: Infinity}
      if(side !== SideEnum.HEDGE) {
        closeUpperBound = await web3Utils.contract(trader).getCloseUpperBound({token, trader, side})
      }

      dispatch( {type: 'SET_CONTRACT_DATA', payload: closeUpperBound})
      return closeUpperBound
    }
  },
  openPosition (trader:string, token:string,side:SideEnum, size:number|string
                , openType:OpenType, price:string|number, leverage:string|number, brokerId:string) {
    return async (dispatch:Dispatch) => {
      if(!trader){
        return
      }

      if (token === undefined) {
        return
      }

      const params = {
        token, side, openType, size, price, leverage
      }

      return await web3Utils.contract(trader, brokerId)
        .openPosition(params)
    }
  },
  // closePosition ({state}, {token, side, size, brokerId}) {
  //   return new Promise((resolve, reject) => {
  //
  //     if(!state.wallet_address){
  //       return resolve({})
  //     }
  //
  //     web3Utils.contract(state.wallet_address, brokerId)
  //       .closePosition(token, side, size).then(r => {
  //       resolve(r)
  //     }).catch(e => reject(e))
  //   })
  // },
  // orderStopPosition ({state}, {token, side, takeProfitPrice, stopLossPrice}) {
  //   return new Promise((resolve, reject) => {
  //
  //     if(!state.wallet_address){
  //       return resolve({})
  //     }
  //     const params = {
  //       token: token,
  //       trader: state.wallet_address,
  //       side,
  //       takeProfitPrice,
  //       stopLossPrice
  //     }
  //
  //     web3Utils.contract(state.wallet_address)
  //       .orderStopPosition(params).then(r => {
  //       resolve(r)
  //     }).catch(e => reject(e))
  //   })
  // },
  // closeAllPositions ({state}, {brokerId}) {
  //   return new Promise((resolve, reject) => {
  //
  //     if(!state.wallet_address){
  //       return resolve({})
  //     }
  //
  //
  //     web3Utils.contract(state.wallet_address, brokerId)
  //       .closeAllPositions().then(r => {
  //       resolve(r)
  //     }).catch(e => reject(e))
  //   })
  // },
  // /**
  //  *
  //  * @param state
  //  * @param token
  //  * @param closeType {CancelOrderedPositionTypeEnum}
  //  * @param side {SideEnum}
  //  * @param timestamp
  //  * @returns {Promise<void>}
  //  */
  // cancleOrderedPosition ({state}, {token, closeType, side, timestamp}) {
  //   return new Promise((resolve, reject) => {
  //
  //     if(!state.wallet_address){
  //       return resolve({})
  //     }
  //
  //     const params = {
  //       token:token,
  //       trader: state.wallet_address,
  //       closeType: closeType,
  //       side: side,
  //       timestamp: timestamp
  //     }
  //
  //     web3Utils.contract(state.wallet_address)
  //       .cancleOrderedPosition(params).then(r => {
  //       resolve(r)
  //     }).catch(e => reject(e))
  //   })
  // },
  // cancleAllOrderedPositions ({state}, {token}) {
  //   return new Promise((resolve, reject) => {
  //
  //     if(!state.wallet_address){
  //       resolve({})
  //       return
  //     }
  //
  //     web3Utils.contract(state.wallet_address)
  //       .cancleAllOrderedPositions(token, state.wallet_address).then(r => {
  //       resolve(r)
  //     }).catch(e => reject(e))
  //   })
  // },
  // loadHomeData ({state, commit, dispatch}, entrustType = 0) {
  //   // load home page data
  //   const self = this
  //   const side = entrustType
  //   return (async function () {
  //     const data = {curSpotPrice: 0, positionChangeFeeRatio: 0}
  //     if(!state.wallet_address){
  //       return {}
  //     }
  //
  //     const contract = web3Utils.contract(state.wallet_address)
  //
  //     // 1.get cur token spotPrice
  //     const curPair = state.pairs.find(pair => pair.key === state.curPairKey)
  //
  //     data.curSpotPrice = await contract.getSpotPrice(curPair.address)
  //     commit('SET_CONTRACT_DATA', data)
  //
  //     // 2.get positionChangeFeeRatio
  //     data.positionChangeFeeRatio = await contract.getPositionChangeFeeRatio(curPair.address)
  //     commit('SET_CONTRACT_DATA', data)
  //
  //     // 3.get traderOpenUpperBound
  //     const price = data.curSpotPrice
  //     const leverage = 10
  //
  //     data.traderOpenUpperBound = await contract.getTraderOpenUpperBound({token: curPair.address, trader: state.wallet_address
  //       , openType: entrustType, price:  toHexString(price), leverage: toContractUnit(leverage)})
  //
  //     commit('SET_CONTRACT_DATA', data)
  //
  //     //4.update all token price
  //     dispatch('updateAllPairPrice')
  //
  //     // 4.get sysOpenUpperBound
  //     data.sysOpenUpperBound = await contract.getSysOpenUpperBound({token: curPair.address, side: side})
  //     commit('SET_CONTRACT_DATA', data)
  //     return data
  //   }())
  // },
  // getSysOpenUpperBound ({state, commit, dispatch}, {side}) {
  //   return (async () => {
  //     if(!state.wallet_address){
  //       return 0
  //     }
  //
  //     const curPair = state.pairs.find(pair => pair.key === state.curPairKey)
  //
  //     if(!curPair){
  //       return 0
  //     }
  //
  //     const contract = web3Utils.contract(state.wallet_address)
  //     let sysOpenUpperBound = {size: Infinity}
  //     if(side !== SideEnum.HEDGE) {
  //       sysOpenUpperBound = await contract.getSysOpenUpperBound({token: curPair.address, side})
  //     }
  //
  //     commit('SET_CONTRACT_DATA', {sysOpenUpperBound})
  //     return sysOpenUpperBound
  //   })()
  // },
  // getSysCloseUpperBound ({state, commit, dispatch}, {side}) {
  //   return (async () => {
  //     if(!state.wallet_address){
  //       return 0
  //     }
  //
  //     const curPair = state.pairs.find(pair => pair.key === state.curPairKey)
  //     if(!curPair){
  //       return 0
  //     }
  //
  //     const contract = web3Utils.contract(state.wallet_address)
  //     let sysCloseUpperBound = {size: Infinity}
  //     if(side !== SideEnum.HEDGE) {
  //       sysCloseUpperBound = await contract.getSysCloseUpperBound({token: curPair.address, side})
  //     }
  //
  //     commit('SET_CONTRACT_DATA', {sysCloseUpperBound})
  //     return sysCloseUpperBound
  // })
  // },
  // updateAllPairPrice ({state, commit}) {
  //   const contract = web3Utils.contract(state.wallet_address)
  //
  //   if(!state.wallet_address){
  //     return {}
  //   }
  //
  //   state.pairs.forEach((pair) => {
  //
  //     if(!pair.enable){
  //       return
  //     }
  //
  //     contract.getSpotPrice(pair.address).then((spotPrice) => {
  //       commit('UPDATE_PAIRS', [{num: fromContractUnit(spotPrice), key: pair.key}])
  //     })
  //
  //     if(!tokenPriceRateEnventMap[pair.key]){
  //       tokenPriceRateEnventMap[pair.key] = createTokenPriceChangeEvenet(pair.key, (pairKey, priceChangeRate) => {
  //         //Update token price change
  //
  //         if(pair.key === state.curPairKey) {
  //           commit('SET_CONTRACT_DATA', {tokenPriceRate: amountFormt(priceChangeRate * 100,4, true,0)})
  //         }
  //
  //         commit('UPDATE_PAIRS', [{percent: amountFormt(priceChangeRate * 100,4, true,0), key: pairKey}])
  //
  //         const matchPair = state.pairs.find((item) => item.key === pairKey)
  //
  //         contract.getSpotPrice(matchPair.address).then((spotPrice) => {
  //           commit('UPDATE_PAIRS', [{num: fromContractUnit(spotPrice), key: matchPair.key}])
  //         })
  //       })
  //     }
  //
  //
  //   })
  //
  // },
  //
  // loadAccountData ({state, commit}) {
  //   // 1.get user account data
  //   return (async function () {
  //     if(!state.wallet_address){
  //       return {}
  //     }
  //
  //     const contract = web3Utils.contract(state.wallet_address)
  //
  //     const accountData = await contract.getTraderAccount(state.wallet_address)
  //
  //     const tradeVariables = await contract.getTraderVariables(state.wallet_address)
  //
  //     Object.assign(accountData, {marginBalance: tradeVariables.marginBalance
  //       , totalPositionAmount: tradeVariables.totalPositionAmount
  //       , marginRate: tradeVariables.marginRate})
  //
  //     commit('SET_ACCOUNT_DATA', accountData)
  //
  //     return accountData
  //   }())
  // },
  // loadPositionData ({state, commit}) {
  //   return (async () => {
  //     if(!state.wallet_address){
  //       return {}
  //     }
  //
  //     const contract = web3Utils.contract(state.wallet_address)
  //
  //     const positionDatas = []
  //     for(let idx = 0; idx < state.pairs.length; idx++) {
  //       const pairItem = state.pairs[idx]
  //       if(!pairItem.enable){
  //         continue
  //       }
  //
  //       positionDatas.push({positionData: await contract.getTraderAllPosition(state.wallet_address, pairItem.address), pair: pairItem})
  //     }
  //
  //     commit('RESET_POSITION_DATA')
  //     positionDatas.forEach((positionData) => {
  //       commit('ADD_POSITION_DATA', {...positionData})
  //     })
  //
  //   })()
  // },
  // getTraderOpenUpperBound ({state, commit}, {openType, price, leverage}) {
  //   return (async () => {
  //
  //     if(!state.wallet_address){
  //       return {}
  //     }
  //
  //     let idx = state.pairs.findIndex(pair => pair.key === state.curPairKey)
  //
  //     if (idx === undefined) {
  //       idx = 0
  //     }
  //
  //     const coin = state.pairs[idx]
  //
  //     const token = coin.address;
  //
  //     const contract = web3Utils.contract(state.wallet_address)
  //
  //     const data = await contract.getTraderOpenUpperBound({token: token
  //       , trader:  state.wallet_address, openType, price, leverage})
  //
  //     const update = Object.assign({}, state.contractData, {traderOpenUpperBound: data})
  //     commit("SET_CONTRACT_DATA", update)
  //     return data;
  //   })()
  // },
  loadTradeRecords (trader:string, {page=0, size=10}) {
    return getTradeList(trader, page, size)
  },
  // getTraderTradeBalanceDetail ({state, commit}, {page = 0, size = 10}) {
  //   return getTradeBalanceDetail(state.wallet_address, page, size)
  // },
  // async getPositionChangeFee ({state, commit, dispatch}, {side, actionType, size, price}) {
  //
  //   if(!state.wallet_address){
  //     return {}
  //   }
  //
  //   let token = state.pairs.find(pair => pair.key === state.curPairKey)
  //
  //   if (!token) {
  //     return
  //   }
  //
  //   return web3Utils.contract(state.wallet_address).getPositionChangeFee(token.address, side, actionType, size, price)
  // },
  // getTradingFee ({state, commit, dispatch}, {size, price}) {
  //   let idx = state.pairs.findIndex(pair => pair.key === state.curPairKey)
  //
  //   if (idx === undefined) {
  //     idx = 0
  //   }
  //
  //   const coin = state.pairs[idx]
  //
  //   return web3Utils.contract(state.wallet_address).getTradingFee(coin.address, size, price)
  // },
  // onDeposit ({state, commit, dispatch}) {
  //   if(!state.wallet_address){
  //     return {}
  //   }
  //
  //   const self = this;
  //   web3Utils.contract(state.wallet_address).onDeposit(state.wallet_address, function (){
  //     dispatch("loadAccountData")
  //   })
  // },
  // onWithDraw ({state, commit, dispatch}) {
  //   if(!state.wallet_address){
  //     return {}
  //   }
  //
  //   const self = this;
  //   web3Utils.contract(state.wallet_address).onDeposit(state.wallet_address, function (){
  //     dispatch("loadAccountData")
  //   })
  // }
}

export default {
  namespaced: true,
  state,
  reducers,
  actions
}


