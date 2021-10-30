import Contract from './contractUtil'
import * as CfgUtil from '../config'

export const contractDebug = CfgUtil.isDebug()

export const EVENT_WALLET_CHANGE = 'walletChange'

export function contract (account, broker = '') {

  const contractObj = new Contract({from: account, broker: broker})

  return new Proxy(contractObj, {
    get(target, propKey, receiver) {
      const ret = Reflect.get(...arguments)

      if(ret instanceof Function && isProxyPropertyKey(propKey)){
        return new Proxy(ret, {
          apply (target, ctx, args) {
            try{
              const ret = Reflect.apply(...arguments);

              if(ret instanceof Promise){
                if(contractDebug){
                  console.log('request.contract.'+ propKey + ',args=' + JSON.stringify(args) + ',trader=' + contractObj.from)
                }

                return (async () => {
                  let data = await ret;
                  if(contractDebug) {
                    console.log('response.contract.' + propKey + ',args=' + JSON.stringify(args) + ',trader=' + contractObj.from + ",ret=", data)
                  }
                  return data;
                })();

              }else{
                if(contractDebug){
                  console.log('response.contract.'+ propKey + ',args=' + JSON.stringify(args)+ ',trader=' + contractObj.from + ",ret=", ret)
                }
              }
              return ret;
            }catch (e) {
              console.error('exception.contract.'+ propKey + ',args=' + JSON.stringify(args)+ ',trader=' + contractObj.from + ",error=", e);
              return {};
            }

          }
        })
      }else{
        return ret
      }
    }
  });
}

function isProxyPropertyKey(key) {
  if(key.startsWith('__')) {
    return false
  }

  if(key === 'getSpotPrice'){
    return false
  }

  if('getTraderVariables,getTraderPositionVariables'.indexOf(key) > -1){
    return false
  }

  return true
}

export function enable () {
  if (!window.ethereum) {
    return new Promise((resolve, reject) => {
      reject(new Error('please install Metamask'))
    })
  }
  return new Promise((resolve, reject) => {
    window.ethereum.request({
      method: 'eth_requestAccounts'
    }).then(r => resolve(r)).catch(e => reject(e))
  })
}
