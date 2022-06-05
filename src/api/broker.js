import * as io from "@/utils/request";
import * as configUtil from "../config";
import { Pagenation } from "@/api/types";
import { getCurChain } from "@/config";

/**
 * get trader's brokerId
 * @param trader
 * @return {Promise<String>} brokerId
 */
export async function getBrokerIdByTrader(trader) {
  const content = await getBindBrokerByTrader(trader);
  if (content != null) {
    return content.broker;
  }

  return null;
}

/**
 * get trader's brokerId
 * @param trader
 * @return {Promise<BrokerInfo>}
 */
export async function getBindBrokerByTrader(trader) {
  const content = await io.get("/api/broker_info_of_trader/" + trader);
  if (content && content.data && content.data.length > 0) {
    return content.data[0];
  }

  return null;
}

/**
 *
 * @param page
 * @param size
 * @returns {Promise<Pagenation<BrokerInfo>>}
 */
export async function getBrokerList(page = 1, size = 10) {
  const content = await io.get(`/api/brokers_list/${page - 1}/${size}`);
  let pagenation = new Pagenation();

  pagenation.current = page;
  pagenation.pageSize = size;
  pagenation.records = [];
  pagenation.totalPage = 0;
  if (content && content.data) {
    pagenation.records = content.data.records;
    pagenation.totalItems = content.data.totalItems;
    pagenation.totalPage = content.data.totalPages;
    return pagenation;
  }

  return pagenation;
}

/**
 * bind broker code
 * @param trader
 * @param brokerId
 * @return {Promise<{msg: string, success: boolean}>}
 */
export async function bindBroker({ trader, brokerId }) {
  const content = await io.post("/api/bind_broker", { brokerId, trader });

  if (content && content.code === 0) {
    return { success: true, msg: content.msg };
  } else if (content && content.error) {
    return { success: false, msg: content.error };
  }

  return { success: false, msg: "unknown" };
}

/**
 * get broker info
 * @param brokerId
 * @return {Promise<BrokerInfo>}
 */
export async function getBrokerByBrokerId(brokerId) {
  const content = await io.get(`/api/broker_info_by_id/${brokerId}`);

  if (content && content.data && content.data.length > 0) {
    return content.data[0];
  }

  return {};
}

function getBrokerByTraderCacheKey() {
  const chainKey = getCurChain();
  return chainKey + "_broker_info_by_addr";
}
/**
 * get broker info by trader address
 * @param trader
 * @return {Promise<BrokerInfo|null>}
 */
export async function getBrokerByTrader(trader) {
  const cacheKey = getBrokerByTraderCacheKey();
  let localStr = localStorage.getItem(cacheKey);
  let broker = null;

  if (localStr) {
    try {
      broker = JSON.parse(localStr);
    } catch (e) {
      console.error("getBrokerByTrader failed," + localStr, e);
    }

    if (broker && broker.broker !== trader) {
      broker = null;
      localStorage.removeItem(cacheKey);
    }
  }

  if (!broker) {
    const content = await io.get(`/api/broker_info_by_addr/${trader}`);
    if (content && content.data && content.data.length > 0) {
      localStorage.setItem(cacheKey, JSON.stringify(content.data[0]));
      return content.data[0];
    }
  }

  return broker;
}

export function getBrokerByAddr(trader) {
  return io.get(`/api/broker_info_by_addr/${trader}`);
}

/**
 * update broker info
 * @param param
 * @return {Promise<{msg, success: boolean,data:BrokerInfo}>}
 */
export async function updateBroker(param) {
  var data = new FormData();
  for (var name in param) {
    data.append(name, param[name]);
  }

  let config = {
    headers: { "Content-Type": "multipart/form-data" },
  };

  const content = await io.post(`/api/broker_info_updates`, data, config);
  localStorage.removeItem(getBrokerByTraderCacheKey());
  if (content && content.msg) {
    return { success: true, msg: content.msg, data: content.data };
  } else if (content && content.error) {
    return { success: false, msg: content.error, data: undefined };
  }

  return { success: false, msg: "unknown", data: undefined };
}

/**
 * get broker rewards in date range
 * @param trader
 * @param start
 * @param end
 * @return {Promise<Number>}
 */
export async function getBrokerTodayReward(
  trader,
  start = new Date().Format("yyyy-MM-ddT00:00:00"),
  end = new Date().Format("yyyy-MM-ddT23:59:59")
) {
  const content = await io.get(
    `/api/broker_today_reward/${trader}/${start}/${end}`
  );

  if (content && content.data && typeof content.data == "number") {
    return content.data;
  }

  return 0;
}

/**
 *
 * @param broker
 * @param page
 * @param size
 * @return {Promise<Pagenation<BrokerHistoryRecord>>}
 */
export async function getBrokerRewardHistory(broker, page = 1, size = 10) {
  const content = await io.get(
    `/api/broker_reward_balance/${broker}/${page - 1}/${size}`
  );

  let pagenation = new Pagenation();

  pagenation.current = page;
  pagenation.pageSize = size;
  pagenation.records = [];
  pagenation.totalPage = 0;
  if (content && content.data) {
    pagenation.records = content.data.records;
    pagenation.totalItems = content.data.totalItems;
    pagenation.totalPage = content.data.totalPages;
    return pagenation;
  }

  return pagenation;
}

/**
 *
 * @param broker
 * @param page
 * @param size
 * @return {Promise<Pagenation<{trader: String, update_time: Date}>>}
 */
export async function getbrokerBindTraders(broker, page = 1, size = 10) {
  const content = await io.get(
    `/api/traders_of_brokerAddr/${broker}/${page - 1}/${size}`
  );

  let pagenation = new Pagenation();

  pagenation.current = page;
  pagenation.pageSize = size;
  pagenation.records = [];
  pagenation.totalPage = 0;
  if (content && content.data) {
    pagenation.records = content.data.records;
    pagenation.totalItems = content.data.totalItems;
    pagenation.totalPage = content.data.totalPages;
    return pagenation;
  }

  return pagenation;
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
  introduction;
}

/**
 * eDRF balance history
 */
export class BrokerHistoryRecord {
  id; //uuid
  tx; //contract transactionHash
  broker; //trader address
  trader;
  amount; //
  balance; //amout after changed
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
  event_time; //contract event time（UTC）
  update_time; //db update time（UTC）
}
