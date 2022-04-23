import * as React from "react";
import close from "@/assets/images/close.png";
import Button from "@/components/buttons/borderButton";
import Modal from "@/components/modal";
import Type from "@/components/type";
import Input from "@/components/input";
import Percent from "@/components/percent";
import "./index.less";

export interface ClosePositionProps {
  close: () => void;
  confirm: () => void;
  type: "Short" | "Long";
  operate: "select" | "";
}

export interface ClosePositionState {
  value: string;
}

export default class ClosePositionModal extends React.Component<
  ClosePositionProps,
  ClosePositionState
> {
  constructor(props: ClosePositionProps) {
    super(props);
    this.state = {
      value: "",
    };
  }

  onChange = (e: any) => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    return (
      <Modal className="close-position-modal">
        <div className="title">
          Close Position
          <img src={close} alt="" onClick={this.props.close} />
        </div>

        {this.props.operate === "select" && (
          <div className="list">
            <div className="card">
              <div className="t">
                <span className="t1">BTC-USDT</span>
                <Type t={this.props.type} c={10} />
              </div>
              <div className="num">
                <span className="big-num">22222</span>
                <span className="small-num">.23</span>
                <span className="per">-12.34%</span>
              </div>
              <div className="line line0">
                Position Average Price :{" "}
                <span className="line-num">56789.12</span>
              </div>
              <div className="line">
                Position Held : <span className="line-num">1.23</span> BTC /{" "}
                <span className="line-num">13445.23</span> USDT
              </div>
            </div>
            <Input
              className="close-pos-input"
              value={this.state.value}
              onChange={this.onChange}
              label="Amount to Close"
              unit="BTC"
            />
            <Percent className="close-pos-percent" />
          </div>
        )}

        {this.props.operate === "" && (
          <div className="list">
            <div className="card">
              <div className="t">
                <span className="t1">BTC-USDT</span>
                <Type t={this.props.type} c={10} />
                <div className="n">
                  <span>12.34% </span> APY.
                </div>
              </div>
              <div className="num">
                <span className="big-num">22222</span>
                <span className="small-num">.23</span>
                <div className="p">Limit Price</div>
              </div>
            </div>

            <div className="item item0">
              <span>Volume</span>
              <div>
                <span className="n">12.23</span>
                <span className="t">BTC</span>
              </div>
            </div>
            <div className="item">
              <span>PCF</span>
              <div>
                <span className="n">-112.23</span>
                <span className="t">USDT</span>
              </div>
            </div>
            <div className="item item1">
              <span>Trading Fee</span>
              <div>
                <span className="n">-112.23</span>
                <span className="t">USDT</span>
              </div>
            </div>
          </div>
        )}
        <Button
          text="Confirm"
          click={this.props.confirm}
          fill={true}
          className="close-position-btn"
        />
      </Modal>
    );
  }
}
