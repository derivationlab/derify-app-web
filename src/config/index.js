import MulChainConfig from './config.js'
import { ChainEnum } from '@/utils/types'

const nodeEnv = process.env.REACT_APP_NODE_ENV ? process.env.REACT_APP_NODE_ENV : process.env.NODE_ENV;
const currentEnv = "production,development,debug".indexOf(nodeEnv) > -1 ? nodeEnv : "production"
window.currentEnv = currentEnv;
console.log(`currentEnv ${currentEnv}`)
const config = {
  currentEnv: currentEnv,
  debug: !isCurrentProduction()
}


export function getCurChain(){
  const curChain = ChainEnum.values.find((chain) => {
    return parseInt(window.ethereum.chainId, 16) === chain.chainId
  });
  let chainKey = 'rinkeby';

  if(curChain && curChain.chainId === ChainEnum.BSC.chainId){
    chainKey = 'bsc';
  }

  return chainKey;
}

export function getCurrentContractConfig(chain) {

  if(!chain){
    chain = getCurChain();
  }

  return MulChainConfig[chain].contract[currentEnv]
}

export function getCurrentServerEndPoint(chain) {

  if(!chain){
    chain = getCurChain();
  }

  return MulChainConfig[chain].server[currentEnv]
}

export function getCurrentKdataEndPoint(chain) {
  if(!chain){
    chain = getCurChain();
  }

  return MulChainConfig[chain].kdata[currentEnv]
}

export function getCurrentEnv() {
  return currentEnv
}

export function isCurrentProduction() {
  return currentEnv === 'production'
}

export function getWebroot(chain){
  if(!chain){
    chain = getCurChain();
  }

  return MulChainConfig[chain].webroot[currentEnv]
}

export function  isDebug() {
  if(window.location.href.indexOf("debug") > -1) {
    return true
  }

  return !isCurrentProduction()
}

export default config
