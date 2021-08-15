import React,{CSSProperties} from "react";
import { Row, Col } from "antd";
import IconFont from "@/components/IconFont";
import classNames from "classnames";

import './index.less'

interface ErrorMessageProps {
  msg: string;
  visible: boolean;
  style?: CSSProperties;
  onCancel:()=>void
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ msg, visible,style ,onCancel}) => {
  return (
    <Row  style={style} className={classNames(["error-container", visible && "active"])}>
      <Col>{msg}</Col>
      <Col onClick={onCancel}>
        <IconFont type="icon-cuowu" size={18} className="derify-pointer" />
      </Col>
    </Row>
  );
};

export default ErrorMessage;
