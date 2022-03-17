import React, {ReactNode, useCallback, useEffect, useState} from "react";
import { Row, Col, Modal } from "antd";
import { ModalProps } from "antd/es/modal";
import {FormattedMessage, useIntl} from "react-intl";
import { useToggle } from "react-use";
import classNames from "classnames";
import ModalTips, {DerifyTradeModal} from "@/views/CommonViews/ModalTips";
import {FormatXMLElementFn, PrimitiveType} from "intl-messageformat";
import {
  convertAmount2TokenSize,
  fromContractUnit,
  OpenType,
  SideEnum,
  toContractNum,
  UnitTypeEnum
} from "@/utils/contractUtil";
import ErrorMessage from "@/components/ErrorMessage";
import {OpenConfirmData} from "@/views/trade/operation/index";
import {useDispatch, useSelector} from "react-redux";
import {AppModel, RootStore} from "@/store";
import contractModel, {OpenUpperBound, TokenPair} from "@/store/modules/contract";
import {amountFormtNumberDefault, fck} from "@/utils/utils";
import {getUSDTokenName} from "@/config";

const typeColor:{[key:number]:string} ={
  [SideEnum.LONG]:"main-green",
  [SideEnum.SHORT]:"main-red",
  [SideEnum.HEDGE]: "main-color",
}
const sideLangMap:{[key:number]:string} ={
  [SideEnum.LONG]:"Trade.OpenPosition.OpenPopup.Long",
  [SideEnum.SHORT]:"Trade.OpenPosition.OpenPopup.Short",
  [SideEnum.HEDGE]: "Trade.OpenPosition.OpenPopup.TwoWay",
}


export interface ComModalProps extends ModalProps {
  openConfirmData?: OpenConfirmData;
  closeModal:()=>void;
}
declare type T = PrimitiveType | FormatXMLElementFn<string, string>

declare type OpenDataRow = {
  key: string,
  val: T|ReactNode,
  classNames?:string[],
  suffix:string
}

const ComModal: React.FC<ComModalProps> = props => {

  const dispatch = useDispatch();
  const curPair = useSelector<RootStore, TokenPair>(state => state.contract.curPair)
  const walletInfo = useSelector((state:RootStore) => state.user);

  const [pcf,setPcf] = useState<number>(0);
  const [tradeFee,setTradeFee] = useState<number>(0);
  const [dataRows,setDataRows] = useState<OpenDataRow[]>([]);
  const [sysOpenUpperBound,setSysOpenUpperBound] = useState<OpenUpperBound>({amount:0,size:0});
  const Intl = useIntl();
  const {formatMessage} = Intl;

  function intl<T>(id:string,values:T[] = []) {

    const intlValues:{[key:number]:T} = {}

    values.forEach((item, index) => {
      intlValues[index] = item
    })


    return formatMessage({id}, intlValues)
  }

  const $t = intl;


  const { openConfirmData,...others } = props;
  const [errorMsg, setErrorMsg] = useState("");


  useEffect(() => {
    const trader = walletInfo.selectedAddress;
    if(!trader || !openConfirmData){
      return
    }

    const {side,token,size,openType,unit} = openConfirmData;
    const price = openType === OpenType.MarketOrder ? token.num : openConfirmData.limitPrice;
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
    }).catch((e) => {

    })

    const getSysOpenUpperBoundAction = contractModel.actions.getSysOpenUpperBound(trader, params.side,params.token);

    getSysOpenUpperBoundAction(dispatch).then((val:OpenUpperBound) => {
      setSysOpenUpperBound(val);
    }).catch(e => {});

  }, [openConfirmData, walletInfo]);


  useEffect(() => {

    if(!openConfirmData){
      return
    }

    let isMarketOrder = openConfirmData?.openType === OpenType.MarketOrder;
    isMarketOrder = isMarketOrder || (openConfirmData?.limitPrice || 0) > curPair.num;


    const rows:OpenDataRow[] = [
      {
        key: "Trade.OpenPosition.OpenPopup.Price",
        val: isMarketOrder ? $t("Trade.OpenPosition.OpenPopup.Market") : openConfirmData.limitPrice,
        suffix: isMarketOrder ? "" : `${getUSDTokenName()}`,
      },
      {
        key: "Trade.OpenPosition.OpenPopup.Type",
        val: $t(sideLangMap[openConfirmData.side]),
        classNames:[typeColor[openConfirmData.side] || "main-white"],
        suffix: openConfirmData.leverage + "x",
      },
      {
        key: "Trade.OpenPosition.OpenPopup.Amount",
        val: openConfirmData.size,
        suffix: openConfirmData.unit === UnitTypeEnum.USDT ? `${getUSDTokenName()}`: curPair.key,
      },
      {
        key: "Trade.OpenPosition.OpenPopup.PCF",
        classNames:[-pcf >0  ? "main-green" : "main-red"],
        val: amountFormtNumberDefault(-pcf,4, true, 0),
        suffix: `${getUSDTokenName()}`,
      },
      {
        key: "Trade.OpenPosition.OpenPopup.TradFee",
        classNames:[],
        val: amountFormtNumberDefault(-tradeFee,4, true, 0),
        suffix: `${getUSDTokenName()}`,
      },
    ];

    setDataRows(rows);
  }, [openConfirmData, pcf, tradeFee]);

  const checkAndGetMaxBound = useCallback((sysOpenUpperBound, openConfirmData) => {

    if(!openConfirmData){
      return 0
    }

    const {size, side, unit, openType} = openConfirmData

    if(side === SideEnum.HEDGE) {
      return size;
    }

    if(openType !== OpenType.MarketOrder) {
      return size;
    }

    const self = this;
    if(!sysOpenUpperBound){
      return 0;
    }

    if(unit === UnitTypeEnum.USDT){
      if (size > fromContractUnit(sysOpenUpperBound.size)) {

        setErrorMsg(`${$t('Trade.OpenPosition.OpenPopup.LiqLimitMsg')} ${fck(sysOpenUpperBound.size, -8)} ${getUSDTokenName()}`)
        return fromContractUnit(sysOpenUpperBound.size);
      }
    } else {
      if (size > fromContractUnit(sysOpenUpperBound.amount)) {
        setErrorMsg(`${$t('Trade.OpenPosition.OpenPopup.LiqLimitMsg')} ${fck(sysOpenUpperBound.size, -8)}${curPair.key}`)

        return fromContractUnit(sysOpenUpperBound.amount);
      }
    }

    setErrorMsg('');

    return size
  },[sysOpenUpperBound,openConfirmData])

  const doOpenSumbmit = useCallback(() => {

    if(!walletInfo.selectedAddress || !walletInfo.brokerId) {
      return;
    }

    const size = checkAndGetMaxBound(sysOpenUpperBound, openConfirmData)

    if(size <= 0 || !openConfirmData) {
      return;
    }

    const leverage = openConfirmData.leverage
    let price = null
    if (openConfirmData.openType === OpenType.MarketOrder) {
      price = curPair.num;
    } else {
      price = openConfirmData.limitPrice;
    }
    const {unit} = openConfirmData
    let tokenSize = convertAmount2TokenSize(unit, toContractNum(size), toContractNum(price))

    const params = {
      trader: walletInfo.selectedAddress,
      token: openConfirmData.token.address,
      quantityType: unit === UnitTypeEnum.USDT ? 1 : 0,
      side: openConfirmData.side,
      size: toContractNum(size),
      openType: openConfirmData.openType,
      price: toContractNum(price),
      leverage: toContractNum(leverage),
      brokerId: walletInfo.brokerId,
    }

    const openPositionAction = contractModel.actions.openPosition(params);

    DerifyTradeModal.pendding();
    props.closeModal();
    openPositionAction(dispatch).then(() => {
      DerifyTradeModal.success();
      dispatch(AppModel.actions.updateTradeLoadStatus());
    }).catch((e) => {
      DerifyTradeModal.failed();
    });

  }, [openConfirmData, walletInfo,sysOpenUpperBound])


  return (
      <Modal
        width={300}
        title={$t("Trade.OpenPosition.OpenPopup.OpenConfirm")}
        getContainer={false}
        focusTriggerAfterClose={false}
        {...others}
        onOk={doOpenSumbmit}
      >
        <ErrorMessage style={{margin: "10px 0"}} msg={errorMsg} visible={!!errorMsg} onCancel={() => setErrorMsg("")}/>
        <Row>
          {dataRows.map((item, i) => (
            <Col flex="100%" key={i} style={{ marginBottom: "12px" }}>
              <Row justify="space-between">
                <Col>
                  <FormattedMessage id={item.key} />
                </Col>
                <Col>
                  <span
                    className={classNames(item.classNames)}
                  >
                    {item.val}&nbsp;
                  </span>
                  {item.suffix}
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
      </Modal>
  );
};

export default ComModal;
