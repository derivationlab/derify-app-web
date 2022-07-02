import * as React from "react";
import moment from "moment";
import Notice1 from "../notice";
import close from "@/assets/images/close1.png";
import edit from "@/assets/images/edit1.png";
import { SideEnum as TradeTypes, fromContractUnit} from "@/utils/contractUtil";
import { amountFormt } from "@/utils/utils";
import Type from "../type";
import "./index.less";

interface IPosProps {
  unit: string;
  data: any;
  getPairByAddress: any;
  toggleModal: any;
  setData: any;
}

interface IPosState {
}

export class TradePosition extends React.Component<IPosProps, IPosState> {
  constructor(props: IPosProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { props, state } = this;
    const { data } = props;
    const currentToken = props.getPairByAddress(data.token);
    const volume = amountFormt(data.size, 4, false, "0", -8);
    return (
      <div className="trade-item trade-postion-item">
        <div className="header">
          <span className="title">{currentToken.name}</span>
          <Type
            t={data.side === TradeTypes.LONG ? 'Long' : 'Short'}
            c={fromContractUnit(data.leverage)}
          />
          <span className="close red" onClick={() => {
            props.toggleModal(true);
            props.setData(data);
          }}>
            close
            <img src={close} alt="" />
          </span>
        </div>
        <div className="row row1">
          <div className="data">
            <Notice text="Unrealized PnL" />
            <div className="line num red">
              <span className="per">{amountFormt(data.returnRate, 2, true, "--", -6)}%</span>
              <span>{amountFormt(data.unrealizedPnl, 2, true, "--", -8)}</span>
            </div>
            <div className="line">{props.unit}</div>
          </div>
          <Item title="Volume"
                num={`${volume} / ${(currentToken.num * volume).toFixed(2)} `}
                u={currentToken.key}
          />
          <Item title="Liq. Price" num="-12313.23 " u={props.unit} />
          <Item title="Avg. Price" num={amountFormt(data.averagePrice, 2, false, "--", -8)} u={props.unit} />
        </div>
        <div className="hr"></div>
        <div className="row row2">
          <Item title="Margin" num={amountFormt(data.margin, 2, false, "--", -8)} u={props.unit} />
          <Item title="Margin Rate" num={`${amountFormt(data.marginRate, 2, false, "--", -6)}%`} u={false} />
          <Item
            title="Take Profit"
            num="--"
            editFn={() => {
              console.log("edit");
            }}
            u={props.unit}
          />
          <Item
            title="Stop Loss"
            num="--"
            editFn={() => {
              console.log("edit");
            }}
            u={props.unit}
          />
        </div>
      </div>
    );
  }
}

export interface ITradeOrderProps {
}

export interface ITradeOrderState {
}

export class TradeOrder extends React.Component<ITradeOrderProps,
  ITradeOrderState> {
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

interface ITradeHistoryProps {
  data: any;
  unit: any;
  getPairByAddress: any;
}

interface ITradeHistoryState {
}

export class TradeHistory extends React.Component<ITradeHistoryProps,
  ITradeHistoryState> {
  constructor(props: ITradeHistoryProps) {
    super(props);
    this.state = {};
  }

  getOpenOrClose = (num: number) => {
    if(num < 4){
      return 'Open'
    }else {
      return 'Close'
    }
  }

  getPriceType = (num: number) => {
    if(num === 0 || num === 1){
      return "Market"
    }
    if(num === 2){
      return "Limit"
    }
    if(num === 3 || num === 4){
      return "TPSL"
    }
    if(num === 5){
      return "Deleverage"
    }
    if(num === 6){
      return "Liquidate"
    }
    return "Market"
  }

  render() {
    const {data, getPairByAddress, unit} = this.props;
    const currentToken = getPairByAddress(data.token);
    return (
      <div className="trade-item trade-history-item">
        <div className="header">
          <span className="title">{currentToken.name} </span>
          <Type t={data.side === 0 ? 'Long' : 'Short'} c={10} />
        </div>
        <div className="row row1">
          <div className="data">
            <Notice text="Type" />
            <div className="line num red">{this.getOpenOrClose(data.type)}</div>
            <div className="line">{this.getPriceType(data.type)}</div>
          </div>
          <Item title="Unrealized PnL" num={amountFormt(data.pnl_usdt,2,true,"--")} u={unit}/>
          <Item title="Trading Fee" num={amountFormt(-data.trading_fee, 2, false, '--')} u={unit}/>
          <Item title="Position Change Fee" num={amountFormt(-data.position_change_fee,2,false,"--")} u={unit} />
        </div>
        <div className="hr"></div>
        <div className="row row2">
          <Item title="Volume (Base)" num={amountFormt(data.size,4,false,"--")} u={currentToken.key} />
          <Item title="Volume (Quoted)" num={amountFormt(data.amount,2, false, '--')} u={unit} />
          <Item title="Price" num={amountFormt(data.price,2,false,"--")} u={unit} />
          <Item title="Time" num={moment(data.event_time).format("YYYY-MM-DD HH:mm:ss")} u={moment(data.event_time).fromNow()} />
        </div>
      </div>
    );
  }
}

function Notice(props: { text: string, more?: string }) {
  return (
    <div className="line line-notice">
      <span>{props.text}</span>
      <Notice1 title={props.more || props.text} />
    </div>
  );
}

function Item({
                title,
                more,
                num,
                u = true,
                editFn,
              }: {
  title: string;
  more?: string;
  num: any;
  u?: boolean | string;
  editFn?: () => void;
}) {
  return (
    <div className="data">
      <Notice text={title} more={more} />
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
