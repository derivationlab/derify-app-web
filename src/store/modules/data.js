import {
  getCurrentIndexData,
  getCurrentInsurancePoolData,
  getCurrentPositionData,
  getHistoryInsurancePoolData,
  getHistoryPositionData, getHistoryTradingData
} from '@/api/data'

const state = {

}
const mutations = {
  updateState (state, updates) {
    state = Object.assign(state, {...updates})
  }
}

const actions = {
  loadTradeData ({state, commit, dispatch}, token) {
    return (async() => {
      let current = {}
      const history = await getHistoryTradingData(token)

      if(history && history.length > 0) {
        current = history[0]
      }

      return {current,history}
    })()
  },
  loadHeldData ({state, commit, dispatch}, token) {
    return (async() => {
      const current = await getCurrentPositionData(token)
      const history = await getHistoryPositionData(token)
      return {current,history}
    })()
  },
  loadInsuranceData ({state, commit, dispatch}) {
    return (async() => {
      const current = await getCurrentInsurancePoolData()
      const history = await getHistoryInsurancePoolData()

      return {current,history}
    })()
  },
  loadTokenInfoData ({state, commit, dispatch}) {
    return (async() => {
      const current = await getCurrentIndexData()

      return {current}
    })()
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
