// @ts-nocheck
import React, { useCallback, useEffect, useState ,useMemo} from "react";
import { Row, Col, Tooltip } from "antd";
import Chart from "./chart";
import { useDispatch, useSelector } from "react-redux";
import contractModel, { ContractState, TokenPair, } from "@/store/modules/contract";
import { amountFormt, fck } from "@/utils/utils";
import { OpenType, SideEnum, } from "@/utils/contractUtil";
import { DataModel, RootStore } from "@/store";
import { getUSDTokenName } from "@/config";
import Notice from "@/components/notice";
import arrow from "@/assets/images/arrowd.png";
import arrow1 from "@/assets/images/arrow1.png";
import search from "@/assets/images/search.png";
import search1 from "@/assets/images/search1.png";
import { TimeList } from "./config";
import "./index.less";

function DataPanel() {
  const [showList, setShowList] = useState(false);
  const [showTimeList, setShowTimeList] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [holdVolume, setHoldVolume] = useState([0,0]);
  const dispatch = useDispatch();

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

  useEffect(() => {
    document.addEventListener("click", function(){
      setShowList(false);
    }, false)
    const firstToken = tokenPairs[0].address;
    getHoldVolume(firstToken);
  }, []);


  function getHoldVolume(token) {
    const loadHeldDataAction = DataModel.actions.loadHeldData(token);
    loadHeldDataAction(dispatch).then(data => {
      if(data && data.current){
        setHoldVolume([data.current.long_position_amount, data.current.short_position_amount])
      }
    })
  }

  const net = useMemo(() => {
    return holdVolume[0] - holdVolume[1]
  }, [holdVolume]);

  const netRate = useMemo(() => {
    if(holdVolume[0] - holdVolume[1] === 0){
      return 0;
    }
   let v =  (holdVolume[0] - holdVolume[1]) / (holdVolume[0] + holdVolume[1]);
    return (v * 100).toFixed(2);
  }, [holdVolume]);


  return (
    <Row className="main-block data-panel-container">
      <Col className="list">
        <div
          className={`types ${showList ? "types-active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setShowList(!showList);
          }}
        >
          <div className="t">
            <span>{curTokenPair.name}</span>
            <img src={showList ? arrow1 : arrow} alt="" />
          </div>
          <div className="data">
            <span className="num">{curTokenPairVal[0]}</span>
            <span className="num1">.{curTokenPairVal[1]}</span>
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

          <Tooltip title={`${netRate} % ( ${net} ${getUSDTokenName()} )`}>
            <div className="val val-hidden">{netRate} % ( {net} {getUSDTokenName()} )</div>
          </Tooltip>
          <div className="vl" />
        </div>

        <div className="item">
          <div className="t">
            <span>PCF Rate</span>
            <Notice title="PCF Rate" />
          </div>
          <div className="val">{amountFormt(pcRate, 4, true, "0", -6)}</div>
          <div className="vl" />
        </div>

        <div className="item">
          <div className="t">
            <span>Position Mining APY.</span>
            <Notice title="Position Mining APY." />
          </div>
          <div className="val">
            {amountFormt(curTokenPair.longPmrRate, 2, false, "--", 0)}%
            <span>Long</span> /{" "}
            {amountFormt(curTokenPair.shortPmrRate, 2, false, "--", 0)}%
            <span>Short</span>
          </div>
        </div>
      </Col>

      <div className="types-list-wrapper" onClick={(e) => {
        e.stopPropagation();
      }}>
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
                if (item.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())) {
                  if(!item.enable){
                    return null;
                  }
                  return (
                    <Item
                      rate={Math.max(item.longPmrRate, item.shortPmrRate)}
                      data={item}
                      key={index}
                      name={item.name}
                      percent={item.percent}
                      enable={item.enable}
                      value={item.num}
                      click={() => {
                        if (item.enable) {
                          getHoldVolume(item.address)
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
          <span className="time">{timeGap}</span>
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
            {TimeList.map((val: any, index) => {
              if (val === "hr") {
                return <div className="hr" key={index}></div>;
              } else {
                return (
                  <div
                    className={`time ${
                      timeGap === val.value ? "time-active" : ""
                    } `}
                    key={val.label}
                    onClick={() => {
                      setTimeGap(val.value);
                      setShowTimeList(!showTimeList);
                    }}
                  >
                    {val.value}
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
  rate: any;
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
        <span className="n">{amountFormt(props.rate, 2, false, "--", 0)}%</span>
        <span>APY</span>
      </div>
    </div>
  );
}
