import * as React from "react";
import {notification} from 'antd'
import Decimal from "decimal.js"
import Modal from "./modal";
import MainData from "./index.data";
import "./index.less";
import { connect } from "react-redux";
import {AppModel} from "@/store";
import rewardModel, {RewardState} from '@/store/modules/reward'
import {UserState} from '@/store/modules/user' 
import { fck } from "@/utils/utils";
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

const maxNumber = (number, max=1)=>{
  if(isNaN(Number(number))) return 0
  const numberDecimal = new Decimal(Number(number)).mul(new Decimal(max))
  return numberDecimal.toNumber();
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
    if(title === 'Claim BUSD'){
      const maxAmount = rewardState.pmrBalance;
      const {selectedAddress} = userState;
      data = {
        showModal: true,
        title: "Claim BUSD",
        title2: "Wallet Balance",
        address: selectedAddress,
        unit: "BUSD",
        unit2: "BUSD",
        label: "Amount to claim",
        btn: "claim",
        maxAmount: fck(maxAmount, -8, 2),
        confirmFun: (amount: number)=>{
          const doSubmitAction = rewardModel.actions.withdrawPMReward(selectedAddress,maxNumber(amount,8))
          this.commonTip(doSubmitAction)
          
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
        maxAmount: fck(maxAmount, -8, 2),
        confirmFun: (amount: number)=>{
          const doSubmitAction = rewardModel.actions.stakingDrf(selectedAddress,maxNumber(amount,8))
          this.commonTip(doSubmitAction)
          
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
        maxAmount: fck(maxAmount, -8, 2),
        confirmFun: (amount: number)=>{
          const doSubmitAction = rewardModel.actions.redeemDrf(selectedAddress,maxNumber(amount,8))
          this.commonTip(doSubmitAction)
          
        }
      };
    } else if (title === "Stake bDRF") {
      const maxAmount = rewardState.wallet.bdrfBalance
      const {selectedAddress} = userState;
      data = {
        showModal: true,
        title: "Stake bDRF",
        title2: "Wallet Balance",
        address: selectedAddress,
        unit: "bDRF",
        unit2: "bDRF",
        label: "Amount to Stake",
        btn: "Stake",
        maxAmount: fck(maxAmount, -8, 2),
        confirmFun: (amount: number)=>{
          const doSubmitAction = rewardModel.actions.depositBondToBank(selectedAddress,maxNumber(amount,8), BondAccountType.WalletAccount)
          this.commonTip(doSubmitAction)
          
        }
      };
    } else if(title==="UnStake bDRF"){
      const maxAmount = rewardState.bondInfo.bondReturnBalance
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
        maxAmount: fck(maxAmount, -8, 2),
        confirmFun: (amount: number)=>{
          const doSubmitAction = rewardModel.actions.redeemBondFromBank(selectedAddress,maxNumber(amount,8), BondAccountType.WalletAccount);
          this.commonTip(doSubmitAction)
          
        }
      };
    } else if (title === "Exchange bDRF") {
      const maxAmount = rewardState.exchangeBondSizeUpperBound
      const {selectedAddress} = userState;
      data = {
        showModal: true,
        title: "Exchange bDRF",
        title2: "Exchangeable",
        address: "",
        unit: "bDRF->USDT",
        unit2: "bDRF",
        label: "Amount to exchange",
        btn: "Exchange",
        maxAmount: fck(maxAmount, -8, 2),
        confirmFun: (amount: number)=>{
          const doSubmitAction = rewardModel.actions.exchangeBond(selectedAddress,maxNumber(amount,8), BondAccountType.WalletAccount);
          this.commonTip(doSubmitAction)
          
        }
      };
    }
    this.setState(data);
  }

  componentDidMount() {
    // this.showModal("Exchange bDRF");
  }
  commonTip(doSubmitAction){
    const {dispatch} = this.props;
    if(!doSubmitAction){
      return;
    }
    this.setState({showModal: false})
    // pendding
    notification.open({
      description: 'pending...',
      className: 'cunstom_notification'
    })
    doSubmitAction(dispatch).then(() => {
      notification.open({
        description: 'success',
        className: 'cunstom_notification'
      })
      dispatch(AppModel.actions.updateLoadStatus("reward"));
    }).catch((e) => {
      notification.open({
        description: 'failed',
        className: 'cunstom_notification'
      })
      console.error('doSubmitAction type', e)
    }).finally(() => {

    });
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
