import * as web3Utils from '@/utils/web3Utils'
import update from "react-addons-update";

import {getTradeBalanceDetail, getTradeList} from '@/api/trade'
import {
  CancelOrderedPositionTypeEnum,
  fromContractUnit,
  OpenType,
  OrderTypeEnum,
  PositionDataView,
  PositionView,
  SideEnum,
  toContractUnit,
  toHexString,
  Token,
  UnitTypeEnum
} from '@/utils/contractUtil'
import {amountFormt} from '@/utils/utils'
import {createReducer} from "redux-create-reducer";
import {TraderAccount} from "@/utils/types";
import {Dispatch} from "redux";

const tokenPriceRateEnventMap:{[key:string]:EventSource} = {};
export declare type TokenPair = {
  key: string,
  name: string,
  num: number,
  percent: number,
  longPmrRate:number,
  shortPmrRate:number,
  enable: boolean,
  address: string
}

export declare type OpenUpperBound = {
  amount: number|string;
  size: number|string;
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
  price: number,
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
  readonly curPair: TokenPair,
  contractData: ContractData,
  accountData: TraderAccount,
  positionData: PositioData,
  limitPositionData: [],
  curSpotPrice: number
}

const state : ContractState = {
  pairs: [
    {key: 'BTC', name: 'BTC / USDT', num: 0, percent: 0, enable: true, address: Token.BTC,longPmrRate: 0,shortPmrRate:0},
    {key: 'ETH', name: 'ETH / USDT', num: 0, percent: 0, enable: true, address: Token.ETH,longPmrRate: 0,shortPmrRate:0},
    {key: 'BNB', name: 'BNB / USDT', num: 0, percent: 0, enable: false, address: '0xf3a6679b266899042276804930b3bfbaf807f15b',longPmrRate: 0,shortPmrRate:0},
    {key: 'UNI', name: 'UNI / USDT', num: 0, percent: 0, enable: false, address: '0xf3a6679b266899042276804930b3bfbaf807f15b',longPmrRate: 0,shortPmrRate:0}
  ],
  get curPair () {
    const pair = this.pairs.find(pair => pair.key == this.curPairKey)

    if(pair === undefined) {
      return this.pairs[0]
    }

    return pair
  },
  curPairKey: window.localStorage.getItem("curPairKey") || 'BTC',
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
  'contract/UPDATE_PAIRS' (state : ContractState, {payload}) {
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

    return update(state,{pairs: {$merge:state.pairs}})
  },
  'contract/SET_CURPAIRKEY' (state : ContractState, {payload}) {

    const curPair = state.pairs.find(pair => pair.key === payload.key)

    window.localStorage.setItem("curPairKey", payload.key);
    return update(state,{
      curPairKey: {$set: payload.key},
      curPair: {$set: curPair}
    })
  },
  'contract/SET_CURSPOTPRICE' (state : ContractState, {payload}) {
    return update(state,{curSpotPrice:{$set: payload.curSpotPrice}})
  },
  'contract/SET_CONTRACT_DATA' (state : ContractState, {payload}) {
    return update(state,{
      contractData:{$merge: {...payload}}
    })
  },
  'contract/SET_ACCOUNT_DATA' (state : ContractState, {payload}) {
    return update(state,{accountData:{$merge: payload}})
  },
  'contract/RESET_POSITION_DATA' (state : ContractState,{payload}) {
    state.positionData.positions.splice(0)
    state.positionData.orderPositions.splice(0)

    return update(state.positionData,{
        positions: {$splice: []},
        orderPositions:{$splice: []}
    })
  },
  'contract/ADD_POSITION_DATA' (state : ContractState, {payload}) {
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

const openPositionListener:{callback:Function, commit:Dispatch}[] = [];
const closePositionListener:{callback:Function, commit:Dispatch}[] = [];



const actions = {

  depositAccount (trader:string, amount:string|number) {
    return async (dispatch:Dispatch) => {
      if (!trader) {
        return
      }

      return await web3Utils.contract(trader).deposit(amount)
    }
  },
  withdrawAccount (trader:string, amount:string|number) {
    return async (dispatch:Dispatch) => {
      if (!trader) {
        return
      }

      return await web3Utils.contract(trader).withdraw(amount);
    }
  },
  getSpotPrice (trader:string,token:string) {
    return async (dispatch:Dispatch) => {
      if (!trader) {
        return
      }

      const spotPrice = web3Utils.contract(trader).getSpotPrice(token)

      dispatch({type: 'contract/SET_CURSPOTPRICE', payload: spotPrice})
    }
  },
  updateTokenSpotPrice (trader:string,token:string) {
    return async (commit:Dispatch) => {
      if (!trader) {
        return
      }

      const matchPair = this.getPairByAddress(token)

      if(matchPair.key === 'unknown'){
        return
      }

      web3Utils.contract(trader).getSpotPrice(token).then((spotPrice) => {
        commit({type:'contract/UPDATE_PAIRS', payload:[{num: fromContractUnit(spotPrice), key: matchPair.key}]})
      })
    }
  },
  getPairByAddress (token:string) {
    const pair = state.pairs.find((pair) => pair.address === token)
    if(!pair){
      return {name: 'unknown', key: 'unknown', num: 0}
    }

    return pair
  },
  getCloseUpperBound (trader:string, token:string, side:SideEnum) {

    return async (dispatch:Dispatch) => {

      if(!trader || token === undefined || side === undefined){
        return 0
      }
      let closeUpperBound = Infinity
      if(side !== SideEnum.HEDGE) {
        closeUpperBound = await web3Utils.contract(trader).getCloseUpperBound({token, trader, side})
      }

      return closeUpperBound
    }
  },
  openPosition ({trader, token, side, openType, size, price, leverage,brokerId}:{trader:string, token:string,side:SideEnum, size:number|string
  , openType:OpenType, price:string|number, leverage:string|number, brokerId:string}) {
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

      const ret = await web3Utils.contract(trader, brokerId)
        .openPosition(params)

      if(openPositionListener.length > 0){
        openPositionListener.forEach(listener => {
          listener.callback(listener.commit);
        });
      }
      return ret;
    }
  },
  closePosition (trader:string, token:string, side:SideEnum, size:string|number, brokerId:string) {
    return async (dispatch:Dispatch) => {
      if(!trader){
        return false
      }

      const ret = await web3Utils.contract(trader, brokerId)
        .closePosition(token, side, size)

      if(closePositionListener.length > 0){
        closePositionListener.forEach(listener => {
          listener.callback(listener.commit);
        });
      }

      return ret;
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
   * @returns {Promise<void>}
   * @param params
   */
  cancleOrderedPosition (params:{trader:string, token:string, closeType:CancelOrderedPositionTypeEnum, side: SideEnum, timestamp: number}) {
    return async (dispatch:Dispatch) => {
      if(!params.trader){
        return false
      }

      return await web3Utils.contract(params.trader)
        .cancleOrderedPosition(params)
    }
  },
  cancleAllOrderedPositions (trader:string) {
    return async(dispatch:Dispatch) => {
      if(!trader){
        return false
      }

      return await web3Utils.contract(trader)
        .cancleAllOrderedPositions()
    }
  },
  loadHomeData ({token, trader, side = 0, openType = OpenType.MarketOrder}:{token:string,trader:string,side:SideEnum,openType:OpenType}) {
    // load home page data
    const self = this
    return async (commit:Dispatch) => {
      const data = {curSpotPrice: 0, positionChangeFeeRatio: 0, traderOpenUpperBound: {amount:0,size:0}, sysOpenUpperBound: 0}
      if(!trader){
        return {}
      }

      const contract = web3Utils.contract(trader)

      // 1.get cur token spotPrice
      const curPair = state.pairs.find(pair => pair.address === token)
      if(curPair == undefined){
        return {}
      }

      const updateAllPairPriceAction = self.updateAllPairPrice(trader, curPair.address)
      await updateAllPairPriceAction(commit);

      data.curSpotPrice = await contract.getSpotPrice(token)
      commit({type: 'contract/SET_CONTRACT_DATA', payload: {...data}})

      // 2.get positionChangeFeeRatio
      data.positionChangeFeeRatio = await contract.getPositionChangeFeeRatio(token)
      commit({type: 'contract/SET_CONTRACT_DATA', payload: {...data}})

      // 3.get traderOpenUpperBound
      const price = data.curSpotPrice
      const leverage = 10

      data.traderOpenUpperBound = await contract.getTraderOpenUpperBound({token, trader
        , openType, price:  toHexString(price), leverage: toContractUnit(leverage)})

      commit({type: 'contract/SET_CONTRACT_DATA', payload: {...data}})

      //4.update all token price

      // 4.get sysOpenUpperBound
      data.sysOpenUpperBound = await contract.getSysOpenUpperBound({token: curPair.address, side: side})

      commit({type: 'contract/SET_CONTRACT_DATA', payload: {...data}})

      return data
    }
  },
  getSysOpenUpperBound (trader:string, side:SideEnum, token:string) {
    return async (commit:Dispatch) => {
      if(!trader){
        return {amount: 0, size: 0}
      }

      const contract = web3Utils.contract(trader)
      let sysOpenUpperBound = {size: Infinity, amount: Infinity}
      if(side !== SideEnum.HEDGE) {
        sysOpenUpperBound = await contract.getSysOpenUpperBound({token: token, side})
      }

      commit({type:'contract/SET_CONTRACT_DATA', payload:{sysOpenUpperBound}})
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

      commit({type:'contract/SET_CONTRACT_DATA', payload:{sysCloseUpperBound}})
      return sysCloseUpperBound
  })
  },
  updateAllPairPrice (trader:string, token:string,priceChangeRate?:number,longPmrRate?:number|undefined, shortPmrRate?:number) {
    return async (commit:Dispatch) => {
      const contract = web3Utils.contract(trader)

      if(!trader){
        return {}
      }

      for (const pair of state.pairs) {
        if(!pair.enable || pair.address != token){
          continue;
        }

        if(longPmrRate !== undefined){
          pair.longPmrRate = longPmrRate * 100;
        }

        if(shortPmrRate != undefined){
          pair.shortPmrRate = shortPmrRate * 100;
        }

        const num = await contract.getSpotPrice(pair.address);
        if(num || num == 0){
          pair.num = fromContractUnit(num);
        }

        if(priceChangeRate || priceChangeRate == 0){
          pair.percent = priceChangeRate * 100;
        }


        commit({type:'contract/UPDATE_PAIRS', payload:[pair]});
      }
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

      commit({type:'contract/SET_ACCOUNT_DATA', payload:accountData})

      return accountData
    }
  },
  getOpenUpperBoundMaxSize(traderOpenUpperBound:OpenUpperBound, token:number):number {
    if (token ===  UnitTypeEnum.USDT) {
      return fromContractUnit(traderOpenUpperBound.amount,2)
    }else{
      return fromContractUnit(traderOpenUpperBound.size,4)
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
  getTraderOpenUpperBound ({trader, token,openType, price, leverage}:{trader:string,token:string,openType:OpenType, price:string|number, leverage:number|string}):(commit:Dispatch)=>Promise<OpenUpperBound> {
    return async (commit:Dispatch) => {

      if(!trader){
        return {amount: 0, size: 0}
      }

      const contract = web3Utils.contract(trader)

      const data = await contract.getTraderOpenUpperBound({token
        , trader, openType, price, leverage})

      const update = Object.assign({}, state.contractData, {traderOpenUpperBound: data})
      commit({type:"contract/SET_CONTRACT_DATA", payload: update})
      return data;
    }
  },
  loadTradeRecords (trader:string, {page=0, size=10}) {
    return getTradeList(trader, page, size)
  },
  getTraderTradeBalanceDetail ({trader, page = 0, size = 10}:{trader:string,page:number,size:number}) {
    return getTradeBalanceDetail(trader, page, size)
  },
  getPositionChangeFee ({trader, token, side, actionType, size, price}:{trader:string,token:string,side:SideEnum, actionType:number, size:number|string, price:number|string}) {
    return async (commit:Dispatch) => {
      if(!trader){
        return {}
      }
      return await web3Utils.contract(trader).getPositionChangeFee(token, side, actionType, size, price)
    }
  },
  getTradingFee (token:string, trader:string, size:string|number, price:string|number):Promise<number> {
    return web3Utils.contract(trader).getTradingFee(token, size, price)
  },
  onDeposit (trader:string, callback?:Function) {
    return async (commit:Dispatch) => {
      if(!trader){
        return {}
      }

      if(!callback){
        callback = function (){
          const loadAccountAction = self.loadAccountData(trader);
          loadAccountAction(commit)
        };
      }

      const self = this;
      web3Utils.contract(trader).onDeposit(trader, callback)
    }
  },
  onWithDraw (trader:string, callback?:Function) {
    return async (commit:Dispatch) => {
      if(!trader){
        return {}
      }

      const self = this;

      if(!callback){
        callback = function (){
          const loadAccountAction = self.loadAccountData(trader);
          loadAccountAction(commit)
        };
      }
      web3Utils.contract(trader).onWithdraw(trader, callback)
    }
  },

  updateCurTokenPair(tokenPair:TokenPair) {
    const self = this;
    return async (commit:Dispatch) => {
      if(!tokenPair){
        return false
      }
      commit({type: "contract/SET_CURPAIRKEY", payload: tokenPair})

      return true
    }
  },

  onOpenPosition(trader:string, callback:Function){
    return async (commit:Dispatch) => {
      openPositionListener.push({callback, commit});
    }
  },
  onClosePosition(trader:string, callback:Function){
    return async (commit:Dispatch) => {
      closePositionListener.push({callback, commit});
    }
  }
}

export default {
  namespaced: true,
  state,
  reducers,
  actions
}


