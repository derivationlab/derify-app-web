import * as io from "@/utils/request";

import * as configUtil from '../config'

const kdataEndPoint = configUtil.getCurrentKdataEndPoint()

const KDATA_API_URL = kdataEndPoint + '/api/v5/market/candles'

/**
 * fetch k-line data
 * @param instId ETH/BTC
 * @param after  ts,unix timestamp
 * @param before ts ,unix timestamp
 * @param bar time gap,eg.[1m/3m/5m/15m/30m/1H/2H/4H/6H/12H/1D/1W/1M/3M/6M/1Y]
 * @param limit
 * @returns {Promise<*[]|*>} [0 open, 1 highest,2 lowest,3 close]
 */
export async function getKLineData ({instId, after, before, bar = '15m', limit= 35}) {
  const param = {
    instId: instId,
    after: after,
    before: before,
    bar: bar,
    limit: limit
  }
  const content = await io.get(KDATA_API_URL, param)

  if(content) {
    return content.data;
  }

  return [];
}
