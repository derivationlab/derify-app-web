import DerifyDerivative from '../utils/contract/DerifyDerivative'
import DerifyExchange from '../utils/contract/DerifyExchange'
import DerifyRewards from '../utils/contract/DerifyRewards'
import DUSD from '../utils/contract/DUSD'
import bDRF from '../utils/contract/bDRF'
import DRF from '../utils/contract/DRF'
import eDRF from '../utils/contract/eDRF'

const data = {
  "rinkeby": {
    "server": {
      "development": "https://dev-api.derify.exchange/eth",
      "debug": "https://dev-api.derify.exchange/eth",
      "production": "https://api.derify.exchange/eth"
    },
    "kdata": {
      "development": "https://dev-api.derify.exchange",
      "debug": "https://dev-api.derify.exchange",
      "production": "https://api.derify.exchange"
    },
    "webroot": {
      "development": "https://test-web.derify.exchange",
      "debug": "https://test-web.derify.exchange",
      "production": "https://derify.exchange"
    },
    "showVar": {
      "usdTokenName": "USDT"
    },
    "contract": {
      "development": {
        "DerifyRewards": {
          "abi": DerifyRewards,
          "address": "0xe24b9b8D8A4c55a6D8bbF8C1271cD183FaaCF4Bc"
        },
        "DerifyDerivative": {
          "abi": DerifyDerivative,
          "BTC": {
            "address": "0x08b0e34882d008576f430c8aF9474519cEd16Dcc",
            "token": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
          },
          "ETH": {
            "address": "0xAF3fDcA9c2408F26D74F6508C0910b870Ea3A79b",
            "token": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
          }
        },
        "DerifyExchange": {
          "abi": DerifyExchange,
          "address": "0xf9D5e699e4081FE4D112012898D93Ca7Ea28bD5a"
        },
        "DUSD": {
          "abi": DUSD,
          "address": "0x1D0ccA5D9D21E4706652D7dA40389576258ac8db"
        },
        "bDRF": {
          "abi": bDRF,
          "address": "0x991f80d5AAb74aCFD86cDde25e8a31aA492A64a2"
        },
        "DRF": {
          "abi": DRF,
          "address": "0x1574e9AB4bA58d221aB49D5dE5370fD9B06a9548"
        },
        "eDRF": {
          "abi": eDRF,
          "address": "0x2D889b28dC1Af5e614Eefd821Bb6AbE3d6C860Fe"
        }
      },
      "debug": {
        "DerifyRewards": {
          "abi": DerifyRewards,
          "address": "0xe24b9b8D8A4c55a6D8bbF8C1271cD183FaaCF4Bc"
        },
        "DerifyDerivative": {
          "abi": DerifyDerivative,
          "BTC": {
            "address": "0x40F8Af172E95B696B45A55943C02CB063367a2e9",
            "token": "0xBD9d08D0469adb84189Fb062bd017187741eC656"
          },
          "ETH": {
            "address": "0xAF3fDcA9c2408F26D74F6508C0910b870Ea3A79b",
            "token": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
          }
        },
        "DerifyExchange": {
          "abi": DerifyExchange,
          "address": "0xf9D5e699e4081FE4D112012898D93Ca7Ea28bD5a"
        },
        "DUSD": {
          "abi": DUSD,
          "address": "0x1D0ccA5D9D21E4706652D7dA40389576258ac8db"
        },
        "bDRF": {
          "abi": bDRF,
          "address": "0x991f80d5AAb74aCFD86cDde25e8a31aA492A64a2"
        },
        "DRF": {
          "abi": DRF,
          "address": "0x1574e9AB4bA58d221aB49D5dE5370fD9B06a9548"
        },
        "eDRF": {
          "abi": eDRF,
          "address": "0x2D889b28dC1Af5e614Eefd821Bb6AbE3d6C860Fe"
        }
      },
      "production": {
        "DerifyRewards": {
          "abi": DerifyRewards,
          "address": "0x6fc1Bd9124D69aaA6612aABFc81F514Bdd0cF467"
        },
        "DerifyDerivative": {
          "abi": DerifyDerivative,
          "BTC": {
            "address": "0x08b0e34882d008576f430c8aF9474519cEd16Dcc",
            "token": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
          },
          "ETH": {
            "address": "0xAF3fDcA9c2408F26D74F6508C0910b870Ea3A79b",
            "token": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
          }
        },
        "DerifyExchange": {
          "abi": DerifyExchange,
          "address": "0x61Ead17C0085eBc61D4826fBe08FdafbF5D9834A"
        },
        "DUSD": {
          "abi": DUSD,
          "address": "0x1D0ccA5D9D21E4706652D7dA40389576258ac8db"
        },
        "bDRF": {
          "abi": bDRF,
          "address": "0x991f80d5AAb74aCFD86cDde25e8a31aA492A64a2"
        },
        "DRF": {
          "abi": DRF,
          "address": "0x1574e9AB4bA58d221aB49D5dE5370fD9B06a9548"
        },
        "eDRF": {
          "abi": eDRF,
          "address": "0x2D889b28dC1Af5e614Eefd821Bb6AbE3d6C860Fe"
        }
      }
    }
  },
  "bsc": {
    "server": {
      "development": "https://dev-bsctestnet-api.derify.exchange",
      "debug": "https://dev-bsctestnet-api.derify.exchange",
      "production": "https://api.derify.exchange/bsc"
    },
    "kdata": {
      "development": "https://dev-api.derify.exchange",
      "debug": "https://dev-api.derify.exchange",
      "production": "https://api.derify.exchange"
    },
    "webroot": {
      "development": "https://test-web.derify.exchange",
      "debug": "https://test-web.derify.exchange",
      "production": "https://derify.exchange"
    },
    "showVar": {
      "usdTokenName": "BUSD"
    },
    "contract": {
      "development": {
        "DerifyRewards": {
          "abi": DerifyRewards,
          "address": "0x0cA0e7810d00A9268478aF0eC03C49bD37862D00"
        },
        "DerifyDerivative": {
          "abi": DerifyDerivative,
          "BTC": {
            "address": "0x7F4c1429a99b16df381430818F826a00Ae463578",
            "token": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
          },
          "ETH": {
            "address": "0xaC413A0B3ce02D8c9D13a697A14D8FB01cFD9A9e",
            "token": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
          }
        },
        "DerifyExchange": {
          "abi": DerifyExchange,
          "address": "0xaf6062D12eC27CEd55511D78597402E8fB1520BD"
        },
        "DUSD": {
          "abi": DUSD,
          "address": "0xCABcFdBddf6e03cdfEFD0dCC33115F3E7Ea790D4"
        },
        "bDRF": {
          "abi": bDRF,
          "address": "0x528249BED95D74b2A59C9B0554651CAdcde5Afc6"
        },
        "DRF": {
          "abi": DRF,
          "address": "0xb86B85D13Cb4992c7A2f2AA811b678c664F274b5"
        },
        "eDRF": {
          "abi": eDRF,
          "address": "0x1b7f2541940E6fA83Ae2b3332c2A4CAe02656cb0"
        }
      },
      "debug": {
        "DerifyRewards": {
          "abi": DerifyRewards,
          "address": "0x0cA0e7810d00A9268478aF0eC03C49bD37862D00"
        },
        "DerifyDerivative": {
          "abi": DerifyDerivative,
          "BTC": {
            "address": "0x7F4c1429a99b16df381430818F826a00Ae463578",
            "token": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
          },
          "ETH": {
            "address": "0xaC413A0B3ce02D8c9D13a697A14D8FB01cFD9A9e",
            "token": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
          }
        },
        "DerifyExchange": {
          "abi": DerifyExchange,
          "address": "0xaf6062D12eC27CEd55511D78597402E8fB1520BD"
        },
        "DUSD": {
          "abi": DUSD,
          "address": "0xCABcFdBddf6e03cdfEFD0dCC33115F3E7Ea790D4"
        },
        "bDRF": {
          "abi": bDRF,
          "address": "0x528249BED95D74b2A59C9B0554651CAdcde5Afc6"
        },
        "DRF": {
          "abi": DRF,
          "address": "0xb86B85D13Cb4992c7A2f2AA811b678c664F274b5"
        },
        "eDRF": {
          "abi": eDRF,
          "address": "0x1b7f2541940E6fA83Ae2b3332c2A4CAe02656cb0"
        }
      },
      "production": {
        "DerifyRewards": {
          "abi": DerifyRewards,
          "address": "0xc0e3dA3E33b94cC2d2fF4d203d2e0D2B5dab1549"
        },
        "DerifyDerivative": {
          "abi": DerifyDerivative,
          "BTC": {
            "address": "0xF992D738290a5ef18BfA5B6236F46DCf1005f07A",
            "token": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
          },
          "ETH": {
            "address": "0x0eBbAa19EDD0206241DA19A09DD3725C2f974cC9",
            "token": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
          }
        },
        "DerifyExchange": {
          "abi": DerifyExchange,
          "address": "0x889089b975E505530Da15b7AFF67C2f7d6eA18AE"
        },
        "DUSD": {
          "abi": DUSD,
          "address": "0xD5eC82071D0c870BfBa60B58A0AA52E42A3BEFba"
        },
        "bDRF": {
          "abi": bDRF,
          "address": "0x528249BED95D74b2A59C9B0554651CAdcde5Afc6"
        },
        "DRF": {
          "abi": DRF,
          "address": "0xb86B85D13Cb4992c7A2f2AA811b678c664F274b5"
        },
        "eDRF": {
          "abi": eDRF,
          "address": "0x1b7f2541940E6fA83Ae2b3332c2A4CAe02656cb0"
        }
      }
    }
  }
}

export default data
