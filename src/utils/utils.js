
/* eslint-disable */
export function dateFormat  (date, fmt) {
  var o = {
    'M+': date.getMonth() + 1, // month
    'd+': date.getDate(), // day
    'h+': date.getHours(), // hour
    'm+': date.getMinutes(), // min
    's+': date.getSeconds(), // sec
    'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
    S: date.getMilliseconds(), // ms
    W: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][date.getDay()]
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}

export function fck (num, pow = 8, bit = 2) {
  if (/^-?\d+\.?\d*$/.test(`${num}`)) {
    let val = parseFloat(num)
    val *= Math.pow(10, pow)
    return Number(val).toFixed(bit)
  }
  return num
}

export function dfv (num, defaultValue) {
  return num ? num : defaultValue
}

export function amountFormt (num, bit = 4, showPositive = false, zeroDefault = null, shiftNum = 0) {

  if(!num && zeroDefault !== null){
    return zeroDefault
  }

  if (/^-?\d+\.?\d*$/.test(`${num}`)) {
    let val = parseFloat(num)

    if(val === 0 && zeroDefault !== null) {
      return zeroDefault
    }

    val *= Math.pow(10, shiftNum)

    if(showPositive && val > 0) {
      return "+" +  Number(val).toFixed(bit)
    }

    return Number(val).toFixed(bit)
  }

  return num
}
