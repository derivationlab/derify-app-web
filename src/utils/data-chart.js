/**
 * generateDataEchartsOptions
 * @param {array} colors
 * @param {array} xaxisDta
 * @param {stack: string, data:array}seriesData
 * @return {{yAxis: [{type: string}], xAxis: [{data, type: string, boundaryGap: boolean}], color, grid: {left: string, bottom: string, right: string, containLabel: boolean}, series: *[], tooltip: {axisPointer: {label: {backgroundColor: string}, type: string}, trigger: string}, toolbox: {feature: {saveAsImage: {}}}}}
 */
import * as echarts from 'echarts'

function convertHexColorToRGB(hexColor, opacity){
  const r = parseInt('0x'+hexColor.substr(1,2))
  const g = parseInt('0x'+hexColor.substr(3,2))
  const b = parseInt('0x'+hexColor.substr(5,2))

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export default function generateDataEchartsOptions(colors, xaxisDta, seriesData) {

  const seriers = [];

  seriesData.forEach((data, index) => {
    seriers.push({
      name: 'Line 1',
      type: 'line',
      stack: data.stack,
      smooth: false,
      lineStyle: {
        width: 1,
        type: 'solid',
        color: colors[index]
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.2,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: convertHexColorToRGB(colors[index], 1)
        }, {
          offset: 1,
          color: convertHexColorToRGB(colors[index], 0)
        }])
      },
      emphasis: {
        focus: 'series'
      },
      data: data.data
    })
  })

  return {
    color: colors,
    grid: {
      left: '0%',
      right: '0%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: xaxisDta
      }
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          show: true,
          lineStyle:{
            color: ['rgba(255,255,255, 0.1)'],
            width: 1
          }
        },
        position: 'right',
        axisLabel:{
          inside: true
        }
      }
    ],
    series: seriers
  }
}
