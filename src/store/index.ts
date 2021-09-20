import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers, Dispatch,
} from "redux";

import thunkMiddleware from "redux-thunk";
import appReducer, { AppState } from "./modules/app/reducers";

import UserModel,{UserState} from "./modules/user";
import BrokerModel,{BrokerState} from "./modules/broker";

import ContractModel,{ContractState} from "@/store/modules/contract";
export interface RootStore {
  app: AppState
  user: UserState
  contract: ContractState
  broker: BrokerState
}

const composeEnhancers =
  typeof window === "object" &&
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const middlewares = [thunkMiddleware];

if (process.env.NODE_ENV === "development") {
  middlewares.push(require("redux-logger").createLogger());
}

const rootStote  = {
  app: appReducer,
  user: UserModel.reducers,
  contract: ContractModel.reducers,
  broker: BrokerModel.reducers
};

const store = createStore(
  combineReducers(rootStote),
  composeEnhancers(applyMiddleware(...middlewares))
);

export {
  ContractModel,UserModel,BrokerModel
}

export default store;
