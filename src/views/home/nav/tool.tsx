import React, {useCallback, useEffect, useState} from "react";
import {Button, Col, Image, Modal, Popover, Row, Select, Space} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {RootStore} from "@/store";

import {changeLang, showFundsDetail, showTransfer} from "@/store/modules/app";
import {FormattedMessage, useIntl} from "react-intl";
import IconFont from "@/components/IconFont";
import Account from "./Account";
import WalletInstall from './WalletInstall';

import Eth from "@/assets/images/Eth.png";
import HECO from "@/assets/images/huobi-token-ht-logo.png";
import Binance from "@/assets/images/binance-coin-bnb-logo.png";
import Solana from "@/assets/images/Solana.png";
import Wallet from "@/assets/images/Metamask.png";
import EnIcon from "@/assets/images/en.png";
import ZhIcon from "@/assets/images/zh.png";
import classNames from "classnames";
import userModel, {ChainEnum, mainChain, WalletEnum} from "@/store/modules/user";
import ErrorMessage from "@/components/ErrorMessage";
import Transfer from "@/views/CommonViews/Transfer";
import FundsDetails from "@/views/home/nav/Account/FundsDetail";
import TextOverflowView, {ShowPosEnum} from "@/components/TextOverflowView";

const { Option } = Select;

const networkList: { url: string; name: string, chainEnum?: ChainEnum }[] = [
  { url: Binance, name: ChainEnum.BSC.name, chainEnum: ChainEnum.BSC},
  { url: Eth, name: ChainEnum.Rinkeby.name, chainEnum: ChainEnum.Rinkeby },
  { url: HECO, name: "HECO", chainEnum: ChainEnum.Kovan },
  { url: Solana, name: "Solana", chainEnum: ChainEnum.Morden},
];

function Tool() {

  const locale: string = useSelector((state: RootStore) => state.app.locale);
  const [network, setNetwork] = useState<ChainEnum|undefined>(mainChain);
  const [wallet, setWallet] = useState<string>(WalletEnum.MetaMask);
  const [account] = useState<Partial<string>>();
  const [blance] = useState<Partial<string>>();
  const [errorMsg, setErrorMsg] = useState<Partial<{id:string,value?:string}|undefined>>();

  const {selectedAddress, isLogin, isEthum, showWallet, chainEnum, isMetaMask} = useSelector((state : RootStore) => state.user)

  const dispatch = useDispatch();

  const {transferShow, operateType, fundsDetailShow} = useSelector((state : RootStore) => state.app);

  const handelChangeIntl = useCallback((val: string) => {
    dispatch(changeLang(val));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkWallet = useCallback((newWallet ) => {

    if(!newWallet){
      return false
    }

    const walletIsMetaMask = newWallet === WalletEnum.MetaMask && isMetaMask;

    if(!walletIsMetaMask) {
      setErrorMsg({id: 'Trade.Wallet.NoWalletErrorMsg', value: WalletEnum.MetaMask})
      return false
    }

    setErrorMsg(undefined)

    return true
  },[wallet,isMetaMask]) // eslint-disable-line react-hooks/exhaustive-deps

  const checkNetwork = useCallback(async (newNetWork) => {

    if(!newNetWork){
      return false
    }

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
      }).catch(e => console.error('loginWalletAction failed', e));
    }
  }, [wallet, network, checkNetwork, checkWallet]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(userModel.actions.loadWallet());
  }, [selectedAddress]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {

    if(isLogin){
      return;
    }

    window.onload = function () {

      if(!window.ethereum){
        return;
      }

      window.ethereum.on('accountsChanged', function () {
        dispatch(userModel.actions.loadWallet())
      })

      window.ethereum.on('chainChanged', function () {
        dispatch(userModel.actions.loadWallet())
      })

      window.addEventListener('ethereum#initialized', () => dispatch(userModel.actions.loadWallet()), {
        once: true,
      });
    }

    setTimeout(() =>     {
      if(!isLogin){
        dispatch(userModel.actions.loadWallet())
      }
    }, 3000);
  }, [isLogin]); // eslint-disable-line react-hooks/exhaustive-deps

  const onChangeNetwork = useCallback((item:ChainEnum|undefined) => {
    if(!item || item.disabled) {
      return;
    }
    setNetwork(item);
  }, [checkLogin, wallet]); // eslint-disable-line react-hooks/exhaustive-deps

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



  const onChangeWallet = useCallback((val) => {
    setWallet(val);
  }, [checkLogin]); // eslint-disable-line react-hooks/exhaustive-deps

  const {formatMessage} = useIntl()

  function intl(id:string) {
    return formatMessage({id})
  }

  const $t = intl;

  return (
    <Row align={"middle"} className="tool">
      <Col style={{ marginRight: "10px" }}>
        <Button type="primary"
                danger
                shape="round"
                block><a href={"https://docs.derify.finance/tutorial/connect-wallet"} target={"_blank"} rel="noreferrer"><FormattedMessage id="Trade.navbar.Guide" /></a> </Button>
      </Col>
      <Col style={{ marginRight: "10px" }}>
        {isLogin ? (
          <Popover
            content={<Account {...{ account: account, blance: blance }} />}
            trigger="hover"
          >
            <Button
              className="account-wrapper"
              shape="round"
              icon={<Image preview={false} src={chainEnum?.logo}/>}
              type="primary"
            >
              <TextOverflowView text={selectedAddress||''} showPos={ShowPosEnum.mid} len={10}/>
            </Button>
          </Popover>
        ) : (
          <Button
            type="primary"
            onClick={() => {
              dispatch(userModel.actions.showWallet());
            }}
            shape="round"
            icon={
              <IconFont
                size={14}
                type="icon-link"
                style={{ marginRight: "10px" }}
              />
            }
          >
            <FormattedMessage id="Trade.navbar.ConnectWallet" />
          </Button>
        )}
      </Col>

      <Col>
        <Select value={locale} onChange={handelChangeIntl}>
          <Option value="en">
            <Space>
              <img src={EnIcon} alt="" /><span>English</span>
            </Space>
          </Option>
          <Option value="zh-CN">
            <Space>
              <img src={ZhIcon} alt="" />
              <span>????????????</span>
            </Space>
          </Option>
        </Select>
      </Col>
      <Modal
        title={<FormattedMessage id="Trade.navbar.ConnectWallet" />}
        footer={null}
        getContainer={false}
        focusTriggerAfterClose={false}
        visible={showWallet}
        onCancel={() => {
          dispatch(userModel.actions.showWallet(false));
        }}
      >
        <WalletInstall>
          <Row>
            {errorMsg?.id ? <Col flex="100%" style={{ marginBottom: "10px" }}>
              <ErrorMessage msg={<FormattedMessage id={errorMsg?.id} values={{0:errorMsg?.value}}/>} visible={!!errorMsg} onCancel={() => setErrorMsg(undefined)}/>
            </Col>:''}
            <Col style={{ marginBottom: "10px" }}>
              <FormattedMessage id="Trade.Wallet.ChooseNetwork" />
            </Col>

            <Col flex="100%">
              <Row className="network-list" justify="space-between">
                {networkList.map((item, i) => (
                  <Col
                    className={classNames({ active: item.chainEnum?.chainId === network?.chainId, disabled: item.chainEnum?.disabled})}
                    onClick={() => onChangeNetwork(item.chainEnum)}
                    key={i}
                  >
                    <IconFont size={18} type="icon-Group-" />
                    <img src={item.url} alt="" />
                    <div>{item.name}</div>
                  </Col>
                ))}
              </Row>
            </Col>
            <Col style={{ margin: "40px 0 10px" }}>
              <FormattedMessage id="Trade.Wallet.ChooseWallet" />
            </Col>
            <Col flex="100%">
              <Row className="wallet-list">
                <Col
                  className={classNames({ active: wallet === WalletEnum.MetaMask })}
                  onClick={() => onChangeWallet(WalletEnum.MetaMask)}
                >
                  <IconFont size={18} type="icon-Group-" />
                  <img src={Wallet} alt="" />
                  <div>Metamask</div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={[20,20]} justify={"center"}>
            <Col>
              <Button type={"primary"} disabled={!!errorMsg} onClick={() => checkLogin(network, wallet)}>{$t('global.Confirm')}</Button>
            </Col>
          </Row>
        </WalletInstall>
      </Modal>
      <Transfer
        visible={transferShow}
        closeModal={() => dispatch(showTransfer(false, operateType))}
        operateType={operateType}
        onCancel={() => dispatch(showTransfer(false, operateType))}
      />

      <FundsDetails
        visible={fundsDetailShow}
        onCancel={() => dispatch(showFundsDetail(false))}
      />
    </Row>
  );
}

export default Tool;
