export default
[
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_factory",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_rewards",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_tokenUSD",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_marginMaintenanceRatio",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_marginMaintenanceRatioMultiple",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_marginLiquidationRatio",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_thetaRatio",
        "type": "uint256"
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
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "balance",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "enum IDerifyExchange.InsuranceType",
        "name": "insuraceType",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "amount",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "InfurancePoolUpdate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "enum IDerifyExchange.FeeType",
        "name": "feeType",
        "type": "uint8"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "amount",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "balance",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "TraderBalanceUpdate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "amount",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "balance",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "Withdraw",
    "type": "event"
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
    "name": "gasFeePool",
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
    "name": "insuranceFundPool",
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
    "name": "liquidityPool",
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
    "name": "marginLiquidationRatio",
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
    "name": "marginMaintenanceRatio",
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
    "name": "marginMaintenanceRatioMultiple",
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
    "name": "rewards",
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
    "name": "thetaRatio",
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
    "name": "tokenUSD",
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
    "name": "totalAccountBalance",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_marginMaintenanceRatio",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_marginMaintenanceRatioMultiple",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_marginLiquidationRatio",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_thetaRatio",
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
        "name": "_rewards",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_tokenUSD",
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
        "internalType": "uint256",
        "name": "tradingFee",
        "type": "uint256"
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
        "internalType": "uint256",
        "name": "tradingFeePmrRatio",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tradingFeeInusranceRatio",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tradingFeeBrokerRatio",
        "type": "uint256"
      }
    ],
    "name": "operateTradingFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum IDerifyExchange.FeeType",
        "name": "feeType",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "int256",
        "name": "amount",
        "type": "int256"
      }
    ],
    "name": "operateTraderBalance",
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
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "exchangeBondByInsuranceFund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "transferGasFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "theBroker",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "enum IDerifyExchange.OpenType",
        "name": "openType",
        "type": "uint8"
      },
      {
        "internalType": "enum IDerifyExchange.QuantityType",
        "name": "quantityType",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "quantity",
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
      }
    ],
    "name": "openPosition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "theBroker",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "token",
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
    "name": "closePosition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "theBroker",
        "type": "address"
      }
    ],
    "name": "closeAllPositions",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "cancleAllOrderedPositions",
    "outputs": [],
    "stateMutability": "nonpayable",
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
    "inputs": [],
    "name": "getSysTotalPositionAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "sysTotalPositionAmount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCompensationParams",
    "outputs": [
      {
        "internalType": "int256",
        "name": "sysNetPnl",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "allTradersMarginBalance",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSysTotalNetProfitDerivative",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "sysTotalNetProfit",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "enum IDerifyExchange.OpenType",
        "name": "openType",
        "type": "uint8"
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
      }
    ],
    "name": "getTraderOpenUpperBound",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      }
    ],
    "name": "getSysOpenUpperBound",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      }
    ],
    "name": "getCloseUpperBound",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      }
    ],
    "name": "getSysCloseUpperBound",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
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
    "name": "getTraderAccount",
    "outputs": [
      {
        "internalType": "int256",
        "name": "balance",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "marginBalance",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "totalMargin",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "availableMargin",
        "type": "uint256"
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
    "name": "getTraderVariables",
    "outputs": [
      {
        "internalType": "int256",
        "name": "marginBalance",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "totalPositionAmount",
        "type": "uint256"
      },
      {
        "internalType": "int256",
        "name": "marginRate",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum IDerifyDerivative.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "spotPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "leverage",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "averagePrice",
        "type": "uint256"
      }
    ],
    "name": "getTraderPositionVariables",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "margin",
        "type": "uint256"
      },
      {
        "internalType": "int256",
        "name": "unrealizedPnl",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "returnRate",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "traders",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "brokers",
        "type": "address[]"
      },
      {
        "internalType": "uint256",
        "name": "estimateGasFee",
        "type": "uint256"
      }
    ],
    "name": "operateOrderedPositions",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "partLiquidateTraders",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "partLiquidateBrokers",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "liquidateTraders",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "liquidateBrokers",
        "type": "address[]"
      },
      {
        "internalType": "uint256",
        "name": "estimateGasFee",
        "type": "uint256"
      }
    ],
    "name": "operateLiquidatePositions",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
