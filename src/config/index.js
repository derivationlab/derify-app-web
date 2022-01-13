import MulChainConfig from './config.js'

const nodeEnv = process.env.REACT_APP_NODE_ENV ? process.env.REACT_APP_NODE_ENV : process.env.NODE_ENV;
const currentEnv = "production,development,debug".indexOf(nodeEnv) > -1 ? nodeEnv : "production"
window.currentEnv = currentEnv;
console.log(`currentEnv ${currentEnv}`)
const config = {
  currentEnv: currentEnv,
  debug: !isCurrentProduction()
}

export function getCurrentContractConfig(chain = 'rinkeby') {
  return MulChainConfig[chain].contract[currentEnv]
}

export function getCurrentServerEndPoint(chain = 'rinkeby') {
  return MulChainConfig[chain].server[currentEnv]
}

export function getCurrentKdataEndPoint(chain = 'rinkeby') {
  return MulChainConfig[chain].kdata[currentEnv]
}

export function getCurrentEnv() {
  return currentEnv
}

export function isCurrentProduction() {
  return currentEnv === 'production'
}

export function getWebroot(chain = 'rinkeby'){
  return MulChainConfig[chain].webroot[currentEnv]
}

export function  isDebug() {
  if(config.debug || location.href.indexOf("debug") > -1) {
    return true
  }

  return !isCurrentProduction()
}

export default config
