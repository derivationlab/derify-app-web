import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunkMiddleware from "redux-thunk";
import appReducer, { AppState } from "./modules/app/reducers";

export interface RootStore {
  app: AppState
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
  app:appReducer,
};

const store = createStore(
  combineReducers(rootStote),
  composeEnhancers(applyMiddleware(...middlewares))
);

export default store;
