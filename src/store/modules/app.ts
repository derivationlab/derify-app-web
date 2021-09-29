import update from "react-addons-update";
import { createReducer } from "redux-create-reducer";

import {CHANGE_LANG, BIND_PARTNERS, TRANSFER_SHOW, UPDATE_APP_STATE, TRIGGER_EVENT} from "./types";
import { Dispatch } from "redux";
import {TransferOperateType} from "@/utils/types";
import {bindBroker, getBrokerByBrokerId} from "@/api/broker";

export declare type DerifyEvent = {name: string, args:any[]};
export interface AppState {
  locale: "en" | "zh-CN";
  isBindPartners: boolean;
  transferShow: boolean;
  fundsDetailShow: boolean;
  operateType: TransferOperateType;
  reloadDataStatus:{
    trade: number,
    account: number,
    reward: number,
    broker: number
  }
}

const getInitialState: () => AppState = () => {

  return {
    locale: window.localStorage.getItem("lang") === "zh-CN" ? "zh-CN" : "en",
    isBindPartners: false,
    transferShow: false,
    fundsDetailShow: false,
    operateType: TransferOperateType.withdraw,
    reloadDataStatus:{
      trade: 0,
      account: 0,
      reward: 0,
      broker: 0
    }
  };
};

const reducers = createReducer(getInitialState(), {
  [CHANGE_LANG](state, { payload }) {
    return update(state, {
      locale: { $set: payload },
    });
  },
  [BIND_PARTNERS](state, { payload }) {
    return update(state, {
      isBindPartners: { $set: payload },
    });
  },
  [TRANSFER_SHOW](state, {payload}) {

    return update(state, {
      transferShow: { $set: payload.transferShow },
      operateType: { $set: payload.operateType },
    })
  },

  [UPDATE_APP_STATE](state, {payload}) {

    return update(state, {$merge:payload})
  },

  [TRIGGER_EVENT](state, {payload}) {

    return update(state, {tiggerEvents:{[payload.name]:payload.args}})
  },
  ['/updateTradeLoadStatus'](state, {payload}) {
    return update(state, {reloadDataStatus:{trade:{$set: state.reloadDataStatus.trade+1}}})
  },
  ['/updateLoadStatus'](state, {payload}) {
    const reloadDataStatus:any = state.reloadDataStatus;
    if(reloadDataStatus.hasOwnProperty(payload)){
      return update(state, {reloadDataStatus:{[payload]:{$set: (reloadDataStatus[payload])+1}}})
    }else{
      return update(state,{$merge:{}});
    }

  },
});
export function changeLang(lang: string) {
  return async (dispatch: Dispatch) => {
    dispatch({ type: CHANGE_LANG, payload: lang });
    window.localStorage.setItem("lang", lang);
    return Promise.resolve();
  };
}

export function bindPartners(trader:string, brokerId:string) {
  return async (dispatch: Dispatch) => {

    if (!trader) {
      return
    }

    const data =  await getBrokerByBrokerId(brokerId)
    if(data == null || data.broker == null){
      return {success: false, msg: 'Trade.BrokerBind.BrokerCodes.BrokerCodeNoExistError'}
    }

    return await bindBroker({trader, brokerId})
  };
}

export const showTransfer = (transferShow:boolean, operateType: TransferOperateType) => {
  return async (commit : Dispatch) => {
    return commit({type: TRANSFER_SHOW, payload:{transferShow, operateType}})
  }
}


export const showFundsDetail = (fundsDetailShow:boolean) => {
  return async (commit : Dispatch) => {
    return commit({type: UPDATE_APP_STATE, payload:{fundsDetailShow}})
  }
}


export const triggerGlobalEvent = (name:string,...args:any[]) => {
  return async (commit : Dispatch) => {
    return commit({type: TRIGGER_EVENT, payload:{name,params: args}})
  }
}

const actions = {
  changeLang,
  triggerGlobalEvent,
  showFundsDetail,
  showTransfer,
  bindPartners,
  updateTradeLoadStatus: () => {
    return async (commit:Dispatch) =>{
      commit({type:"/updateTradeLoadStatus"});
    }
  },
  updateLoadStatus: (key:string) => {
    return async (commit:Dispatch) =>{
      commit({type:"/updateLoadStatus", payload:key});
    }
  }
}

export default {
  namespace: 'app',
  state: getInitialState(),
  reducers,
  actions
}
