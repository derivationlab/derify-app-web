/**
 * @title the wallet modal
 */
import * as React from "react";
import "./index.less";
import Wallet1 from "@/assets/images/wallet/wallet1.png";
import Wallet2 from "@/assets/images/wallet/wallet2.png";
import Wallet3 from "@/assets/images/wallet/wallet3.png";
import Wallet4 from "@/assets/images/wallet/wallet4.png";
import close from "@/assets/images/close.png";
import Modal from "@/components/modal";

export interface WalletModalProps {
  close: () => void;
  click: any;
  installed: boolean;
}

export interface WalletModalState {
}

export default class WalletModal extends React.Component<WalletModalProps,
  WalletModalState> {
  constructor(props: WalletModalProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Modal className="wallet-modal">
        <div className="title">
          Select a wallet
          <img src={close} alt="" onClick={this.props.close} />
        </div>
        <div className="sub-title">
          Before you connect wallet, you should have read, understand and agree
          to Derivation Labs' <a href="#">Terms of Service.</a>
        </div>
        <div className="list">
          {
            this.props.installed ? <div className="wallet" onClick={this.props.click}>
              <img src={Wallet1} alt="" />
              <span>MetaMask</span>
            </div> : <a className="wallet" href="https://metamask.io/" target="_blank">
              <img src={Wallet1} alt="" />
              <span>MetaMask</span>
            </a>
          }

          <div className="wallet">
            <img src={Wallet2} alt="" />
            <span>WalletConnect</span>
          </div>
          <div className="wallet">
            <img src={Wallet3} alt="" />
            <span>Coinbase Wallet</span>
          </div>
          <div className="wallet">
            <img src={Wallet4} alt="" />
            <span>Fortmatic</span>
          </div>
        </div>
      </Modal>
    );
  }
}
