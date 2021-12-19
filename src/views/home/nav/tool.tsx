import React, {useCallback, useEffect, useState} from "react";
import {Button, Col, Image, Modal, Popover, Row, Select, Space} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {RootStore} from "@/store";

import {changeLang, showFundsDetail, showTransfer} from "@/store/modules/app";
import {FormattedMessage, useIntl} from "react-intl";
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
import userModel, {ChainEnum, mainChain, WalletEnum} from "@/store/modules/user";
import ErrorMessage from "@/components/ErrorMessage";
import Transfer from "@/views/CommonViews/Transfer";
import FundsDetails from "@/views/home/nav/Account/FundsDetail";
import TextOverflowView, {ShowPosEnum} from "@/components/TextOverflowView";

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
  const [network, setNetwork] = useState<ChainEnum|undefined>(mainChain);
  const [wallet, setWallet] = useState<string>(WalletEnum.MetaMask);
  const [account, setAccount] = useState<Partial<string>>();
  const [blance, setBlance] = useState<Partial<string>>();
  const [errorMsg, setErrorMsg] = useState<Partial<{id:string,value?:string}|undefined>>();

  const {selectedAddress, isLogin, isEthum, showWallet, chainEnum} = useSelector((state : RootStore) => state.user)

  const dispatch = useDispatch();

  const {transferShow, operateType, fundsDetailShow} = useSelector((state : RootStore) => state.app);

  const handelChangeIntl = useCallback((val: string) => {
    dispatch(changeLang(val));
  }, []);

  const checkWallet = useCallback((newWallet ) => {

    if(!newWallet){
      return false
    }

    const walletIsMetaMask = newWallet === WalletEnum.MetaMask;

    if(!walletIsMetaMask) {
      setErrorMsg({id: 'Trade.Wallet.NoWalletErrorMsg', value: WalletEnum.MetaMask})
      return false
    }

    setErrorMsg(undefined)

    return true
  },[wallet])

  const checkNetwork = useCallback(async (newNetWork) => {

    if(!newNetWork){
      return false
    }

    const networkIsMain = newNetWork?.chainId === mainChain.chainId;

    if(!networkIsMain){
      setErrorMsg({id: 'Trade.Wallet.MainChainUnmatch', value: mainChain.name})
      return false;
    }

    if(!isEthum) {
      const ret = await switchNetwork(mainChain);

      if(ret){
        setErrorMsg(undefined);
        return true;
      }
      setErrorMsg({id: 'Trade.Wallet.MainChainUnmatch', value: mainChain.name})
      return false
    }

    setErrorMsg(undefined)

    return true
  },[network,isEthum]);


  const checkLogin = useCallback(async (network:ChainEnum|undefined, wallet:WalletEnum|undefined) => {
    if (await checkNetwork(network) && checkWallet(wallet)) {
      const loginWalletAction = userModel.actions.loginWallet();
      loginWalletAction(dispatch).then(() => {
        dispatch(userModel.actions.loginSuccess());
      }).catch(e => console.error('loginWalletAction failed', e));
    }
  }, [wallet, network, checkNetwork, checkWallet]);

  useEffect(() => {
    dispatch(userModel.actions.loadWallet());
  }, [selectedAddress]);

  useEffect(() => {

    if(isLogin){
      return;
    }

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

    setTimeout(() =>     {
      if(!isLogin){
        dispatch(userModel.actions.loadWallet())
      }
    }, 3000);
  }, [isLogin]);

  const onChangeNetwork = useCallback((item:ChainEnum|undefined) => {
    if(!item || item.disabled) {
      return;
    }
    setNetwork(item);
  }, [checkLogin, wallet]);

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
      return false
    }
  }



  const onChangeWallet = useCallback((val) => {
    setWallet(val);
  }, [checkLogin]);

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
                block><a href={"https://docs.derify.finance/tutorial/connect-wallet"} target={"_blank"}><FormattedMessage id="Trade.navbar.Guide" /></a> </Button>
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
              <span>简体中文</span>
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
