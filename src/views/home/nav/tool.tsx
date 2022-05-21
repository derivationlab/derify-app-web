import React, {useCallback, useEffect, useState} from "react";
import MetaMaskOnboarding from '@metamask/onboarding';
import {Button, Col, Row, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {RootStore} from "@/store";
import {changeLang, showFundsDetail, showTransfer} from "@/store/modules/app";
import {FormattedMessage, useIntl} from "react-intl";

// images
import Eth from "@/assets/images/Eth.png";
import BSC from "@/assets/images/bnb1.png";
import ETH1 from "@/assets/images/eth1.png";
import Polygon from "@/assets/images/polygon.png";
import Avalanche from "@/assets/images/avalanche.png";
import MenuOther from '@/assets/images/menu-others.png';
import MenuOtherActive from '@/assets/images/menu-others-active.png';
import HECO from "@/assets/images/huobi-token-ht-logo.png";
import Binance from "@/assets/images/binance-coin-bnb-logo.png";
import Solana from "@/assets/images/Solana.png";

import userModel, {ChainEnum, mainChain, WalletEnum} from "@/store/modules/user";
import TextOverflowView, {ShowPosEnum} from "@/components/TextOverflowView";
import BorderButton from "@/components/buttons/borderButton";

// modals
import WalletListModal from '../walletListModal'
import WalletOperateModal from "../../trade/modal/wallet"
import AccountModal from '../walletAccountModal'

const networkList: { url: string; name: string, chainEnum?: ChainEnum }[] = [
  { url: Binance, name: ChainEnum.BSC.name, chainEnum: ChainEnum.BSC},
  { url: Eth, name: ChainEnum.Rinkeby.name, chainEnum: ChainEnum.Rinkeby },
  { url: HECO, name: "HECO", chainEnum: ChainEnum.Kovan },
  { url: Solana, name: "Solana", chainEnum: ChainEnum.Morden},
];

const lang: any = 'en';
const theme: any = 'light';

const netWorks =  [
  ['BSC', 'BNB Chain'],
  //  ['POL', 'Polygon'],
  //  ['AVA', 'Avalanche'],
  //  ['ETH', 'Etherum']
];

const icons: any = {}
icons['BSC'] = BSC;
icons['POL'] = Polygon;
icons['AVA'] = Avalanche;
icons['ETH'] = ETH1;

function Tool() {

  const dispatch = useDispatch();
  const [showAccountModal, setshowAccountModal] = useState<boolean>(false);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [showOperateModal, setShowOperatetModal] = useState<boolean>(false);
  const [showAddTokenList, setShowAddTokenList] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showLangs, setShowLangs] = useState<boolean>(false);
  const [showTheme, setShowTheme] = useState<boolean>(false);
  const [modalAddr, setModalAddr] = useState<string>("");
  const [modalType, setModalType] = useState<"deposit" | "withdraw">("withdraw");

  const [line, setLine] = useState<string>('BSC');
  const [showLineList, setShowLineList] = useState<boolean>(false);
  const locale: string = useSelector((state: RootStore) => state.app.locale);
  const [network, setNetwork] = useState<ChainEnum|undefined>(mainChain);
  const [wallet, setWallet] = useState<string>(WalletEnum.MetaMask);
  const [account] = useState<Partial<string>>();
  const [blance] = useState<Partial<string>>();
  const [errorMsg, setErrorMsg] = useState<Partial<{id:string,value?:string}|undefined>>();

  const {selectedAddress, isLogin, isEthum, showWallet, chainEnum, isMetaMask} = useSelector((state : RootStore) => state.user)
  const {transferShow, operateType, fundsDetailShow} = useSelector((state : RootStore) => state.app);

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
  }, [isLogin]); // eslint-disable-line react-hooks/exhaustive-deps

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

  let onboarding: any = React.useRef();
  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
    console.log(onboarding);
  }, []);

  async function addDRF() {
    const tokenAddress = '0x89C1Af791d7B4cf046Dca8Fa10a41Dd2298A6a3F';
    const tokenSymbol = 'DRF';
    const tokenDecimals = 18;
    const tokenImage = 'https://bsctestnet-prod-api.derify.exchange:8084/1650023741739-logo.png';
    try {
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });
      if (wasAdded) {
        message.success("added success")
      } else {
        message.error("added failed, please try later");
      }
    } catch (error) {
       message.error("added failed, please try later");
    }
  }

  return (
    <Row align={"middle"} className="tool">
      <Col className="connect-btn">
        {isLogin ? (
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
            fill={true}
            className='con-btn'
            text={<FormattedMessage id="Trade.navbar.ConnectWallet" />}
            click={() => {
              setShowWalletModal(true);
              // dispatch(userModel.actions.showWallet());
            }} />
        )}
      </Col>

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

      {
        // add-token button show if login
        isLogin ?  <Col className="add-token">
          <BorderButton text='Add Token' click={() => {
            setShowAddTokenList(!showAddTokenList);
          }}/>
          {
            showAddTokenList && (
              <div className="add-token-list">
                <div className="token" onClick={addDRF}>Add DRF Token to wallet</div>
                <div className="token">Add eDRF Token to wallet</div>
                <div className="token">Add bDRF Token to wallet</div>
                <div className="hr" />
                <div className="token">Buy DRF Token at pancakeswap</div>
                <div className="token">Buy eDRF Token at pancakeswap</div>
                <div className="token">Buy bDRF Token at pancakeswap</div>
              </div>
            )
          }
        </Col> : null
      }

      <Col className="change-line">
        <BorderButton
          className={`change-line-btn change-line-btn-${line.toLocaleLowerCase()}`}
          icon={icons[line]} text={line} click={() => {
            setShowLineList(!showLineList);
          }}/>
         {
         // this is the toggle chain list
         showLineList && (
          <div className="change-line-list">
            <div className="title">Select a network</div>
            {
              netWorks.map(item =>
                <BorderButton key={item[0]} className={`select-btn select-btn-${item[0].toLocaleLowerCase()} ${line === item[0] ? '' : 'select-normal'}`}
                  fill={true}
                  icon={icons[item[0]]} text={item[1]} click={() => {
                    setLine(item[0])
                    setShowLineList(false)
                  }}/>
              )
            }
          </div>
        )}
      </Col>

      <Col className="menu-other">
        <img src={(showSettings || showLangs || showTheme) ? MenuOtherActive : MenuOther } onClick={
          () => {
            if(showTheme || showLangs){
              return false;
            }
            setShowSettings(true);
          }
        }/>
        {
          showSettings &&  (
            <div className="setting-list">
              <div className="item" onClick={() => {
                setShowLangs(true);
                setShowSettings(false);
              }}>
                <span>Language</span>
                <span>{locale === 'en' ? 'English' : '简体中文'} &gt;</span>
              </div>
              <div className="item" onClick={() => {
                setShowTheme(true);
                setShowSettings(false);
              }}>
                <span>Theme</span>
                <span>light &gt;</span>
              </div>
              <div className="item">
                <span>Feedback</span>
              </div>
              <a className="item" href="https://docs.derify.finance/" target='_blank'>
                <span>Docs</span>
              </a>
              <a className="item" href="https://docs.derify.finance/whitepaper/introduction" target='_blank'>
                <span>Whitepaper</span>
              </a>
            </div>
          )
        }

        {
          showLangs && (
            <div className="lang-list">
               <div className={locale === 'en' ? 'lang-active':'lang'} onClick={() => {
                 dispatch(changeLang('en'))
                 setShowLangs(false)
               }}>
                 English
               </div>
               <div className={locale === 'zh-CN' ? 'lang-active':'lang'} onClick={
                 () => {
                  dispatch(changeLang('zh-CN'));
                  setShowLangs(false);
                 }
               }>
                 简体中文
               </div>
            </div>
          )
        }

      {
          showTheme && (
            <div className="lang-list">
               <div className={theme === 'light' ? 'lang-active':'lang'} onClick={() => {
                 setShowTheme(false)
               }}>
                 Light
               </div>
               <div className={theme === 'dark' ? 'lang-active':'lang'} onClick={
                 () => setShowTheme(false)
               }>
                 Dark
               </div>
            </div>
          )
        }

      </Col>
    </Row>
  );
}

export default Tool;
