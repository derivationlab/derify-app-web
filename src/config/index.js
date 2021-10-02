import DerifyDerivative from '../utils/contract/DerifyDerivative'
import DerifyExchange from '../utils/contract/DerifyExchange'
import DerifyRewards from '../utils/contract/DerifyRewards'
import DUSD from '../utils/contract/DUSD'
import bDRF from '../utils/contract/bDRF'
import DRF from '../utils/contract/DRF'
import eDRF from '../utils/contract/eDRF'

const currentEnv = "production,development,debug".indexOf(process.env.NODE_ENV) > -1 ? process.env.NODE_ENV : "production"

const config = {
  currentEnv: currentEnv,
  debug: true,
  server: {
    development: "https://test-m.derify.exchange",
    debug: "https://test-m.derify.exchange",
    production: "https://test-m.derify.exchange"
  },
  kdata:{
    development: 'https://test-m.derify.exchange',
    debug: 'https://test-m.derify.exchange',
    production: 'https://test-m.derify.exchange',
  },
  webroot: {
    development: 'https://test-m.derify.exchange',
    debug: 'https://test-m.derify.exchange',
    production: 'https://test-m.derify.exchange',
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
