import React, {useCallback, useEffect, useState} from "react";
import { Row, Col, Select, Button, Slider, Input } from "antd";
import {FormattedMessage, useIntl} from "react-intl";

import Transfers from "@/views/CommonViews/Transfer";
import ComModal from "./comModal";
import {fromContractUnit, OpenType, SideEnum, toContractUnit, UnitTypeEnum} from "@/utils/contractUtil";
import {useDispatch, useSelector} from "react-redux";
import contractModel, {TokenPair, OpenUpperBound} from "@/store/modules/contract";
import {RootStore} from "@/store";
import {checkNumber, fck} from "@/utils/utils";
import WalletConnectButtonWrapper from "@/views/CommonViews/ButtonWrapper";
import {DerifyErrorNotice} from "@/components/ErrorMessage";
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
  const [traderOpenUpperBound, setTraderOpenUpperBound] = useState<{amount:number|string,size:number|string}>({amount:0,size:0})
  const [sliderVal, setSliderVal] = useState<number>(0);
  const [token, setToken] = useState<number>(UnitTypeEnum.USDT);
  const [openConfirmData, setOpenConfirmData] = useState<OpenConfirmData>();

  const getMaxSize = (traderOpenUpperBound:OpenUpperBound, token:number) => {
    return contractModel.actions.getOpenUpperBoundMaxSize(traderOpenUpperBound, token);
  };

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

  }, [limitPrice])

  const onSizeChange = useCallback((value:string) => {
    const maxSize = getMaxSize(traderOpenUpperBound, token);
    const checkNumRet = checkNumber(value, maxSize)
    if(!checkNumRet.success){
      DerifyErrorNotice.error($t("global.NumberError"));
    }else{
      DerifyErrorNotice.error(null);
    }

    if(checkNumRet.value !== null){
      setSize(checkNumRet.value);
      const sizeNum = parseFloat(checkNumRet.value);
      setSliderVal(Math.ceil(sizeNum / maxSize * 100));
    }

  },[traderOpenUpperBound,token])

  const onLeverageChange = useCallback((value:number) => {
    setLeverage(value);
    updateMaxAmount(openType,limitPrice,value)
  }, [limitPrice,openType]);

  const onSliderChange = useCallback((value:number) => {
    const maxSize = getMaxSize(traderOpenUpperBound, token);

    setSliderVal(value);
    setSize(fck(maxSize * value / 100,0,8));
    setToken(UnitTypeEnum.Percent);

    if(maxSize > 0){
      DerifyErrorNotice.error(null);
    }

  }, [traderOpenUpperBound, token]);

  const onTokenChange = useCallback((token) => {
    setToken(token);
  },[]);

  const onOpenTypeChange = useCallback((val) => {
    setOpenType(val)
    const price =  curPair.num.toFixed(2);
    if(val === OpenType.LimitOrder){
      setLimitPrice(price)
    }
    updateMaxAmount(openType,price,leverage)
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
    }).catch((e)=>{
    }).finally(()=>{});

  }, [walletInfo.selectedAddress,leverage,curPair, openType]);

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

    const params:OpenConfirmData = {unit: token, openType, limitPrice:parseFloat(limitPrice), token: curPair, side, size:parseFloat(size),leverage};
    setOpenConfirmData(params)
    setIsModalVisible(true)
  },[openType,size, limitPrice,curPair,leverage])

  const selectAfter = (
    <Select value={token} className="select-after" onChange={(value) => onTokenChange(value)}>
      <Option value={UnitTypeEnum.USDT}>USTD</Option>
      <Option value={UnitTypeEnum.CurPair}>{curPair.key}</Option>
      <Option value={UnitTypeEnum.Percent}>%</Option>
    </Select>
  );

  useEffect(() => {
    updateMaxAmount(openType, curPair.num, leverage)
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
                    ：{getMaxSize(traderOpenUpperBound, token)} {token === UnitTypeEnum.USDT ? "USDT" : curPair.key}
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
      <Transfers closeModal={() => setModalVisible(false)} visible={modalVisible}  onCancel={()=>setModalVisible(false)}/>

    </Row>
  );
}

export default Operation;
