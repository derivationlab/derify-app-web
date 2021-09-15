import { Dispatch } from "redux";
import {CHANGE_LANG, BIND_PARTNERS, TRANSFER_SHOW, UPDATE_APP_STATE} from "./types";
import {TransferOperateType} from "@/utils/types";
export function changeLang(lang: string) {
  return async (dispatch: Dispatch) => {
    dispatch({ type: CHANGE_LANG, payload: lang });
    return Promise.resolve();
  };
}

export function bindPartners(isBind: boolean) {
  return async (dispatch: Dispatch) => {
    dispatch({ type: BIND_PARTNERS, payload: isBind });
    return Promise.resolve();
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
