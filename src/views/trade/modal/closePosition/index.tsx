import * as React from "react";
import close from "@/assets/images/close.png";
import Button from "@/components/buttons/borderButton";
import Modal from "@/components/modal";
import "./index.less";

export interface ClosePositionProps {
  close: () => void;
}

export interface ClosePositionState {}

export default class ClosePositionModal extends React.Component<
  ClosePositionProps,
  ClosePositionState
> {
  constructor(props: ClosePositionProps) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <Modal className="close-position-modal">
        <div className="title">
          Close Position
          <img src={close} alt="" onClick={this.props.close} />
        </div>
        <div className="list">
          <div className="t">Margin Balance</div>
        </div>
      </Modal>
    );
  }
}
