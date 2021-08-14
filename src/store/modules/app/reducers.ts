import update from "react-addons-update";
import { createReducer } from "redux-create-reducer";

import { CHANGE_LANG, BIND_PARTNERS } from "./types";

export interface AppState {
  locale: "en" | "zh-CN";
  isBindPartners: boolean;
}
const getInitialState: () => AppState = () => {
  return {
    locale: "zh-CN",
    isBindPartners: false,
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
});
