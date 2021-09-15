import React, { useCallback, useEffect, useState } from "react";
import { Button, Row, Col, Select, Modal, Popover, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@/store/index";

import {changeLang, showTransfer, showFundsDetail} from "@/store/modules/app/actions";
import { FormattedMessage } from "react-intl";
import IconFont from "@/components/IconFont";
import Account from "./Account";

import Eth from "@/assets/images/Eth.png";
import HECO from "@/assets/images/huobi-token-ht-logo.png";
import Binance from "@/assets/images/binance-coin-bnb-logo.png";
import Solana from "@/assets/images/Solana.png";
import Wallet from "@/assets/images/Metamask.png";
import EnIcon from "@/assets/images/en.png";
import ZhIcon from "@/assets/images/zh.png";
import classNames from "classnames";
import * as web3Utils from '@/utils/web3Utils'
import userModel, {asyncInitWallet, ChainEnum, getWallet, mainChain, UserState, WalletEnum} from "@/store/modules/user";
import {fck} from "@/utils/utils";
import ErrorMessage from "@/components/ErrorMessage";
import Transfer from "@/views/CommonViews/Transfer";
import {TransferOperateType} from "@/utils/types";
import {Dispatch} from "redux";
import FundsDetails from "@/views/home/nav/Account/FundsDetail";

const { Option } = Select;

const networkList: { url: string; name: string, chainEnum?: ChainEnum }[] = [
  { url: Eth, name: mainChain.name, chainEnum: mainChain },
  { url: HECO, name: "HECO", chainEnum: ChainEnum.Kovan },
  { url: Binance, name: "Binance", chainEnum: ChainEnum.Goerli},
  { url: Solana, name: "Solana", chainEnum: ChainEnum.Morden},
];

function Tool() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const locale: string = useSelector((state: RootStore) => state.app.locale);
  const [network, setNetwork] = useState<Partial<ChainEnum|null>>();
  const [wallet, setWallet] = useState<Partial<string|null>>();
  const [account, setAccount] = useState<Partial<string>>();
  const [blance, setBlance] = useState<Partial<string>>();
  const [errorMsg, setErrorMsg] = useState<Partial<{id:string,value?:string}|undefined>>();
  const [walletInfo, setWalletInfo] = useState<Partial<UserState>>();

  const state = useSelector((state : RootStore) => state)

  const dispatch = useDispatch();

  const {transferShow, operateType, fundsDetailShow} = useSelector((state : RootStore) => state.app);

  const handelChangeIntl = useCallback((val: string) => {
    dispatch(changeLang(val));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlLoginWallet = useCallback(() => {

    dispatch( async (commit: Dispatch) => {
      return await web3Utils.enable();
    })

  }, [])

  const loadWallet = useCallback(() => {

    asyncInitWallet().then(() => {
      getWallet().then(walletInfo => {
        setAccount(walletInfo.selectedAddress||"")
        setWalletInfo(walletInfo)
      })
    })

  }, [])

  const checkWallet = useCallback(() => {

    if(!wallet){
      return false
    }

    const walletIsMetaMask = wallet === WalletEnum.MetaMask;

    if(!walletIsMetaMask) {
      setErrorMsg({id: 'Trade.Wallet.NoWalletErrorMsg', value: WalletEnum.MetaMask})
      return false
    }

    setErrorMsg(undefined)

    return true
  },[wallet])

  const checkNetwork = useCallback(() => {


    if(!network){
      return false
    }

    const networkIsMain = network?.chainId === mainChain.chainId;

    if(!networkIsMain) {
      setErrorMsg({id: 'Trade.Wallet.MainChainUnmatch', value: mainChain.name})
      return false
    }

    setErrorMsg(undefined)

    return true
  },[network])

  useEffect(() => {
    if (checkNetwork() && checkWallet()) {
      handlLoginWallet()
    }
  }, [walletInfo, network,wallet]);

  useEffect(() => {
    loadWallet()

    window.onload = function () {
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

  }, []);

  return (
    <Row align={"middle"} className="tool">
      <Col style={{ marginRight: "10px" }}>
        {walletInfo && walletInfo.isLogin ? (
          <Popover
            content={<Account {...{ account: account, blance: blance }} />}
            trigger="hover"
          >
            <Button
              className="account-wrapper"
              shape="round"
              icon={<IconFont size={14} type="icon-link" />}
              type="primary"
            >
              {walletInfo.selectedAddress}
            </Button>
          </Popover>
        ) : (
          <Button
            type="primary"
            onClick={() => {
              setIsModalVisible(true);
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
              <span>繁体中文</span>
            </Space>
          </Option>
          <Option value="zh-CN">
            <Space>
              <img src={ZhIcon} alt="" />
              <span>简体中文</span>
            </Space>
          </Option>
        </Select>
        <span></span>
      </Col>
      <Modal
        title={<FormattedMessage id="Trade.navbar.ConnectWallet" />}
        footer={null}
        getContainer={false}
        focusTriggerAfterClose={false}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <Row>
          {errorMsg?.id ? <Col style={{ marginBottom: "10px" }}>
            <ErrorMessage msg={<FormattedMessage id={errorMsg?.id} values={{0:errorMsg?.value}}/>} visible={!!errorMsg} onCancel={() => setErrorMsg(undefined)}/>
          </Col>:''}
          <Col style={{ marginBottom: "10px" }}>
            <FormattedMessage id="Trade.Wallet.ChooseNetwork" />
          </Col>

          <Col flex="100%">
            <Row className="network-list" justify="space-between">
              {networkList.map((item, i) => (
                <Col
                  className={classNames({ active: item.chainEnum?.chainId === network?.chainId })}
                  onClick={() => {

                    if(item.chainEnum?.chainId === network?.chainId) {
                      setNetwork(undefined)
                    }else{
                      setNetwork(item.chainEnum);
                    }

                    checkNetwork()

                  }}
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
                onClick={() => {
                  if(wallet === WalletEnum.MetaMask) {
                    setWallet(undefined);
                  }else{
                    setWallet(WalletEnum.MetaMask);
                  }
                }}
              >
                <IconFont size={18} type="icon-Group-" />
                <img src={Wallet} alt="" />
                <div>Metamask</div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
      <Transfer
        visible={transferShow}
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
