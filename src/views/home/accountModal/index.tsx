/**
 * @title the wallet modal
 */
import * as React from "react";
import "./index.less";
import close from "@/assets/images/close.png";
import notice from "@/assets/images/notice.png";
import Button from "@/components/buttons/borderButton";
import Modal from "@/components/modal";

export interface AccountModalProps {
  close: () => void;
}

export interface AccountModalState {}

export default class AccountModal extends React.Component<
  AccountModalProps,
  AccountModalState
> {
  constructor(props: AccountModalProps) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <Modal className="account-modal">
        <div className="title">
          Account
          <img src={close} alt="" onClick={this.props.close} />
        </div>
        <div className="list">
          <div className="t">
            Margin Balance <img src={notice} alt="" />
          </div>
          <div className="num1">
            <span className="big-num">891,234</span>
            <span className="small-num">.23</span>
            <span className="unit">USDT</span>
          </div>
          <div className="t t1">
            Avaliable Margin Balance <img src={notice} alt="" />
          </div>
          <div className="num1">
            <span className="big-num">891,234</span>
            <span className="small-num">.23</span>
            <span className="unit">USDT</span>
          </div>
          <div className="btns">
            <Button
              click={() => {
                console.log(1);
              }}
              fill={true}
              className="deposit"
              text="Deposit"
            />
            <Button
              click={() => {
                console.log(1);
              }}
              className="withdaw"
              text="Withdaw"
            />
          </div>
          <div className="addr">0x40d276e6a7C80562BB1848e3ACB7B7629234C5a6</div>
          <div className="tag">MetaMask @ BNB Chain</div>
        </div>

        <Button
          click={() => {
            console.log(1);
          }}
          className="disconnect"
          text="Disconnect"
        />
      </Modal>
    );
  }
}
