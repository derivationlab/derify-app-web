import DerifyDerivative from '../utils/contract/DerifyDerivative'
import DerifyExchange from '../utils/contract/DerifyExchange'
import DerifyRewards from '../utils/contract/DerifyRewards'
import DUSD from '../utils/contract/DUSD'
import bDRF from '../utils/contract/bDRF'
import DRF from '../utils/contract/DRF'
import eDRF from '../utils/contract/eDRF'

const nodeEnv = process.env.REACT_APP_NODE_ENV ? process.env.REACT_APP_NODE_ENV : process.env.NODE_ENV;
const currentEnv = "production,development,debug".indexOf(nodeEnv) > -1 ? nodeEnv : "production"
window.currentEnv = currentEnv;
console.log(`currentEnv ${currentEnv}`)
const config = {
  currentEnv: currentEnv,
  debug: true,
  server: {
    development: "https://test-api.derify.exchange",
    debug: "https://test-api.derify.exchange",
    production: "https://api.derify.exchange"
  },
  kdata:{
    development: 'https://test-api.derify.exchange',
    debug: 'https://test-api.derify.exchange',
    production: 'https://api.derify.exchange',
  },
  webroot: {
    development: 'https://test-web.derify.exchange',
    debug: 'https://test-web.derify.exchange',
    production: 'https://derify.exchange',
  },
  contract: {
    development: {
      DerifyRewards: {
        abi: DerifyRewards,
        address: '0x067BcAA44A8d630314Ae3a0BB7e674810Dc2BF41'
      },
      DerifyDerivative: {
        abi: DerifyDerivative,
        BTC: {
          address: '0x28640fcB71FBdfe6EAe7A06c506cFeb86d31ca83',
          token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        },
        ETH: {
          address: '0x77208aC1DF97179f5A5d95DCc532ac25D935F74B',
          token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        }
      },
      DerifyExchange: {
        abi: DerifyExchange,
        address: '0x55fC6A4DfFe3BA32fCd0C6f19062b462C89282CE'
      },
      DUSD: {
        abi: DUSD,
        address: '0x1D0ccA5D9D21E4706652D7dA40389576258ac8db'
      },
      bDRF: {
        abi: bDRF,
        address: '0x991f80d5AAb74aCFD86cDde25e8a31aA492A64a2'
      },
      DRF: {
        abi: DRF,
        address: '0x1574e9AB4bA58d221aB49D5dE5370fD9B06a9548'
      },
      eDRF: {
        abi: eDRF,
        address: '0x2D889b28dC1Af5e614Eefd821Bb6AbE3d6C860Fe'
      },
    },
    debug: {
      DerifyRewards: {
        abi: DerifyRewards,
        address: '0x067BcAA44A8d630314Ae3a0BB7e674810Dc2BF41'
      },
      DerifyDerivative: {
        abi: DerifyDerivative,
        BTC: {
          address: '0x28640fcB71FBdfe6EAe7A06c506cFeb86d31ca83',
          token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        },
        ETH: {
          address: '0x77208aC1DF97179f5A5d95DCc532ac25D935F74B',
          token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        }
      },
      DerifyExchange: {
        abi: DerifyExchange,
        address: '0x55fC6A4DfFe3BA32fCd0C6f19062b462C89282CE'
      },
      DUSD: {
        abi: DUSD,
        address: '0x1D0ccA5D9D21E4706652D7dA40389576258ac8db'
      },
      bDRF: {
        abi: bDRF,
        address: '0x991f80d5AAb74aCFD86cDde25e8a31aA492A64a2'
      },
      DRF: {
        abi: DRF,
        address: '0x1574e9AB4bA58d221aB49D5dE5370fD9B06a9548'
      },
      eDRF: {
        abi: eDRF,
        address: '0x2D889b28dC1Af5e614Eefd821Bb6AbE3d6C860Fe'
      },
    },
    production: {
      DerifyRewards: {
        abi: DerifyRewards,
        address: '0xC73Eb71CB8C35668c9FAC44EdDF1321c4431044F'
      },
      DerifyDerivative: {
        abi: DerifyDerivative,
        BTC: {
          address: '0xF26e3FdA260167A4ED0ABf7402DC8286ac770395',
          token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        },
        ETH: {
          address: '0xB61c88A0ED9b03eBf7573046DFD5FeE8c7a8987d',
          token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        }
      },
      DerifyExchange: {
        abi: DerifyExchange,
        address: '0x0d7B6b79b6b0398fa40C7c1f65586332349EA46F'
      },
      DUSD: {
        abi: DUSD,
        address: '0x1D0ccA5D9D21E4706652D7dA40389576258ac8db'
      },
      bDRF: {
        abi: bDRF,
        address: '0xdf470A7868d782f0D66C77B937926eC8aC58fce7'
      },
      DRF: {
        abi: DRF,
        address: '0x1574e9AB4bA58d221aB49D5dE5370fD9B06a9548'
      },
      eDRF: {
        abi: eDRF,
        address: '0x721ab1c27976e10D30FCe48151F40e6D8C11D99B'
      },
    }
  }
}

export function getCurrentContractConfig() {
  return config.contract[currentEnv]
}

export function getCurrentServerEndPoint() {
  return config.server[currentEnv]
}

export function getCurrentKdataEndPoint() {
  return config.kdata[currentEnv]
}

export function getCurrentEnv() {
  return currentEnv
}

export function isCurrentProduction() {
  return currentEnv === 'production'
}

export function getWebroot(){
  return config.webroot[currentEnv]
}

export function  isDebug() {
  if(config.debug) {
    return true
  }

  return !isCurrentProduction()
}

export default config
