import { getKLineData } from '../api/kdata'
import { Token } from '@/utils/contractUtil'

export function buildEchartsOptions ({categoryData = [(new Date()).Format('hh:mm')]
                                       , values = [[0,0,0,0]], curPrice = 0
                                       , bar = '15m'}) {

  let min = values[0][3]
  let max = values[0][2]
  if(values.length > 0){
    values[values.length - 1][1] = curPrice;
  }

  values.forEach(item => {
    if(item[3] > 0){
      min = min === 0 ? item[3] : Math.min(item[3], min)
    }

    if(item[2] > 0){
      max = Math.max(item[2], max)
    }

  })

  if(curPrice > 0) {
    max = Math.max(curPrice, max)
    min = Math.min(curPrice, min)
  }

  max = max + (max - min)/10
  min = min - (max - min)/10


  const distance = 10
  const rightOffset = ((curPrice+"").length) * 7

  return {
    darkMode: true,
    tooltip: {
      show: false,
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: []
    },
    grid: {
      top: '0%',
      left: '0%',
      right: rightOffset,
      bottom: '10%'
    },
    dataZoom: [],
    xAxis: {
      type: 'category',
      data: categoryData,
      scale: true,
      boundaryGap: false,
      axisLabel: {
        inside: false,
        margin: '10',
        color: 'rgba(255,255,255,0.3)'
      },
      axisLine: { onZero: false },
      splitLine: { show: false },
      splitNumber: 5
    },
    yAxis: {
      scale: true,
      show: true,
      splitNumber: 5,
      min: min,
      max: max,
      boundaryGap: ['0%', '0%'],
      axisLabel: {
        inside: false,
        margin: '10',
        color: 'rgba(255,255,255,0.3)',
        showMinLabel: false,
        showMaxLabel: false,
      },
      splitLine: {
        show: true,
        lineStyle:{
          color: ['rgba(255,255,255, 0.1)'],
          width: 1
        }
      },
      position: 'right'
    },
    series: [
      {
        name: bar,
        type: 'candlestick',
        data: values,
        itemStyle: {
          color0: '#EA446B', //up color
          color: '#00C49A', //down color
          borderColor0: '#EA446B',
          borderColor: '#00C49A'
        },
        markLine: {
          symbol: ['none', 'none'],
          show: categoryData.length > 1,
          data: [
            [
              {
                name: curPrice+'',
                coord: [0, curPrice],
                symbolSize: 10,
                label: {
                  show: categoryData.length > 1,
                  color: '#fff',
                  backgroundColor:'#EA446B',
                  position: 'end',
                  distance: distance
                },
                emphasis: {
                  label: {
                    show: false
                  }
                }
              },
              {
                name: curPrice+'',
                coord: [categoryData.length - 1, curPrice],
                symbolSize: 10,
                label: {
                  show: false
                },
                emphasis: {
                  label: {
                    show: false
                  }
                }
              }
            ]
          ]
        }
      }
    ]
  }
}

const tokenInstIdMap = {
  ETH: 'ETH-USDT',
  BTC: 'BTC-USDT',
}

function getTokenInstIdByToken(token) {
  return Token[token]
}

export default async function getEchartsOptions({token, bar, after, before, limit, curPrice}) {
  const data = await getKLineData({instId: getTokenInstIdByToken(token), bar, after, before, limit})
  return buildEchartsOptions({...splitData(data, bar), curPrice, bar})
}

const barDateFmtMap = {
  '1m': 'hh:mm',
  '5m': 'hh:mm',
  '15m': 'hh:mm',
  '30m': 'hh:mm',
  '1h': 'hh:mm',
  '4h': 'hh:mm',
  '1D': 'MM-dd',
  '1W': 'MM-dd',
  '1M': 'yyyy-MM'
}
function splitData (rawData, bar) {
  const categoryData = []
  const values = []

  rawData.sort((o1, o2) =>{
    return parseInt(o1[0]) - parseInt(o2[0]);
  });

  for (let i = 0; i < rawData.length; i++) {
    const date = new Date(parseInt(rawData[i].splice(0, 1)[0]) * 1000);
    categoryData.push(date.Format(barDateFmtMap[bar]))
    //[open, highest, lowest, close]
    //convert to
    //[open, close, highest, lowest]

    let open = rawData[i][0];
    if(i > 0 && rawData[i - 1][3] > 0) {
      open = rawData[i - 1][3];
    }

    let close = rawData[i][3];
    // if(i < (rawData.length - 1)){
    //   close = rawData[i + 1][0];
    // }

    let highest = Math.max(open, close, rawData[i][1], rawData[i][2]);
    let lowest = Math.min(open, close, rawData[i][1], rawData[i][2]);

    values.push([open,close,rawData[i][1],rawData[i][2]])
  }


  return {
    categoryData: categoryData,
    values: values
  }
}
