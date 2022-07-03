import * as React from "react";
import { ModalWithTitle } from "@/components/modal";
import Button1 from "@/components/buttons/borderButton";
import "./index.less";

export interface CancelOrderProps {
  close: () => void;
  confirm: () => void;
  type: "order" | "allOrder" | "allPosition";
}

type DataItem = {
  title: string;
  content: string;
}

type DataMap = {
  [key: string] : DataItem
}

const dataMap: DataMap= {};
dataMap["order"] = {
  title: "Cancel Order",
  content: "Do you want to cancel this order IMMEDIATELY ?",
};
dataMap["allOrder"] = {
  title: "Cancel All Order",
  content: "Do you want to cancel all order IMMEDIATELY ?",
};
dataMap["allPosition"] = {
  title: "Close  All Position",
  content: "Do you want to close all positions at Market Price?",
};

export default class CancelOrder extends React.Component<CancelOrderProps>{
  render() {
    const { confirm, type } = this.props;
    return (
      <ModalWithTitle
        className="trade-cancel-order"
        title={dataMap[type].title}
        close={this.props.close}
      >
        <div className="text">{dataMap[type].content}</div>
        <div className="btn">
          <Button1
            text="Confirm"
            click={confirm}
            fill={true}
            className="cancel-order-btn"
          />
        </div>
      </ModalWithTitle>
    );
  }
}
