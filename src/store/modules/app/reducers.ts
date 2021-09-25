import update from "react-addons-update";
import { createReducer } from "redux-create-reducer";

import {CHANGE_LANG, BIND_PARTNERS, TRANSFER_SHOW, UPDATE_APP_STATE, TRIGGER_EVENT} from "./types";
import {TransferOperateType} from "@/utils/types";

export declare type DerifyEvent = {name: string, args:any[]};
export interface AppState {
  locale: "en" | "zh-CN";
  isBindPartners: boolean;
  transferShow: boolean;
  fundsDetailShow: boolean;
  operateType: TransferOperateType;
  tiggerEvents: {[key:string]:DerifyEvent[]};
}

const getInitialState: () => AppState = () => {

  return {
    locale: window.localStorage.getItem("lang") === "zh-CN" ? "zh-CN" : "en",
    isBindPartners: false,
    transferShow: false,
    fundsDetailShow: false,
    operateType: TransferOperateType.withdraw,
    tiggerEvents:{}
  };
};

export default createReducer(getInitialState(), {
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
});
