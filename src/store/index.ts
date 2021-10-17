import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers, Dispatch,
} from "redux";

import thunkMiddleware from "redux-thunk";
import AppModel, { AppState } from "./modules/app";

import UserModel,{UserState} from "./modules/user";
import BrokerModel,{BrokerState} from "./modules/broker";
import DataModel,{DataState} from "./modules/data";
import RewardModel,{RewardState} from "./modules/reward";

import ContractModel,{ContractState} from "@/store/modules/contract";
import {getCurrentEnv} from "@/config";
export interface RootStore {
  app: AppState
  user: UserState
  contract: ContractState
  broker: BrokerState,
  data: DataState,
  reward: RewardState
}

const composeEnhancers =
  typeof window === "object" &&
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const middlewares = [thunkMiddleware];

if (getCurrentEnv() === "development") {
  middlewares.push(require("redux-logger").createLogger());
}

const rootStore  = {
  app: AppModel.reducers,
  user: UserModel.reducers,
  contract: ContractModel.reducers,
  broker: BrokerModel.reducers,
  reward: RewardModel.reducers
};

const store = createStore(
  combineReducers(rootStore),
  composeEnhancers(applyMiddleware(...middlewares))
);

export {
  AppModel,ContractModel,UserModel,BrokerModel,DataModel,RewardModel
}

export default store;
