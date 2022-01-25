import React, {useCallback, useEffect, useState} from "react";
import {Row, Col, Button, Space, Input, Tabs, message, Spin, Statistic} from "antd";
import {useDispatch, useSelector} from "react-redux";
import { RouteProps } from "@/router/types";
import {useIntl} from "react-intl";
import {RootStore} from "@/store";
import {Dispatch} from "redux";
import Link from "antd/lib/typography/Link";
import {isUSDTClaimed, sendUSDT} from "@/api/trade";
import {DerifyTradeModal} from "@/views/CommonViews/ModalTips";
import ErrorMessage, {DerifyErrorNotice} from "@/components/ErrorMessage";
import "./index.less"
import {Token} from "@/utils/contractUtil";
import {ChainEnum} from "@/store/modules/user";

interface FaucetProps extends RouteProps {}

const code =
  "<div class='g-recaptcha' data-callback='recaptchaCallBack' data-sitekey='6Lev3DIeAAAAAD5fDP3f12cMzgmPfu9qZaOMdQYd'></div>";

const Faucet: React.FC<FaucetProps> = props => {
  const { history } = props;
  const {trader,chainEnum} = useSelector((state:RootStore) => state.user);
  const [traderInputVal,setTraderInputValue] = useState("");
  const [usdtClaimed,setUsdtClaimed] = useState(true);

  const [showRecaptcha, setShowRecaptcha] = useState(false);
  const [valid, setValid] = useState(false);

  const [loading,setLoading] = useState(false);
  const defaultUSDTAmount = 100000;
  const tokenAddress = Token.USDT;
  const dispatch = useDispatch();

  const {formatMessage} = useIntl();

  function intl<T>(id:string,values:T[] = []) {
    const intlValues:{[key:number]:T} = {}
    values.forEach((item, index) => {
      intlValues[index] = item
    })
    return formatMessage({id}, intlValues)
  }

  useEffect(() => {
    if(trader){
      setTraderInputValue(trader);
      isUSDTClaimed(trader).then((res) => {
        setUsdtClaimed(res);
      }).catch(e => {
        console.log('error', e);
      })
    }
  }, [trader])

  useEffect(() => {
      // @ts-ignore
      window.recaptchaCallBack = () => {
        setValid(true)
        setShowRecaptcha(false)
        onSendUSDT();
      }
      return () => {
         // @ts-ignore
        window.recaptchaCallBack = null;
      }
  }, [])

  const $t = intl;

  const onSendUSDT = useCallback(() => {
    if(usdtClaimed){
      DerifyTradeModal.failed({msg: formatMessage({id: 'Faucet.GetUSDTError'})});
      return;
    }

    setLoading(true);
    sendUSDT(traderInputVal, defaultUSDTAmount).then((data) => {

      if(data.code === 0){
        setUsdtClaimed(true);
        addTestTokentoWallet();
        DerifyTradeModal.success();
      }else{
        DerifyTradeModal.failed({msg: data.msg});
      }

    }).catch(e => {
      DerifyTradeModal.failed({msg: e?.msg});
    }).finally(() => {
      setLoading(false);
    })
  },[traderInputVal,usdtClaimed]);

  const addTestTokentoWallet = useCallback(async() => {
    const tokenAddress = Token.USDT;
    const tokenSymbol = 'USDT';
    const tokenDecimals = 18;
    const tokenImage = null;

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
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
    } catch (error) {
      console.log(error);
    }
  },[]);


  return (
    <Row className="faucet-container main-block" gutter={[20,20]} justify={"center"}>
      <Col flex="100%" className="main-wrapper">
        <Row gutter={[20,20]} align={"middle"}  justify={"center"}>
          <Col >
            {$t("Faucet.Address")}
          </Col>
          <Col>
            <Input  size="large" style={{width: "400px"}} value={tokenAddress} readOnly={true}/>
          </Col>
        </Row>
      </Col>
      <Col flex="100%">
        <Row justify={"center"}>
          <Col>
            <Spin spinning={loading}>

            <div
              dangerouslySetInnerHTML={{ __html: code }}
              style={{
                display: showRecaptcha ? "block" : "none",
              }}
            ></div>
            {
              valid ? null :   <Button onClick={
                () => {
                  setShowRecaptcha(true)
                }
              }> 
                   {$t("Faucet.GetUSDT", [<Statistic prefix={" "} suffix={" "} style={{display: "inline-block"}} valueStyle={{color:"none"}} value={defaultUSDTAmount}/>])}
               </Button>
            }

            {
              valid && (
                <Button className={usdtClaimed ? 'disabled' :''} type={"primary"} onClick={onSendUSDT}>
                  {$t("Faucet.GetUSDT", [<Statistic prefix={" "} suffix={" "} style={{display: "inline-block"}} valueStyle={{color:"none"}} value={defaultUSDTAmount}/>])}
                </Button>
              )
            }
            </Spin>
          </Col>
        </Row>
      </Col>
      <Col flex="100%">
        <Row justify={"center"}>
          <Col>
            {chainEnum?.chainId == ChainEnum.Rinkeby.chainId
              ? <Link target="_blank" href="https://www.rinkeby.io/#faucet">
                <Button type="link">
                  {$t("Faucet.GetETH")}
                </Button>
              </Link> :<></>}
            {chainEnum?.chainId == ChainEnum.BSC.chainId
              ? <Link target="_blank" href="https://testnet.binance.org/faucet-smart">
                <Button type="link">
                  {$t("Faucet.GetBNB")}
                </Button>
              </Link> :<></>}

          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Faucet;
