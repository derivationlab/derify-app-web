import * as React from "react";
import notice from "@/assets/images/notice.png";
import Button from "@/components/buttons/borderButton";
import Notice from "@/components/notice";
import Modal from "./modal";
import "./main.less";

export interface IEarnProps {}

export interface IEarnState {
  showModal: boolean;
  title: string;
  title2: string;
  address: string;
  unit: string;
  unit2: string;
  label: string;
  btn: string;
}

export default class Earn extends React.Component<IEarnProps, IEarnState> {
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
    console.log(title);
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
        <div className="wrapper">
          <Title
            t1="Position Mining"
            t2="Open position to earn position mining rewards."
          />

          <div className="datas">
            <CenterData b="98" s=".34%(max)" />
            <div className="b2">
              <div className="t1">Claimable</div>
              <Value unit="USDT" b="67456" s=".2" />
              <Value unit="DRF" b="656" s=".4" />
              <div className="desc">
                Total earned : <span className="v">9.87M</span> USDT and{" "}
                <span className="v">987654.32</span> DRF
              </div>
              <Button
                className="earn-btn"
                fill={true}
                text="Claim All"
                click={() => {
                  this.showModal("Stake DRF");
                }}
              />
            </div>

            <div className="b2 b3">
              <div className="t1">Positions</div>
              <Value unit="USDT" b="45.2M" s="" />
              <div className="t2" />
              <div className="desc">
                Total positions : <span className="v">9.87M</span> USDT
              </div>
              <Button
                className="earn-btn"
                fill={true}
                text="Open Position"
                click={() => {
                  console.log(111);
                }}
              />
            </div>
          </div>

          <Title
            t1="DRF Pool"
            t2="Stake DRF to mint and use eDRF, the ultilized token of Derify protocol."
          />

          <div className="datas">
            <CenterData b="34" s=".34%" />
            <div className="b2">
              <div className="t1">Claimable</div>
              <Value unit="eDRF" b="67456" s=".2" />
              <div className="t2"></div>
              <div className="desc">
                Total earned : <span className="v">987124867345.4</span>eDRF
              </div>
              <Button
                className="earn-btn"
                fill={true}
                text="Claim All"
                click={() => {
                  console.log(111);
                }}
              />
            </div>

            <div className="b2 b3">
              <div className="t1">Staked</div>
              <Value unit="DRF" b="45" s=".1" />
              <div className="t2" />
              <div className="desc">
                Current pool size : <span className="v">81677.44</span> DRF
              </div>
              <Button
                className="earn-btn"
                fill={true}
                text="Stake"
                click={() => {
                  console.log(111);
                }}
              />
              <Button
                className="earn-btn earn-btn2"
                text="UnStake"
                click={() => {
                  console.log(111);
                }}
              />
            </div>
          </div>

          <Title
            t1="bDRF Pool"
            t2="Deposit bDRF to earn stable interests, or exchange bDRF to stable coin."
          />

          <div className="datas">
            <CenterData b="12" s=".34%" />
            <div className="b2">
              <div className="t1">Intrests</div>
              <Value unit="bDRF" b="1456" s=".2" />
              <div className="t2"></div>
              <div className="desc">
                Exchangeable : <span className="v">0.334</span>bDRF
              </div>
              <Button
                className="earn-btn"
                fill={true}
                text="Claim All"
                click={() => {
                  console.log(111);
                }}
              />
              <Button
                className="earn-btn earn-btn2"
                text="Exchange"
                click={() => {
                  console.log(111);
                }}
              />
            </div>

            <div className="b2 b3">
              <div className="t1">Deposited</div>
              <Value unit="bDRF" b="4344565" s=".133" />
              <div className="t2" />
              <div className="desc">
                Total deposited : <span className="v">87.44M</span> bDRF
              </div>
              <Button
                className="earn-btn"
                fill={true}
                text="Stake"
                click={() => {
                  console.log(111);
                }}
              />
              <Button
                className="earn-btn earn-btn2"
                text="UnStake"
                click={() => {
                  console.log(111);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function Title({ t1, t2 }: { t1: string; t2: string }) {
  return (
    <div className="title">
      <span className="t">
        {t1}
        <Notice title={t1} />
      </span>
      <span className="desc">{t2}</span>
    </div>
  );
}

function Value({
  b,
  s,
  unit,
}: {
  b: string | number;
  s: string;
  unit: string;
}) {
  return (
    <div className="t2">
      <span className="big">{b}</span>
      <span className="s">{s}</span>
      <span className="unit">{unit}</span>
    </div>
  );
}

function CenterData({ b, s }: { b: number | string; s: string }) {
  return (
    <div className="b1">
      <div className="b1-data">
        <div className="t">
          {b}
          <span className="t1">{s}</span>
        </div>
        <div className="t2">APY.</div>
      </div>
    </div>
  );
}
