import { Dispatch } from "redux";
import { CHANGE_LANG, BIND_PARTNERS } from "./types";
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
