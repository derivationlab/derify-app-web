import * as React from "react";
import close from "@/assets/images/close1.png";
import notice from "@/assets/images/notice.png";
import "./index.less";

export interface ITradePosProps {}

export interface ITradePosState {}

export class TradePosition extends React.Component<
  ITradePosProps,
  ITradePosState
> {
  constructor(props: ITradePosProps) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <div className="trade-item trade-postion-item">
        <div className="header">
          <span className="title">BTC-USDT</span>
          <span className="type">
            Long
            <span className="type-inner">10x</span>
          </span>
          <span className="close red">
            close
            <img src={close} alt="" />
          </span>
        </div>
        <div className="row row1">
          <div className="data">
            <Notice text="Unrealized PnL" />
            <div className="line num red">
              <span className="per">-12313.23%</span>
              <span>( -12.34 BTC ) </span>
            </div>
            <div className="line">USDT</div>
          </div>
          <Item title="Volume" num="2.34 / 23124.32 " />
          <Item title="Liq. Price" num="-12313.23 " />
          <Item title="Avg. Price" num="-12313.23 " />
        </div>
        <div className="hr"></div>
        <div className="row row2">
          <Item title="Margin" num="4513.12" />
          <Item title="Margin Rate" num="34.56%" u={false} />
          <Item title="Take Profit" num="-12313.23 " />
          <Item title="Stop Loss" num="-12313.23 " />
        </div>
      </div>
    );
  }
}

function Notice(props: { text: string }) {
  return (
    <div className="line line-notice">
      <span>{props.text}</span>
      <img src={notice} alt="" className="notice" />
    </div>
  );
}

function Item({
  title,
  num,
  u = true,
}: {
  title: string;
  num: any;
  u?: boolean;
}) {
  return (
    <div className="data">
      <Notice text={title} />
      <div className="line num">{num}</div>
      {u && <div className="line">USDT</div>}
    </div>
  );
}
