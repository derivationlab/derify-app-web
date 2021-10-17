import Web3 from 'web3'
import ABIData from './contract'
import BigNumber from 'bignumber.js'
import {TraderAccount, TraderVariable} from "@/utils/types";

window.BigNumber = BigNumber
window.Web3 = Web3;
export class UnitTypeEnum {
  static get USDT() {
    return 0
  }

  static get CurPair() {
    return 1
  }

  static get Percent() {
    return 2
  }
}

export class CancelOrderedPositionTypeEnum {
  static get LimitedOrder() {
    return 0
  }

  static get StopProfitOrder() {
    return 1
  }

  static get StopLossOrder() {
    return 2
  }

  static get AllOrder() {
    return 3
  }

  static get StopProfitAndLossOrder() {
    return 4
  }
}

export class SideEnum {
  static get LONG (){
    return 0;
  }

  static get SHORT (){
    return 1;
  }

  static get HEDGE() {
    return 2
  }
}


/**
 * cancel ordered position type
 */
export class StopTypeEnum {
  static get TakeProfit (){
    return 0;
  }

  static get StopLoss (){
    return 1;
  }

  static get TakeProfitAndStopLoss() {
    return 2
  }
}

/**
 * Bond account types
 */
export class BondAccountType {

  /**
   * 0-DerifyAccount
   * @return {number}
   */
  static get DerifyAccount () {
    return 0
  }

  /**
   * 1-WalletAccount
   * @return {number}
   */
  static get WalletAccount () {
    return 1
  }
}

export class OrderedOperateType {
  type;
  method;
  stopType;
  /**
   * 0-TakeProfit，1-StopLoss
   */
  orderStopType;
  /**
   * 0-TakeProfit，1-StopLoss
   */
  cancleStopType;

  static get SetTakeProfitPrice () {
    return {type: 0, method: 'orderStopPosition', stopType: 0}
  }

  static get SetStopLossPrice () {
    return {type: 1, method: 'orderStopPosition', stopType: 1}
  }

  static get SetTakeProfitAndStopLossPrice () {
    return {type: 2, method: 'orderStopPosition', stopType: 2}
  }

  static get UnSetTakeProfitPrice () {
    return {type: 3, method: 'cancleOrderedStopPosition', stopType: 0}
  }

  static get UnSetStopLossPrice () {
    return {type: 4, method: 'cancleOrderedStopPosition', stopType: 1}
  }

  static get UnSetTakeProfitAndStopLossPrice () {
    return {type: 5, method: 'cancleOrderedStopPosition', stopType: 2}
  }

  static get SetTakeProfitAndUnSetStopLossPrice () {
    return {type: 6, method: 'orderAndCancleStopPosition', orderStopType: 0, cancleStopType: 1}
  }

  static get UnSetTakeProfitAndSetStopLossPrice () {
    return {type: 7, method: 'orderAndCancleStopPosition', orderStopType: 1, cancleStopType: 0}
  }
}

/**
 * Order type
 */
export class OrderTypeEnum {
 static get LimitOrder () {
   return 0
 }
 static get StopProfitOrder () {
   return 1
 }
 static get StopLossOrder () {
   return 2
 }

}

/**
 * Opening price type
 */
export class OpenType {
  static get MarketOrder(){
    return 0
  }

  static get LimitOrder() {
    return 1
  }
}

export const Token = {
  BTC: ABIData.DerifyDerivative.BTC.token,
  ETH: ABIData.DerifyDerivative.ETH.token,
  DUSD: ABIData.DUSD.address,
  bDRF: ABIData.bDRF.address,
  eDRF: ABIData.eDRF.address,
  DRF: ABIData.DRF.address,
  USDT: ABIData.DUSD.address
}


const cache = {gasPrice: 1e9}

export const contractDecimals = 8

export function toContractUnit (number) {
  return toShiftedHexString(number, contractDecimals)
}

export function toShiftedHexString (number, decimals = 0) {
  return "0x" + (new BigNumber(number)).shiftedBy(decimals).toString(16)
}

export function toShiftedString (number, decimals = 0, bit = 2) {
  return (new BigNumber(number)).shiftedBy(decimals).toFixed(bit)
}

export function convertAmount2TokenSize(unit, amount, price) {

  if(unit === UnitTypeEnum.USDT) {
    return fromContractUnit(amount) / fromContractUnit(price)
  }

  return fromContractUnit(amount)
}


export function toHexString (number) {

  if(number === null || number === undefined) {
    return null
  }

  return toShiftedHexString(number)
}

export function toContractNum (number) {
  const num = (new BigNumber(number)).shiftedBy(contractDecimals).toNumber()
  return Math.ceil(num)
}

export function fromContractUnit(unit, bit = -1, rounding = BigNumber.ROUND_HALF_UP) {
  return numConvert(unit, -contractDecimals, bit, rounding)
}

export function numConvert (unit, pow = -contractDecimals, bit = -1, rounding = BigNumber.ROUND_HALF_UP) {
  const number = new BigNumber(unit)
  if(bit < 0) {
    return number.shiftedBy(pow).toNumber()
  }

  return number.shiftedBy(pow).dp(bit, rounding).toNumber()
}

export function stringFromContractUnit (unit, bit = 2) {
  return toShiftedString(unit, -contractDecimals, bit)
}

export function convertTokenNumToContractNum (amount, tokenDecimals) {
  return (new BigNumber(amount)).shiftedBy(tokenDecimals).toNumber()
}


/**
 *
 * @param abi
 * @param address
 * @param option Object, the actual example: {from: '',gasPrice: '20000000000'}
 * @constructor
 */
export default class Contract {

  constructor ({from, broker}) {
    const option = {from}
    const web3 = new Web3(window.ethereum)
//    option.gasPrice = 1e9;

    this.web3 = web3
    this.from = from
    this.broker = broker
    this.option = option;

    this.DerifyRewards = new web3.eth.Contract(ABIData.DerifyRewards.abi, ABIData.DerifyRewards.address, option)
    this.DerifyDerivative = {
      BTC: new web3.eth.Contract(ABIData.DerifyDerivative.abi, ABIData.DerifyDerivative.BTC.address, option),
      ETH: new web3.eth.Contract(ABIData.DerifyDerivative.abi, ABIData.DerifyDerivative.ETH.address, option)
    }

    this.DerifyExchange = new web3.eth.Contract(ABIData.DerifyExchange.abi, ABIData.DerifyExchange.address, option)
    this.DUSD = new web3.eth.Contract(ABIData.DUSD.abi, ABIData.DUSD.address, option)
    this.bDRF = new web3.eth.Contract(ABIData.bDRF.abi, ABIData.bDRF.address, option)
    this.eDRF = new web3.eth.Contract(ABIData.eDRF.abi, ABIData.eDRF.address, option)
    this.DRF = new web3.eth.Contract(ABIData.DRF.abi, ABIData.DRF.address, option)
  }

  updateGasPrice (web3) {
    web3.eth.getGasPrice().then((gasPrice) => {
      if(gasPrice) {
        cache.gasPrice = gasPrice
      }
    })
  }

  /**
   * deposit amount
   * @param amount
   * @return
   */
  deposit (amount) {

    const web3 = this.web3
    const from = this.from
    const tokenContract = this.DUSD

    return new Promise(async (resolve, reject) => {
      const approveRet = await this.__approve(tokenContract, ABIData.DerifyExchange, amount)
      if(approveRet){
        try{
          let depositRes = await  this.DerifyExchange.methods.deposit(amount).send({gasPrice:1e9});
          resolve(depositRes)
        }catch (e) {
          reject(e)
        }
      }else{
        reject('approve failed')
      }
    })
  }
  /**
   * withdraw
   * @param amount
   * @returns {*}
   */
  withdraw (amount) {
    return this.DerifyExchange.methods.withdraw(amount).send({gasPrice:1e9})
  }

  balanceOf (trader, token) {
    return (async () => {

      let tokenAmount = 0
      let decimals = 18
      if(ABIData.DUSD.address === token){
        decimals = await this.DUSD.methods.decimals().call()
        tokenAmount = await this.DUSD.methods.balanceOf(trader).call()
      }else if(ABIData.bDRF.address === token){
        decimals = await this.bDRF.methods.decimals().call()
        tokenAmount = await this.bDRF.methods.balanceOf(trader).call()
      }else if(ABIData.eDRF.address === token){
        decimals = await this.eDRF.methods.decimals().call()
        tokenAmount = await this.eDRF.methods.balanceOf(trader).call()
      }else if(ABIData.DRF.address === token){
        decimals = await this.DRF.methods.decimals().call()
        tokenAmount = await this.DRF.methods.balanceOf(trader).call()
      }

      return convertTokenNumToContractNum(tokenAmount, contractDecimals - decimals)
    })()

  }

  /**
   * Open a position
   * @param token Current contract token address
   * @param side LONG，SHORT，HEDGE
   * @param openType 0-MarketOrder，1-LimitOrder
   * @param size Open position volume (based on currency, precision is 8 digits)
   * @param price Opening price (precision is 8 digits)
   * @param leverage（precision is 8 digits）
   * @return {*}
   */
  openPosition ({token, side, openType, size, price, leverage}) {
    return this.DerifyExchange.methods
      .openPosition(this.broker, token, side, openType, size, price, leverage)
      .send({gasPrice:1e9})
  }
  /**
   * close position
   * @param token Current contract currency address
   * @param side LONG，SHORT，HEDGE
   * @param size size for close position volume (based on currency, precision is 8 digits)
   * @return {*}
   */
  closePosition (token, side, size) {
    return this.DerifyExchange.methods.closePosition(this.broker, token, side, size)
      .send({gasPrice:1e9})
  }

  /**
   * closeAllPositions
   */
  closeAllPositions () {
    return this.DerifyExchange.methods.closeAllPositions(this.broker)
      .send({gasPrice:1e9})
  }


  /**
   * getTraderAccount
   * @param trader
   * @return {Promise<TraderAccount>}
   */
  getTraderAccount (trader) {
    const ret = this.DerifyExchange.methods.getTraderAccount(trader).call();
    return this.__tryWithPromoise(ret, new TraderAccount());
  }
  /**
   * Get the user's maximum open position
   * @param token
   * @param trader
   * @param openType enum OpenType { MarketOrder, LimitOrder }
   * @param price
   * @param leverage
   * @return {{amount:0,size:0}}
   */
  getTraderOpenUpperBound ({token, trader, openType, price, leverage}) {
    const ret = this.DerifyExchange.methods.getTraderOpenUpperBound(token, trader, openType, price, leverage).call()
    return this.__tryWithPromoise(ret, {amount: 0, size: 0});
  }

  /**
   * Get the maximum open position of the system
   * @param token
   * @param side
   * @return {*}
   */
  getSysOpenUpperBound ({token, side}) {
    const ret = this.DerifyExchange.methods.getSysOpenUpperBound(token, side).call();
    return this.__tryWithPromoise(ret, {amount: 0, size: 0});
  }

  /**
   * getSysCloseUpperBound
   * @param token
   * @param side
   * @returns {size:number}
   */
  getSysCloseUpperBound ({token, side}) {
    const ret =  this.DerifyExchange.methods.getSysCloseUpperBound(token, side).call();
    return this.__tryWithPromoise(ret, {size: 0});
  }

  /**
   * Calculate margin, floating profit and loss, rate of return
   * @param trader
   * @param token
   * @param side
   * @param spotPrice
   * @param size
   * @param leverage
   * @param averagePrice
   */
  getTraderPositionVariables ({trader, token, side, spotPrice, size, leverage, averagePrice}) {
    const ret = this.DerifyExchange.methods.getTraderPositionVariables(side, spotPrice, size, leverage, averagePrice).call()
    return this.__tryWithPromoise(ret, {margin:0,unrealizedPnl:0,returnRate:0});
  }
  /**
   * Get user margin information
   * @param trader
   * @return {Promise<TraderVariable>}
   */
  getTraderVariables (trader) {
    const ret = this.DerifyExchange.methods.getTraderVariables(trader).call();
    return this.__tryWithPromoise(ret, new TraderVariable());
  }

  /**
   *
   * @param ret:Promise<T>
   * @param defaultVal:<T>
   * @return {Promise<T>}
   * @private
   */
  __tryWithPromoise(ret, defaultVal){
  return async() => {
      let data = defaultVal;

      try{
        data = await ret;
      }catch (e){
        console.error('__tryWithPromoise', e);
      }

      return data;
    }
  }

  /**
   * Forced liquidation amount
   * @param side
   * @param spotPrice
   * @param size
   * @param marginMaintenanceRatio
   * @param marginBalance
   * @param totalPositionAmount
   * @return {*}
   */
  getTraderPositionLiquidatePrice ({side, spotPrice, size, marginMaintenanceRatio, marginBalance, totalPositionAmount}) {
    const sideRatio = side === SideEnum.SHORT ? -1 : 1;

    return Math.max(0,spotPrice - sideRatio * ((marginBalance - (totalPositionAmount * marginMaintenanceRatio)) / size));
  }

  /**
   * deposit event
   * @param user
   * @param callback
   */
  onDeposit (user, callback) {
    this.DerifyExchange.events.Deposit({user: user}, callback)
  }

  /**
   * withdraw event
   * @param user
   * @param callback
   */
  onWithdraw (user, callback) {
    this.DerifyExchange.events.Withdraw({user: user}, callback)
  }

  /**
   * Obtain contract objects based on currency
   * @param token
   * @return {Web3.eth.Contract}
   */
  __getDerifyDerivativeContract(token) {

    if(ABIData.DerifyDerivative.BTC.token === token){
      return this.DerifyDerivative.BTC
    }

    return this.DerifyDerivative.ETH
  }
  /**
   * Get positions
   * @param trader
   * @param token
   * @return {DerivativePositions}
   */
  getTraderPosition (trader, token) {
    return this.__getDerifyDerivativeContract(token).methods.getTraderDerivativePositions(trader).call()
  }

  /**
   * Set the current price of the currency
   * @param token  token contract address
   * @param price
   * @return {*}
   */
  setSpotPrice (token, price) {
    return this.__getDerifyDerivativeContract(token).methods.setSpotPrice(price).send({gasPrice:1e9})
  }

  /**
   * Get the current price of the token
   * @param token
   * @return {Promise<number>}
   */
  getSpotPrice (token) {
    return this.__getDerifyDerivativeContract(token).methods.getSpotPrice().call()
  }

  /**
   * Set up a stop-profit and stop-loss commission
   * @param token
   * @param trader
   * @param side
   * @param stopLossPrice
   * @param takeProfitPrice
   * @return {*}
   */
  orderStopPosition ({token, trader, side, takeProfitPrice, stopLossPrice}) {


    let operateType = new OrderedOperateType();
    if(takeProfitPrice > 0 && stopLossPrice === 0) {
      operateType = OrderedOperateType.SetTakeProfitPrice
    }else if(takeProfitPrice === 0 && stopLossPrice > 0) {
      operateType = OrderedOperateType.SetStopLossPrice
    }else if(takeProfitPrice > 0 && stopLossPrice > 0){
      operateType = OrderedOperateType.SetTakeProfitAndStopLossPrice
    } else if (takeProfitPrice < 0 && stopLossPrice === 0) {
      operateType = OrderedOperateType.UnSetTakeProfitPrice
    }else if (takeProfitPrice === 0 && stopLossPrice < 0) {
      operateType = OrderedOperateType.UnSetStopLossPrice
    }else if (takeProfitPrice < 0 && stopLossPrice < 0) {
      operateType = OrderedOperateType.UnSetTakeProfitAndStopLossPrice
    }else if (takeProfitPrice > 0 && stopLossPrice < 0) {
      operateType = OrderedOperateType.SetTakeProfitAndUnSetStopLossPrice
    }else if (takeProfitPrice < 0 && stopLossPrice > 0) {
      operateType = OrderedOperateType.UnSetTakeProfitAndSetStopLossPrice
    }

    if(operateType.method === 'orderStopPosition') {
      return this.__getDerifyDerivativeContract(token).methods.orderStopPosition(trader, side, operateType.stopType, takeProfitPrice, stopLossPrice)
        .send({gasPrice:1e9})
    }

    if(operateType.method === 'cancleOrderedStopPosition') {
      return this.__getDerifyDerivativeContract(token).methods.cancleOrderedStopPosition(trader, operateType.stopType, side)
        .send({gasPrice:1e9})
    }

    if(operateType.method === 'orderAndCancleStopPosition') {
      let price = operateType.orderStopType === 0 ? takeProfitPrice : stopLossPrice;
      return this.__getDerifyDerivativeContract(token).methods.orderAndCancleStopPosition(trader, side, operateType.orderStopType, price, operateType.cancleStopType)
        .send({gasPrice:1e9})
    }

    return Promise.resolve(true)
  }

  /**
   * Cancel order
   * @param token
   * @param trader
   * @param stopType {CancelOrderedPositionTypeEnum}
   * @param side
   * @param timestamp
   * @return {*}
   */
  cancleOrderedPosition ({token, trader, closeType, side, timestamp}) {
    if (closeType === CancelOrderedPositionTypeEnum.LimitedOrder) {
      return this.__getDerifyDerivativeContract(token).methods.cancleOrderedLimitPosition(trader, side, timestamp).send({gasPrice:1e9})
    } else {
      //CancelOrderedPositionTypeEnum => StopTypeEnum
      const closeTypeStopTypeMap = {}
      closeTypeStopTypeMap[CancelOrderedPositionTypeEnum.StopLossOrder] = StopTypeEnum.StopLoss
      closeTypeStopTypeMap[CancelOrderedPositionTypeEnum.StopProfitOrder] = StopTypeEnum.TakeProfit
      closeTypeStopTypeMap[CancelOrderedPositionTypeEnum.StopProfitAndLossOrder] = StopTypeEnum.TakeProfitAndStopLoss

      const stopType = closeTypeStopTypeMap[closeType]

      if(stopType === undefined) {
        return async () => {}
      }

      return this.__getDerifyDerivativeContract(token).methods.cancleOrderedStopPosition(trader, stopType, side).send({gasPrice:1e9})
    }

  }
  /**
   * Cancel all orders
   * @return {*}
   */
  cancleAllOrderedPositions () {
    return this.DerifyExchange.methods.cancleAllOrderedPositions().send({gasPrice:1e9})
  }

  /**
   * getPositionChangeFeeRatio
   * @param token
   * @return {*}
   */
  getPositionChangeFeeRatio (token) {
    return this.__getDerifyDerivativeContract(token).methods.getPositionChangeFeeRatio().call()
  }

  /**
   * getTradingFee
   * @param token
   * @param size
   * @param price
   */
  getTradingFee (token, size, price) {
    return this.__getDerifyDerivativeContract(token).methods.getTradingFee(size, price).call()
  }
  getCloseUpperBound ({token, trader, side}) {
    return this.DerifyExchange.methods.getCloseUpperBound(token, trader, side).call()
  }

  /**
   * getPositionChangeFee
   * @param token
   * @param side 0-LONG，1-SHORT，2-HEDGE
   * @param actionType 0-open, 1-close
   * @param size
   * @param price
   */
  async getPositionChangeFee ({token, side, actionType, size, price}) {
    const ratioSum = await this.__getPredictPositionChangeFeeRatioSum(token, side,
      size,
      price,
      actionType)
    return await this.__getDerifyDerivativeContract(token).methods.getPositionChangeFee(side, actionType, size, price, ratioSum).call()
  }

  /**
   * Convertible bond bDRF
   * Transfer from Derify account to wallet account
   * @param amount
   * @return {*}
   */
  withdrawBond (amount) {
    return this.DerifyRewards.methods.withdrawBond(amount).send({gasPrice:1e9});
  }

  /**
   * Convertible bond bDRF
   * Transfer from Derify account balance or wallet account balance to USDT to wallet account
   * @param amount
   * @param bondAccountType 0-DerifyAccount, 1-WalletAccount
   * @return {*}
   */
  exchangeBond ({amount, bondAccountType}) {

    return new Promise((resolve, reject) => {
      (async () => {
        try{
          let approveRet = false

          if(bondAccountType === BondAccountType.WalletAccount) {
            approveRet = await this.__approve(this.bDRF, ABIData.DerifyRewards, amount)
          }else{
            approveRet = true
          }

          if(approveRet){
            resolve(await this.DerifyRewards.methods.exchangeBond(amount, bondAccountType).send({gasPrice:1e9}))
          }else{
            reject('approve failed')
          }
        }catch (e){
          reject(e)
        }
      })()
    })
  }

  /**
   * Income plan deposit
   * deposit f rom Derify account balance or wallet account balance
   * @param amount
   * @param bondAccountType
   * @return {*}
   */
  depositBondToBank ({amount,bondAccountType}) {
    return new Promise((resolve, reject) => {
      (async () => {
        try{
          let approveRet = false

          if(bondAccountType === BondAccountType.WalletAccount) {
            approveRet = await this.__approve(this.bDRF, ABIData.DerifyRewards, amount)
          }else{
            approveRet = true
          }

          if(approveRet){
            resolve(await this.DerifyRewards.methods.depositBondToBank(amount, bondAccountType).send({gasPrice:1e9}))
          }else{
            reject('approve failed')
          }
        }catch (e) {
          reject('approve failed')
        }

      })()
    })
  }

  async __approve(tokenContract, contractABI, amount) {
    try {

      let decimals = await tokenContract.methods.decimals().call();

      const decimalNum = parseInt(decimals)

      const approveNum = toShiftedHexString(amount, decimalNum - contractDecimals);

      //The wallet obtains the authorized amount
      return await tokenContract.methods.approve(contractABI.address, approveNum).send({gasPrice:1e9})
    } catch (e) {
      console.error(`__approve exception`, e)
      return false
    }
  }

  /**
   * Income plan redemption
   * redemption，from "Income plan deposit" to your Derify account balance or wallet account balance
   * @param amount
   * @param bondAccountType
   * @return {*}
   */
  redeemBondFromBank ({amount, bondAccountType }) {
    return this.DerifyRewards.methods.redeemBondFromBank(amount, bondAccountType).send({gasPrice:1e9});
  }

  /**
   * Get the user's "convertible bond bDRF" balance, "income plan deposit" balance
   * , "convertible bond bDRF" wallet account balance, bond annualized yield
   * @param trader
   * @return {BondInfo}
   */
  getBondInfo (trader) {
    return this.DerifyRewards.methods.getBondInfo(trader).call();
  }

  /**
   * Get the upper limit of the user's "redeemable" bDRF. "Convertible bond bDRF"=>Exchange=>Convertible upper limit
   * @param trader User account address
   * @param bondAccountType，0-DerifyAccount, 1-WalletAccount
   * @return {int} bDRF exchangeable maximum（The precision is 8 bits）
   */
  getExchangeBondSizeUpperBound ({trader, bondAccountType}) {
    return this.DerifyRewards.methods.getExchangeBondSizeUpperBound(trader, bondAccountType).call();
  }

  /**
   * withdrawPMReward
   * @param amount
   * @return {*}
   */
  withdrawPMReward (amount) {
    return this.DerifyRewards.methods.withdrawPMReward(amount).send({gasPrice:1e9});
  }

  /**
   * Obtain user's holding mining income
   * @param trader wallet address
   * @return {Promise<int>} （The precision is 8 bits）
   */
  getPMReward (trader) {
    return this.DerifyRewards.methods.getPMReward(trader).call();
  }

  /**
   * get broker chain data
   * @param trader
   * @return {Promise<{rewardBalance:  BigInt, accumulatedReward: BigInt, validPeriodInDay: BigInt}>}
   */
  getBrokerInfo(trader) {
    return this.DerifyRewards.methods.getBrokerInfo(trader).call();
  }

  /**
   * apply to be broker
   * @param accountType {BondAccountType}
   * @param amount apply data
   * @return {Promise<*>}
   */
  applyBroker(accountType,amount = toContractUnit(60000)) {
    const tokenContract = this.eDRF
    return new Promise(async (resolve, reject) => {

      let approveRet = false;
      if(accountType === BondAccountType.WalletAccount) {
        approveRet = await this.__approve(tokenContract, ABIData.DerifyRewards, amount)
      }else{
        approveRet = true;
      }


      if(approveRet){
        try{
          await this.DerifyRewards.methods.applyBroker(accountType).send({gasPrice:1e9})
          resolve(true)
        }catch (e) {
          reject(e)
        }
      }else{
        reject('approve failed')
      }
    })
  }

  /**
   * burn eDRF
   * @param accountType
   * @param amount
   */
  burnEdrfExtendValidPeriod(accountType, amount) {
    const tokenContract = this.eDRF
    return new Promise(async (resolve, reject) => {

      let approveRet = false;
      if(accountType === BondAccountType.WalletAccount) {
        approveRet = await this.__approve(tokenContract, ABIData.DerifyRewards, amount)
      }else{
        approveRet = true;
      }

      if(approveRet){
        try{
          await this.DerifyRewards.methods.burnEdrfExtendValidPeriod(accountType, amount).send({type: '0x2'})
          resolve(true)
        }catch (e) {
          reject(e)
        }
      }else{
        reject('approve failed')
      }
    })
  }

  /**
   * width draw edrf
   * @param amount
   */
  withdrawBrokerReward(amount) {
    return this.DerifyRewards.methods.withdrawBrokerReward(amount).send({gasPrice:1e9})
  }

  /**
   * get Staking Info
   * @param trader
   * @return {Promise<{drfBalance: BigInt, edrfBalance: BigInt}>}
   */
  getStakingInfo(trader) {
    return this.DerifyRewards.methods.getStakingInfo(trader).call()
  }

  /**
   * withdraw edrf
   * @param amount
   * @return {Promise}
   */
  withdrawEdrf(amount) {
    return this.DerifyRewards.methods.withdrawEdrf(amount).send({gasPrice:1e9})
  }

  /**
   * staking drf
   * @param amount
   * @return {Promise<unknown>}
   */
  stakingDrf(amount) {
    const tokenContract = this.DRF
    return new Promise(async (resolve, reject) => {
      const approveRet = await this.__approve(tokenContract, ABIData.DerifyRewards, amount)
      if(approveRet){
        try{
          await this.DerifyRewards.methods.stakingDrf(amount).send({gasPrice:1e9})
          resolve(true)
        }catch (e) {
          reject(e)
        }
      }else{
        reject('approve failed')
      }
    })
  }

  /**
   * redeem drf
   * @param amount
   * @return {*}
   */
  redeemDrf(amount) {
    return this.DerifyRewards.methods.redeemDrf(amount).send({gasPrice:1e9})
  }

  /**
   * get All positions
   * @param trader
   * @param token
   * @return {PositionDataView}
   */
  async getTraderAllPosition (trader, token) {

    const positionDataView = new PositionDataView()

    //1.getTraderPosition
    const positions = []
    let derivativePosition = new DerivativePositions();
    derivativePosition = await this.getTraderPosition(trader, token)

    const tradeVariables = await this.__getTraderVariablesWithCache(trader)

    //1.1 long position
    if(derivativePosition.long && derivativePosition.long.leverage > 0
      && derivativePosition.long.size > 0){
      const longPositionView = await this.__convertPositionToPositionView(trader, token, SideEnum.LONG
        , derivativePosition.long, derivativePosition.longOrderStopProfitPosition, derivativePosition.longOrderStopLossPosition, tradeVariables);
      positions.push(longPositionView)
    }


    //1.2 short position
    if(derivativePosition.short
      && derivativePosition.short.leverage > 0
      && derivativePosition.short.size > 0){
      const shortPositionView = await this.__convertPositionToPositionView(trader, token, SideEnum.SHORT
        , derivativePosition.short, derivativePosition.shortOrderStopProfitPosition, derivativePosition.shortOrderStopLossPosition, tradeVariables);
      positions.push(shortPositionView)
    }

    positionDataView.positions = positions

    //2.my order position
    const limitOrders = []
    //2.1 long position
    const limitLongOrders = derivativePosition.longOrderOpenPosition
    for(const limitOrder of limitLongOrders){
      if(!limitOrder.isUsed) {
        continue
      }
      const limitLongOrderView = new OrderLimitPositionView()
      limitLongOrderView.side = SideEnum.LONG
      limitLongOrderView.token = token
      limitLongOrderView.orderType = OrderTypeEnum.LimitOrder
      if(!derivativePosition.longOrderStopProfitPosition){
        limitLongOrderView.stopProfitPrice = derivativePosition.longOrderStopProfitPosition.stopProfitPrice
      }

      if(!derivativePosition.longOrderStopLossPosition) {
        limitLongOrderView.stopLossPrice = derivativePosition.longOrderStopLossPosition.stopLossPrice
      }

      Object.assign(limitLongOrderView, limitOrder)
      limitOrders.push(limitLongOrderView)
    }

    //2.2 short position
    const limitShortOrders = derivativePosition.shortOrderOpenPosition

    for(const limitOrder of limitShortOrders){
      if(!limitOrder.isUsed) {
        continue
      }

      const limitShortOrderView = new OrderLimitPositionView()
      limitShortOrderView.side = SideEnum.SHORT
      limitShortOrderView.token = token
      limitShortOrderView.orderType = OrderTypeEnum.LimitOrder
      if(!derivativePosition.shortOrderStopProfitPosition){
        limitShortOrderView.stopProfitPrice = derivativePosition.shortOrderStopProfitPosition.stopProfitPrice
      }

      if(!derivativePosition.shortOrderStopProfitPosition) {
        limitShortOrderView.stopLossPrice = derivativePosition.shortOrderStopProfitPosition.stopLossPrice
      }

      Object.assign(limitShortOrderView, limitOrder)
      limitOrders.push(limitShortOrderView)
    }

    positionDataView.orderPositions = limitOrders

    positionDataView.stopOrderPoistions = []

    if(derivativePosition.shortOrderStopLossPosition.isUsed){
      positionDataView.orderPositions.push({side: SideEnum.SHORT,
        token,
        size: derivativePosition.short.size,
        leverage: derivativePosition.short.leverage,
        orderType: OrderTypeEnum.StopLossOrder,
        stopPrice: derivativePosition.shortOrderStopLossPosition.stopPrice,
        timestamp: derivativePosition.shortOrderStopLossPosition.timestamp,
        isUsed: derivativePosition.shortOrderStopLossPosition.isUsed});
    }


    if(derivativePosition.shortOrderStopProfitPosition.isUsed){
      positionDataView.orderPositions.push({side: SideEnum.SHORT, token,
        orderType: OrderTypeEnum.StopProfitOrder,
        size: derivativePosition.short.size,
        leverage: derivativePosition.short.leverage,
        stopPrice: derivativePosition.shortOrderStopProfitPosition.stopPrice,
        timestamp: derivativePosition.shortOrderStopProfitPosition.timestamp,
        isUsed: derivativePosition.shortOrderStopProfitPosition.isUsed});
    }


    if(derivativePosition.longOrderStopLossPosition.isUsed) {
      positionDataView.orderPositions.push({side: SideEnum.LONG, token,
        orderType: OrderTypeEnum.StopLossOrder,
        size: derivativePosition.long.size,
        leverage: derivativePosition.long.leverage,
        stopPrice: derivativePosition.longOrderStopLossPosition.stopPrice,
        timestamp: derivativePosition.longOrderStopLossPosition.timestamp,
        isUsed: derivativePosition.longOrderStopLossPosition.isUsed});
    }


    if(derivativePosition.longOrderStopProfitPosition.isUsed) {
      positionDataView.orderPositions.push({side: SideEnum.LONG, token,
        orderType: OrderTypeEnum.StopProfitOrder,
        size: derivativePosition.long.size,
        leverage: derivativePosition.long.leverage,
        stopPrice: derivativePosition.longOrderStopProfitPosition.stopPrice,
        timestamp: derivativePosition.longOrderStopProfitPosition.timestamp,
        isUsed: derivativePosition.longOrderStopProfitPosition.isUsed});
    }

    return positionDataView
  }

  /**
   * build PositionToPositionView
   * @param trader
   * @param token
   * @param side {SideEnum}
   * @param positionDO {Position}
   * @param stopProfitPosition {StopPosition}
   * @param stopLossPosition {StopPosition}
   * @param tradeVariables
   * @private
   */
  async __convertPositionToPositionView (trader, token, side, positionDO, stopProfitPosition, stopLossPosition, tradeVariables) {
    const position = new PositionView()

    position.token = token
    position.side = side
    position.isUsed = positionDO.isUsed
    position.size = positionDO.size
    position.leverage = positionDO.leverage
    position.averagePrice = positionDO.price
    position.timestamp = positionDO.timestamp
    position.stopLossPrice = stopLossPosition.stopPrice
    position.stopProfitPrice = stopProfitPosition.stopPrice
    position.spotPrice = await this.getSpotPrice(token)

    // 3.Get floating profit and loss, position margin, rate of return
    const params = {trader:trader,
      token: token,
      side:  side,
      spotPrice: position.spotPrice,
      size:  position.size,
      leverage: Math.max(position.leverage, 1),
      averagePrice: position.averagePrice
    }

    const variables = await this.getTraderPositionVariables(params)
    const marginMaintenanceRatio = await this.DerifyExchange.methods.marginMaintenanceRatio().call();

    position.margin = variables.margin
    position.unrealizedPnl = variables.unrealizedPnl
    position.returnRate = variables.returnRate

    //4.Get trader parameters
    position.marginBalance = tradeVariables.marginBalance
    position.totalPositionAmount = tradeVariables.totalPositionAmount
    position.marginRate = tradeVariables.marginRate


    const liquidPriceParam = {
      side: position.side,
      spotPrice: fromContractUnit(position.spotPrice),
      size: fromContractUnit(position.size),
      marginMaintenanceRatio:  fromContractUnit(marginMaintenanceRatio),
      marginBalance: fromContractUnit(position.marginBalance),
      totalPositionAmount: fromContractUnit(position.totalPositionAmount)
    }
    position.liquidatePrice = toContractNum(this.getTraderPositionLiquidatePrice(liquidPriceParam));


    return position
  }

  async __getTraderVariablesWithCache (trader) {
    if(cache[trader] !== undefined){
      return cache[trader]
    }

    return this.getTraderVariables(trader)
  }

  /**
   * getPredictPositionChangeFeeRatioSum
   * @param token
   * @param side
   * @param size
   * @param price
   * @param actionType 0 open, 1 close
   * @returns {Promise<int>}
   */
  async __getPredictPositionChangeFeeRatioSum(token,
    side,
    size,
    price,
    actionType
  ) {

    if(side === SideEnum.HEDGE) {
      return 0
    }

    const ratioBefore = await this.getPositionChangeFeeRatio(token)
    const kRatio = await this.__getDerifyDerivativeContract(token).methods.kRatio().call();
    const gRatio = await this.__getDerifyDerivativeContract(token).methods.gRatio().call();

    const amounts = await this.__getDerifyDerivativeContract(token).methods.getSideTotalAmount().call();

    const {longTotalAmount, shortTotalAmount}  = amounts;

    // system data from DerifyExchange
    const sysTotalPositionAmount = await this.DerifyExchange.methods.getSysTotalPositionAmount().call();

    let amount = size * price;
    let diffAmountAfter = 0;
    let sysTotalPositionAmountAfter = 0;
    // open position

    if ((actionType === 0  && side === SideEnum.SHORT) || (actionType === 1 && side === SideEnum.LONG)) {
      amount = -amount
    }

    sysTotalPositionAmountAfter = sysTotalPositionAmount * 1.0 + amount;
    diffAmountAfter = longTotalAmount * 1.0 + amount - shortTotalAmount * 1.0;

    let ratioAfter = 0;
    if (sysTotalPositionAmountAfter > 0) {
      if (sysTotalPositionAmountAfter * kRatio > gRatio) {
        ratioAfter = diffAmountAfter / gRatio;
      } else {
        ratioAfter = diffAmountAfter / (sysTotalPositionAmountAfter * kRatio);
      }
    }

    return Math.ceil(ratioBefore * 1.0 + ratioAfter);
  }
}

const SOLIDITY_RATIO = 1e8

export class PositionView {
  tx;

  isUsed;
  /**
   * token
   */
  token;

  /**
   * @see {SideEnum}
   */
  side;

  size;

  leverage;

  averagePrice;

  timestamp;

  unrealizedPnl;

  returnRate;

  spotPrice;

  margin;

  marginRate;

  marginBalance;

  totalPositionAmount;

  stopProfitPrice;

  stopLossPrice;

  liquidatePrice;
}

export class LimitPoistion {
  tx;
  size;


  price;


  leverage;

  timestamp;
}

export class OrderLimitPositionView {
  tx;
  isUsed;

  /**
   * token
   */
  token;

  /**
   * @see {OrderTypeEnum}
   */
  orderType;

  /**
   * @see {SideEnum}
   */
  side;

  /**
   * stopProfitPrice（precision is 8 digits）
   */
  stopProfitPrice;

  //precision is 8 digits
  stopLossPrice;

  //时间戳
  stopTimestamp;

  /**
   *
   *@return {LimitPoistion[]}
   */
  limitOrders;
}


export class PositionDataView {
  tx;
  /**
   * @return {PositionView[]}
   */
  positions;

  /**
   * @return {OrderLimitPositionView[]}
   */
  orderPositions;

  /**
   * @return {OrderStopPoistionView[]}
   */
  stopOrderPoistions;
}

export class OrderStopPoistionView {
  tx;

  /**
   * @return {boolean}
   */
  isUsed;

  /**
   * @return {SideEnum}
   */
  side;

  /**
   * @return {OrderTypeEnum}
   */
  orderType;

  /**
   * @return {int}
   */
  stopPrice;

  /**
   * @return {long}
   */
  timestamp;
}


export class BondInfo {
  tx;
  /**
   * The precision is 8 bits
   */
  bondBalance;

  /**
   * The precision is 8 bits
   */
  bondReturnBalance;

  /**
   * The precision is 8 bits
   */
  bondWalletBalance;

  /**
   * The precision is 8 bits
   */
  bondAnnualInterestRatio;
}

export class DerivativePositions {
  tx;
  /**
   * boolean
   */
  isUsed;
  /**
   * @return {Position}
   */
  long;
  /**
   * @return {Position}
   */
  short;
  /**
   * @return {Position}
   */
  longOrderOpenPosition;
  /**
   * @return {Position[]}
   */
  shortOrderOpenPosition;
  /**
   * @return {StopPosition}
   */
  longOrderStopProfitPosition;
  /**
   * @return {StopPosition}
   */
  longOrderStopLossPosition;
  /**
   * @return {StopPosition}
   */
  shortOrderStopProfitPosition;
  /**
   * @return {StopPosition}
   */
  shortOrderStopLossPosition;
}

export class Position {
  /**
   * bool
   */
  isUsed;
  /**
   * uint256
   */
  size;
  /**
   * uint256
   */
  price;
  /**
   * uint256
   */
  leverage;

  /**
   * uint256
   */
  timestamp;
}


export class StopPosition {
  /**
   * {bool}
   */
  isUsed;
  /**
   * {int}
   */
  stopPrice;

  /**
   * {int}
   */
  timestamp;
}


window.Contract = Contract
