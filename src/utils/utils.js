import createKeccakHash from "keccak";
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
      return "+" +  bit >=0 ? Number(val).toFixed(bit) : Number(val).toString();
    }

    return bit >=0 ? Number(val).toFixed(bit) : Number(val).toString();
  }

  return num
}

/**
 * number validate
 * @param value {string}
 * @param maxNum {number}
 * @param minNum {number}
 * @param allowMin {boolean}
 * @returns {{success: boolean, value: string|null}}
 */
export function checkNumber(value, maxNum= Infinity, minNum = 0, allowMin = false){
  if(/^(\d+(.\d*)?)?$/.test(value)){
    let size = parseFloat(value)

    if(size > maxNum){
      value = maxNum.toString()
    }

    // if(allowMin && size < minNum){
    //   value = minNum.toString();
    // }

    const retValue = value.replace(/[^0-9.]/g,'')


    if(size <= minNum) {
      return {success: size === minNum && allowMin, value: retValue}
    }else{
      return {success: true, value: retValue}
    }
  }

  return {success: true, value: null}
}

export function mergeNonNull(obj1, obj2){
  const resultObj = Object.assign({}, obj1);
  const source = Object.assign({}, obj2);

  if(resultObj === undefined || resultObj === null){
    return source;
  }

  for(let name in source){
    if(source[name] !== null && source[name] !== undefined){
      if(Object.keys(source[name]).length > 0 && typeof source[name] === "object"){
        resultObj[name] = mergeNonNull(resultObj[name], source[name]);
      }else{
        resultObj[name] = source[name];
      }

      console.log(resultObj,source[name])
    }
  }

  return resultObj;
}

export function toChecksumAddress (address) {
  address = address.toLowerCase().replace('0x', '')
  var hash = createKeccakHash('keccak256').update(address).digest('hex')
  var ret = '0x'

  for (var i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}
