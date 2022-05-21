import React, { useCallback, useEffect, useState } from "react";
import IconFont from "@/components/IconFont";
import { Row, Col, Modal, Tooltip } from "antd";
import { RightOutlined } from "@ant-design/icons";
import Chart, { timeOptions } from "./chart";
import { FormattedMessage, useIntl } from "react-intl";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import contractModel, {
  ContractState,
  TokenPair,
} from "@/store/modules/contract";
import { RootStore } from "@/store";
import { amountFormt, fck } from "@/utils/utils";
import {
  fromContractUnit,
  OpenType,
  SideEnum,
  Token,
} from "@/utils/contractUtil";
import Notice from "@/components/notice";
import arrow from "@/assets/images/arrowd.png";
import arrow1 from "@/assets/images/arrow1.png";
import search from "@/assets/images/search.png";
import search1 from "@/assets/images/search1.png";
import { timeList } from "./config";
import "./index.less";

declare type Context = {
  tokenMiningRateEvent: EventSource | null;
};
const context: Context = {
  tokenMiningRateEvent: null,
};

function DataPanel() {
  const [showList, setShowList] = useState(false);
  const [time, setTime] = useState<any>("5m");
  const [showTimeList, setShowTimeList] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  function intl<T>(id: string, values: { [key: string]: T } = {}) {
    return formatMessage({ id }, values);
  }
  const $t = intl;
  const contractState = useSelector<RootStore, ContractState>(
    state => state.contract
  );
  // the token pairs selectable
  const tokenPairs = useSelector<RootStore, TokenPair[]>(
    state => state.contract.pairs
  );
  const curTokenPair = useSelector<RootStore, TokenPair>(
    state => state.contract.curPair
  );
  const curPrice = contractState.curPair.num || 0;
  const curPercent = contractState.curPair.percent || 0;
  const pcRate = contractState.contractData.positionChangeFeeRatio || 0;
  const [timeGap, setTimeGap] = useState<Partial<string>>("1h");
  const walletInfo = useSelector((state: RootStore) => state.user);
  const curPair = useSelector((state: RootStore) => state.contract.curPair);
  const loadHomeData = useCallback(() => {
    const trader = walletInfo.selectedAddress;
    if (!trader) {
      return;
    }
    const action = contractModel.actions.loadHomeData({
      trader,
      side: SideEnum.SHORT,
      token: curTokenPair.address,
      openType: OpenType.MarketOrder,
    });
    dispatch(action);
  }, [walletInfo, curTokenPair]);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  useEffect(() => {
    if (!walletInfo.trader) {
      return;
    }
    const priceChangeAction = contractModel.actions.onPriceChange(
      walletInfo.trader,
      () => {
        loadHomeData();
      }
    );
    priceChangeAction(dispatch);
  }, [walletInfo]);

  // current token price array
  const curTokenPairVal = fck(curTokenPair.num, 0, 2).split(".");

  console.log(tokenPairs);

  return (
    <Row className="main-block data-panel-container">
      <Col className="list">
        <div
          className={`types ${showList ? "types-active" : ""}`}
          onClick={() => {
            setShowList(!showList);
          }}
        >
          <div className="t">
            <span>{curTokenPair.name}</span>
            <img src={showList ? arrow1 : arrow} alt="" />
          </div>
          <div className="data">
            <span className="num">{curTokenPairVal[0]}</span>
            <span className="num1">{curTokenPairVal[1]}</span>
            <span
              className={`per ${
                curTokenPair.percent > 0 ? "per-green" : "per-red"
              }`}
            >
              {amountFormt(curTokenPair.percent, 2, true, "--", 0)} %
            </span>
          </div>
        </div>
        <div className="item item0">
          <div className="t">
            <span>Net Position Rate</span>
            <Notice title="Net Position Rate" />
          </div>
          <div className="val">-1.23% ( -12.34 BTC )</div>
          <div className="vl" />
        </div>

        <div className="item">
          <div className="t">
            <span>PCF Rate</span>
            <Notice title="PCF Rate" />
          </div>
          <div className="val">-1.23</div>
          <div className="vl" />
        </div>

        <div className="item">
          <div className="t">
            <span>Position Mining APY.</span>
            <Notice title="Position Mining APY." />
          </div>
          <div className="val">
            13.57% <span>Long</span> / 56.78% <span>Short</span>
          </div>
        </div>
      </Col>

      <div className="types-list-wrapper">
        {showList && (
          <div className="types-list">
            <div className={`search ${searchFocus ? "search-active" : ""}`}>
              <div className="icon">
                <img src={searchFocus ? search1 : search} alt="" />
              </div>
              <input
                type="text"
                placeholder="Search derivatives"
                value={searchValue}
                onChange={(e: any) => {
                  setSearchValue(e.target.value);
                }}
                onFocus={() => {
                  setSearchFocus(true);
                }}
                onBlur={() => {
                  setSearchFocus(false);
                }}
              />
            </div>
            <div className="lists">
              {tokenPairs.map((item, index) => {
                if (item.name.includes(searchValue)) {
                  return (
                    <Item
                      data={item}
                      key={index}
                      name={item.name}
                      percent={item.percent}
                      enable={item.enable}
                      value={item.num}
                      click={() => {
                        if (item.enable) {
                          setShowList(false);
                          dispatch(
                            contractModel.actions.updateCurTokenPair(item)
                          );
                        }
                      }}
                    />
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </div>
        )}
      </div>

      <Col flex="100%" className="chart-wrapper">
        <div
          className={`time-select ${showTimeList ? "time-select-active" : ""}`}
        >
          <span className="time">{time}</span>
          <span
            className="arrow"
            onClick={() => {
              setShowTimeList(!showTimeList);
            }}
          >
            <img src={showTimeList ? arrow1 : arrow} alt="" />
          </span>
        </div>
        {showTimeList && (
          <div className="time-select-list">
            {timeList.map((val, index) => {
              console.log(val);
              if (val === "hr") {
                return <div className="hr" key={index}></div>;
              } else {
                return (
                  <div
                    className={`time ${time === val[0] ? "time-active" : ""} `}
                    key={val[0]}
                    onClick={() => {
                      setTime(val[0]);
                      setShowTimeList(!showTimeList);
                    }}
                  >
                    {val[0]}
                  </div>
                );
              }
            })}
          </div>
        )}
        <Chart token={curPair.key} curPrice={curPrice} bar={timeGap} />
      </Col>
    </Row>
  );
}

export default DataPanel;

interface ItemProps {
  name: string;
  value: number;
  percent: number;
  enable: boolean;
  data: any;
  click: any;
}

function Item(props: ItemProps) {
  return (
    <div
      className={`item ${props.enable ? "" : "item-disabled"}`}
      onClick={props.click}
    >
      <div className="t">{props.name}</div>
      <div className="p">{props.value}</div>
      <div className="tag">
        <span className={props.percent < 0 ? "red" : ""}>
          {amountFormt(props.percent, 2, true, "--", 0)}%
        </span>
      </div>
      <div className="per">
        <span className="n">{0}%</span>
        <span>APY</span>
      </div>
    </div>
  );
}
