import React, {useCallback, useEffect, useMemo, useState} from "react";
import { Row, Col, Button } from "antd";
import FundsDetails from "./FundsDetail";
import Transfer from "@/views/CommonViews/Transfer";

import {TransferOperateType} from "@/utils/types";

import {FormattedMessage} from "react-intl";
import * as web3Utils from "@/utils/web3Utils";
import {amountFormt, fck} from "@/utils/utils";
import {Token} from "@/utils/contractUtil";
import {createTokenPriceChangeEvenet} from "@/api/trade";
import {TraderAccount} from "@/utils/types";
import {Dispatch} from "redux";
import {useDispatch} from "react-redux";
import {showTransfer,showFundsDetail} from "@/store/modules/app/actions";
const Account: React.FC<Partial<{ account: string; blance: string }>> = ({
  account,
  blance,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [traderAccount, setTraderAccount] = useState<Partial<TraderAccount>>();
  const [spotPrice, setSpotPrice] = useState<Partial<number>>();
  const [priceRate, setPriceRate] = useState<Partial<number>>();

  const dispatch = useDispatch();

  const contract = web3Utils.contract(account);

  const loadAccountInfo = useCallback(async() => {
    if(account){

      const traderAccount = await contract.getTraderAccount(account)
      const traderVar = await contract.getTraderVariables(account)
      traderAccount.totalPositionAmount = traderVar.totalPositionAmount
      traderAccount.marginRate = traderVar.marginRate
      traderAccount.marginBalance = traderVar.marginBalance
      setTraderAccount(traderAccount)
    }

    const price = await contract.getSpotPrice(Token.ETH)
    setSpotPrice(price)

  }, [])


  useEffect(() => {
    loadAccountInfo()

  },[])

  useMemo(()=>{
    return createTokenPriceChangeEvenet(Token.ETH, (pairKey:string, priceChangeRate:number) => {
      setPriceRate(priceChangeRate)
    })
  },[])

  return (
    <Row style={{ width: 500 }}>
      <Col flex="100%" className="margin-b-m">
        <Row justify="space-between">
          <Col><FormattedMessage id="Trade.Account.MarginAccount.MarginAccount"/></Col>
          <Col>
            <Button type="link" onClick={() => dispatch(showFundsDetail(true))}>
              <FormattedMessage id="Trade.Account.MarginAccount.BalanceHistory"/>
            </Button>
            <Button type="link">
              <FormattedMessage id="Trade.Wallet.Disconnect"/></Button>
          </Col>
        </Row>
      </Col>
      <Col flex="100%" className="margin-b-max">
        <Row align="bottom">
          {/* <Space > */}
          <Col
            className="main-color"
            style={{ fontSize: 30, fontWeight: 700, marginRight: "10px" }}
          >
            {fck(spotPrice, -8, 2)}
          </Col>
          <Col>ETH</Col>
          <Col
            className="main-green"
            style={{
              background: "rgba(0,196,154,1)",
              color: "#000",
              borderRadius: "12px",
              padding: "0px 1px",
              marginLeft: "10px",
            }}
          >
            {amountFormt(priceRate, -8, true, "--")}
          </Col>
          {/* </Space> */}
        </Row>
      </Col>
      <Col flex="100%" className="margin-b-max">
        <Row justify="space-between">
          <Col>
            <div><FormattedMessage id="Trade.Account.MarginAccount.MarginBalance"/></div>
            <div>
              <span>{fck(traderAccount?.marginBalance, -8, 4)}</span>USDT
            </div>
          </Col>
          <Col>
            <div><FormattedMessage id="Trade.Account.MarginAccount.Margin"/></div>
            <div>
              <span>{fck(traderAccount?.availableMargin, -8, 4)}</span>USDT({fck(traderAccount?.marginRate, -6,2)}%)
            </div>
          </Col>
        </Row>
      </Col>
      <Col flex="100%">
        <Row gutter={20}>
          <Col flex="25">
            <Button
              block
              type="ghost"
              onClick={() => {
                dispatch(showTransfer(true, TransferOperateType.withdraw))
              }}
            >
              <FormattedMessage id="Trade.Account.MarginAccount.Withdraw"/>
            </Button>
          </Col>
          <Col flex="25">
            <Button
              block
              type="primary"
              onClick={() => {
                dispatch(showTransfer(true, TransferOperateType.deposit))
              }}
            >
              <FormattedMessage id="Trade.Account.MarginAccount.Deposit"/>
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Account;
