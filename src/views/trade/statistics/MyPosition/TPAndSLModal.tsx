// @ts-nocheck
import React, {useCallback, useEffect, useState} from "react";
import { Modal, Row, Col, Input } from "antd";
import { ModalProps } from "antd/es/modal";
import {useIntl} from "react-intl";
import {FormatXMLElementFn, PrimitiveType} from "intl-messageformat";
import {
  fromContractUnit,
  numConvert,
  PositionView,
  SideEnum,
  toContractNum,
  toContractUnit
} from "@/utils/contractUtil";
import {amountFormt, checkNumber, fck} from "@/utils/utils";
import ErrorMessage from "@/components/ErrorMessage";
import {useDispatch, useSelector} from "react-redux";
import {AppModel, RootStore} from "@/store";
import contractModel from "@/store/modules/contract"
import {DerifyTradeModal} from "@/views/CommonViews/ModalTips";
import {getUSDTokenName} from "@/config";


interface TPAndSLModalProps extends ModalProps {
  position?: PositionView;
  closeModal: () => void;
}

const TPAndSLModal: React.FC<TPAndSLModalProps> = props => {
  const walletInfo = useSelector((state:RootStore) => state.user);
  const position = props.position;
  const dispatch = useDispatch();

  const {formatMessage} = useIntl()

  function intl<T = PrimitiveType | FormatXMLElementFn<string, string>>(id:string,values:T[] = []) {

    const intlValues:{[key:number]:T} = {}

    values.forEach((item, index) => {
      intlValues[index] = item
    })


    return formatMessage({id}, intlValues)
  }

  const $t = intl

  const clickedTPSLPostion = props.position;

  const [takeProfitPrice,setTakeProfitPrice] = useState<string>('')

  const [stopLossPrice,setStopLossPrice] = useState<string>('')

  const [profitAmount,setProfitAmount] = useState<number>(0)
  const [lossAmount,setLossAmount] = useState<number>(0)
  const [errorMsg,setErrorMsg] = useState<any>("")

  const onTakeProfitPriceChange = (value:string) => {
    const checkNumRet = checkNumber(value)

    if(checkNumRet.value === null){
      return;
    }

    if(!checkNumRet.success) {
      setErrorMsg($t("global.NumberError"))
    }else{
      if(checkNumber(stopLossPrice).success){
        setErrorMsg("");
      }

    }

    setTakeProfitPrice(checkNumRet.value)

    calLossAndProfit(checkNumRet.value, stopLossPrice)
  }

  const onStopLossPriceChange = (value:string) => {
    const checkNumRet = checkNumber(value)

    if(checkNumRet.value === null){
      return;
    }

    if(!checkNumRet.success) {
      setErrorMsg($t("global.NumberError"));
    }else{
      if(checkNumber(takeProfitPrice).success){
        setErrorMsg("");
      }
    }

    setStopLossPrice(checkNumRet.value);

    calLossAndProfit(takeProfitPrice, checkNumRet.value)
  }

  const calLossAndProfit = useCallback((takeProfitPrice, stopLossPrice) => {
    const takeProfitPriceNum = takeProfitPrice ? parseFloat(takeProfitPrice) : -1;
    const stopLossPriceNum = stopLossPrice ? parseFloat(stopLossPrice) : -1;

    const position = props.position;

    if(takeProfitPriceNum > 0) {
      const profitAmount = (takeProfitPriceNum - fromContractUnit(position?.averagePrice))
        * fromContractUnit(position?.size) * (position?.side === SideEnum.LONG ? 1 : -1)

      setProfitAmount(profitAmount);
    }else{
      setProfitAmount(0);
    }

    if(stopLossPriceNum > 0) {
      const lostAmount = (stopLossPriceNum - fromContractUnit(position?.averagePrice))
        * fromContractUnit(position?.size) * (position?.side === SideEnum.LONG ? 1 : -1)

      setLossAmount(lostAmount)
    }else{
      setLossAmount(0);
    }

  }, [takeProfitPrice,stopLossPrice,position?.size,position?.side,position?.averagePrice,position?.spotPrice])




  const onOk = useCallback((e) => {
    const trader = walletInfo.selectedAddress;
    if(!trader){
      return
    }

    const checkProfitRes = checkNumber(takeProfitPrice);
    if(!checkProfitRes.success){
      setErrorMsg($t("global.NumberError"));
      return;
    }

    const checkLossRes = checkNumber(stopLossPrice);
    if(!checkLossRes.success){
      setErrorMsg($t("global.NumberError"));
      return;
    }

    if(checkProfitRes.value && profitAmount <= 0){
      setErrorMsg($t("global.NumberError"));
      return;
    }

    if(checkLossRes.value && lossAmount > 0){
      setErrorMsg($t("global.NumberError"));
      return;
    }

    let takeProfitPriceNum: number;
    let stopLossPriceNum: number;

    if(amountFormt(stopLossPrice,-1,false,"") === amountFormt(position?.stopLossPrice,-1,false,"",-8)){
      stopLossPriceNum = 0;
    }else if(stopLossPrice == ''){
      stopLossPriceNum = -1;
    }else{
      stopLossPriceNum = parseFloat(stopLossPrice)
    }

    if(amountFormt(takeProfitPrice,-1,false,"") === amountFormt(position?.stopProfitPrice,-1,false,"",-8).toString()){
      takeProfitPriceNum = 0;
    }else if(takeProfitPrice == ''){
      takeProfitPriceNum = -1;
    }else{
      takeProfitPriceNum = parseFloat(takeProfitPrice)
    }

    const orerStopPositionAction = contractModel.actions.orderStopPosition({trader,
        token: position?.token, side:position?.side, takeProfitPrice: toContractNum(takeProfitPriceNum),
      stopLossPrice: toContractNum(stopLossPriceNum)})

    DerifyTradeModal.pendding();
    props.closeModal();
    orerStopPositionAction(dispatch).then(() => {
      DerifyTradeModal.success();
      dispatch(AppModel.actions.updateTradeLoadStatus());
    }).catch(() => {
      DerifyTradeModal.failed();
    })
  }, [walletInfo.selectedAddress,takeProfitPrice,stopLossPrice]);

  useEffect(() => {

    if(clickedTPSLPostion && clickedTPSLPostion.stopProfitPrice && clickedTPSLPostion.stopProfitPrice > 0){
      setTakeProfitPrice(fck(clickedTPSLPostion?.stopProfitPrice,-8,2))
    }else{
      setTakeProfitPrice("")
    }


    if(clickedTPSLPostion && clickedTPSLPostion.stopLossPrice && clickedTPSLPostion.stopLossPrice > 0){
      setStopLossPrice(fck(clickedTPSLPostion?.stopLossPrice,-8,2))
    }else{
      setStopLossPrice("")
    }

    calLossAndProfit(fromContractUnit(clickedTPSLPostion?.stopProfitPrice), fromContractUnit(clickedTPSLPostion?.stopLossPrice))

  }, [clickedTPSLPostion, props.visible])

  return (
    <Modal
      {...props}
      title={$t("Trade.MyPosition.SetStopPricePopup.SetTPSL")}
      width={360}
      className="close-modal"
      onOk={onOk}
      getContainer={false}
    >
      <ErrorMessage style={{margin: "10px 0"}} msg={errorMsg} visible={!!errorMsg} onCancel={() => setErrorMsg("")}/>
      <Row>
        <Col flex="100%" className="margin-b-max">
          <Row justify="space-between">
            <Col>
              <div>{$t("Trade.MyPosition.SetStopPricePopup.AveragePrice")}</div>
              <div>{$t("Trade.MyPosition.SetStopPricePopup.CurrentPrice")}</div>
            </Col>
            <Col>
              <div>
                <span className="main-white">{fck(position?.averagePrice, -8,2)}</span>&nbsp;{getUSDTokenName()}
              </div>
              <div>
                <span className="main-green">{fck(position?.spotPrice, -8,2)}</span>&nbsp;{getUSDTokenName()}
              </div>
            </Col>
          </Row>
        </Col>
        <Col flex="100%" className="margin-b-max">
          <Row>{$t("Trade.MyPosition.SetStopPricePopup.TakeProfit")}</Row>
          <Row className="margin-b-m">
            <Input size="large" addonAfter={getUSDTokenName()} onChange={({target:{value}}) => {
              onTakeProfitPriceChange(value)
            }} value={takeProfitPrice}/>
          </Row>
          <Row style={{display: "inline-block"}}>
            {$t("Trade.MyPosition.SetStopPricePopup.StopPriceProfitNotice",[<span className="main-white">{amountFormt(takeProfitPrice ? takeProfitPrice : '--')}</span>,<span className={profitAmount > 0 ? "main-green":"main-red"}>{amountFormt(profitAmount,2,true,"--")}</span>])}
          </Row>
        </Col>
        <Col flex="100%">
          <Row>{$t("Trade.MyPosition.SetStopPricePopup.StopLoss")}</Row>
          <Row className="margin-b-m">
            <Input size="large" addonAfter={getUSDTokenName()}  onChange={({target:{value}}) => {
              onStopLossPriceChange(value)
            }} value={stopLossPrice}/>
          </Row>
          <Row  style={{display: "inline-block"}}>
            {$t("Trade.MyPosition.SetStopPricePopup.StopPriceLossNotice",[<span className="main-white">{stopLossPrice ? stopLossPrice : '--'}</span>,<span className={lossAmount > 0 ? "main-green":"main-red"}>{amountFormt(lossAmount,2,true,"--")}</span>])}
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

export default TPAndSLModal;
