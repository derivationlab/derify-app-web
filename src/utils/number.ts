import {fck} from './utils'


export const numFormat=(num: any, bit = -8) => {
    let value = fck(num, bit, 2);
    return value.split(".");
  }