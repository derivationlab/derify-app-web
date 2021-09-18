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
        address: '0x0213822c5b23c31588eba8EF5C4D954aa4d6a1Cf'
      },
      DerifyDerivative: {
        abi: DerifyDerivative,
        BTC: {
          address: '0x6dC9E3beE4495C8C4AceaD90ebe9e8030B8ECB19',
          token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        },
        ETH: {
          address: '0x89c7e4C94108Ea7803fE3400e4417B9906cC087C',
          token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        }
      },
      DerifyExchange: {
        abi: DerifyExchange,
        address: '0xF5b162CC1Ad613CE2402091CCfBe2CfEe9214BbD'
      },
      DUSD: {
        abi: DUSD,
        address: '0x5C0E60b974C8E41A4c314d2F2B3FB87517c48E13'
      },
      bDRF: {
        abi: bDRF,
        address: '0x93242E3a7C6878A372027EDfBefe000154cEc1De'
      },
      DRF: {
        abi: DRF,
        address: '0xB4A0DF1e7D0365c7c0BADc8A57a044FFc94dDc4C'
      },
      eDRF: {
        abi: eDRF,
        address: '0x8C31Ccaf8E155A7bb0222A5eF6Ce1C935efDD8c2'
      },
    },
    debug: {
      DerifyRewards: {
        abi: DerifyRewards,
        address: '0x0213822c5b23c31588eba8EF5C4D954aa4d6a1Cf'
      },
      DerifyDerivative: {
        abi: DerifyDerivative,
        BTC: {
          address: '0x6dC9E3beE4495C8C4AceaD90ebe9e8030B8ECB19',
          token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        },
        ETH: {
          address: '0x89c7e4C94108Ea7803fE3400e4417B9906cC087C',
          token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        }
      },
      DerifyExchange: {
        abi: DerifyExchange,
        address: '0xF5b162CC1Ad613CE2402091CCfBe2CfEe9214BbD'
      },
      DUSD: {
        abi: DUSD,
        address: '0x5C0E60b974C8E41A4c314d2F2B3FB87517c48E13'
      },
      bDRF: {
        abi: bDRF,
        address: '0x93242E3a7C6878A372027EDfBefe000154cEc1De'
      },
      DRF: {
        abi: DRF,
        address: '0xB4A0DF1e7D0365c7c0BADc8A57a044FFc94dDc4C'
      },
      eDRF: {
        abi: eDRF,
        address: '0x8C31Ccaf8E155A7bb0222A5eF6Ce1C935efDD8c2'
      },
    },
    production: {
      DerifyRewards: {
        abi: DerifyRewards,
        address: '0x0213822c5b23c31588eba8EF5C4D954aa4d6a1Cf'
      },
      DerifyDerivative: {
        abi: DerifyDerivative,
        BTC: {
          address: '0x6dC9E3beE4495C8C4AceaD90ebe9e8030B8ECB19',
          token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        },
        ETH: {
          address: '0x89c7e4C94108Ea7803fE3400e4417B9906cC087C',
          token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        }
      },
      DerifyExchange: {
        abi: DerifyExchange,
        address: '0xF5b162CC1Ad613CE2402091CCfBe2CfEe9214BbD'
      },
      DUSD: {
        abi: DUSD,
        address: '0x5C0E60b974C8E41A4c314d2F2B3FB87517c48E13'
      },
      bDRF: {
        abi: bDRF,
        address: '0x93242E3a7C6878A372027EDfBefe000154cEc1De'
      },
      DRF: {
        abi: DRF,
        address: '0xB4A0DF1e7D0365c7c0BADc8A57a044FFc94dDc4C'
      },
      eDRF: {
        abi: eDRF,
        address: '0x8C31Ccaf8E155A7bb0222A5eF6Ce1C935efDD8c2'
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
