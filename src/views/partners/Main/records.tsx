// @ts-nocheck
import * as React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Pagination } from "antd";
import Deri from "@/assets/images/deri.png";
import Share from "@/assets/images/share.png";
import { RootStore } from "@/store";
import { getbrokerBindTraders, getBrokerRewardHistory } from "@/api/broker";
import Share1 from "@/assets/images/share1.png";
import { getUSDTokenName } from "@/config";

interface IRecProps {
  user: any;
}

interface IRecState {
  tab: number;
  total: number;
  current: number;
  data: Array<any>;
}

let tabs = ["History", "Transaction", "Trader"];
const types = [
  "Income",
  "Withdraw",
  "Exchange",
  "Redeem",
  "Deposit",
  "Interest",
];

const pageData = [
  ["Type", "Amount", "Balance", "Time"],
  ["Transaction", "Type", "Realized PnL", "Time"],
  ["Trader", "Last Transaction", "Last Transaction Time", "Registration Time"],
];

class Records extends React.Component<IRecProps, IRecState> {
  constructor(props: IRecProps) {
    super(props);
    this.state = {
      tab: 0,
      current: 1,
      total: 0,
      data: [],
    };
  }

  tabChange(tab: number) {
    return () => {
      //  transaction not done
      if (tab === 1) {
        return;
      }
      this.setState(
        {
          tab,
        },
        this.getData
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

  changePage = (page: number) => {
    this.setState(
      {
        current: page,
      },
      this.getData
    );
  };

  getData = () => {
    const { current, tab } = this.state;
    const { trader } = this.props.user;
    if (tab === 0) {
      getBrokerRewardHistory(trader, current, 10).then(r => {
        console.log(r);
        this.setState({
          data: r.records,
          total: r.totalItems,
        });
      });
    } else {
      getbrokerBindTraders(trader, current, 10).then(r => {
        console.log(r);
        this.setState({
          data: r.records,
          total: r.totalItems,
        });
      });
    }
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    const { tab, data, current, total } = this.state;
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
        <Pagination
          current={current}
          total={total}
          onChange={this.changePage}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: RootStore) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps)(Records);

function Record0({ item }: { item: any }) {
  const unit = getUSDTokenName();
  return (
    <div className="record">
      <div className="field">
        <span className="line1">
          {typeof item.update_type === "number" ? types[item.update_type] : "-"}
        </span>
        <span className="line2">
          {item.trader} <img style={{ width: "20px" }} src={Share} alt="" />{" "}
        </span>
      </div>
      <div className="field">
        <span className="line1">{item.amount}</span>
        <span className="line2">{unit}</span>
      </div>
      <div className="field">
        <span className="line1">{item.balance}</span>
        <span className="line2">{unit}</span>
      </div>
      <div className="field">
        <span className="line1">
          {item.event_time
            ? moment(item.event_time).format("YYYY-MM-DD HH:mm:ss")
            : "-"}
        </span>
        <span className="line2">
          {item.event_time ? moment(item.event_time).fromNow() : ""}
        </span>
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
    <div className="record record2">
      <div className="field field21">
        {item.avatar ? (
          <img src={item.avatar} alt="" />
        ) : (
          <span className="default">
            <img src={Deri} alt="" />
          </span>
        )}
        <span className="record-trader">{item.trader}</span>
        <img src={Share1} alt="" style={{ width: "21px" }} />
      </div>
      <div className="field">
        <span>
          {item.lastTransaction || "-"}
          <img src={Share1} alt="" style={{ width: "21px" }} />
        </span>
      </div>
      <div
        className="field"
        style={{
          paddingTop: item.lastTransactionTime ? "12px" : 0,
        }}
      >
        {item.lastTX_time ? (
          <>
            <span className="line1">
              {item.lastTX_time
                ? moment(item.lastTX_time).format("YYYY-MM-DD HH:mm:ss")
                : "-"}
            </span>
            <span className="line2">
              {item.lastTX_time ? moment(item.lastTX_time).fromNow() : "-"}
            </span>
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
        <span className="line1">
          {item.update_time
            ? moment(item.update_time).format("YYYY-MM-DD HH:mm:ss")
            : "-"}
        </span>
        <span className="line2">
          {item.update_time ? moment(item.update_time).fromNow() : "-"}
        </span>
      </div>
    </div>
  );
}
