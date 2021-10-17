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
    development: 'https://test-m.derify.exchange',
    debug: 'https://test-m.derify.exchange',
    production: 'https://m.derify.exchange',
  },
  contract: {
    development: {
      DerifyRewards: {
        abi: DerifyRewards,
        address: '0x40fB4B2B165989BdAd60cA577502cB8E839e3a16'
      },
      DerifyDerivative: {
        abi: DerifyDerivative,
        BTC: {
          address: '0x3D7fef78aA65fE667A87Cb6f13a7E4D016D9EE14',
          token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        },
        ETH: {
          address: '0x911c8e1c0048e496F0737009aA70c842A5ed2D65',
          token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        }
      },
      DerifyExchange: {
        abi: DerifyExchange,
        address: '0xe859a05cc233Be7B6BeEC9b9Cb96e76AD672cce5'
      },
      DUSD: {
        abi: DUSD,
        address: '0x1D0ccA5D9D21E4706652D7dA40389576258ac8db'
      },
      bDRF: {
        abi: bDRF,
        address: '0x57dC009Bc7068A5772d41c9eC872BB217578995E'
      },
      DRF: {
        abi: DRF,
        address: '0x1574e9AB4bA58d221aB49D5dE5370fD9B06a9548'
      },
      eDRF: {
        abi: eDRF,
        address: '0x02B9aFa0D8BB9BA1e5A6A44f78BC8Ffc852642C9'
      },
    },
    debug: {
      DerifyRewards: {
        abi: DerifyRewards,
        address: '0x40fB4B2B165989BdAd60cA577502cB8E839e3a16'
      },
      DerifyDerivative: {
        abi: DerifyDerivative,
        BTC: {
          address: '0x3D7fef78aA65fE667A87Cb6f13a7E4D016D9EE14',
          token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        },
        ETH: {
          address: '0x911c8e1c0048e496F0737009aA70c842A5ed2D65',
          token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        }
      },
      DerifyExchange: {
        abi: DerifyExchange,
        address: '0xe859a05cc233Be7B6BeEC9b9Cb96e76AD672cce5'
      },
      DUSD: {
        abi: DUSD,
        address: '0x1D0ccA5D9D21E4706652D7dA40389576258ac8db'
      },
      bDRF: {
        abi: bDRF,
        address: '0x57dC009Bc7068A5772d41c9eC872BB217578995E'
      },
      DRF: {
        abi: DRF,
        address: '0x1574e9AB4bA58d221aB49D5dE5370fD9B06a9548'
      },
      eDRF: {
        abi: eDRF,
        address: '0x02B9aFa0D8BB9BA1e5A6A44f78BC8Ffc852642C9'
      },
    },
    production: {
      DerifyRewards: {
        abi: DerifyRewards,
        address: '0x5BaFC3f4cb564F60A7A4913693dA2dD2b98ea49A'
      },
      DerifyDerivative: {
        abi: DerifyDerivative,
        BTC: {
          address: '0x0d6FFeeb8154B9dC7c26F4126d348342f750e278',
          token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        },
        ETH: {
          address: '0xc5Ab814D2b21971296483c889a7E18Fef20b149b',
          token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        }
      },
      DerifyExchange: {
        abi: DerifyExchange,
        address: '0xFC992420D38390e1B5dFC37c8c345357B6AF8f8b'
      },
      DUSD: {
        abi: DUSD,
        address: '0x1D0ccA5D9D21E4706652D7dA40389576258ac8db'
      },
      bDRF: {
        abi: bDRF,
        address: '0x8d3B6Eb5451a0bc72d1083011267409beceB03D3'
      },
      DRF: {
        abi: DRF,
        address: '0x1574e9AB4bA58d221aB49D5dE5370fD9B06a9548'
      },
      eDRF: {
        abi: eDRF,
        address: '0xc1E48d502EFea2997080d0A9A61Db57EE8b09e06'
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
