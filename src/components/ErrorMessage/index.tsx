import React, {CSSProperties, ReactNode, useEffect} from "react";
import { Row, Col } from "antd";
import IconFont from "@/components/IconFont";
import classNames from "classnames";

import './index.less'
import ModalTips, {TradeMoalProps} from "@/views/CommonViews/ModalTips";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import store from "@/store";
import IntlPro from "@/locales";

interface ErrorMessageProps {
  msg: string|React.ReactNode;
  visible: boolean;
  style?: CSSProperties;
  onCancel:()=>void
}

let timer:any = 0;
const ErrorMessage: React.FC<ErrorMessageProps> = ({ msg, visible,style ,onCancel}) => {
  useEffect(() => {
    if(visible){
      if(timer != null){
        clearTimeout(timer);
      }
      timer = setTimeout(() => onCancel(), 3000);
    }
  }, [visible])
  return (
    <Row  style={style} className={classNames(["error-container", visible && "active"])}>
      <Col onClick={onCancel}>
        <IconFont type="icon-cuowu" size={18} className="derify-pointer derify-close-icon" />
      </Col>
      <Col>{msg}</Col>
    </Row>
  );
};

const IntlErrorMsg : React.FC<ErrorMessageProps> = props => {

  return (
    <Provider store={store}>
      <IntlPro>
        <ErrorMessage {...props}/>
      </IntlPro>
    </Provider>)
}
const ModalId = `DerifyErrorNotice`;

function upadte(msg:ReactNode, visible:boolean) {
  let container = document.getElementById(ModalId);
  if(!container){
    container = document.createElement("div")
    container.id = ModalId;
    container.className="derify-error-fixed";
    document.body.appendChild(container);
  }

  ReactDOM.render(<IntlErrorMsg visible={visible} msg={msg} onCancel={() => destory()}/>,container);
}

function destory() {
  let container = document.getElementById(ModalId);
  if(container){
    ReactDOM.unmountComponentAtNode(container);
  }
}

const DerifyErrorNotice = {
  error (msg:ReactNode) {
    upadte(msg,!!msg);
  },
  upadte,
}

export {
  DerifyErrorNotice
}


export default ErrorMessage;
