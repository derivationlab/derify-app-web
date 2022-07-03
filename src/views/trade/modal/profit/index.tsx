/**
 * Modal - Take Profit  /  Stop Loss
 */
import React, { useState, useCallback, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/buttons/borderButton";
import { ModalWithTitle } from "@/components/modal";
import { amountFormt, checkNumber, fck } from "@/utils/utils";
import ErrorMessage from "@/components/ErrorMessage";
import { SideEnum, fromContractUnit, OrderTypeEnum, PositionView, toContractNum} from "@/utils/contractUtil";
import { AppModel, RootStore } from "@/store";
import contractModel from "@/store/modules/contract";
import Input from "@/components/input";
import Type from "@/components/type";
import "./index.less";
import { message } from "antd";

interface IProfitModalProps {
  close: () => void;
  confirm: () => void;
  getPairByAddress: any;
  position: any;
  unit: string;
}

function ProfitModal(props: IProfitModalProps) {
  const { close, confirm, position, unit, getPairByAddress} = props;
  const walletInfo = useSelector((state: RootStore) => state.user);
  const dispatch = useDispatch();

  const [errorMsg, setErrorMsg] = useState("");
  const [takeProfitPrice, setTakeProfitPrice] = useState("");
  const [stopLossPrice, setStopLossPrice] = useState("");
  const [profitAmount, setProfitAmount] = useState<number>(0);
  const [lossAmount, setLossAmount] = useState<number>(0);

  const currentToken = getPairByAddress(position.token);
  const curPrice = fck(position?.spotPrice, -8, 2);
  const avgPrice = fck(position.averagePrice, -8, 2);
  const curPriceArr = curPrice.split(".")

  const calLossAndProfit = useCallback((takeProfitPrice, stopLossPrice) => {
    const takeProfitPriceNum = takeProfitPrice ? parseFloat(takeProfitPrice) : -1;
    const stopLossPriceNum = stopLossPrice ? parseFloat(stopLossPrice) : -1;
    const position = props.position;
    if (takeProfitPriceNum > 0) {
      const profitAmount = (takeProfitPriceNum - fromContractUnit(position?.averagePrice))
        * fromContractUnit(position?.size) * (position?.side === SideEnum.LONG ? 1 : -1);
      setProfitAmount(profitAmount);
    } else {
      setProfitAmount(0);
    }
    if (stopLossPriceNum > 0) {
      const lostAmount = (stopLossPriceNum - fromContractUnit(position?.averagePrice))
        * fromContractUnit(position?.size) * (position?.side === SideEnum.LONG ? 1 : -1);
      setLossAmount(lostAmount);
    } else {
      setLossAmount(0);
    }
  }, [takeProfitPrice, stopLossPrice, position?.size, position?.side, position?.averagePrice, position?.spotPrice]);

  const onTakeProfitPriceChange = (value: string) => {
    const checkNumRet = checkNumber(value);
    if (checkNumRet.value === null) {
      return;
    }
    if (!checkNumRet.success) {
      setErrorMsg("NumberError")
    } else {
      if (checkNumber(stopLossPrice).success) {
        setErrorMsg("");
      }
    }
    setTakeProfitPrice(checkNumRet.value);
    calLossAndProfit(checkNumRet.value, stopLossPrice);
  };

  const onStopLossPriceChange = (value: string) => {
    const checkNumRet = checkNumber(value);
    if (checkNumRet.value === null) {
      return;
    }
    if (!checkNumRet.success) {
      setErrorMsg("NumberError");
    } else {
      if (checkNumber(takeProfitPrice).success) {
        setErrorMsg("");
      }
    }
    setStopLossPrice(checkNumRet.value);
    calLossAndProfit(takeProfitPrice, checkNumRet.value);
  };

  useEffect(() => {
    if (position && position.stopProfitPrice && position.stopProfitPrice > 0) {
      setTakeProfitPrice(fck(position?.stopProfitPrice, -8, 2));
    } else {
      setTakeProfitPrice("");
    }
    if (position && position.stopLossPrice && position.stopLossPrice > 0) {
      setStopLossPrice(fck(position?.stopLossPrice, -8, 2));
    } else {
      setStopLossPrice("");
    }
    calLossAndProfit(fromContractUnit(position?.stopProfitPrice), fromContractUnit(position?.stopLossPrice));
  }, [position]);

  const onOk = useCallback((e) => {
    const trader = walletInfo.selectedAddress;
    if (!trader) {
      return;
    }
    const checkProfitRes = checkNumber(takeProfitPrice);
    if (!checkProfitRes.success) {
      return setErrorMsg("NumberError");
    }
    const checkLossRes = checkNumber(stopLossPrice);
    if (!checkLossRes.success) {
      return setErrorMsg("NumberError");
    }
    if (checkProfitRes.value && profitAmount <= 0) {
      setErrorMsg("NumberError");
      return;
    }
    if (checkLossRes.value && lossAmount > 0) {
      return setErrorMsg("NumberError");
    }
    let takeProfitPriceNum: number;
    let stopLossPriceNum: number;
    if (amountFormt(stopLossPrice, -1, false, "") === amountFormt(position?.stopLossPrice, -1, false, "", -8)) {
      stopLossPriceNum = 0;
    } else if (stopLossPrice == "") {
      stopLossPriceNum = -1;
    } else {
      stopLossPriceNum = parseFloat(stopLossPrice);
    }
    if (amountFormt(takeProfitPrice, -1, false, "") === amountFormt(position?.stopProfitPrice, -1, false, "", -8).toString()) {
      takeProfitPriceNum = 0;
    } else if (takeProfitPrice == "") {
      takeProfitPriceNum = -1;
    } else {
      takeProfitPriceNum = parseFloat(takeProfitPrice);
    }
    const orerStopPositionAction = contractModel.actions.orderStopPosition({
      trader,
      token: position?.token, side: position?.side, takeProfitPrice: toContractNum(takeProfitPriceNum),
      stopLossPrice: toContractNum(stopLossPriceNum),
    });
    orerStopPositionAction(dispatch).then(() => {
      close();
      message.success("success")
      dispatch(AppModel.actions.updateTradeLoadStatus());
    }).catch(() => {
      setErrorMsg("failed");
    });
  }, [walletInfo.selectedAddress, takeProfitPrice, stopLossPrice]);

  return (
    <ModalWithTitle className="trade-profit-modal" close={close} title={'Take Profit / Stop Loss'}>
      <ErrorMessage
        style={{ margin: "10px 0" }}
        msg={errorMsg} visible={!!errorMsg}
        onCancel={() => setErrorMsg("")}
      />
      <div className="list">
        <div className="card">
          <div className="t">
            <span className="t1">{currentToken.name}</span>
            <Type t={position.side === SideEnum.LONG ? 'Long' : (position.side === SideEnum.SHORT ? 'Short' : '2-Way')} />
          </div>
          <div className="num">
            <span className="big-num">{curPriceArr[0]}</span>
            <span className="small-num">.{curPriceArr[1]}</span>
            <span className={`per ${currentToken.percent > 0 ? 'per-g' : ''}`}>{amountFormt(currentToken.percent, 2, true, "--", 0)}%</span>
          </div>
          <div className="line line0">
            Position Average Price : <span className="line-num">{avgPrice}</span>
          </div>
        </div>
        <Input
          className="trade-profit-input1"
          value={takeProfitPrice}
          onChange={(e: any) => onTakeProfitPriceChange(e.target.value)}
          label={`Take Profit`}
          unit={unit}
        />
        <div className="intro">
          When market price reaches <span className="n0">{amountFormt(takeProfitPrice ? takeProfitPrice : "--")}</span> {unit},
          it will trigger Take Profit order to close this position. Estimated
          profit will be <span className={profitAmount > 0 ? 'n1' : 'n2'}>{amountFormt(profitAmount, 2, true, "--")}</span> {unit}
        </div>
        <Input
          className="trade-profit-input2"
          value={stopLossPrice}
          onChange={(e: any) => onStopLossPriceChange(e.target.value)}
          label={`Stop Loss`}
          unit={unit}
        />
        <div className="intro">
          When market price reaches <span>{amountFormt(stopLossPrice ? stopLossPrice : "--")}</span> {unit}, it will trigger Stop Loss order to
          close this position. Estimated loss will be <span className={lossAmount > 0 ? 'n1' : 'n2'}>{amountFormt(lossAmount, 2, true, "--")}</span> {unit}.
        </div>
      </div>

      <Button
        text="Confirm"
        click={onOk}
        fill={true}
        className="trade-profit-btn"
      />
    </ModalWithTitle>
  );
}

export default ProfitModal;
