import * as React from "react";
import Modal from "@/components/modal";
import close from "@/assets/images/close.png";
import Button1 from "@/components/buttons/borderButton";
import "./index.less";

export interface CancelOrderProps {
  close: () => void;
  confirm: () => void;
  type: "order" | "allOrder" | "allPosition";
}

const dataMap: any = {};
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

export interface CancelOrderState {}

export default class CancelOrder extends React.Component<
  CancelOrderProps,
  CancelOrderState
> {
  constructor(props: CancelOrderProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { confirm, type } = this.props;
    return (
      <Modal className="trade-cancal-order">
        <div className="title">
          {dataMap[type].title}
          <img src={close} alt="" onClick={this.props.close} />
        </div>
        <div className="text">{dataMap[type].content}</div>
        <div className="btn">
          <Button1
            text="Confirm"
            click={confirm}
            fill={true}
            className="cancal-order-btn"
          />
        </div>
      </Modal>
    );
  }
}
