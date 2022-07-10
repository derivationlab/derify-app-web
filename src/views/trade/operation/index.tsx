// @ts-nocheck
import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Select, Button } from "antd";
import { useIntl } from "react-intl";
import { OpenType, toContractUnit, SideEnum, UnitTypeEnum, } from "@/utils/contractUtil";
import { useDispatch, useSelector } from "react-redux";
import contractModel, { TokenPair, OpenUpperBound, } from "@/store/modules/contract";
import { ContractModel, RootStore } from "@/store";
import { amountFormtNumberDefault, checkNumber, fck, amountFormt } from "@/utils/utils";
import { DerifyErrorNotice } from "@/components/ErrorMessage";
import { getUSDTokenName } from "@/config";
import notice from "@/assets/images/notice.png";
import Button1 from "@/components/buttons/borderButton";
import Percent from "@/components/percent";
import ModalOpenPosition from "../modal/openPosition";
import ModalWallet from "../modal/wallet";
import ModalProfit from "../modal/profit";

const { Option } = Select;
const LEVERAGES = [10,5,3,2,1];
// value 0 market
const type1 = OpenType.MarketOrder;

export declare type OpenConfirmData = {
  openType: OpenType;
  limitPrice: number;
  token: TokenPair;
  unit: UnitTypeEnum;
  side: number;
  size: number;
  leverage: number;
};

type boundData = {
  amount: number | string;
  size: number | string;
}

function Operation() {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const $t = (id: string) => formatMessage({ id });

  // state from redux
  const walletInfo = useSelector((state: RootStore) => state.user);
  const curPair = useSelector<RootStore, TokenPair>(
    state => state.contract.curPair,
  );
  const { accountData } = useSelector((state: RootStore) => state.contract);
  const loadAccountStatus = useSelector((state: RootStore) => state.app.reloadDataStatus.account);

  // state local
  const [walletType, setWalletType] = useState<"" | "withdraw" | "deposit">("");
  const [type, setType] = useState<"Short" | "Long" | "2-Way">("Long");
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showProfitModal, setShowProfitModal] = useState(false);
  const [openType, setOpenType] = useState<OpenType>(type1);
  const [leverage, setLeverage] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<string>(curPair.num.toFixed(2));
  const [size, setSize] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<number>(0);
  const [traderOpenUpperBound, setTraderOpenUpperBound] = useState<boundData>({ amount: 0, size: 0 });
  const [token, setToken] = useState<number>(UnitTypeEnum.USDT);
  const [openConfirmData, setOpenConfirmData] = useState<OpenConfirmData>();

  const getMaxSize = useCallback((traderOpenUpperBound: OpenUpperBound, token: number) => {
    return contractModel.actions.getOpenUpperBoundMaxSize(traderOpenUpperBound, token,);
  }, [showPositionModal, token],);

  const priceChange = (value: string) => {
    const checkNumRet = checkNumber(value);
    DerifyErrorNotice.error(checkNumRet.success ? null : $t("global.NumberError"));
    if (checkNumRet.value !== null) setLimitPrice(checkNumRet.value);
    updateMaxAmount(openType, checkNumRet.value, leverage);
  }

  const resetMax = useCallback((maxSize:number) =>{
    const checkNumRet = checkNumber(size, maxSize)
    if(checkNumRet.value !== null){
      setSize(checkNumRet.value);
    }
  }, [traderOpenUpperBound, token]);

  const sizeChange = useCallback((value:string) => {
    const maxSize = token === UnitTypeEnum.Percent ? 100 : getMaxSize(traderOpenUpperBound, token);
    const checkNumRet = checkNumber(value, maxSize)
    DerifyErrorNotice.error(checkNumRet.success ? null : $t("global.NumberError"));
    if(checkNumRet.value !== null){
      setSize(checkNumRet.value);
    }
  },[traderOpenUpperBound,token])

  const levChange = (v: number) => {
    setLeverage(v);
    updateMaxAmount(openType, limitPrice, v);
  }

  const onSliderChange = useCallback((value:number) => {
    const tokenSize = calculatePositionSize(size, token, traderOpenUpperBound,value);
    setSize(tokenSize.toString());
  }, [traderOpenUpperBound, token, size]);

  const tokenChange = useCallback(token => {
      setToken(token);
      resetMax(getMaxSize(traderOpenUpperBound, token));
      setMaxAmount(getMaxSize(traderOpenUpperBound, token));
    },
    [traderOpenUpperBound],
  );

  const openTypeChange = useCallback(val => {
    setOpenType(val);
    const price = curPair.num.toFixed(2);
    if (val === OpenType.LimitOrder) {
      setLimitPrice(price);
    }
    updateMaxAmount(val, price, leverage);
   }, [openType, curPair.num, leverage],);

  const updateMaxAmount = useCallback((openType, limitPrice, leverage) => {
      const trader = walletInfo.selectedAddress;
      if (!trader) {
        return;
      }
      const price = openType === type1 ? curPair.num : limitPrice;
      const params = {
        trader, openType,
        price: toContractUnit(price),
        leverage: toContractUnit(leverage),
        token: curPair.address,
      };
      const getTraderOpenUpperBoundAction = contractModel.actions.getTraderOpenUpperBound(params);
      const tokenNew = token;
      getTraderOpenUpperBoundAction(dispatch).then(data => {
        setTraderOpenUpperBound(data);
        setMaxAmount(getMaxSize(data, tokenNew));
        resetMax(getMaxSize(data, tokenNew));
      })
      .catch(e => {
        console.error("getTraderOpenUpperBoundAction", e);
      })
    }, [walletInfo.tradeDataTick, walletInfo.selectedAddress, leverage, curPair, openType, token,],
  );

  const calculatePositionSize = useCallback((size: string, unit: number, traderOpenUpperBound: OpenUpperBound, sliderValue: number,) => {
      const maxSize = getMaxSize(traderOpenUpperBound, unit);
      let newSize = 0;
      if (maxSize > 0) {
        newSize = amountFormtNumberDefault(
          (sliderValue / 100.0) * maxSize,
          4,
          false,
          0,
          0,
        );
      }
      return newSize;
    },
    [],
  );

  const openPositionConfirm = useCallback((side: number) => {
    const t = ['Long', 'Short', '2-Way'];
    let typeValue = openType;
    setType(t[side]);
    if(size === '' || size === undefined){
      return DerifyErrorNotice.error("Please input volume");
    }
    let checkNumRet = checkNumber(size, getMaxSize(traderOpenUpperBound, token),);
    if (!checkNumRet.success || !size) {
      return DerifyErrorNotice.error($t("global.NumberError"));
    }
    if (openType === OpenType.LimitOrder) {
      checkNumRet = checkNumber(limitPrice);
      if (!checkNumRet.success || !limitPrice) {
        return DerifyErrorNotice.error($t("global.NumberError"));
      }
    }
    if(openType === 1){
      if(side === 0) {
        if (parseFloat(limitPrice) > curPair.num) {
          typeValue = 0;
        }
      }
      if(side === 1){
        if(parseFloat(limitPrice) < curPair.num){
          typeValue = 0;
        }
      }
    }
    DerifyErrorNotice.error(null);
    const params: OpenConfirmData = {
      unit: token,
      openType: typeValue,
      limitPrice: parseFloat(limitPrice),
      token: curPair,
      side,
      size: Number.parseFloat(size),
      leverage,
    };
    setOpenConfirmData(params);
    setShowPositionModal(true)
  }, [openType, size, limitPrice, curPair, leverage, traderOpenUpperBound]);

  useEffect(() => {
    updateMaxAmount(openType, openType === type1 ? curPair.num : limitPrice, leverage,);
    const trader = walletInfo.trader;
    if (!trader) {
      return;
    }
    const onWithdrawAction = ContractModel.actions.onWithDraw(trader, () => {
      console.log("onWithdrawAction,updateMaxAmount");
      updateMaxAmount(openType, openType == type1 ? curPair.num : limitPrice, leverage,);
    });
    onWithdrawAction(dispatch);

    const onDepositAction = ContractModel.actions.onDeposit(trader, () => {
      console.log(`onDepositAction,updateMaxAmount,${token}`);
      updateMaxAmount(openType, openType == type1 ? curPair.num : limitPrice, leverage,);
    });
    onDepositAction(dispatch);

    const onOpenPositionAction = ContractModel.actions.onOpenPosition(trader, () => {
      console.log(`onOpenPositionAction,updateMaxAmount, ${token}`);
      updateMaxAmount(openType, openType == type1 ? curPair.num : limitPrice, leverage,);
    },);
    onOpenPositionAction(dispatch);

    const onClosePositionAction = ContractModel.actions.onClosePosition(trader, () => {
      console.log(`onClosePositionAction,updateMaxAmount, ${token}`);
      updateMaxAmount(openType, openType == type1 ? curPair.num : limitPrice, leverage,);
    },);
    onClosePositionAction(dispatch);
  }, [walletInfo, openType, curPair, leverage, limitPrice, token]);


  useEffect(() => {
    if (walletInfo.selectedAddress) {
      const loadAccountAction = ContractModel.actions.loadAccountData(walletInfo.selectedAddress);
      loadAccountAction(dispatch);
      const onDepositAction = ContractModel.actions.onDeposit(walletInfo.selectedAddress, function() {
        loadAccountAction(dispatch);
      });
      onDepositAction(dispatch);
      const onWithdrawAction = ContractModel.actions.onWithDraw(walletInfo.selectedAddress, function() {
        loadAccountAction(dispatch);
      });
      onWithdrawAction(dispatch);
      const onOpenPositionAction = ContractModel.actions.onOpenPosition(walletInfo.selectedAddress, function() {
        loadAccountAction(dispatch);
      });
      onOpenPositionAction(dispatch);
      const onClosePositionAction = ContractModel.actions.onClosePosition(walletInfo.selectedAddress, function() {
        loadAccountAction(dispatch);
      });
      onClosePositionAction(dispatch);
    }
  }, [walletInfo.selectedAddress, loadAccountStatus]);



  const num1 = fck(accountData?.marginBalance, -8, 2);
  const num1Data = num1.split(".");
  const num2 = fck(accountData?.availableMargin, -8, 2);
  const num2Data = num2.split(".");
  const unitName = getUSDTokenName();

  // render the margin module
  function Margin(){
    return (
      <div className="data-block">
        <div className="t">Margin Balance <img src={notice} alt="" /></div>
        <div className="num1">
          <span className="big-num">{num1Data[0]}</span>
          <span className="small-num">.{num1Data[1]}</span>
          <span className="unit">{unitName}</span>
        </div>
        <div className="t t1">Avaliable Margin Balance <img src={notice} alt="" /></div>
        <div className="num1">
          <span className="big-num">{num2Data[0]}</span>
          <span className="small-num">.{num2Data[1]}</span>
          <span className="unit">{unitName}</span>
        </div>
        <div className="btns">
          <Button1
            click={() => {setWalletType("deposit");}}
            fill={true}
            className="deposit"
            text="Deposit"
          />
          <Button1
            click={() => {setWalletType("withdraw");}}
            className="withdaw"
            text="Withdraw"
          />
        </div>
      </div>
    )
  }

  return (
    <Row className="main-block operation-container">
      <Margin />
      <div className="select-main">
        <Col flex="180px" className="select-type">
          <div className="select-label">Price Type</div>
          <Select defaultValue={type1} onChange={openTypeChange} size={"large"} dropdownClassName="trade-type-list">
            <Option value={type1}>Market Price</Option>
            <Option value={OpenType.LimitOrder}>Limit Price</Option>
          </Select>
        </Col>
        <Col flex="auto" className="select-lev">
          <div className="select-label">Leverage</div>
          <Select value={leverage} size={'large'} onChange={v => levChange(v)}>
            {LEVERAGES.map(item => <Option value={item} key={item}>{item}x</Option>)}
          </Select>
        </Col>
      </div>

      <div className="select-price">
        <div className="select-price-txt">{$t("Trade.OpenPosition.OpenPage.Price")}</div>
        {openType === type1
          ? <Col flex="100%"><Button disabled>{$t("Trade.OpenPosition.OpenPage.MarketPrice")}</Button></Col>
          : <Col flex="100%" className="price-input">
              <input value={limitPrice} onChange={e=> priceChange(e.target.value)} />
            </Col>
        }
      </div>

      <div className="volumes">
        <div className="vol">
          <span className="tag tag1">Volume</span>
          <input type="text" value={size} onChange={e => sizeChange(e.target.value)}/>
        </div>
        <div className="unit">
          <span className="tag tag2">
            {maxAmount} <span>{token === UnitTypeEnum.USDT ? `${unitName}` : curPair.key}</span>
          </span>
          <Select  onChange={tokenChange} className="sel-unit" value={token}>
            <Option value={UnitTypeEnum.USDT}>{unitName}</Option>
            <Option value={UnitTypeEnum.CurPair}>{curPair.key}</Option>
          </Select>
        </div>
      </div>

      <Percent setValue={(e) => onSliderChange(e)} />

      <div className="btn-group">
        <div className="btn long" onClick={() => {
          openPositionConfirm(0)
        }}>
          <div className="type">long</div>
          <div className="num">{amountFormt(curPair.longPmrRate, 2, false, "--", 0)}%</div>
          <div className="t">APY</div>
        </div>
         <div className="btn" onClick={() => {
           openPositionConfirm(1)
          }}>
          <div className="type">short</div>
          <div className="num">{amountFormt(curPair.shortPmrRate, 2, false, "--", 0)}%</div>
          <div className="t">APY</div>
        </div>
      </div>

        <div className="btn2"
             style={{visibility: openType === OpenType.LimitOrder ? 'hidden' : 'initial'}}
             onClick={() => {openPositionConfirm(2)}}>
          2-Way
          <div className="num">{amountFormt(Math.max(curPair.shortPmrRate,curPair.longPmrRate), 2, false, "--", 0)}%</div>
          <div className="t">APY</div>
        </div>

      {showPositionModal && (
        <ModalOpenPosition
          data={openConfirmData}
          title="Open Position"
          type={type}
          confirm={() => {setShowPositionModal(false);}}
          close={() => {setShowPositionModal(false);}}
        />
      )}

      {showProfitModal && (
        <ModalProfit
          close={() => {setShowProfitModal(false);}}
          confirm={() => {setShowProfitModal(false);}}
        />
      )}

      {walletType && (
        <ModalWallet
          confirm={() => {console.log("confirm");}}
          address={walletInfo.selectedAddress || ""}
          type={walletType}
          close={() => {
            setWalletType("");
          }}
        />
      )}

    </Row>
  );
}

export default Operation;
