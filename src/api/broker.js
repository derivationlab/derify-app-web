import * as io from '@/utils/request'
import * as configUtil from '../config'

const serverEndPoint = configUtil.getCurrentServerEndPoint()

/**
 * get trader's brokerId
 * @param trader
 * @return {Promise<String>} brokerId
 */
export async function getBrokerIdByTrader(trader) {
  const content =  await io.get("/api/broker_info_of_trader/" + trader)
  if(content && content.data && content.data.length > 0) {
    return content.data[0].broker;
  }

  return null;
}

/**
 *
 * @param page
 * @param size
 * @returns {Promise<[BrokerInfo]>}
 */
export async function getBrokerList(page = 0, size = 10) {
  const content =  await io.get(`/api/brokers_list/${page}/${size}`)
  if(content && content.data) {
    return content.data.records;
  }

  return [];
}

/**
 * bind broker code
 * @param trader
 * @param brokerId
 * @return {Promise<{msg: string, success: boolean}>}
 */
export async function bindBroker({trader,brokerId}) {
  const content =  await io.post('/api/bind_broker', {brokerId,trader})

  if(content && content.msg) {
    return {success: true, msg: content.msg}
  }else if(content && content.error){
    return {success: false, msg: content.error}
  }

  return {success: false, msg: 'unknown'};
}

/**
 * get broker info
 * @param brokerId
 * @return {Promise<BrokerInfo>}
 */
export async function getBrokerByBrokerId(brokerId) {
  const content =  await io.get(`/api/broker_info_by_id/${brokerId}`)

  if(content && content.data && content.data.length > 0) {
    return content.data[0]
  }

  return {}
}

/**
 * get broker info by trader address
 * @param trader
 * @return {Promise<{}|BrokerInfo>}
 */
export async function getBrokerByTrader(trader) {
  const content = await io.get(`/api/broker_info_by_addr/${trader}`)
  if(content && content.data && content.data.length > 0) {
    return content.data[0]
  }

  return {}
}

/**
 * update broker info
 * @param param
 * @return {Promise<{msg, success: boolean}|{msg: string, success: boolean}>}
 */
export async function updateBroker(param) {
  var data = new FormData();
  for(var name in param) {
    data.append(name, param[name])
  }

  let config = {
    headers:{'Content-Type':'multipart/form-data'}
  };

  const content =  await io.post(`/api/broker_info_updates`, data, config)

  if(content && content.msg) {
    return {success: true, msg: content.msg}
  }else if(content && content.error){
    return {success: false, msg: content.error}
  }

  return {success: false, msg: 'unknown'};
}

/**
 * get broker rewards in date range
 * @param trader
 * @param start
 * @param end
 * @return {Promise<Number>}
 */
export async function getBrokerTodayReward(trader, start=(new Date()).Format('yyyy-MM-ddT00:00:00'), end = (new Date()).Format('yyyy-MM-ddT23:59:59')) {
  const content = await io.get(`/api/broker_today_reward/${trader}/${start}/${end}`)

  if(content && content.data) {
    return content.data
  }

  return 0
}

/**
 *
 * @param broker
 * @param page
 * @param size
 * @return {Promise<[]|BrokerHistoryRecord>}
 */
export async function getBrokerRewardHistory(broker, page = 0, size = 10) {
  const content = await io.get(`/api/broker_reward_balance/${broker}/${page}/${size}`)

  if(content && content.data && content.records) {
    return content.data.records
  }

  return []
}

/**
 *
 * @param broker
 * @param page
 * @param size
 * @return {Promise<*[]|{trader: String, update_time: Date}>}
 */
export async function getbrokerBindTraders(broker, page = 0, size = 10) {
  const content = await io.get(`/api/traders_of_broker/${broker}/${page}/${size}`)

  console.log(content)
  if(content && content.data && content.data.records) {
    return content.data.records
  }

  return []
}

/**
 * brokerInfo
 */
export class BrokerInfo {

  /**
   * invite code
   */
  id;
  /**
   * brokerAccount
   */
  broker;
  name;
  logo;
  update_time;
}


/**
 * eDRF balance history
 */
export class BrokerHistoryRecord {
  id;//uuid
  tx;//contract transactionHash
  broker;//trader address
  trader;
  amount;//
  balance;//amout after changed
  /**
   0-Income
   1-Withdraw
   2-Exchange
   3-TransferFromBank
   4-TransferToBank
   5-Interest
   6-Burn
   */
  update_type;
  event_time;//contract event time（UTC）
  update_time;//db update time（UTC）
}
