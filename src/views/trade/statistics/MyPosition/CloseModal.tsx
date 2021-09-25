import React, {useCallback, useEffect, useState} from "react";
import {FormattedMessage, useIntl} from "react-intl";

import { Modal, Row, Col, Input, Radio } from "antd";
import { ModalProps } from "antd/es/modal";
import {useDispatch, useSelector} from "react-redux";
import {RootStore} from "@/store";
import {fromContractUnit, PositionView, toContractUnit} from "@/utils/contractUtil";
import contractModel from "@/store/modules/contract";
import {fck} from "@/utils/utils";
import {CheckboxOptionType} from "antd/lib/checkbox/Group";
import {useDebounce} from "react-use";
import {RadioChangeEvent} from "antd/es";
import ErrorMessage from "@/components/ErrorMessage";
import {FormatXMLElementFn, PrimitiveType} from "intl-messageformat";
import {DerifyTradeModal} from "@/views/CommonViews/ModalTips";

interface CloseModalProps extends ModalProps {
  position: PositionView|undefined;
  closeModal:()=>void
}

const plainOptions:CheckboxOptionType[] = [
  {label: '25%', value: 25},
  {label: '50%', value: 50},
  {label: '75%', value: 75},
  {label: '100%', value: 100}
];

const CloseModal: React.FC<CloseModalProps> = props => {
  const dispatch = useDispatch();
  const self = this;
  const position = props.position;

  const {formatMessage} = useIntl();

  function intl<T = PrimitiveType | FormatXMLElementFn<string, string>>(id:string,values:T[] = []) {

    const intlValues:{[key:number]:T} = {}

    values.forEach((item, index) => {
      intlValues[index] = item
    })


    return formatMessage({id}, intlValues)
  }

  const $t = intl;


  const getPairByAddress = (token:string) => {
    return contractModel.actions.getPairByAddress(token)
  }


  const closeModel = useCallback(() => {
    props.closeModal()
  },[])


  const walletInfo = useSelector((state:RootStore) => state.user);
  const trader = useSelector((state:RootStore) => state.user.selectedAddress);

  const maxSize = fromContractUnit(position?.size);

  const [closeUpperBond, setCloseUpperBond] = useState<number>(0);
  const [size, setSize] = useState<string>(isNaN(maxSize) ? "":fck(maxSize,0,8));

  const [percent, setPercent] = useState<number>(100);
  const [errorMsg, setErrorMsg] = useState<any>("")

  const closePostion = () => {
    const trader = walletInfo.selectedAddress;
    const brokerId = walletInfo.brokerId;
    const position = props.position;

    const sizeAmount = parseFloat(size)

    if(!trader || !brokerId || !position){
      return;
    }

    if(sizeAmount > closeUpperBond || sizeAmount <= 0) {
      setErrorMsg($t("global.NumberError",[]))
      return;
    }

    const closePositionAction = contractModel.actions.closePosition(trader, position.token, position.side, toContractUnit(size), brokerId);

    DerifyTradeModal.pendding();
    closeModel();
    closePositionAction(dispatch).then(() =>{
      DerifyTradeModal.success();
    }).catch(() => {
      DerifyTradeModal.failed();
    })
  }

  const updateCloseUpperBound = useCallback(() => {
    const position = props.position;

    if(!trader || !position){
      return
    }

    const getCloseUpperBoundAction = contractModel.actions.getCloseUpperBound(trader,position.token,position.side);

    getCloseUpperBoundAction(dispatch).then((maxSize) => {
      if(maxSize) {
        setCloseUpperBond(fromContractUnit(maxSize))
      }
    })
  },[trader,position?.side,position?.token])


  const onSizeChange = (value:string) => {
    if(/^\d+(.\d*)?$/.test(value)){
      let size = parseFloat(value)

      if(size > maxSize){
        value = maxSize.toString()
      }

      if(size <= 0) {
        setErrorMsg($t("global.NumberError"))
      }else{
        setErrorMsg("")
      }

      setPercent(Math.round(size / maxSize * 100))
      setSize(value.replace(/[^0-9.]/g,''))
    }
  }

  useEffect(() => {
    const position = props.position;

    if(!trader || !position){
      return
    }

    dispatch(contractModel.actions.updateTokenSpotPrice(trader, position.token))
  },[trader, position?.token])

  useEffect(() => {
    if(props.visible){
      updateCloseUpperBound()
    }

  },[props.visible])

  useEffect(() => {

    if(maxSize) {
      setSize(fck(position?.size,-8,8))
    }
  },[position?.size])


  return (
    <Modal
      {...props}
      title={<FormattedMessage id="Trade.MyPosition.ClosePositionPopup.Close" />}
      width={360}
      className="close-modal"
      getContainer={false}
      onOk={closePostion}
      okText={$t("Trade.MyPosition.ClosePositionPopup.Confirm")}
      cancelText={$t("Trade.MyPosition.ClosePositionPopup.Cancel")}
    >
      <ErrorMessage style={{margin: "10px 0"}} msg={errorMsg} visible={!!errorMsg} onCancel={() => setErrorMsg("")}/>
      <Row>
        <Col flex="100%">
          <Row justify="space-between">
            <Col>
              <FormattedMessage id="Trade.MyPosition.ClosePositionPopup.PositionHeld" />
            </Col>
            <Col>
              <span className="main-white">{fck(position?.size, -8, 8)}</span> {getPairByAddress(position?.token).key}
            </Col>
          </Row>
        </Col>
        <Col flex="100%">
          <Row justify="space-between">
            <Col>
              <FormattedMessage id="Trade.MyPosition.ClosePositionPopup.AveragePrice" />
            </Col>
            <Col>
              <span className="main-white">{fck(position?.averagePrice, -8, 2)}</span> USDT
            </Col>
          </Row>
        </Col>
        <Col flex="100%">
          <Row justify="space-between">
            <Col>
              <FormattedMessage id="Trade.MyPosition.ClosePositionPopup.CurrentPrice" />
            </Col>
            <Col>
              <span className="main-green"> {getPairByAddress(position?.token).num}</span> USDT
            </Col>
          </Row>
        </Col>
        <Col flex="100%" style={{ margin: "40px 0 18px" }}>
          {$t("Trade.MyPosition.ClosePositionPopup.Amount")}
        </Col>
        <Col flex="100%" style={{ marginBottom: "12px" }}>
          <Input size="large" addonAfter={getPairByAddress(position?.token).key} value={size} onChange={(e) => onSizeChange(e.target.value)} />
        </Col>
        <Col flex="100%">
          <Radio.Group value={percent} options={plainOptions} optionType="button" onChange={(e) => {
            const {value} = e.target
            setPercent(value)
            const sizeAmount  = fck((value / 100.0 * maxSize),0,8);
            setSize(sizeAmount)

            if(parseFloat(sizeAmount) > 0) {
              setErrorMsg("")
            }

          }}/>
        </Col>
      </Row>
    </Modal>
  );
};

export default CloseModal;
