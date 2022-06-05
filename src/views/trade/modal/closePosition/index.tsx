// @ts-nocheck
import React, { useCallback, useEffect, useState } from "react";
import Button from "@/components/buttons/borderButton";
import {useDispatch, useSelector} from "react-redux";
import {message} from "antd";
import {
  convertAmount2TokenSize,
  fromContractUnit,
  OpenType,
  SideEnum,
  toContractNum,
  UnitTypeEnum
} from "@/utils/contractUtil";
import { ModalWithTitle } from "@/components/modal";
import {amountFormtNumberDefault, fck} from "@/utils/utils";
import Type from "@/components/type";
import Input from "@/components/input";
import Percent from "@/components/percent";
import {getUSDTokenName} from "@/config";
import { AppModel, RootStore } from "@/store";
import contractModel, {OpenUpperBound, TokenPair} from "@/store/modules/contract";
import { DerifyTradeModal } from "@/views/CommonViews/ModalTips";
import "./index.less";

interface ClosePositionProps {
  close: () => void;
  confirm: () => void;
  type: "Short" | "Long" | "2-Way";
  operate: "select" | "";
  title?: string;
  data: any;
}

function PositionModal(props: ClosePositionProps) {
  const {type, data} = props;
  const dispatch = useDispatch();
  const curPair = useSelector(state => state.contract.curPair)
  const walletInfo = useSelector((state:RootStore) => state.user);
  const [value, setValue] = useState('')
  const [pcf,setPcf] = useState<number>(0);
  const [tradeFee,setTradeFee] = useState<number>(0);
  const [sysOpenUpperBound,setSysOpenUpperBound] = useState<OpenUpperBound>({amount:0,size:0});

  // calculate the pcf and tradeFee
  useEffect(() => {
    const trader = walletInfo.selectedAddress;
    const {side,token,size,openType,unit, limitPrice} = data;
    const price = openType === OpenType.MarketOrder ? token.num : limitPrice;
    let tokenSize = convertAmount2TokenSize(unit, toContractNum(size), toContractNum(price));
    const params = {
      trader,
      side: side,
      actionType: 0,
      token: token.address,
      size: toContractNum(tokenSize),
      price: toContractNum(price)
    };
    const getPCFAction = contractModel.actions.getPositionChangeFee(params)
    getPCFAction(dispatch).then((pcf) => {
      setPcf(fromContractUnit(pcf))
    }).catch(e => {});

    const tradeFeeAction = contractModel.actions.getTradingFee(params.token, params.trader, params.size,params.price);
    tradeFeeAction.then((val) => {
      setTradeFee(fromContractUnit(val));
    })
    const getSysOpenUpperBoundAction = contractModel.actions.getSysOpenUpperBound(trader, params.side,params.token);
    getSysOpenUpperBoundAction(dispatch).then((val:OpenUpperBound) => {
      setSysOpenUpperBound(val);
    }).catch(e => {});
  }, [data, walletInfo]);

  const checkAndGetMaxBound = useCallback((sysOpenUpperBound, data) => {
    if(!data){
      return 0
    }
    const {size, side, unit, openType} = data;
    if(side === SideEnum.HEDGE) {
      return size;
    }
    if(openType !== OpenType.MarketOrder) {
      return size;
    }
    if(!sysOpenUpperBound){
      return 0;
    }
    if(unit === UnitTypeEnum.USDT){
      if (size > fromContractUnit(sysOpenUpperBound.size)) {
        return fromContractUnit(sysOpenUpperBound.size);
      }
    } else {
      if (size > fromContractUnit(sysOpenUpperBound.amount)) {
        return fromContractUnit(sysOpenUpperBound.amount);
      }
    }
    return size
  },[sysOpenUpperBound,data])

  const confirm = useCallback(() => {
    if(!walletInfo.selectedAddress || !walletInfo.brokerId) {
      return;
    }
    const size = checkAndGetMaxBound(sysOpenUpperBound, data)
    if(size <= 0 || !data) {
      return;
    }
    const leverage = data.leverage
    let price = null
    if (data.openType === OpenType.MarketOrder) {
      price = curPair.num;
    } else {
      price = data.limitPrice;
    }
    const {unit} = data
    const params = {
      trader: walletInfo.selectedAddress,
      token: data.token.address,
      quantityType: unit === UnitTypeEnum.USDT ? 1 : 0,
      side: data.side,
      size: toContractNum(size),
      openType: data.openType,
      price: toContractNum(price),
      leverage: toContractNum(leverage),
      brokerId: walletInfo.brokerId,
    }
    const openPositionAction = contractModel.actions.openPosition(params);
    props.close();
    openPositionAction(dispatch).then(() => {
      message.success("success");
      dispatch(AppModel.actions.updateTradeLoadStatus());
    }).catch((e) => {
      message.error("error");
      console.log(e)
    });
  }, [data, walletInfo,sysOpenUpperBound])

  return (
    <ModalWithTitle
      title={props.title || "Close Position"}
      close={props.close}
      className="close-position-modal"
    >
      {props.operate === "select" && (
        <div className="list">
          <div className="card">
            <div className="t">
              <span className="t1">BTC-USDT</span>
              <Type t={type} c={data.leverage} />
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
            value={value}
            onChange={e=> setValue(e.target.value)}
            label="Amount to Close"
            unit="BTC"
          />
          <Percent className="close-pos-percent" setValue={e => {
            console.log(e)}
          }/>
        </div>
      )}

      {props.operate === "" && (
        <div className="list">
          <div className="card">
            <div className="t">
              <span className="t1">{data.token.name}</span>
              <Type t={type} c={data.leverage} />
              <div className="n">
                <span>12.34% </span> APY.
              </div>
            </div>

            {data.openType === 0 ? (
              <div className="num">Market Price </div>
            ) : (
              <div className="num">
                <span className="big-num">{(data.limitPrice + '').split(".")[0]}</span>
                <span className="small-num">
                  {(data.limitPrice + '').includes(".") ? `.${(data.limitPrice + '').split(".")[1]}` : ''}
                </span>
                <div className="p">Limit Price</div>
              </div>
            )}
          </div>

          <div className="item item0 item2">
            <span className="left">Volume</span>
            <div className="rights">
              {
                (type === "2-Way" || type === "Long") && (
                  <div className="l">
                    <Type t={"Long"} />
                    <span className="n">{data.size}</span>
                    <span className="t">{data.unit === UnitTypeEnum.USDT ? `${getUSDTokenName()}`: curPair.key}</span>
                  </div>
                )
              }
              {
                (type === "2-Way" || type === "Short") && (
                  <div className="l">
                    <Type t={"Short"} />
                    <span className="n">{data.size}</span>
                    <span className="t">{data.unit === UnitTypeEnum.USDT ? `${getUSDTokenName()}`: curPair.key}</span>
                  </div>
                )
              }
            </div>
          </div>

          <div className="item">
            <span>PCF</span>
            <div>
              <span className="n">{amountFormtNumberDefault(-pcf,4, true, 0)}</span>
              <span className="t">{getUSDTokenName()}</span>
            </div>
          </div>
          <div className="item item1">
            <span>Trading Fee</span>
            <div>
              <span className="n">{amountFormtNumberDefault(-tradeFee,4, true, 0)}</span>
              <span className="t">{getUSDTokenName()}</span>
            </div>
          </div>
        </div>
      )}

      <Button
        text="Confirm"
        click={confirm}
        fill={true}
        className="close-position-btn"
      />
    </ModalWithTitle>
  )
}

export default PositionModal;

