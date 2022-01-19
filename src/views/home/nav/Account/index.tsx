import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Row, Col, Button, Statistic} from "antd";
import FundsDetails from "./FundsDetail";
import Transfer from "@/views/CommonViews/Transfer";

import {TransferOperateType} from "@/utils/types";

import {FormattedMessage} from "react-intl";
import * as web3Utils from "@/utils/web3Utils";
import {amountFormt, fck} from "@/utils/utils";
import {fromContractUnit, Token} from "@/utils/contractUtil";
import {createTokenPriceChangeEvenet} from "@/api/trade";
import {TraderAccount} from "@/utils/types";
import {Dispatch} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {showTransfer,showFundsDetail} from "@/store/modules/app";
import {ContractModel, RootStore, UserModel} from "@/store";
const Account: React.FC<Partial<{ account: string; blance: string }>> = ({
  account,
  blance,
}) => {
  const {selectedAddress} = useSelector((state:RootStore) => state.user);
  const loadAccountStatus = useSelector((state:RootStore) => state.app.reloadDataStatus.account);

  const {accountData,curPair,contractData} = useSelector((state:RootStore) => state.contract);
  const dispatch = useDispatch();

  useEffect(() => {

    if(!selectedAddress){
      return;
    }
    const loadAccountAction = ContractModel.actions.loadAccountData(selectedAddress);
    loadAccountAction(dispatch);

    const onDepositAction = ContractModel.actions.onDeposit(selectedAddress, function(){
      loadAccountAction(dispatch);
    });
    onDepositAction(dispatch);

    const onWithdrawAction = ContractModel.actions.onWithDraw(selectedAddress, function (){
      loadAccountAction(dispatch);
    });

    onWithdrawAction(dispatch);

    const onOpenPositionAction = ContractModel.actions.onOpenPosition(selectedAddress, function(){
      loadAccountAction(dispatch);
    });
    onOpenPositionAction(dispatch);

    const onClosePositionAction = ContractModel.actions.onClosePosition(selectedAddress, function(){
      loadAccountAction(dispatch);
    });
    onClosePositionAction(dispatch);

  },[selectedAddress,loadAccountStatus])

  return (
    <Row style={{ width: 500 }}>
      <Col flex="100%" className="margin-b-m">
        <Row justify="space-between">
          <Col><FormattedMessage id="Trade.Account.MarginAccount.AccountBalance"/></Col>
          <Col>
            <Button type="link" onClick={() => dispatch(showFundsDetail(true))}>
              <FormattedMessage id="Trade.Account.MarginAccount.BalanceHistory"/>
            </Button>
            <Button type="link" onClick={() => dispatch(UserModel.actions.logout())}>
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
            <Statistic value={fck(accountData.balance, -8, 2)} />
          </Col>
          <Col>BUSD</Col>
          {/*<Col*/}
          {/*  className="main-green"*/}
          {/*  style={{*/}
          {/*    background: "rgba(0,196,154,1)",*/}
          {/*    color: "#000",*/}
          {/*    borderRadius: "12px",*/}
          {/*    padding: "0px 1px",*/}
          {/*    marginLeft: "10px",*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <Statistic value={} {amountFormt(0, 2, true, "--", -6)}%*/}
          {/*</Col>*/}
          {/* </Space> */}
        </Row>
      </Col>
      <Col flex="100%" className="margin-b-max">
        <Row justify="space-between">
          <Col>
            <div><FormattedMessage id="Trade.Account.MarginAccount.MarginBalance"/></div>
            <div>
              <Statistic value={fck(accountData?.marginBalance, -8, 2)}/>BUSD
            </div>
          </Col>
          <Col>
            <div><FormattedMessage id="Trade.Account.MarginAccount.Margin"/></div>
            <div>
              <Statistic value={fck(accountData?.totalMargin, -8,2)} precision={2}/>BUSD
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
