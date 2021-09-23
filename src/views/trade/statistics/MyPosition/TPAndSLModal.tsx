import React, {useCallback, useState} from "react";
import { Modal, Row, Col, Input } from "antd";
import { ModalProps } from "antd/es/modal";
import {useIntl} from "react-intl";
import {FormatXMLElementFn, PrimitiveType} from "intl-messageformat";
import {fromContractUnit, PositionView, SideEnum, toContractNum, toContractUnit} from "@/utils/contractUtil";
import {amountFormt, checkNumber, fck} from "@/utils/utils";
import ErrorMessage from "@/components/ErrorMessage";
import {useDispatch, useSelector} from "react-redux";
import {RootStore} from "@/store";
import contractModel from "@/store/modules/contract"
import {DerifyTradeModal} from "@/views/CommonViews/ModalTips";


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



  const [takeProfitPrice,setTakeProfitPrice] = useState<string>("")
  const [stopLossPrice,setStopLossPrice] = useState<string>("")
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
    const takeProfitPriceNum = parseFloat(takeProfitPrice);
    const stopLossPriceNum = parseFloat(stopLossPrice);

    const position = props.position;

    if(takeProfitPriceNum > 0) {
      const profitAmount = (takeProfitPriceNum - fromContractUnit(position?.averagePrice))
        * fromContractUnit(position?.size) * (position?.side === SideEnum.LONG ? 1 : -1)

      setProfitAmount(profitAmount);
    }

    if(stopLossPriceNum > 0) {
      const lostAmount = (stopLossPriceNum - fromContractUnit(position?.averagePrice))
        * fromContractUnit(position?.size) * (position?.side === SideEnum.LONG ? 1 : -1)

      setLossAmount(lostAmount)
    }

  }, [takeProfitPrice,stopLossPrice,position?.size,position?.side,position?.averagePrice,position?.spotPrice])


  const onOk = useCallback((e) => {
    const trader = walletInfo.selectedAddress;
    if(!trader){
      return
    }

    if(!checkNumber(takeProfitPrice).success){
      setErrorMsg($t("global.NumberError"));
      return;
    }

    if(!checkNumber(stopLossPrice).success){
      setErrorMsg($t("global.NumberError"));
      return;
    }

    if(profitAmount <= 0){
      setErrorMsg($t("global.NumberError"));
      return;
    }

    if(lossAmount > 0){
      setErrorMsg($t("global.NumberError"));
      return;
    }

    let takeProfitPriceNum = -1;
    let stopLossPriceNum = -1;
    if(takeProfitPrice == ''){
      takeProfitPriceNum = -1;
    }else{
      takeProfitPriceNum = parseFloat(takeProfitPrice)
    }

    if(stopLossPrice == ''){
      stopLossPriceNum = -1;
    }else{
      stopLossPriceNum = parseFloat(stopLossPrice)
    }

    if(stopLossPriceNum === fromContractUnit(position?.stopLossPrice)){
      stopLossPriceNum = 0;
    }

    if(takeProfitPriceNum === fromContractUnit(position?.stopProfitPrice)){
      takeProfitPriceNum = 0;
    }

    const orerStopPositionAction = contractModel.actions.orderStopPosition({trader,
        token: position?.token, side:position?.side, takeProfitPrice: toContractNum(takeProfitPriceNum),
      stopLossPrice: toContractNum(stopLossPriceNum)})

    DerifyTradeModal.pendding();
    props.closeModal();
    orerStopPositionAction(dispatch).then(() => {
      DerifyTradeModal.success();
    }).catch(() => {
      DerifyTradeModal.failed();
    })
  }, [walletInfo.selectedAddress,takeProfitPrice,stopLossPrice]);

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
                <span className="main-white">{fck(position?.averagePrice, -8,2)}</span>USDT
              </div>
              <div>
                <span className="main-green">{fck(position?.spotPrice, -8,2)}</span>USDT
              </div>
            </Col>
          </Row>
        </Col>
        <Col flex="100%" className="margin-b-max">
          <Row>{$t("Trade.MyPosition.SetStopPricePopup.TakeProfit")}</Row>
          <Row className="margin-b-m">
            <Input size="large" addonAfter="USDT" defaultValue="" onChange={({target:{value}}) => {
              onTakeProfitPriceChange(value)
            }} value={takeProfitPrice}/>
          </Row>
          <Row>
            {$t("Trade.MyPosition.SetStopPricePopup.StopPriceProfitNotice",[<span className="main-white">{takeProfitPrice}</span>,<span className={profitAmount > 0 ? "main-green":"main-red"}>{amountFormt(profitAmount,2,true,"--")}</span>])}
          </Row>
        </Col>
        <Col flex="100%">
          <Row>{$t("Trade.MyPosition.SetStopPricePopup.StopLoss")}</Row>
          <Row className="margin-b-m">
            <Input size="large" addonAfter="USDT" defaultValue="" onChange={({target:{value}}) => {
              onStopLossPriceChange(value)
            }} value={stopLossPrice}/>
          </Row>
          <Row>
            {$t("Trade.MyPosition.SetStopPricePopup.StopPriceLossNotice",[<span className="main-white">{stopLossPrice}</span>,<span className={lossAmount > 0 ? "main-green":"main-red"}>{amountFormt(lossAmount,2,true,"--")}</span>])}
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

export default TPAndSLModal;
