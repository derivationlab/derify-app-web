import * as React from "react";
import Modal from "./modal";
import MainData from "./index.data";
import "./index.less";
import { connect } from "react-redux";
import rewardModel, {RewardState} from '@/store/modules/reward'
import {UserState} from '@/store/modules/user' 
import {
  BondAccountType,
} from "@/utils/contractUtil";

interface IEarnProps {
  rewardState: RewardState;
  userState: UserState;
}

interface IEarnState {
  showModal: boolean;
  title: string;
  title2: string;
  address: string;
  unit: string;
  unit2: string;
  label: string;
  btn: string;
  maxAmount: number;
  confirmFun: Function;
}

class Earn extends React.Component<IEarnProps, IEarnState> {
  constructor(props: IEarnProps) {
    super(props);
    this.state = {
      showModal: false,
      title: "",
      title2: "",
      address: "",
      unit: "",
      unit2: "",
      label: "",
      btn: "",
      maxAmount: 0,
      confirmFun:()=>{}
    };
  }

  showModal = (title: string)=> {
    const {rewardState,userState} = this.props;
    let data: any = {};
    if(title === 'eDRFWithdraw'){
      const maxAmount = rewardState.edrfInfo.edrfBalance
      const {selectedAddress} = userState;
      data = {
        showModal: true,
        title: "Claim DRF",
        title2: "Wallet Balance",
        address: selectedAddress,
        unit: "DRF",
        unit2: "DRF",
        label: "Amount to Claim",
        btn: "Claim",
        maxAmount,
        confirmFun: (trader: string, amount: number)=>{
          rewardModel.actions.stakingDrf(selectedAddress, amount)
          this.setState({showModal: false})
        }
      };
    }else if (title === "Stake DRF") {
      const maxAmount = rewardState.wallet.drfBalance;
      const {selectedAddress} = userState;
      data = {
        showModal: true,
        title: "Stake DRF",
        title2: "Wallet Balance",
        address: selectedAddress,
        unit: "DRF",
        unit2: "DRF",
        label: "Amount to stake",
        btn: "Stake",
        maxAmount,
        confirmFun: (trader: string, amount: number)=>{
          rewardModel.actions.stakingDrf(selectedAddress, amount)
          this.setState({showModal: false})
        }
      };
    } else if (title === "Unstake DRF") {
      const maxAmount = rewardState.edrfInfo.drfBalance
      const {selectedAddress} = userState;
      data = {
        showModal: true,
        title: "Unstake DRF",
        title2: "Staking Amount",
        address: "",
        unit: "DRF",
        unit2: "DRF",
        label: "Amount to unstake",
        btn: "unstake",
        maxAmount,
        confirmFun: (trader: string, amount: number)=>{
          rewardModel.actions.redeemDrf(selectedAddress, amount)
          this.setState({showModal: false})
        }
      };
    } else if (title === "Stake bDRF") {
      data = {
        showModal: true,
        title: "Stake bDRF",
        title2: "Wallet Balance",
        address: "123",
        unit: "bDRF",
        unit2: "bDRF",
        label: "Amount to Stake",
        btn: "Stake",
      };
    } else if(title==="UnStake bDRF"){
      const maxAmount = rewardState.edrfInfo.drfBalance
      const {selectedAddress} = userState;
      data = {
        showModal: true,
        title: "Unstake bDRF",
        title2: "Staking Amount",
        address: "",
        unit: "bDRF",
        unit2: "bDRF",
        label: "Amount to unstake",
        btn: "unstake",
        maxAmount,
        confirmFun: (trader: string, amount: number)=>{
          rewardModel.actions.redeemDrf(selectedAddress, amount)
          this.setState({showModal: false})
        }
      };
    } else if (title === "Withdraw bDRF") {
      data = {
        showModal: true,
        title: "Withdraw bDRF",
        title2: "Withdraw",
        address: "",
        unit: "bDRF",
        unit2: "bDRF",
        label: "Amount to withdraw",
        btn: "Withdraw",
      };
    } else if (title === "Exchange bDRF") {
      data = {
        showModal: true,
        title: "Exchange bDRF",
        title2: "Exchangeable",
        address: "",
        unit: "bDRF->USDT",
        unit2: "bDRF",
        label: "Amount to exchange",
        btn: "Exchange",
      };
    }
    this.setState(data);
  }

  componentDidMount() {
    // this.showModal("Exchange bDRF");
  }

  render() {
    const { title, title2, address, unit, unit2, label, btn,maxAmount,confirmFun=()=>{} } = this.state;
    return (
      <div className="earn-page">
        {this.state.showModal && (
          <Modal
            title={title}
            title2={title2}
            address={address}
            unit={unit}
            unit2={unit2}
            label={label}
            btn={btn}
            maxAmount={maxAmount}
            close={() => {
              this.setState({
                showModal: false,
              });
            }}
            confirm={confirmFun}
          />
        )}
        <MainData
          showModal={this.showModal}
          toTrade={() => {
            // @ts-ignore
            this.props.history.push("/trade");
          }}
        />
      </div>
    );
  }
}

export default connect((state)=>{
  const {
    reward: rewardState,
    user: userState,
  } = state;
  return {
    rewardState,
    userState
  }
})(Earn);
