import React, { Component } from "react";
import Broker from "@/components/broker";
import Notice from "@/components/notice";
import Button from "@/components/buttons/borderButton";
import share1 from "@/assets/images/share1.png";
import paste from "@/assets/images/paste.png";
import Modal from "./modal";

type Props = {};
type State = {};

class BrokerInfo extends Component<Props, State> {
  state = {
    showModal: false,
    data: {
      name: "name",
      id: "001",
    },
  };
  render() {
    return (
      <div className="broker-info-part">
        {this.state.showModal && (
          <Modal
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
        <div className="data">
          <div className="balance">
            <Button
              fill={true}
              className="claim-btn"
              click={() => {
                this.setState({
                  showModal: true,
                });
              }}
              text="Claim All"
            />
            <div className="t">Broker Account Balance</div>
            <div className="t1">
              45,644
              <span className="small-num">.23</span>
              <span className="unit">USDT</span>
            </div>
            <div className="t2">
              You've earned a total of <span className="b">987654321.98</span>{" "}
              USDT since <span className="b">Dec 31, 2021.</span>
            </div>
          </div>
          <div className="cards">
            <div className="d">
              <div className="t">Daily Rewards</div>
              <div className="t1">234</div>
              <div className="t2">
                <span className="b">12.34%</span>
                in total rewards
              </div>
            </div>
            <div className="d">
              <div className="t">Daily Active Trader</div>
              <div className="t1">234</div>
              <div className="t2">
                <span className="b">1234</span> transactions
              </div>
            </div>
            <div className="d">
              <div className="t">Broker Rank</div>
              <div className="t1">#24</div>
              <div className="t2 t3">
                Rank List <img src={share1} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="info-detail">
          <Broker data={this.state.data} className="info-detail-broker" />
          <div className="desc">
            introduction text introduction text introduction text introduction
            text introduction text introduction text introduction text
            introduction...
          </div>
          <div className="card">
            <Button
              fill={true}
              className="card-btn"
              click={() => {
                console.log(111);
              }}
              text="Extend"
            />
            <div className="t">
              Broker Privilege Expiration
              <Notice title="Broker Privilege Expiration" />
            </div>
            <div className="days">
              <span className="num">234</span>
              <span className="d">days</span>
            </div>
            <div className="expire">
              <div>
                expire at <span className="d">2024-12-31</span>
              </div>
              <div className="link">
                My promotion link
                <img src={paste} alt="" />
                <img src={share1} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BrokerInfo;
