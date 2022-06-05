import * as React from "react";
import Modal from "./modal";
import MainData from "./index.data";
import "./index.less";

interface IEarnProps {}

interface IEarnState {
  showModal: boolean;
  title: string;
  title2: string;
  address: string;
  unit: string;
  unit2: string;
  label: string;
  btn: string;
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
    };
  }

  showModal(title: string) {
    let data: any = {};
    if (title === "Stake DRF") {
      data = {
        showModal: true,
        title: "Stake DRF",
        title2: "Wallet Balance",
        address: "123",
        unit: "DRF",
        unit2: "DRF",
        label: "Amount to stake",
        btn: "Stake",
      };
    } else if (title === "Unstake DRF") {
      data = {
        showModal: true,
        title: "Unstake DRF",
        title2: "Staking Amount",
        address: "",
        unit: "DRF",
        unit2: "DRF",
        label: "Amount to unstake",
        btn: "unstake",
      };
    } else if (title === "Deposit bDRF") {
      data = {
        showModal: true,
        title: "Deposit bDRF",
        title2: "Wallet Balance",
        address: "123",
        unit: "bDRF",
        unit2: "bDRF",
        label: "Amount to deposit",
        btn: "Deposit",
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
    const { title, title2, address, unit, unit2, label, btn } = this.state;
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
            close={() => {
              this.setState({
                showModal: false,
              });
            }}
            confirm={() => {
              this.setState({
                showModal: false,
              });
            }}
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

export default Earn;
