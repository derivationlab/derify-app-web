export default
[
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_aggregator",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_exchange",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum IDerifyDerivative.TradeType",
        "name": "tradeType",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tradingFee",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "positionChangeFee",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "pnlUsdt",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pnlBond",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "longTotalSize",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "shortTotalSize",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "Close",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum IDerifyDerivative.TradeType",
        "name": "tradeType",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "leverage",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tradingFee",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "positionChangeFee",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "longTotalSize",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "shortTotalSize",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "Open",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "exchange",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "factory",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gRatio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "kRatio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "longAveragePrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "longTotalSize",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "roRatio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "shortAveragePrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "shortTotalSize",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tradingFeeBrokerRatio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tradingFeeInusranceRatio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tradingFeePmrRatio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tradingFeeRatio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tradingFeeRatio",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_tradingFeePmrRatio",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_tradingFeeInusranceRatio",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_tradingFeeBrokerRatio",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_kRatio",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_gRatio",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_roRatio",
        "type": "uint256"
      }
    ],
    "name": "updateParams",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_factory",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_exchange",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_aggregator",
        "type": "address"
      }
    ],
    "name": "updateContracts",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum IDerifyDerivative.TradeType",
        "name": "tradeType",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "theBroker",
        "type": "address"
      },
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "openPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "leverage",
        "type": "uint256"
      }
    ],
    "name": "openMarketPricePosition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "limitPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "leverage",
        "type": "uint256"
      }
    ],
    "name": "orderLimitPricePosition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "enum IDerifyDerivative.StopType",
        "name": "stopType",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "takeProfitPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "stopLossPrice",
        "type": "uint256"
      }
    ],
    "name": "orderStopPosition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "enum IDerifyDerivative.StopType",
        "name": "orderStopType",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "orderPrice",
        "type": "uint256"
      },
      {
        "internalType": "enum IDerifyDerivative.StopType",
        "name": "cancleStopType",
        "type": "uint8"
      }
    ],
    "name": "orderAndCancleStopPosition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum IDerifyDerivative.TradeType",
        "name": "tradeType",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "theBroker",
        "type": "address"
      },
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      }
    ],
    "name": "closePositionByTrader",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "theBroker",
        "type": "address"
      },
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      }
    ],
    "name": "closePositionByLiquidation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "theBroker",
        "type": "address"
      }
    ],
    "name": "closeDerivativePositions",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "enum IDerifyDerivative.StopType",
        "name": "stopType",
        "type": "uint8"
      },
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      }
    ],
    "name": "cancleOrderedStopPosition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "cancleOrderedLimitPosition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      }
    ],
    "name": "cancleDerivativeOrderedPositions",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSpotPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSideTotalAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "longTotalAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "shortTotalAmount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPositionChangeFeeRatio",
    "outputs": [
      {
        "internalType": "int256",
        "name": "ratio",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTokenTotalUnrealizedPnl",
    "outputs": [
      {
        "internalType": "int256",
        "name": "tokenTotalUnrealizedPnl",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllTraders",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      }
    ],
    "name": "getTraderDerivativePositions",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bool",
            "name": "isUsed",
            "type": "bool"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "isUsed",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "size",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "leverage",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct IDerifyDerivative.Position",
            "name": "long",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "isUsed",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "size",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "leverage",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct IDerifyDerivative.Position",
            "name": "short",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "isUsed",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "size",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "leverage",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct IDerifyDerivative.Position[]",
            "name": "longOrderOpenPosition",
            "type": "tuple[]"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "isUsed",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "size",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "leverage",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct IDerifyDerivative.Position[]",
            "name": "shortOrderOpenPosition",
            "type": "tuple[]"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "isUsed",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "stopPrice",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct IDerifyDerivative.StopPosition",
            "name": "longOrderStopProfitPosition",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "isUsed",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "stopPrice",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct IDerifyDerivative.StopPosition",
            "name": "longOrderStopLossPosition",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "isUsed",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "stopPrice",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct IDerifyDerivative.StopPosition",
            "name": "shortOrderStopProfitPosition",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "isUsed",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "stopPrice",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct IDerifyDerivative.StopPosition",
            "name": "shortOrderStopLossPosition",
            "type": "tuple"
          }
        ],
        "internalType": "struct IDerifyDerivative.DerivativePositions",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "nakedPositionDiff",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "ratioSum",
        "type": "int256"
      }
    ],
    "name": "getPositionChangeFee",
    "outputs": [
      {
        "internalType": "int256",
        "name": "positionChangeFee",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "theBroker",
        "type": "address"
      }
    ],
    "name": "operateOrderedLimitPositions",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "operatedSize",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "theBroker",
        "type": "address"
      },
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "spotPrice",
        "type": "uint256"
      }
    ],
    "name": "operateSideOrderedStopPositions",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "operatedSize",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
