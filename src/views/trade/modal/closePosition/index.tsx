import * as React from "react";
import Button from "@/components/buttons/borderButton";
import { ModalWithTitle } from "@/components/modal";
import Type from "@/components/type";
import Input from "@/components/input";
import Percent from "@/components/percent";
import "./index.less";

export interface ClosePositionProps {
  close: () => void;
  confirm: () => void;
  type: "Short" | "Long" | "2-Way";
  operate: "select" | "";
  title?: string;
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
      <ModalWithTitle
        title={this.props.title || "Close Position"}
        close={this.props.close}
        className="close-position-modal"
      >
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
            <Percent className="close-pos-percent" setValue={e => {
            console.log(e)}
            }/>
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

              {this.props.type === "2-Way" ? (
                <div className="num">Market Price </div>
              ) : (
                <div className="num">
                  <span className="big-num">22222</span>
                  <span className="small-num">.23</span>
                  <div className="p">Limit Price</div>
                </div>
              )}
            </div>

            <div className="item item0 item2">
              <span className="left">Volume</span>
              <div className="rights">
                <div className="l">
                  <Type t={"Long"} />
                  <span className="n">12.23</span>
                  <span className="t">BTC</span>
                </div>
                <div className="l">
                  <Type t={"Short"} />
                  <span className="n">12.23</span>
                  <span className="t">BTC</span>
                </div>
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
      </ModalWithTitle>
    );
  }
}
