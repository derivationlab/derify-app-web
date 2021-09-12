import * as io from '@/utils/request'
import * as configUtil from '../config'

/**
 * get history trading data
 * @param token
 * @param days
 * @return {Promise<[{trading_fee: number, day_time: string, trading_amount: number}]>}
 */
export async function getHistoryTradingData(token, days=30) {
  const content =  await io.get(`/api/history_trading_amount/${token}/${days}`)
  if(content && content.data) {
    content.data.reverse()
    content.data.forEach((item) => {
      item.day_time = (new Date(item.day_time)).Format('MM-dd')
    })

    return content.data;
  }

  return [{trading_amount: 0, trading_fee: 0, day_time: ''}];
}

/**
 * get current held position data
 * @param token
 * @return {Promise<{long_position_amount: number, short_position_amount: number}>}
 */
export async function getCurrentPositionData(token) {
  const content =  await io.get(`/api/current_positions_amount/${token}`)
  if(content && content.data) {

    return content.data;
  }

  return {long_position_amount: 0, short_position_amount: 0};
}

/**
 * get history position data
 * @param token
 * @param days
 * @return {Promise<[{long_position_amount: number, short_position_amount: number, day_time: string}]>}
 */
export async function getHistoryPositionData(token, days = 30) {
  const content =  await io.get(`/api/history_positions_amount/${token}/${days}`)
  if(content && content.data) {
    content.data.reverse()
    content.data.forEach((item) => {
      item.day_time = (new Date(item.day_time)).Format('MM-dd')
    })

    return content.data;
  }

  return [{
    "long_position_amount": 0,
    "short_position_amount": 0,
    "day_time": "2021-08-26T00:00:00.000Z"
  }];
}

/**
 * get current insurance pool data
 * @return {Promise<{insurance_pool: number}|*>}
 */
export async function getCurrentInsurancePoolData() {
  const content =  await io.get(`/api/current_insurance_pool`)
  if(content && content.data) {
    return content.data;
  }

  return {
    "insurance_pool": 0
  };
}

/**
 *
 * @param days
 * @return {Promise<{insurance_pool: number, day_time: string}|*>}
 */
export async function getHistoryInsurancePoolData(days = 30) {
  const content =  await io.get(`/api/history_insurance_pool/${days}`)
  if(content && content.data) {
    content.data.reverse()

    content.data.forEach((item) => {
      item.day_time = (new Date(item.day_time)).Format('MM-dd')
    })

    return content.data;
  }

  return [{
    "insurance_pool": 0,
    "day_time": ''
  }];
}

/**
 *
 * @return {Promise<{edrfPrice: number, drfPrice: number, drfBuyBack: number, bdrfPrice: number, drfBurnt: number}|*>}
 */
export async function getCurrentIndexData() {
  const content =  await io.get(`/api/current_index_data`)
  if(content && content.data) {
    return content.data;
  }

  return {
    "drfPrice": 0,
    "drfBurnt": 0,
    "drfBuyBack": 0,
    "edrfPrice": 0,
    "bdrfPrice": 0
  };
}

