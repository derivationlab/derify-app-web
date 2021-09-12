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
