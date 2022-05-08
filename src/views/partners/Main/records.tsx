import * as React from "react";
import { Pagination } from "antd";
import Deri from "@/assets/images/deri.png";
import Share from "@/assets/images/share.png";
import Share1 from "@/assets/images/share1.png";
import { history, trans, trader } from "./mock";

export interface IRecordsProps {}

export interface IRecordsState {
  tab: number;
  data: Array<any>;
}

let tabs = ["History", "Transaction", "Trader"];
const pageData = [
  ["Type", "Amount", "Balance", "Time"],
  ["Transaction", "Type", "Realized PnL", "Time"],
  ["Trader", "Last Transaction", "Last Transaction Time", "Registration Time"],
];

export default class Records extends React.Component<
  IRecordsProps,
  IRecordsState
> {
  constructor(props: IRecordsProps) {
    super(props);
    this.state = {
      tab: 0,
      data: history,
    };
  }

  tabChange(tab: number) {
    return () => {
      this.setState(
        {
          tab,
        },
        () => {
          if (tab === 0) {
            this.setState({
              data: history,
            });
          } else if (tab === 1) {
            this.setState({
              data: trans,
            });
          } else {
            this.setState({
              data: trader,
            });
          }
        }
      );
    };
  }

  renderPageData() {
    const { tab, data } = this.state;
    return (
      <div className={`broker-page-data broker-page-data-${tab}`}>
        <div className="t">
          {pageData[tab].map((n, index) => {
            return (
              <div className="field" key={n}>
                {n}
              </div>
            );
          })}
        </div>
        {data.map((item, index) => {
          if (tab === 0) {
            return <Record0 key={index} item={item} />;
          } else if (tab === 1) {
            return <Record1 key={index} item={item} />;
          }
          return <Record2 key={index} item={item} />;
        })}
      </div>
    );
  }

  render() {
    const { tab, data } = this.state;
    return (
      <div className="broker-tab-list">
        <div className="tabs">
          {tabs.map((item, index) => {
            return (
              <div
                key={item}
                className={`tab ${tab === index ? "cur" : ""}`}
                onClick={this.tabChange(index)}
              >
                {item}
              </div>
            );
          })}
        </div>
        <div className="bot">
          <div className={`bott bott${tab}`}></div>
        </div>
        <div className="tab-data-wrapper">
          {data.length ? (
            this.renderPageData()
          ) : (
            <div className="empty-data">No record</div>
          )}
        </div>
        <div className="hline"></div>
        <Pagination defaultCurrent={1} total={50} />
      </div>
    );
  }
}

function Record0({ item }: { item: any }) {
  return (
    <div className="record">
      <div className="field">
        <span className="line1">{item.type}</span>
        <span className="line2">
          {item.from} <img style={{ width: "20px" }} src={Share} alt="" />{" "}
        </span>
      </div>
      <div className="field">
        <span className="line1">{item.amount}</span>
        <span className="line2">{item.unit}</span>
      </div>
      <div className="field">
        <span className="line1">{item.balance}</span>
        <span className="line2">{item.unit}</span>
      </div>
      <div className="field">
        <span className="line1">{item.time}</span>
        <span className="line2">{"2s 前"}</span>
      </div>
    </div>
  );
}

function Record1({ item }: { item: any }) {
  return (
    <div className="record">
      <div className="field">
        <span className="line1">
          {item.id} <img src={Share1} alt="" style={{ width: "21px" }} />
        </span>
        <span className="line2">
          {item.by} <img src={Share} alt="" style={{ width: "21px" }} />
        </span>
      </div>
      <div className="field">
        <span
          className="line1"
          style={{
            color: item.type
              ? item.type.toLocaleLowerCase() === "open"
                ? "#11BE6B"
                : "#F64242"
              : "#222",
          }}
        >
          {item.type ? item.type.toLocaleUpperCase() : "-"}
        </span>
        <span className="line2">{item.operateType}</span>
      </div>
      <div className="field">
        <span className="line1">{item.value}</span>
        <span className="line2">{item.unit}</span>
      </div>
      <div className="field">
        <span className="line1">{item.time}</span>
        <span className="line2">{"2s 前"}</span>
      </div>
    </div>
  );
}

function Record2({ item }: { item: any }) {
  return (
    <div className="record">
      <div className="field field21">
        {item.avatar ? (
          <img src={item.avatar} alt="" />
        ) : (
          <span className="default">
            <img src={Deri} alt="" />
          </span>
        )}
        <span style={{ marginLeft: "8px" }}>{item.id}</span>
        <img src={Share1} alt="" style={{ width: "21px" }} />
      </div>
      <div className="field">
        <span>
          {item.lastTransaction}
          <img src={Share1} alt="" style={{ width: "21px" }} />
        </span>
      </div>
      <div
        className="field"
        style={{
          paddingTop: item.lastTransactionTime ? "12px" : 0,
        }}
      >
        {item.lastTransactionTime ? (
          <>
            <span className="line1">{item.lastTransactionTime}</span>
            <span className="line2">{"2s 前"}</span>
          </>
        ) : (
          <span>No Tx.</span>
        )}
      </div>
      <div
        className="field"
        style={{
          paddingTop: "12px",
        }}
      >
        <span className="line1">{item.registrationTime}</span>
        <span className="line2">{"2s 前"}</span>
      </div>
    </div>
  );
}
