import React, {ReactNode, useEffect} from "react";
import { ModalProps } from "antd/es/modal";
import { Row, Col, Button,Modal } from "antd";

import SuccessImg from "@/assets/images/success.png";
import PendingImg from "@/assets/images/pending.png";
import ErrorImg from "@/assets/images/error.png";
import './ModalTips.less';
import {useIntl,injectIntl,IntlShape} from "react-intl";
import IntlPro from "@/locales/index";

import ReactDOM from "react-dom";
import store from "@/store";
import {Provider} from "react-redux";
import {OperateType} from "@/views/earn/OperateCom";

export declare type TradeMoalProps = {
  msg?:ReactNode,
  confirmable?:boolean,
  show?:boolean,
  operaType:"success" | "error" | "pending"
};

interface ModalTipsProps extends ModalProps,TradeMoalProps {
  onTradeOK?: () => void
  okButton?:ReactNode
}

const msgKeyMap = {
  "success": "global.TradeSuccessMsg",
  "error": "global.TradeFailedMsg",
  "pending": "global.TradePendingMsg",
};

let timer:any = null;
const ModalTips : React.FC<ModalTipsProps> = props => {
  const { formatMessage } = useIntl();

  function intl<T>(id:string,values:T[] = []) {

    const intlValues:{[key:number]:T} = {}

    values.forEach((item, index) => {
      intlValues[index] = item
    })


    return formatMessage({id}, intlValues)
  }

  const $t = intl;

  const { msg,onTradeOK,onCancel, operaType,confirmable, ...others } = props;

  useEffect(() => {
    if(others.visible && operaType === "success"){
      if(timer != null) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {

        if(props.onTradeOK){
          props.onTradeOK();
        }

      }, 3000);
    }
  }, [others.visible, operaType])

  return (
    <Modal {...others} width={300} footer={null} closable={false}>
      <Row justify="center" className="modal-tips">
        <Col className="margin-b-max">
          <img
            src={
              (operaType === "success" && SuccessImg) ||
              (operaType === "pending" && PendingImg) ||
              (operaType === "error" && ErrorImg)||''
            }
            alt=""
          />
        </Col>
        <Col className="margin-b-max">{msg ? msg : $t(msgKeyMap[operaType])}</Col>
        {
          confirmable ?
            (
              <Col>
                <Button type="ghost" onClick={(e) => {
                  if(onCancel){
                    onCancel(e)
                  }

                  if(onTradeOK){
                    onTradeOK()
                  }

                }}>{$t("global.Confirm")}</Button>
              </Col>
          ): (props.okButton ? "" : props.okButton)}
      </Row>
    </Modal>
  );
};
const IntlModalTips : React.FC<ModalTipsProps> = props => {

  return (
    <Provider store={store}>
      <IntlPro>
        <ModalTips {...props}/>
      </IntlPro>
    </Provider>)
}

const ModalId = `DerifyTradeModal`;

function upadte({msg,confirmable,show,operaType}:TradeMoalProps) {
  let container = document.getElementById(ModalId);
  if(!container){
    container = document.createElement("div")
    container.id = ModalId;
    document.body.appendChild(container);
  }

  ReactDOM.render(<IntlModalTips onTradeOK={() => destory()} visible={show} operaType={operaType} msg={msg} confirmable={confirmable}/>,container);
}

function destory() {
  let container = document.getElementById(ModalId);
  if(!container){
    container = document.createElement("div")
    container.id = ModalId;
    document.body.appendChild(container);
  }

  ReactDOM.unmountComponentAtNode(container);
}



const penddingParam:TradeMoalProps = {operaType:"pending",show:true,confirmable:false};
const successParam:TradeMoalProps = {operaType:"success",show:true,confirmable:true};
const errorParam:TradeMoalProps = {operaType:"error",show:true,confirmable:true};

const DerifyTradeModal = {
  pendding (param?:{ msg?:string, confirmable?:boolean, show?:boolean}) {
    upadte(Object.assign({},penddingParam,param))
  },
  success(param?:{ msg?:string, confirmable?:boolean, show?:boolean}){
    upadte(Object.assign({},successParam,param))
  },
  failed(param?: { msg?:string, confirmable?:boolean, show?:boolean}){
    upadte(Object.assign({},errorParam, param))
  },
  upadte,
}

export {
  DerifyTradeModal
}

export default ModalTips;
