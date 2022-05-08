import * as React from "react";
import Deri from "@/assets/images/deri.png";

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

const history: any = [];
const trans: any = [];
const trader: any = [];
for (let i = 0; i < 10; i++) {
  history.push({
    type: "income",
    from: "txid 0x00000000000000000000000000000000",
    amount: "+123.45",
    unit: "usdt",
    balance: "98765.43",
    time: "2022-12-31 23:59:59",
  });
  trans.push({
    id: "0x00000000000000000000000000000000",
    by: "0x00000000000000000000000000000001",
    type: "open",
    value: "-1234.56 ( -12.34% )",
    time: "2022-12-31 23:59:59",
    unit: "usdt",
  });
  trader.push({
    id: "0x00000000000000000000000000000000",
    avatar: "",
    lastTransaction: "0x00000000000000000000000000000000",
    lastTransactionTime: "2022-07-09",
    registrationTime: "2022-07-09",
  });
}

trader.unshift({
  id: "0x00000000000000000000000000000000",
  avatar: "",
  lastTransaction: "0x00000000000000000000000000000000",
  lastTransactionTime: "",
  registrationTime: "2022-07-09",
});

export default class Records extends React.Component<
  IRecordsProps,
  IRecordsState
> {
  constructor(props: IRecordsProps) {
    super(props);
    this.state = {
      tab: 2,
      data: trader,
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
      </div>
    );
  }
}

function Record0({ item }: { item: any }) {
  return (
    <div className="record">
      <div className="field">
        <span className="line1">{item.type}</span>
        <span className="line2">{item.from}</span>
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
        <span className="line1">{item.id}</span>
        <span className="line2">{item.by}</span>
      </div>
      <div className="field">
        <span className="line1">{item.type}</span>
        <span className="line2">market price</span>
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
      </div>
      <div className="field">
        <span>{item.lastTransaction}</span>
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
