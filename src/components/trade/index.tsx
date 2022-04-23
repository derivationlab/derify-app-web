import * as React from "react";
import close from "@/assets/images/close1.png";
import notice from "@/assets/images/notice.png";
import edit from "@/assets/images/edit1.png";
import Type from "../type";
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

  render() {
    return (
      <div className="trade-item trade-postion-item">
        <div className="header">
          <span className="title">BTC-USDT</span>
          <Type t="Long" c={10} />
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
          <Item
            title="Take Profit"
            num="-12313.23 "
            editFn={() => {
              console.log("edit");
            }}
          />
          <Item
            title="Stop Loss"
            num="-12313.23 "
            editFn={() => {
              console.log("edit");
            }}
          />
        </div>
      </div>
    );
  }
}

export interface ITradeOrderProps {}

export interface ITradeOrderState {}

export class TradeOrder extends React.Component<
  ITradeOrderProps,
  ITradeOrderState
> {
  constructor(props: ITradeOrderProps) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="trade-item trade-order-item">
        <div className="header">
          <span className="title">BTC-USDT</span>
          <Type t="Long" c={10} />
          <span className="close red">
            close
            <img src={close} alt="" />
          </span>
        </div>
        <div className="row row1">
          <div className="data">
            <Notice text="Type" />
            <div className="line num red">open</div>
            <div className="line">Limit Price</div>
          </div>
          <Item title="Volume" num="2.34 / 23124.32 " u="BTC / USDT" />
          <Item title="Price" num="-12313.23 " />
          <Item title="Time" num="2022-12-31 23:59:59" u="1 minute ago" />
        </div>
      </div>
    );
  }
}

interface ITradeHistoryProps {}

interface ITradeHistoryState {}

export class TradeHistory extends React.Component<
  ITradeHistoryProps,
  ITradeHistoryState
> {
  constructor(props: ITradeHistoryProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="trade-item trade-history-item">
        <div className="header">
          <span className="title">BTC-USDT</span>
          <Type t="Long" c={10} />
          <span className="close red">
            close
            <img src={close} alt="" />
          </span>
        </div>
        <div className="row row1">
          <div className="data">
            <Notice text="Type" />
            <div className="line num red">open</div>
            <div className="line">Market Price</div>
          </div>
          <Item title="Unrealized PnL" num="23124.32" />
          <Item title="Trading Fee" num="13.23 " />
          <Item title="Position Change Fee" num="-12313.23 " />
        </div>
        <div className="hr"></div>
        <div className="row row2">
          <Item title="Volume (Base)" num="4513.12" u="BTC" />
          <Item title="Volume (Quoted)" num="23124.32" />
          <Item title="Price" num="212313.23 " />
          <Item title="Time" num="2022-12-31 23:59:59" u="1 minute ago" />
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
  editFn,
}: {
  title: string;
  num: any;
  u?: boolean | string;
  editFn?: () => void;
}) {
  return (
    <div className="data">
      <Notice text={title} />
      <div className="line num">
        <span>{num}</span>
        {editFn && (
          <span className="edit" onClick={editFn}>
            edit <img src={edit} alt="" />
          </span>
        )}
      </div>
      {u === true && <div className="line">USDT</div>}
      {typeof u === "string" && <div className="line">{u}</div>}
    </div>
  );
}

export function Empty() {
  return (
    <div className="trade-empty">
      <span>No record</span>
    </div>
  );
}
