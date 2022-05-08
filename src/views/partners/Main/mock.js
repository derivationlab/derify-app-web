const history: any = [];
const trans: any = [];
const trader: any = [];
for (let i = 0; i < 10; i++) {
  history.push({
    type: "income",
    from: "txid 0x00000000000000000000000000000000",
    amount: "+123.45",
    unit: "usdt",
    balance: "98765.43",
    time: "2022-12-31 23:59:59",
  });
  trans.push({
    id: "0x00000000000000000000000000000000",
    by: "0x00000000000000000000000000000001",
    type: "open",
    operateType: "Limit Price",
    value: "-1234.56 ( -12.34% )",
    time: "2022-12-31 23:59:59",
    unit: "usdt",
  });
  trader.push({
    id: "0x00000000000000000000000000000000",
    avatar: "",
    lastTransaction: "0x00000000000000000000000000000000",
    lastTransactionTime: "2022-07-09",
    registrationTime: "2022-07-09",
  });
}

export { history, trader, trans };
