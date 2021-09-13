declare interface Window {
    web3: any,
    ethereum:any
}

declare class TraderAccount {
  balance:number;
  marginBalance: number;
  totalMargin: number;
  marginRate?: number;
  totalPositionAmount?: number;
  availableMargin: number;
}

export declare class TraderVariable {
  marginBalance:number;
  totalPositionAmount: number;
  marginRate: number;
}

export declare class Contract {
  getTraderAccount(trader:string): Promise<TraderAccount>
  getTraderVariables (trader:string): Promise<TraderVariable>
}
