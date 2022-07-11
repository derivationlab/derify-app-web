/**
 * @title the wallet modal
 */
import * as React from "react";
import "./index.less";
import Wallet1 from "@/assets/images/wallet/wallet1.png";
import close from "@/assets/images/close.png";
import Modal from "@/components/modal";
import { useIntl } from "react-intl";

interface WalletModalProps {
  close: () => void;
  click: any;
  installed: boolean;
}

export default function WalletModal(props: WalletModalProps) {
  const { formatMessage } = useIntl();
  const $t = (id: string) => formatMessage({ id });
  return (
    <Modal className="wallet-modal">
      <div className="title">
        {$t("selectWallet")} <img src={close} alt="" onClick={props.close} />
      </div>
      <div className="sub-title">
        {$t("terms1")}
        <a href="https://dev.derify.finance/terms" target="_blank">{$t("terms")}</a>
      </div>
      <div className="list">
        {
          props.installed ? <div className="wallet" onClick={props.click}>
            <img src={Wallet1} alt="" />
            <span>MetaMask</span>
          </div> : <a className="wallet" href="https://metamask.io/" target="_blank">
            <img src={Wallet1} alt="" />
            <span>MetaMask</span>
          </a>
        }
        {/* <div className="wallet">
          <img src={Wallet2} alt="" />
          <span>WalletConnect</span>
        </div>
        <div className="wallet">
          <img src={Wallet3} alt="" />
          <span>Coinbase Wallet</span>
        </div>
        <div className="wallet" >
          <img src={Wallet4} alt="" />
          <span>Fortmatic</span>
        </div> */}
      </div>
    </Modal>
  );
}

