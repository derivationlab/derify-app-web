import * as React from "react";
import { useIntl, FormattedMessage } from "react-intl";
import moment from "moment";
import Notice1 from "../notice";
import close from "@/assets/images/close1.png";
import edit from "@/assets/images/edit1.png";
import { SideEnum as TradeTypes, fromContractUnit, OrderTypeEnum, PositionView } from "@/utils/contractUtil";
import { amountFormt } from "@/utils/utils";
import Type from "../type";
import "./index.less";

interface IPosProps {
  unit: string;
  data: PositionView;
  getPairByAddress: (str: string) => any;
  showProfitModal: (pos: PositionView) => any;
  toggleModal: any;
  setData: any;
}

export function TradePosition(props: IPosProps) {
  const { formatMessage } = useIntl();
  const $t = (id: string) => formatMessage({ id });
  const { data } = props;
  const currentToken = props.getPairByAddress(data.token);
  const volume = amountFormt(data.size, 4, false, "0", -8);
  return (
    <div className="trade-item trade-postion-item">
      <div className="header">
        <span className="title">{currentToken.name}</span>
        <Type
          t={data.side === TradeTypes.LONG ? 'Long' : (data.side === TradeTypes.SHORT ? 'Short' : '2-Way')}
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
          <Notice text={$t("Trade.MyPosition.List.UnrealizedPnL")} />
          <div className={`line num ${data.unrealizedPnl > 0 ? "green" : "red"}`}>
              <span>
                {amountFormt(data.unrealizedPnl, 2, true, "--", -8)}
              </span>
            <span className="per">
                ({amountFormt(data.returnRate, 2, true, "--", -6)}%)
              </span>
          </div>
          <div className="line">{props.unit}</div>
        </div>
        <Item title={$t("Trade.MyPosition.List.volume")}
              num={`${volume} / ${(currentToken.num * volume).toFixed(2)} `}
              u={`${currentToken.key} / ${props.unit}`}
        />
        <Item title={$t("Trade.MyPosition.List.LiqPrice")}
              num={amountFormt(data.liquidatePrice, 2, false, "--", -8)}
              u={props.unit}
        />
        <Item
          title={$t("Trade.MyPosition.Hint.AveragePrice1")}
          num={amountFormt(data.averagePrice, 2, false, "--", -8)}
          u={props.unit}
        />
      </div>
      <div className="hr"></div>
      <div className="row row2">
        <Item
          title={$t("Trade.MyPosition.List.Margin")}
          num={amountFormt(data.margin, 2, false, "--", -8)}
          u={props.unit}
        />
        <Item
          title={$t("Trade.MyPosition.List.Risk")}
          num={`${amountFormt(data.marginRate, 2, false, "--", -6)}%`}
          u={false}
        />
        <Item
          title={$t("Trade.MyPosition.List.SetTPSL1")}
          num={amountFormt(data.stopProfitPrice, 2, false, "--", -8)}
          editFn={() => {
            props.showProfitModal(data);
          }}
          u={props.unit}
        />
        <Item
          title={$t("Trade.MyPosition.List.SetTPSL2")}
          num={amountFormt(data.stopLossPrice, 2, false, "--", -8)}
          editFn={() => {
            props.showProfitModal(data);
          }}
          u={props.unit}
        />
      </div>
    </div>
  );
}

interface IOrderProps {
  data: any;
  getPairByAddress: any;
  check: any;
  unit: string;
}

export class TradeOrder extends React.Component<IOrderProps> {

  getType = (t: number) => {
    if (t === OrderTypeEnum.LimitOrder) {
      return ["Open", "Limit"];
    }
    if (t === OrderTypeEnum.StopProfitOrder) {
      return ["Close", "TP"];
    }
    if (t === OrderTypeEnum.StopLossOrder) {
      return ["Close", "SL"];
    }
    return ["", ""];
  };

  render() {
    const { getPairByAddress, data, check, unit } = this.props;
    const type = this.getType(data.orderType);

    const volume = amountFormt(data.size, 4, false, "0", -8);
    const price = amountFormt(data.orderType === OrderTypeEnum.LimitOrder ? data.price : data.stopPrice, 2, false, "--", -8);
    const total = volume * price;

    return (
      <div className="trade-item trade-order-item">
        <div className="header">
          <span className="title">{getPairByAddress(data.token).name}</span>
          <Type
            t={data.side === TradeTypes.LONG ? "Long" : "Short"}
            c={fromContractUnit(data.leverage)} />

          <span className="close red" onClick={() => {
            // @ts-ignore
            window.cancelOrder = data;
            check();
          }}>
            cancel
            <img src={close} alt="" />
          </span>
        </div>
        <div className="row row1">
          <div className="data">
            <Notice text="Type" />
            <div className={`line num ${type[0] === "Open" ? "green" : "red"}`}>{type[0]}</div>
            <div className="line">{type[1]}</div>
          </div>
          <Item title="Volume"
                num={`${volume} / ${total.toFixed(2)}`}
                u={`${getPairByAddress(data.token).key} / ${unit}`}
          />
          <Item title="Price"
                num={price}
                u={unit}
          />
          <Item title="Time"
                num={data.timestamp ? moment(+data.timestamp).format("YYYY-MM-DD HH:mm:ss") : "-"}
                u={data.timestamp ? (moment(+data.timestamp).fromNow()) : "-"}
          />
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

export class TradeHistory extends React.Component<ITradeHistoryProps> {

  getOpenOrClose = (num: number) => {
    if (num < 4) {
      return "Open";
    } else {
      return "Close";
    }
  };

  getPriceType = (num: number) => {
    if (num === 0 || num === 1) {
      return "Market";
    }
    if (num === 2) {
      return "Limit";
    }
    if (num === 3 || num === 4) {
      return "TPSL";
    }
    if (num === 5) {
      return "Deleverage";
    }
    if (num === 6) {
      return "Liquidate";
    }
    return "Market";
  };

  render() {
    const { data, getPairByAddress, unit } = this.props;
    const currentToken = getPairByAddress(data.token);
    return (
      <div className="trade-item trade-history-item">
        <div className="header">
          <span className="title">{currentToken.name} </span>
          <Type t={data.side === 0 ? "Long" : "Short"} c={10} />
        </div>
        <div className="row row1">
          <div className="data">
            <Notice text="Type" />
            <div
              className={`line num ${this.getOpenOrClose(data.type) === "Open" ? "green" : "red"}`}>{this.getOpenOrClose(data.type)}</div>
            <div className="line">{this.getPriceType(data.type)}</div>
          </div>
          <Item title="Unrealized PnL" num={amountFormt(data.pnl_usdt, 2, true, "--")} u={unit}
                numColor={isNaN(parseFloat(data.pnl_usdt)) ? "red" : (parseFloat(data.pnl_usdt) > 0 ? "green" : "red")} />
          <Item
            title="Trading Fee"
            num={amountFormt(-data.trading_fee, 2, false, "--")}
            u={unit}
            numColor={isNaN(parseFloat(data.trading_fee)) ? "red" : (-parseFloat(data.trading_fee) > 0 ? "green" : "red")}
          />
          <Item
            title="Position Change Fee"
            num={amountFormt(-data.position_change_fee, 2, false, "--")}
            u={unit}
            numColor={isNaN(parseFloat(data.position_change_fee)) ? "red" : (-parseFloat(data.position_change_fee) > 0 ? "green" : "red")}
          />
        </div>
        <div className="hr"></div>
        <div className="row row2">
          <Item title="Volume (Base)" num={amountFormt(data.size, 4, false, "--")} u={currentToken.key} />
          <Item title="Volume (Quoted)" num={amountFormt(data.amount, 2, false, "--")} u={unit} />
          <Item title="Price" num={amountFormt(data.price, 2, false, "--")} u={unit} />
          <Item title="Time" num={moment(data.event_time).format("YYYY-MM-DD HH:mm:ss")}
                u={moment(data.event_time).fromNow()} />
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
                numColor,
              }: {
  title: string;
  more?: string;
  num: any;
  u?: boolean | string;
  editFn?: () => void;
  numColor?: string;
}) {
  return (
    <div className="data">
      <Notice text={title} more={more} />
      <div className={`line num ${numColor || ""}`}>
        <span>{num}</span>
        {editFn && (
          <span className="edit" onClick={editFn}>
            <FormattedMessage id={"Broker.Broker.InfoEdit.Edit"} />
             <img src={edit} alt="" />
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
      <span> <FormattedMessage id={"noData"} /></span>
    </div>
  );
}
