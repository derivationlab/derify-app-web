import * as io from "@/utils/request";
import * as configUtil from '../config'

const serverEndPoint = configUtil.getCurrentServerEndPoint()

const TRADE_LIST_URL = serverEndPoint + "/api/trade_records/"
const FUND_LIST_URL = serverEndPoint + "/api/trader_balance/"
//User bond bDRF turnover breakdown
const TRADER_BOND_BALANCE_URL = serverEndPoint + "/api/trader_bond_balance/"
//User holdings and mining revenue flow details
const TRADER_PMR_BALANCE_URL = serverEndPoint + "/api/trader_pmr_balance/"
//edrf balance
const TRADER_EDRF_BALANCE_URL = serverEndPoint + "/api/trader_edrf_balance/"

const POSITION_MININ_EVENT_URL = serverEndPoint + "/api/position_mining_events/"
const TOKEN_PRICE_EVENT_URL = serverEndPoint + "/api/token_price_events/"

const isNotCallEvent = false;
/**
 *
 * @param trader
 * @param pageNum
 * @param pageSize
 * @returns {Promise<Array<TradeRecord>>}
 */
export async function getTradeList (trader, pageNum = 0, pageSize = 10) {
  const content = await io.get(`/api/trade_records/${trader}/${pageNum}/${pageSize}`)

  if(content) {
    return content.data.records;
  }

  return [];
}

/**
 * mining trade history
 * @param trader
 * @param pageNum
 * @param pageSize
 * @returns {Promise<Array<TradeBalanceDetail>>}
 */
export async function getTradeBalanceDetail (trader, pageNum = 0, pageSize = 10) {
  const content =  await io.get(`/api/trader_balance/${trader}/${pageNum}/${pageSize}`)

  if(content) {
    return content.data.records;
  }

  return [];
}

/**
 *
 * @param trader
 * @param pageNum
 * @param pageSize
 * @returns {Promise<*[]|TraderBondBalance>}
 */
export async function getTraderBondBalance (trader, pageNum = 0, pageSize = 10) {
  const content =  await io.get(`/api/trader_bond_balance/${trader}/${pageNum}/${pageSize}`)
  if(content) {
    return content.data.records;
  }

  return [];
}

/**
 *
 * @param trader
 * @param pageNum
 * @param pageSize
 * @returns {Promise<*[]|TradePMRBalance>}
 */
export async function getTraderPMRBalance (trader, pageNum = 0, pageSize = 10) {
  const content =  await io.get(`/api/trader_pmr_balance/${trader}/${pageNum}/${pageSize}`)
  if(content) {
    return content.data.records;
  }

  return [];
}

/**
 *
 * @param trader
 * @param pageNum
 * @param pageSize
 * @returns {Promise<*[]|TraderEDRFBalance>}
 */
export async function getTraderEDRFBalance (trader, pageNum = 0, pageSize = 10) {
  const content =  await io.get(`/api/trader_edrf_balance/${trader}/${pageNum}/${pageSize}`)
  if(content) {
    return content.data.records;
  }

  return [];
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


  const events = new EventSource(POSITION_MININ_EVENT_URL + tokenAddr);

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

  const events = new EventSource(TOKEN_PRICE_EVENT_URL + tokenKey);

  events.onmessage = (event) => {
    const parsedData = JSON.parse(event.data)
    callback(tokenKey, parsedData)
  }

  return events
}


/**
 * 交易记录
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
