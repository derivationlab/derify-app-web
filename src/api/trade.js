import * as io from "@/utils/request";
import * as configUtil from '../config'
import {Pagenation} from "@/api/types";

const isNotCallEvent = false;
/**
 *
 * @param trader
 * @param pageNum
 * @param pageSize
 * @returns {Promise<Pagenation<TradeRecord>>}
 */
export async function getTradeList (trader, pageNum = 1, pageSize = 10) {
  const content = await io.get(`/api/trade_records/${trader}/${pageNum - 1}/${pageSize}`)

  let pagenation = new Pagenation();

  pagenation.current = pageNum;
  pagenation.pageSize = pageSize;
  pagenation.records = [];
  pagenation.totalPage = 0;
  if(content && content.data) {
    pagenation.records = content.data.records;
    pagenation.totalItems = content.data.totalItems;
    pagenation.totalPage = content.data.totalPages;
    return pagenation;
  }

  return pagenation;
}

/**
 * mining trade history
 * @param trader
 * @param pageNum
 * @param pageSize
 * @returns {Promise<Pagenation<TradeBalanceDetail>>}
 */
export async function getTradeBalanceDetail (trader, pageNum = 1, pageSize = 10) {
  const content =  await io.get(`/api/trader_balance/${trader}/${pageNum - 1}/${pageSize}`)

  let pagenation = new Pagenation();

  pagenation.current = pageNum;
  pagenation.pageSize = pageSize;
  pagenation.records = [];
  pagenation.totalPage = 0;
  if(content && content.data) {
    pagenation.records = content.data.records;
    pagenation.totalItems = content.data.totalItems;
    pagenation.totalPage = content.data.totalPages;
    return pagenation;
  }

  return pagenation;
}

/**
 *
 * @param trader
 * @param pageNum
 * @param pageSize
 * @returns {Promise<Pagenation<TraderBondBalance>>}
 */
export async function getTraderBondBalance (trader, pageNum = 1, pageSize = 10) {
  const content =  await io.get(`/api/trader_bond_balance/${trader}/${pageNum - 1}/${pageSize}`)

  let pagenation = new Pagenation();

  pagenation.current = pageNum;
  pagenation.pageSize = pageSize;
  pagenation.records = [];
  pagenation.totalPage = 0;
  if(content && content.data) {
    pagenation.records = content.data.records;
    pagenation.totalItems = content.data.totalItems;
    pagenation.totalPage = content.data.totalPages;
    return pagenation;
  }

  return pagenation;
}

/**
 *
 * @param trader
 * @param amount
 * @return {Promise<{code:number, msg:string}>}
 */
export async function sendUSDT (trader, amount) {
  const content =  await io.post(`/api/send_usdt`, {trader, amount});

  return content;

}

/**
 *
 * @param trader
 * @param amount
 * @return {Promise<boolean>}
 */
export async function isUSDTClaimed (trader) {
  const content =  await io.get(`/api/is_usdt_claimed/${trader}`);

  if(content.data){
    return content.data;
  }

  return false;

}

/**
 *
 * @param trader
 * @param pageNum
 * @param pageSize
 * @returns {Promise<Pagenation<TradePMRBalance>>}
 */
export async function getTraderPMRBalance (trader, pageNum = 1, pageSize = 10) {
  const content =  await io.get(`/api/trader_pmr_balance/${trader}/${pageNum - 1}/${pageSize}`)

  let pagenation = new Pagenation();

  pagenation.current = pageNum;
  pagenation.pageSize = pageSize;
  pagenation.records = [];
  pagenation.totalPage = 0;
  if(content && content.data) {
    pagenation.records = content.data.records;
    pagenation.totalItems = content.data.totalItems;
    pagenation.totalPage = content.data.totalPages;
    return pagenation;
  }

  return pagenation;
}

/**
 *
 * @param trader
 * @param pageNum
 * @param pageSize
 * @returns {Promise<Pagenation<TraderEDRFBalance>>}
 */
export async function getTraderEDRFBalance (trader, pageNum = 1, pageSize = 10) {
  const content =  await io.get(`/api/trader_edrf_balance/${trader}/${pageNum-1}/${pageSize}`)

  let pagenation = new Pagenation();

  pagenation.current = pageNum;
  pagenation.pageSize = pageSize;
  pagenation.records = [];
  pagenation.totalPage = 0;
  if(content && content.data) {
    pagenation.records = content.data.records;
    pagenation.totalItems = content.data.totalItems;
    pagenation.totalPage = content.data.totalPages;
    return pagenation;
  }

  return pagenation;
}
const eventDataKey = 'eventData';
/**
 * get event data
 * @param callback {(data:{
          "token": string,
          "price_change_rate": number,
          "longPmrRate":number,
          "shortPmrRate":number
        }[]) => void}
 */
export function createDataEvenet (callback){
  if(isNotCallEvent){
    return null
  }

  getEventData(callback);

  const serverEndPoint = configUtil.getCurrentServerEndPoint();
  const events = new EventSource(`${serverEndPoint}/api/events_data/`);

  events.onmessage = (event) => {
    const parsedData = JSON.parse(event.data)
    window.localStorage.setItem(eventDataKey, event.data);
    callback(parsedData)
  }

  return events
}

/** get event data
 * @param callback {(data:{
  "token": string,
  "price_change_rate": number,
  "longPmrRate":number,
  "shortPmrRate":number
}[]) => void}
 */
export function getEventData(callback){
  const localData = window.localStorage.getItem(eventDataKey);
  if(localData){
    callback(JSON.parse(localData))
  }
}

/**
 * Get mining profitability
 * @param tokenAddr
 * @param callback param PositionMiningRate
 */
export function createTokenMiningFeeEvenet (tokenAddr, callback){
  if(isNotCallEvent){
    return null
  }

  const serverEndPoint = configUtil.getCurrentServerEndPoint();

  const events = new EventSource(`${serverEndPoint}/api/position_mining_events/${tokenAddr}`);

  events.onmessage = (event) => {
    const parsedData = JSON.parse(event.data)
    callback(tokenAddr, parsedData)
  }

  return events
}

/**
 * Get token increase
 * @param tokenKey
 * @param callback tokenKey
 * @return {EventSource}
 */
export function createTokenPriceChangeEvenet (tokenKey, callback){
  if(isNotCallEvent){
    return null
  }
  const serverEndPoint = configUtil.getCurrentServerEndPoint();

  const events = new EventSource(`${serverEndPoint}/api/token_price_events/tokenKey`);

  events.onmessage = (event) => {
    const parsedData = JSON.parse(event.data)
    callback(tokenKey, parsedData)
  }

  return events
}

export function updateTraderAccess(trader){
  return io.post('/api/trader_info_updates',{trader});
}


/**
 * trade record domain
 */
export class TradeRecord {
  id;// uuid
  tx;// Smart contract events transactionHash
  user;// User account address
  token;// Transaction pair currency address
  /*
    0-MarketPriceTrade
    1-HedgeMarketPriceTrade
    2-LimitPriceTrade
    3-StopProfitStopLossTrade
    4-AutoDeleveragingTrade
    5-MandatoryLiquidationTrade
  */
  type;
  side; // 0-LONG，1-SHORT
  size; // The number of transactions
  price; // deal price
  amount; // Transaction amount (transaction price*transaction quantity)
  trading_fee;
  position_change_fee;
  pnl_usdt; //Profit and loss (unit: USDT)
  pnl_bond //Apportioned compensation（unit:bDRF）
  event_time;// Smart contract event time（UTC）
  update_time;// Update the back-end database time（UTC）
}

export class TradeBalanceDetail {
  id;// uuid
  tx;// Smart contract events transactionHash
  user;// User account address
  amount;// The value of each in and out, the in is positive, and the out is negative
  balance;// Balance after change
  /*
    0-TradingFee
    1-PositionChangeFee
    2-ProfitAndLoss, Profit and loss (judging profit/loss according to the positive and negative amount)
    3-ProfitAndLossAuto,Profit and loss (profit and loss during automatic deduction and forced liquidation)
    4-GasFee
    5-Liquidation
    6-SysCompensation
    7-SysLossApportionment
    100-Deposit
    101-Withdraw
  */
  fee_type;
  event_time;// Smart contract event time（UTC）
  update_time;// Update the back-end database time（UTC）
}


export class PositionMiningRate {
  /**
   * The multi-directional position mining return rate for this trading pair
   * (a small value, the front end needs to be displayed in percentage *100)
   */
  longPmrRate;
  /**
   * The mining profit rate of the position in the short-selling direction of
   * the trading pair (a decimal value, the front end needs to be displayed as a percentage *100)
   */
  shortPmrRate;
}

/**
 * bDRF balance history
 */
export class TraderBondBalance {
  id;//uuid
  tx;//contract transactionHash
  user;//trader address
  amount;//
  balance;//amout after changed
  /**
   0-Income
   1-Withdraw
   2-Exchange
   3-TransferFromBank
   4-TransferToBank
   5-Interest
   */
  bond_update_type;
  event_time;//contract event time（UTC）
  update_time;//db update time（UTC）
}

/**
 * EDRF trade history
 */
export class TraderEDRFBalance {
  id;//uuid
  tx;//contract transactionHash
  user;//trader address
  amount;//
  balance;//amout after changed
  /**
   0-Income
   1-Withdraw
   6-Burn
   */
  update_type;
  event_time;//contract event time（UTC）
  update_time;//db update time（UTC）
}

/**
 * Position income details
 */
export class TradePMRBalance {
  id; //uuid
  tx;// contract transactionHash
  user;// user account address
  amount;
  balance;
  /**
   0-Income
   1-Withdraw
   */
  pmr_update_type;

  event_time;//contract event time（UTC）

  update_time;//db update time（UTC）
}

window.axios = io
