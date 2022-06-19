import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/buttons/borderButton";
import { ModalWithTitle } from "@/components/modal";
import Type from "@/components/type";
import Input from "@/components/input";
import Percent from "@/components/percent";
import { getUSDTokenName } from "@/config";
import { AppModel, RootStore } from "@/store";
import contractModel from "@/store/modules/contract";
import {
  SideEnum as TradeTypes,
  fromContractUnit,
  UnitTypeEnum,
  toContractUnit,
  convertAmount2TokenSize, toContractNum,
} from "@/utils/contractUtil";
import "./closeModa.less";
import { fck, amountFormt, amountFormtNumberDefault } from "@/utils/utils";
import { message } from "antd";

interface ClosePositionProps {
  close: () => void;
  title?: string;
  data: any;
  getPairByAddress: any;
}

function ClosePositionModal(props: ClosePositionProps) {
  const { data } = props;
  const dispatch = useDispatch();
  const trader = useSelector((state: RootStore) => state.user.selectedAddress);
  const walletInfo = useSelector((state: RootStore) => state.user);
  const [closeUpperBond, setCloseUpperBond] = useState<number>(0);
  const [value, setValue] = useState("");
  const [percent, setPercent] = useState<any>(100);
  const [errorMsg, setErrorMsg] = useState<any>("");
  const [step, setStep] = useState(1);
  // market price ...
  const [openType, setOpenType] = useState(0);
  // the pcf of close position
  const [pcf,setPcf] = useState<number>(0);
  // the tradeFee of close position
  const [tradeFee,setTradeFee] = useState<number>(0);

  const type = data.side === TradeTypes.LONG ? "Long" : (
    data.side === TradeTypes.SHORT ? "Short" : "2-Way"
  );
  const currentToken = props.getPairByAddress(data.token);
  const maxSize = fromContractUnit(data.size);
  const priceArr = (currentToken.num + "").split(".");
  const volume = amountFormt(data.size, 4, false, "0", -8);

  // get the upperbond
  const updateCloseUpperBound = useCallback(() => {
    if (trader && data) {
      const getCloseUpperBoundAction = contractModel.actions.getCloseUpperBound(trader, data.token, data.side);
      getCloseUpperBoundAction(dispatch).then((maxSize) => {
        if (maxSize) {
          setCloseUpperBond(fromContractUnit(maxSize));
        }
      });
    }
  }, [trader, data.side, data.token]);

  const confirm = () => {
    if (step === 1) {
      // show the fees and ....
      setStep(2);
    } else {
      const trader = walletInfo.selectedAddress;
      const brokerId = walletInfo.brokerId;
      const sizeAmount = parseFloat(value);
      if (!trader || !brokerId || !data) {
        return;
      }
      if (sizeAmount > closeUpperBond || sizeAmount <= 0) {
        return;
      }
      const closePositionAction = contractModel.actions.closePosition(trader, data.token, data.side, toContractUnit(value), brokerId);
      props.close();
      closePositionAction(dispatch).then(() => {
        message.success("success");
      }).catch(e => {
        message.error("error");
        console.log(e);
      });
    }
  };

  // when the input of amount change
  const inputValueChange = (e: any) => {
    let v = e.target.value;
    if (/^\d+(.\d*)?$/.test(v)) {
      let size = parseFloat(v);
      if (size > maxSize) {
        v = maxSize.toString();
      }
      setValue(v.replace(/[^0-9.]/g, ""));
      setPercent("");
    }
  };

  useEffect(() => {
    if (trader && data) {
      dispatch(contractModel.actions.updateTokenSpotPrice(trader, data.token));
    }
  }, [trader, data.token]);

  useEffect(() => {
    setValue(maxSize + "");
  }, [data.size]);

  useEffect(() => {
    updateCloseUpperBound();
  }, []);

  // calculate the pcf and tradeFee
  useEffect(() => {
    const trader = walletInfo.selectedAddress;
    const unit = UnitTypeEnum.USDT;
    const size = parseFloat(value);
    const price = currentToken.num;
    let tokenSize = convertAmount2TokenSize(unit, toContractNum(size), toContractNum(price));
    const params = {
      trader,
      side: data.side,
      actionType: 0,
      token: currentToken.address,
      size: toContractNum(tokenSize),
      price: toContractNum(price)
    };
    // @ts-ignore
    const getPCFAction = contractModel.actions.getPositionChangeFee(params)
    getPCFAction(dispatch).then((_pcf) => {
      setPcf(fromContractUnit(_pcf))
    }).catch(e => {});
    // @ts-ignore
    const tradeFeeAction = contractModel.actions.getTradingFee(params.token, params.trader, params.size,params.price);
    tradeFeeAction.then((val) => {
      setTradeFee(fromContractUnit(val));
    })
  }, [data, walletInfo, value])
  return (
    <ModalWithTitle
      title={props.title || "Close Position"}
      close={props.close}
      className="close-position-modal1"
    >
      {
        step === 1 && (
          <div className="list">
            <div className="card">
              <div className="t">
                <span className="t1">{currentToken.name}</span>
                <Type t={type} c={fromContractUnit(data.leverage)} />
              </div>
              <div className="num">
                <span className="big-num">{priceArr[0]}</span>
                <span className="small-num">.{priceArr[1]}</span>
                <span className="per">{currentToken.percent.toFixed(2)}%</span>
              </div>
              <div className="line line0">
                Position Average Price :{" "}
                <span className="line-num">{amountFormt(data.averagePrice, 2, false, "--", -8)}</span>
              </div>
              <div className="line">
                Position Held : <span className="line-num">{volume}</span> BTC /
                <span className="line-num">{(currentToken.num * volume).toFixed(2)}</span> {getUSDTokenName()}
              </div>
            </div>
            <Input
              className="close-pos-input"
              value={value}
              onChange={inputValueChange}
              label="Amount to Close"
              unit={currentToken.key}
            />
            <Percent
              className="close-pos-percent"
              value={percent}
              setValue={e => {
                setPercent(e);
                const sizeAmount = fck((e / 100.0 * maxSize), 0, 8);
                setValue(sizeAmount + "");
                if (parseFloat(sizeAmount) > 0) {
                  setErrorMsg("");
                }
              }}
            />
          </div>
        )
      }

      {step === 2 && (
        <div className="list">
          <div className="card">
            <div className="t">
              <span className="t1">{currentToken.name}</span>
              <Type t={type} c={fromContractUnit(data.leverage)} />
              <div className="n">
                <span>{amountFormt(Math.max(currentToken.shortPmrRate, currentToken.longPmrRate), 2, false, "--", 0)}% </span> APY.
              </div>
            </div>
            {openType === 0 ? (
              <div className="num">Market Price </div>
            ) : (
              <div className="num">
                <span className="big-num">{(data.limitPrice + "").split(".")[0]}</span>
                <span className="small-num">
                  {(data.limitPrice + "").includes(".") ? `.${(data.limitPrice + "").split(".")[1]}` : ""}
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
                    <span className="n">{value}</span>
                    <span className="t">{currentToken.key}</span>
                  </div>
                )
              }
              {
                (type === "2-Way" || type === "Short") && (
                  <div className="l">
                    <span className="n">{value}</span>
                    <span className="t">{currentToken.key}</span>
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
  );
}

export default ClosePositionModal;

