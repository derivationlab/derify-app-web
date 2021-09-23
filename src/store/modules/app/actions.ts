import { Dispatch } from "redux";
import {CHANGE_LANG, BIND_PARTNERS, TRANSFER_SHOW, UPDATE_APP_STATE} from "./types";
import {TransferOperateType} from "@/utils/types";
import {bindBroker, getBrokerByBrokerId} from "@/api/broker";
export function changeLang(lang: string) {
  return async (dispatch: Dispatch) => {
    dispatch({ type: CHANGE_LANG, payload: lang });
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
