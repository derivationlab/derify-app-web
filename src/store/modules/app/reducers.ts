
import update from "react-addons-update";
import { createReducer } from "redux-create-reducer";

import { CHANGE_LANG } from "./types";

interface AppState {
    locale: 'en' | 'zh-CN'
}
const getInitialState: () => AppState = () => {
    return {
        locale: 'zh-CN',
    };
};

export default createReducer(getInitialState(), {
    [CHANGE_LANG](state, { payload }) {
        return update(state, {
            locale: { $set: payload },
        });
    }
});
