
import { Dispatch } from 'redux';
import { CHANGE_LANG } from "./types";
export function changeLang(lang: string) {
    return async (dispatch: Dispatch) => {
        dispatch({ type: CHANGE_LANG, payload: lang });
        return Promise.resolve();
    };
}

