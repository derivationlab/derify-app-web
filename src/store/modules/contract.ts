import * as web3Utils from '@/utils/web3Utils'
import update from "react-addons-update";

import { getTradeList, getTradeBalanceDetail, getTraderEDRFBalance } from '@/api/trade'
import {
  Token,
  SideEnum,
  toHexString,
  toContractUnit,
  fromContractUnit,
  UnitTypeEnum,
  PositionView, OpenType, CancelOrderedPositionTypeEnum, PositionDataView, OrderLimitPositionView, OrderTypeEnum
} from '@/utils/contractUtil'
import { amountFormt, fck } from '@/utils/utils'
import { createTokenPriceChangeEvenet } from '@/api/trade'
import {createReducer} from "redux-create-reducer";
import {TraderAccount} from "@/utils/types";
import {Dispatch} from "redux";
import {CHANGE_LANG} from "@/store/modules/app/types";

const tokenPriceRateEnventMap:{[key:string]:EventSource} = {};
export declare type TokenPair = {
  key: string,
  name?: string,
  num?: number,
  percent?: number,
  enable?: boolean,
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

export declare type OrderPositionData = {
  tx:string;
  side: SideEnum,
  token:string,
  orderType: OrderTypeEnum,
  size: number,
  leverage: number,
  stopPrice: number,
  timestamp: number,
  isUsed: boolean
}

export declare type PositioData = {
  positions: PositionView[],
  orderPositions: OrderPositionData[]
}

export declare type ContractState = {
  pairs: TokenPair[],
  curPairKey: string,
  curPair: TokenPair,
  contractData: ContractData,
  accountData: TraderAccount,
  positionData: PositioData,
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
  get curPair () {
    const pair = this.pairs.find(pair => pair.key == this.curPairKey)

    if(pair === undefined) {
      return this.pairs[0]
    }

    return pair
  },
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

const reducers = createReducer(state, {
  UPDATE_PAIRS (state : ContractState, {payload}) {
    const pairMap:{[key:string]:{item:TokenPair, index: number}} = {};
    state.pairs.forEach((item, index) => {
      pairMap[item.key] = {item, index};
    })

    payload.forEach((item:TokenPair) => {
      const oldItem = pairMap[item.key]
      if(!oldItem) {
        return
      }

      state.pairs[oldItem.index] = Object.assign(oldItem.item, item)
    })

    return update(state,{$merge: {...state}})
  },
  SET_ACCOUNT (state : ContractState, {payload}) {
    return update(state,{$merge: payload.accountData})
  },
  SET_CURPAIRKEY (state : ContractState, {payload}) {
    return update(state,{$merge: payload.key})
  },
  SET_CURSPOTPRICE (state : ContractState, {payload}) {
    return update(state,{$merge: payload.curSpotPrice})
  },
  SET_CONTRACT_DATA (state : ContractState, {payload}) {
    return update(state,{
      contractData:{$merge: {...payload}}
    })
  },
  SET_ACCOUNT_DATA (state : ContractState, {payload}) {
    return update(state,{$merge: {...payload}})
  },
  RESET_POSITION_DATA (state : ContractState,{payload}) {
    console.log(`RESET_POSITION_DATA ${state}`)
    state.positionData.positions.splice(0)
    state.positionData.orderPositions.splice(0)

    return update(state.positionData,{
        positions: {$splice: []},
        orderPositions:{$splice: []}
    })
  },
  ADD_POSITION_DATA (state : ContractState, {payload}) {
    if(!payload.positionData) {
      return update(state,{$merge:{}})
    }

    if(payload.positionData.positions) {
      const positionsMap:{[key:string]:PositionView} = {};

      state.positionData.positions.forEach((position, index) => {
        const key = position.token + '.' + position.side
        positionsMap[key] = position
      })


      payload.positionData.positions.forEach((position:PositionView) => {
        const key = position.token + '.' + position.side
        positionsMap[key] = position
      })

      state.positionData.positions.splice(0)

      for(var key in positionsMap) {
        state.positionData.positions.push(positionsMap[key])
      }


    }

    if(payload.positionData.orderPositions) {
      const positionsMap:{[key:string]:OrderPositionData} = {};

      state.positionData.orderPositions.forEach((position, index) => {
        const key = position.timestamp + '.' + position.token + '.' + position.side + '.' + position.orderType
        positionsMap[key] = position
      })

      payload.positionData.orderPositions.forEach((position:OrderPositionData, index:number) => {
        const key = position.timestamp + '.' + position.token + '.' + position.side + '.' + position.orderType
        positionsMap[key] = position
      })

      state.positionData.orderPositions.splice(0)

      for(key in positionsMap) {
        state.positionData.orderPositions.push(positionsMap[key])
      }
    }

    return update(state,{$merge: {...state}})
  }
})

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

      dispatch( {type: 'SET_CONTRACT_DATA', payload: {closeUpperBound}})
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
  closePosition (trader:string, token:string, side:SideEnum, size:string|number, brokerId:string) {
    return async (dispatch:Dispatch) => {
      if(!trader){
        return false
      }

      return await web3Utils.contract(trader, brokerId)
        .closePosition(token, side, size)
    }
  },
  orderStopPosition(params:{trader:string, token:string, side:SideEnum, takeProfitPrice:string|number, stopLossPrice:string|number}) {
    return async (dispatch:Dispatch) => {
      if(!params.trader){
        return false
      }

      return await web3Utils.contract(params.trader)
        .orderStopPosition(params)
    }
  },
  closeAllPositions (trader:string, brokerId:string) {
    return async (dispatch:Dispatch) => {
      if(!trader) {
        return false
      }
      return await web3Utils.contract(trader, brokerId)
        .closeAllPositions()
    }
  },
  /**
   *
   * @param state
   * @param token
   * @param closeType {CancelOrderedPositionTypeEnum}
   * @param side {SideEnum}
   * @param timestamp
   * @returns {Promise<void>}
   */
  cancleOrderedPosition (params:{trader:string, token:string, closeType:CancelOrderedPositionTypeEnum, side:string, timestamp:string}) {
    return async (dispatch:Dispatch) => {
      if(!params.trader){
        return false
      }

      return await web3Utils.contract(params.trader)
        .cancleOrderedPosition(params)
    }
  },
  cancleAllOrderedPositions ({trader,token}:{token:string,trader:string}) {
    return async(dispatch:Dispatch) => {
      if(!trader){
        return false
      }

      return await web3Utils.contract(trader)
        .cancleAllOrderedPositions(token, trader)
    }
  },
  loadHomeData ({trader, side = 0, openType = OpenType.MarketOrder}:{token:string,trader:string,side:SideEnum,openType:OpenType}) {
    // load home page data
    const self = this
    return async (commit:Dispatch) => {
      const data = {curSpotPrice: 0, positionChangeFeeRatio: 0, traderOpenUpperBound: 0, sysOpenUpperBound: 0}
      if(!trader){
        return {}
      }

      const contract = web3Utils.contract(trader)

      // 1.get cur token spotPrice
      const curPair = state.pairs.find(pair => pair.key === state.curPairKey)
      if(curPair == undefined){
        return {}
      }

      const token = curPair.address

      data.curSpotPrice = await contract.getSpotPrice(token)

      // 2.get positionChangeFeeRatio
      data.positionChangeFeeRatio = await contract.getPositionChangeFeeRatio(token)
      commit({type: 'SET_CONTRACT_DATA', payload: {...data}})

      // 3.get traderOpenUpperBound
      const price = data.curSpotPrice
      const leverage = 10

      data.traderOpenUpperBound = await contract.getTraderOpenUpperBound({token, trader
        , openType, price:  toHexString(price), leverage: toContractUnit(leverage)})

      commit({type: 'SET_CONTRACT_DATA', payload: {...data}})

      //4.update all token price
      const updateAllPairPriceAction = self.updateAllPairPrice(trader)
      await updateAllPairPriceAction(commit)

      // 4.get sysOpenUpperBound
      data.sysOpenUpperBound = await contract.getSysOpenUpperBound({token: curPair.address, side: side})

      commit({type: 'SET_CONTRACT_DATA', payload: {...data}})

      return data
    }
  },
  getSysOpenUpperBound (trader:string, side:SideEnum) {
    return async (commit:Dispatch) => {
      if(!trader){
        return 0
      }

      const curPair = state.pairs.find(pair => pair.key === state.curPairKey)

      if(!curPair){
        return 0
      }

      const contract = web3Utils.contract(trader)
      let sysOpenUpperBound = {size: Infinity}
      if(side !== SideEnum.HEDGE) {
        sysOpenUpperBound = await contract.getSysOpenUpperBound({token: curPair.address, side})
      }

      commit({type:'SET_CONTRACT_DATA', payload:{sysOpenUpperBound}})
      return sysOpenUpperBound
    }
  },
  getSysCloseUpperBound (trader:string, side:SideEnum) {
    return (async (commit:Dispatch) => {
      if(!trader){
        return 0
      }

      const curPair = state.pairs.find(pair => pair.key === state.curPairKey)
      if(!curPair){
        return 0
      }

      const contract = web3Utils.contract(trader)
      let sysCloseUpperBound = {size: Infinity}
      if(side !== SideEnum.HEDGE) {
        sysCloseUpperBound = await contract.getSysCloseUpperBound({token: curPair.address, side})
      }

      commit({type:'SET_CONTRACT_DATA', payload:{sysCloseUpperBound}})
      return sysCloseUpperBound
  })
  },
  updateAllPairPrice (trader:string) {
    return async (commit:Dispatch) => {

      if(!trader){
        return {}
      }
      const contract = web3Utils.contract(trader)

      console.log(`updateAllPairPrice ${state}`);
      state.pairs.forEach((pair) => {

        if(!pair.enable){
          return
        }

        contract.getSpotPrice(pair.address).then((spotPrice) => {
          commit({type:'UPDATE_PAIRS', payload:[{num: fromContractUnit(spotPrice), key: pair.key}]})
        })

        if(!tokenPriceRateEnventMap[pair.key]){
          tokenPriceRateEnventMap[pair.key] = createTokenPriceChangeEvenet(pair.key, (pairKey:string, priceChangeRate:number) => {
            //Update token price change

            if(pair.key === state.curPairKey) {
              commit({type:'SET_CONTRACT_DATA', payload:{tokenPriceRate: amountFormt(priceChangeRate * 100,4, true,0)}})
            }

            commit({type:'UPDATE_PAIRS', payload:[{percent: amountFormt(priceChangeRate * 100,4, true,0), key: pairKey}]})

            const matchPair = state.pairs.find((item) => item.key === pairKey)

            if(!matchPair){
              return {}
            }

            contract.getSpotPrice(matchPair.address).then((spotPrice) => {
              commit({type:'UPDATE_PAIRS', payload:[{num: fromContractUnit(spotPrice), key: matchPair.key}]})
            })
          })
        }


      })
    }
  },

  loadAccountData (trader:string) {
    // 1.get user account data
    return async function (commit:Dispatch) {
      if(!trader){
        return {}
      }

      const contract = web3Utils.contract(trader)

      const accountData = await contract.getTraderAccount(trader)

      const tradeVariables = await contract.getTraderVariables(trader)

      Object.assign(accountData, {marginBalance: tradeVariables.marginBalance
        , totalPositionAmount: tradeVariables.totalPositionAmount
        , marginRate: tradeVariables.marginRate})

      commit({type:'SET_ACCOUNT_DATA', payload:accountData})

      return accountData
    }
  },
  loadPositionData(trader:string):(commit:Dispatch) => Promise<{positionData:PositionDataView|null,pair: TokenPair|null}[]> {
    return async (commit:Dispatch) : Promise<{positionData:PositionDataView|null,pair: TokenPair|null}[]> => {
      if(!trader) {
        return Promise.resolve([])
      }


      const contract = web3Utils.contract(trader)

      const positionDatas:{positionData:PositionDataView|null,pair: TokenPair|null}[] = []
      for(let idx = 0; idx < state.pairs.length; idx++) {
        const pairItem = state.pairs[idx]
        if(!pairItem.enable){
          continue
        }

        const positionDataView:PositionDataView = await contract.getTraderAllPosition(trader, pairItem.address);
        const positionData:{positionData:PositionDataView|null,pair: TokenPair|null} = {positionData: positionDataView, pair: pairItem}
        positionDatas.push(positionData)
      }

      //commit({type:'RESET_POSITION_DATA'})
      positionDatas.forEach((positionData) => {
        //commit({type:'ADD_POSITION_DATA', payload:{...positionData}})
      })

      return Promise.resolve(positionDatas)
    }
  },
  getTraderOpenUpperBound ({trader,openType, price, leverage}:{trader:string,openType:OpenType, price:string|number, leverage:number|string}) {
    return async (commit:Dispatch) => {

      if(!trader){
        return {}
      }

      let coin = state.pairs.find(pair => pair.key === state.curPairKey)

      if(!coin){
        return {}
      }

      const token = coin.address;

      const contract = web3Utils.contract(trader)

      const data = await contract.getTraderOpenUpperBound({token: token
        , trader, openType, price, leverage})

      const update = Object.assign({}, state.contractData, {traderOpenUpperBound: data})
      commit({type:"SET_CONTRACT_DATA", payload: update})
      return data;
    }
  },
  loadTradeRecords (trader:string, {page=0, size=10}) {
    return getTradeList(trader, page, size)
  },
  getTraderTradeBalanceDetail ({trader, page = 0, size = 10}:{trader:string,page:number,size:number}) {
    return getTradeBalanceDetail(trader, page, size)
  },
  getPositionChangeFee ({trader,side, actionType, size, price}:{trader:string,side:SideEnum, actionType:number, size:number|string, price:number|string}) {
    return async (commit:Dispatch) => {
      if(!trader){
        return {}
      }

      let token = state.pairs.find(pair => pair.key === state.curPairKey)

      if (!token) {
        return
      }

      return await web3Utils.contract(trader).getPositionChangeFee(token.address, side, actionType, size, price)
    }
  },
  getTradingFee (trader:string, size:string|number, price:string|number) {
    let coin = state.pairs.find(pair => pair.key === state.curPairKey)

    if (coin === undefined) {
      return {}
    }
    return web3Utils.contract(trader).getTradingFee(coin.address, size, price)
  },
  onDeposit (trader:string) {
    return async (commit:Dispatch) => {
      if(!trader){
        return {}
      }

      const self = this;
      web3Utils.contract(trader).onDeposit(trader, function (){
        const loadAccountAction = self.loadAccountData(trader);
        loadAccountAction(commit)
      })
    }
  },
  onWithDraw (trader:string) {
    return async (commit:Dispatch) => {
      if(!trader){
        return {}
      }

      const self = this;
      web3Utils.contract(trader).onDeposit(trader, function (){
        const loadAccountAction = self.loadAccountData(trader);
        loadAccountAction(commit)
      })
    }
  }
}

export default {
  namespaced: true,
  state,
  reducers,
  actions
}


