declare interface Window {
    web3: any,
    ethereum:any
}

declare class TraderAccount {
  balance:number;
  marginBalance: number;
  totalMargin: number;
  availableMargin: number;
}
declare class Contract {
  getTraderAccount(trader:string):TraderAccount
}
