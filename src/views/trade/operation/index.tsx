import React, {useCallback, useEffect, useState} from "react";
import { Row, Col, Select, Button, Slider, Input } from "antd";
import {FormattedMessage, useIntl} from "react-intl";

import Transfers from "@/views/CommonViews/Transfer";
import ComModal from "./comModal";
import {fromContractUnit, numConvert, OpenType, SideEnum, toContractUnit, UnitTypeEnum} from "@/utils/contractUtil";
import {useDispatch, useSelector} from "react-redux";
import contractModel, {TokenPair, OpenUpperBound} from "@/store/modules/contract";
import {ContractModel, RootStore} from "@/store";
import {checkNumber, fck} from "@/utils/utils";
import WalletConnectButtonWrapper from "@/views/CommonViews/ButtonWrapper";
import {DerifyErrorNotice} from "@/components/ErrorMessage";
import {TransferOperateType} from "@/utils/types";
const { Option } = Select;


export declare type OpenConfirmData = {
  openType: OpenType,
  limitPrice:number,
  token: TokenPair,
  unit: UnitTypeEnum,
  side: number,
  size: number,
  leverage: number
}

function Operation() {

  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [openType, setOpenType] = useState<OpenType>(OpenType.MarketOrder);
  const [leverage, setLeverage] = useState<number>(10);

  const curPair = useSelector<RootStore, TokenPair>(state => state.contract.curPair);
  const [limitPrice, setLimitPrice] = useState<string>(curPair.num.toFixed(2));
  const [size, setSize] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<number>(0);
  const [traderOpenUpperBound, setTraderOpenUpperBound] = useState<{amount:number|string,size:number|string}>({amount:0,size:0})
  const [sliderVal, setSliderVal] = useState<number>(0);
  const [token, setToken] = useState<number>(UnitTypeEnum.USDT);
  const [openConfirmData, setOpenConfirmData] = useState<OpenConfirmData>();

  const getMaxSize = useCallback((traderOpenUpperBound:OpenUpperBound, token:number) => {
    return contractModel.actions.getOpenUpperBoundMaxSize(traderOpenUpperBound, token);
  }, [isModalVisible]);

  const walletInfo = useSelector((state:RootStore) => state.user);

  const {formatMessage} = useIntl()

  function intl(id:string) {
    return formatMessage({id})
  }

  const $t = intl

  const onLimitPriceChange = useCallback((value:string) => {
    const checkNumRet = checkNumber(value)
    if(!checkNumRet.success){
      DerifyErrorNotice.error($t("global.NumberError"));
    }else{
      DerifyErrorNotice.error(null);
    }

    if(checkNumRet.value !== null){
      setLimitPrice(checkNumRet.value)
    }

    updateMaxAmount(openType,checkNumRet.value,leverage)

  }, [limitPrice]);


  const resetMax = useCallback((maxSize:number) =>{
    const checkNumRet = checkNumber(size, maxSize)

    if(checkNumRet.value !== null){
      setSize(checkNumRet.value);
      const sizeNum = parseFloat(checkNumRet.value);
      if(maxSize > 0){
        setSliderVal(Math.ceil(sizeNum / maxSize * 100));
      }else{
        setSliderVal(0);
      }

    }
  }, [traderOpenUpperBound, token]);


  const onSizeChange = useCallback((value:string) => {
    const maxSize = token === UnitTypeEnum.Percent ? 100 : getMaxSize(traderOpenUpperBound, token);

    const checkNumRet = checkNumber(value, maxSize)
    if(!checkNumRet.success){
      DerifyErrorNotice.error($t("global.NumberError"));
    }else{
      DerifyErrorNotice.error(null);
    }

    if(checkNumRet.value !== null){
      setSize(checkNumRet.value);
      const sizeNum = parseFloat(checkNumRet.value);
      if(maxSize > 0){
        setSliderVal(Math.ceil(sizeNum / maxSize * 100));
      }else{
        setSliderVal(0);
      }

    }
  },[traderOpenUpperBound,token])

  const onLeverageChange = useCallback((value:number) => {
    setLeverage(value);
    updateMaxAmount(openType,limitPrice,value);
  }, [limitPrice,openType]);

  const onSliderChange = useCallback((value:number) => {
    const tokenSize = calculatePositionSize(size, token, traderOpenUpperBound,value);
    setSliderVal(value);
    setSize(tokenSize.toString());
  }, [traderOpenUpperBound, token, size]);

  const onTokenChange = useCallback((token) => {
    setToken(token);
    resetMax(getMaxSize(traderOpenUpperBound, token));
    setMaxAmount(getMaxSize(traderOpenUpperBound, token));
  },[traderOpenUpperBound]);

  const onOpenTypeChange = useCallback((val) => {
    setOpenType(val)
    const price =  curPair.num.toFixed(2);
    if(val === OpenType.LimitOrder){
      setLimitPrice(price)
    }
    updateMaxAmount(val,price,leverage);

  },[openType,curPair.num,leverage]);

  const updateMaxAmount = useCallback((openType,limitPrice,leverage) => {

    const trader = walletInfo.selectedAddress;

    if(!trader){
      return
    }

    const price = openType === OpenType.MarketOrder ? curPair.num : limitPrice;


    const params = {
      trader,
      openType,
      price:toContractUnit(price),
      leverage:toContractUnit(leverage),
      token: curPair.address
    };

    const getTraderOpenUpperBoundAction = contractModel.actions.getTraderOpenUpperBound(params);

    getTraderOpenUpperBoundAction(dispatch).then((data)=>{
      setTraderOpenUpperBound(data);
      setMaxAmount(getMaxSize(data, token));
      resetMax(getMaxSize(data, token));
    }).catch((e)=>{
      console.error("getTraderOpenUpperBoundAction",e);
    }).finally(()=>{});

  }, [walletInfo.selectedAddress,leverage,curPair, openType,token]);

  const calculatePositionSize = useCallback((size:string,unit:number, traderOpenUpperBound:OpenUpperBound, sliderValue:number) => {

    const maxSize = getMaxSize(traderOpenUpperBound, unit);
    let newSize = 0;
    if(maxSize > 0){
      newSize =  sliderValue / 100 * maxSize
    }

    return newSize

  }, []);

  const doOpenPositionConfirm = useCallback((side:number) => {

    let checkNumRet = checkNumber(size, getMaxSize(traderOpenUpperBound, token))
    if(!checkNumRet.success || !size){
      DerifyErrorNotice.error($t("global.NumberError"));
      return;
    }

    if(openType === OpenType.LimitOrder){
      checkNumRet = checkNumber(limitPrice)
      if(!checkNumRet.success || !limitPrice){
        DerifyErrorNotice.error($t("global.NumberError"));
        return;
      }
    }

    DerifyErrorNotice.error(null);

    const tokenSize = calculatePositionSize(size, token, traderOpenUpperBound,sliderVal);

    const params:OpenConfirmData = {unit: token, openType, limitPrice:parseFloat(limitPrice), token: curPair, side, size: tokenSize,leverage};
    setOpenConfirmData(params)
    setIsModalVisible(true)
  },[openType,size, limitPrice,curPair,leverage,traderOpenUpperBound])

  const selectAfter = (
    <Select value={token} className="select-after" onChange={(value) => onTokenChange(value)}>
      <Option value={UnitTypeEnum.USDT}>USDT</Option>
      <Option value={UnitTypeEnum.CurPair}>{curPair.key}</Option>
    </Select>
  );

  useEffect(() => {
    updateMaxAmount(openType, openType == OpenType.MarketOrder ? curPair.num : limitPrice, leverage)


    const trader = walletInfo.trader;
    if(!trader){
      return;
    }

    const onWithdrawAction = ContractModel.actions.onWithDraw(trader, () => {
      console.log('onWithdrawAction,updateMaxAmount');
      updateMaxAmount(openType, openType == OpenType.MarketOrder ? curPair.num : limitPrice, leverage)
    });

    onWithdrawAction(dispatch);

    const onDepositAction = ContractModel.actions.onDeposit(trader, () => {
      console.log('onDepositAction,updateMaxAmount');
      updateMaxAmount(openType, openType == OpenType.MarketOrder ? curPair.num : limitPrice, leverage)
    });

    onDepositAction(dispatch);

    const onOpenPositionAction = ContractModel.actions.onOpenPosition(trader, () => {
      console.log('onOpenPositionAction,updateMaxAmount');
      updateMaxAmount(openType, openType == OpenType.MarketOrder ? curPair.num : limitPrice, leverage)
    })

    onOpenPositionAction(dispatch);

    const onClosePositionAction = ContractModel.actions.onClosePosition(trader, () => {
      console.log('onClosePositionAction,updateMaxAmount');
      updateMaxAmount(openType, openType == OpenType.MarketOrder ? curPair.num : limitPrice, leverage)
    })

    onClosePositionAction(dispatch);

  }, [walletInfo,openType, curPair, leverage, limitPrice]);

  return (
    <Row className="main-block operation-container">
      <Col flex="100%">
        <Row wrap={false} gutter={12}>
          <Col flex="230px">
            <Select
              defaultValue={OpenType.MarketOrder}
              size={"large"}
              style={{ width: "100%" }}
              onChange={onOpenTypeChange}
            >
              <Option value={OpenType.MarketOrder}>
                <FormattedMessage id="Trade.OpenPosition.OpenPage.Market" />
              </Option>
              <Option value={OpenType.LimitOrder}>
                <FormattedMessage id="Trade.OpenPosition.OpenPage.Limit" />
              </Option>
            </Select>
          </Col>
          <Col flex="auto">
            <Select
              value={leverage}
              size={"large"}
              style={{ width: "100%" }}
              onChange={val => onLeverageChange(val)}
            >
              <Option value={10}>10x</Option>
              <Option value={5}>5x</Option>
              <Option value={3}>3x</Option>
              <Option value={2}>2x</Option>
              <Option value={1}>1x</Option>
            </Select>
          </Col>
        </Row>
      </Col>
      <Col flex="100%">
        <Row gutter={[0, 10]}>
          <Col flex="100%">
            <FormattedMessage id="Trade.OpenPosition.OpenPage.Price" />
          </Col>

            {openType === OpenType.MarketOrder ?
              (<Col flex="100%">
                  <Button
                    disabled
                    shape="round"
                    style={{ width: "100%" }}
                    size={"large"}
                    >
                    <FormattedMessage id="Trade.OpenPosition.OpenPage.MarketPrice" />
                  </Button>
                </Col>
              )
              :
              (<Col flex="100%" className="derify-input">
                <Input size="large" value={limitPrice} onChange={({target:{value}}) => onLimitPriceChange(value)} />
              </Col>)}

        </Row>
      </Col>
      <Col flex="100%">
        <Row gutter={[0, 10]}>
          <Col flex="100%">
            <Row justify={"space-between"} align={"middle"}>
              <Col>
                <FormattedMessage id="Trade.OpenPosition.OpenPage.Amount" />
              </Col>
              <Col>
                <Row gutter={2} align={"middle"}>
                  <Col>
                    <FormattedMessage id="Trade.OpenPosition.OpenPage.Max" />
                    ：{maxAmount} {token === UnitTypeEnum.USDT ? "USDT" : curPair.key}
                  </Col>
                  <Col>
                    <Button type="link" onClick={() => setModalVisible(true)}>
                      <FormattedMessage id="Trade.OpenPosition.OpenPage.Transfer" />
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col flex="100%" className="select-input">
            <Input size="large" addonAfter={selectAfter} value={size} onChange={({target:{value}}) => {
              onSizeChange(value)
            }}/>
          </Col>
        </Row>
      </Col>
      <Col flex="100%">
        <Slider value={sliderVal} onChange={(val) => onSliderChange(val)}/>
      </Col>
      <WalletConnectButtonWrapper            type="primary"
                                             shape="round"
                                             block
                                             size="large">
        <Col flex="100%">
          <Button
            className="special-btn"
            shape="round"
            block
            size="large"
            onClick={() => doOpenPositionConfirm(SideEnum.LONG)}
          >
            <FormattedMessage id="Trade.OpenPosition.OpenPage.BuyLong" />
          </Button>
        </Col>
        <Col flex="100%">
          <Button
            type="primary"
            danger
            shape="round"
            block
            size="large"
            onClick={() => doOpenPositionConfirm(SideEnum.SHORT)}
          >
            <FormattedMessage id="Trade.OpenPosition.OpenPage.SellShort" />
          </Button>
        </Col>
        <Col flex="100%">
          <Button
            type="primary"
            shape="round"
            block
            size="large"
            onClick={() => doOpenPositionConfirm(SideEnum.HEDGE)}
          >
            <FormattedMessage id="Trade.OpenPosition.OpenPage.TwoWay" />
          </Button>
        </Col>
      </WalletConnectButtonWrapper>

      <ComModal
        visible={isModalVisible}
        openConfirmData={openConfirmData}
        closeModal={()=>{setIsModalVisible(false)}}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      />
      <Transfers operateType={TransferOperateType.deposit} closeModal={() => setModalVisible(false)} visible={modalVisible}  onCancel={()=>setModalVisible(false)}/>

    </Row>
  );
}

export default Operation;
