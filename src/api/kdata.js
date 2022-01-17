import * as io from "@/utils/request";

import * as configUtil from '../config'

const kdataEndPoint = configUtil.getCurrentServerEndPoint()

const KDATA_API_URL = kdataEndPoint + '/api/klines'

const timeGapArr = [
  {value: '1m', text: '1m', time: 60 * 1000},
  {value: '5m', text: '5m', time: 5 * 60 * 1000},
  {value: '15m', text: '15m', time: 15 * 60 * 1000},
  {value: '1h', text: '1h', time: 60 * 60 * 1000},
  {value: '4h', text: '4h', time: 4 * 60 * 60 * 1000},
  {value: '1D', text: 'D', time: 24 * 60 * 60 * 1000},
  {value: '1W', text: 'W', time: 7 * 24 * 60 * 60 * 1000},
  {value: '1M', text: 'M', time: 30 * 24 * 60 * 60 * 1000},
];

/**
 * fetch k-line data
 * /api/klines/:token/:interval/:startTime/:endTime/:limit
 * @param instId ETH/BTC
 * @param after  ts,unix timestamp
 * @param before ts ,unix timestamp
 * @param bar time gap,eg.[1m/3m/5m/15m/30m/1H/2H/4H/6H/12H/1D/1W/1M/3M/6M/1Y]
 * @param limit
 * @returns {Promise<*[]|*>} [0 open, 1 highest,2 lowest,3 close]
 */
export async function getKLineData ({instId, after, before, bar = '15m', limit= 35}) {

  if(!before && !after){
    after = (new Date()).getTime();
  }

  const timeGap = timeGapArr.find((item) => item.value === bar);

  if(!after){
    after = before + timeGap.time * limit;
  }

  if(!before){
    before = after - timeGap.time * limit;
  }

  const param = {
    token: instId,
    endTime: Math.ceil(after / 1000),
    startTime: Math.ceil(before / 1000),
    interval: bar,
    limit: limit
  }
  const content = await io.get(`${KDATA_API_URL}/${param.token}/${param.interval}/${param.startTime}/${param.endTime}/${param.limit}`)

  if(content) {
    return content.data;
  }

  return [];
}
