import React, { FC, useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";
import MetaMaskOnboarding from '@metamask/onboarding';
import {useDispatch, useSelector} from "react-redux";

import {Button, Col, Row, message} from "antd";

import {RootStore} from "@/store";
import userModel, {ChainEnum, mainChain, WalletEnum} from "@/store/modules/user";

import BorderButton from "@/components/buttons/borderButton";
import TextOverflowView, {ShowPosEnum} from "@/components/TextOverflowView";


import WalletListModal from './walletListModal'
import AccountModal from './walletAccountModal'
import WalletOperateModal from "@/views/trade/modal/wallet"
import './index.less'

const ConnectWalletButton: FC = () => {
  const dispatch = useDispatch();
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [showAccountModal, setshowAccountModal] = useState<boolean>(false);
  const [showOperateModal, setShowOperatetModal] = useState<boolean>(false);
  const [modalAddr, setModalAddr] = useState<string>("");
  const [modalType, setModalType] = useState<"deposit" | "withdraw">("withdraw");
  const [network, setNetwork] = useState<ChainEnum|undefined>(mainChain);
  const [errorMsg, setErrorMsg] = useState<Partial<{id:string,value?:string}|undefined>>();
  const [wallet, setWallet] = useState<string>(WalletEnum.MetaMask);
  const {selectedAddress, isLogin, isEthum, showWallet, chainEnum, isMetaMask} = useSelector((state : RootStore) => state.user)

  const switchNetwork = async (item:ChainEnum) => {
    try {
      // check if the chain to connect to is installed
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: '0x'+(item.chainId).toString(16)}], // chainId must be in hexadecimal numbers
      });
      return true;
    } catch (error) {
      console.error(error);
      if (error.code === 4902 || error.code === -32603) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                // chainId: string; // A 0x-prefixed hexadecimal string
                // chainName: string;
                // nativeCurrency: {
                //   name: string;
                //   symbol: string; // 2-6 characters long
                //   decimals: 18;
                // };
                // rpcUrls: string[];
                // blockExplorerUrls?: string[];
                // iconUrls?: string[]; // Currently ignored.

                chainId: '0x'+(item.chainId).toString(16),
                rpcUrls: [item.rpc],
                chainName: item.name,
                blockExplorerUrls: [item.explorer],
                nativeCurrency:{
                  name:"BNB",
                  symbol: "BNB",
                  decimals: 18
                }
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error(addError);
        }
      }
      return false
    }
  }

  const checkWallet = useCallback((newWallet ) => {
    const walletIsMetaMask = newWallet === WalletEnum.MetaMask && isMetaMask;
    if(!walletIsMetaMask) {
      setErrorMsg({id: 'Trade.Wallet.NoWalletErrorMsg', value: WalletEnum.MetaMask})
      return false
    }
    setErrorMsg(undefined)
    return true
  },[wallet,isMetaMask]) // eslint-disable-line react-hooks/exhaustive-deps

  const checkNetwork = useCallback(async (newNetWork) => {
    const networkIsMain = newNetWork?.chainId === chainEnum?.chainId;
    if(!networkIsMain) {
      const ret = await switchNetwork(newNetWork);
      if(ret){
        setErrorMsg(undefined);
        return true;
      }
      setErrorMsg({id: 'Trade.Wallet.MainChainUnmatch', value: chainEnum?.name})
      return false
    }
    setErrorMsg(undefined)
    return true
  },[network,chainEnum,isEthum]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkLogin = useCallback(async (network:ChainEnum|undefined, wallet:WalletEnum|undefined) => {
    const networkCheckRes:boolean = await checkNetwork(network);
    const walletCheckRes:boolean = await checkWallet(wallet);
    if (networkCheckRes && walletCheckRes) {
      const loginWalletAction = userModel.actions.loginWallet();
      loginWalletAction(dispatch).then(() => {
        dispatch(userModel.actions.loginSuccess());
        setShowWalletModal(false);
      }).catch(e => console.error('loginWalletAction failed', e));
    }
  }, [wallet, network, checkNetwork, checkWallet]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {
        isLogin ? (
          <Button
            onClick={() => {
              setshowAccountModal(true);
            }}
            className="account-wrapper"
            shape="round"
            type="primary"
          >
            <TextOverflowView text={selectedAddress||''} showPos={ShowPosEnum.mid} len={10}/>
          </Button>
        ) : (
          <BorderButton
            fill
            className='web-connect-wallet-button'
            text={<FormattedMessage id="Trade.navbar.ConnectWallet" />}
            click={() => setShowWalletModal(true)} />
        )
      }
      {
        // the account modal
        showAccountModal && <AccountModal
          close={() => {
            setshowAccountModal(false)
          }}
          setType={setModalType}
          setAddr={setModalAddr}
          show={setShowOperatetModal}
        />
      }
      {
        showOperateModal &&  <WalletOperateModal
          close={() => {
            setShowOperatetModal(false);
          }}
          address={modalAddr}
          confirm={() => {
            setShowOperatetModal(false);
          }}
         type={modalType}/>
      }
      {
        // the wallet list include metamask
        showWalletModal &&  <WalletListModal
          close={() => {
            setShowWalletModal(false)
          }}
          click={() => checkLogin(network, wallet)}
          installed={MetaMaskOnboarding.isMetaMaskInstalled()}
        />
      }
    </>
  )
}
export default ConnectWalletButton
