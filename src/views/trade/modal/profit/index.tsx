/**
 * Modal - Take Profit  /  Stop Loss
 */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/buttons/borderButton";
import { ModalWithTitle } from "@/components/modal";
import { RootStore } from "@/store";
import { amountFormt, checkNumber, fck } from "@/utils/utils";
import { SideEnum, fromContractUnit, OrderTypeEnum, PositionView} from "@/utils/contractUtil";
import Input from "@/components/input";
import Type from "@/components/type";
import "./index.less";

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

  const [value, setValue] = useState("");
  const [value1, setValue1] = useState("");
  const currentToken = props.getPairByAddress(position.token);
  const avgPrice = fck(position.averagePrice, -8, 2);
  const avgPriceArr = avgPrice.split(".")
  console.log("currentToken", currentToken);
  return (
    <ModalWithTitle className="trade-profit-modal" close={close} title={'Take Profit / Stop Loss'}>
      <div className="list">
        <div className="card">
          <div className="t">
            <span className="t1">{currentToken.name}</span>
            <Type t={position.side === SideEnum.LONG ? 'Long' : (position.side === SideEnum.SHORT ? 'Short' : '2-Way')} />
          </div>
          <div className="num">
            <span className="big-num">{avgPriceArr[0]}</span>
            <span className="small-num">.{avgPriceArr[1]}</span>
            <span className={`per ${currentToken.percent > 0 ? 'per-g' : ''}`}>{amountFormt(currentToken.percent, 2, true, "--", 0)}%</span>
          </div>
          <div className="line line0">
            Position Average Price : <span className="line-num">{fck(position?.spotPrice, -8, 2)}</span>
          </div>
        </div>
        <Input
          className="trade-profit-input1"
          value={value}
          onChange={(e: any) => setValue(e.target.value)}
          label={`Take Profit`}
          unit={unit}
        />
        <div className="intro">
          When market price reaches <span className="n0">34567.89</span> USDT,
          it will trigger Take Profit order to close this position. Estimated
          profit will be <span className="n1">12345.67</span> USDT.
        </div>
        <Input
          className="trade-profit-input2"
          value={value1}
          onChange={(e: any) => setValue1(e.target.value)}
          label={`Stop Loss`}
          unit={unit}
        />
        <div className="intro">
          When market price reaches - USDT, it will trigger Stop Loss order to
          close this position. Estimated loss will be - USDT.
        </div>
      </div>

      <Button
        text="Confirm"
        click={confirm}
        fill={true}
        className="trade-profit-btn"
      />
    </ModalWithTitle>
  );
}

export default ProfitModal;
