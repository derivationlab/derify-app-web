import {
  getCurrentIndexData,
  getCurrentInsurancePoolData,
  getCurrentPositionData,
  getHistoryInsurancePoolData,
  getHistoryPositionData, getHistoryTradingData
} from '@/api/data'
import {createReducer} from "redux-create-reducer";
import {Dispatch} from "redux";

export declare type DataState = {

}
const state:DataState = {
}

const reducers = createReducer(state, {});

const actions = {
  loadTradeData (token:string) {
    return (async(commit:Dispatch) => {
      let current = {trading_fee: 0, day_time: "", trading_amount: 0}
      const history = await getHistoryTradingData(token)

      if(history && history.length > 0) {
        current = history[0]
      }

      return {current,history}
    })
  },
  loadHeldData (token:string) {
    return (async(commit:Dispatch) => {
      const current = await getCurrentPositionData(token)
      const history = await getHistoryPositionData(token)
      return {current,history}
    })
  },
  loadInsuranceData () {
    return async(commit:Dispatch) => {
      const current = await getCurrentInsurancePoolData()
      const history = await getHistoryInsurancePoolData()

      return {current,history}
    }
  },
  loadTokenInfoData () {
    return async(commit:Dispatch) => {
      const current = await getCurrentIndexData()

      return {current}
    }
  },
}

export default {
  namespaced: true,
  state,
  reducers,
  actions
}
