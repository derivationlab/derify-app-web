import React, {ReactNode, useCallback, useEffect, useState} from "react";
import { Modal, Row, Col } from "antd";
import { ModalProps } from "antd/es/modal";
import { useIntl } from "react-intl";

import {amountFormt, dateFormat, fck} from "@/utils/utils";
import {ContractUnit, RewardsHistoryRecord, RewardsType} from "@/store/modules/reward";
import {RewardModel, RootStore} from "@/store";
import {useDispatch, useSelector} from "react-redux";
import {set} from "lodash";
import classNames from "classnames";
interface TransactionHistoryProps extends ModalProps {
  type: RewardsType;
}

const listTitleMap = {
  "USDT":[
    "Rewards.Mining.History.Type",
    "Rewards.Mining.History.Amount",
    "Rewards.Mining.History.Balance",
    "Rewards.Mining.History.Time",
  ],
  "eDRF":[
    "Rewards.Staking.History.Type",
    "Rewards.Staking.History.Amount",
    "Rewards.Staking.History.Balance",
    "Rewards.Staking.History.Time",
  ],
  "bDRF":[
    "Rewards.Bond.History.Type",
    "Rewards.Bond.History.Amount",
    "Rewards.Bond.History.Balance",
    "Rewards.Bond.History.Time",
  ]
};

const TransactionHistory: React.FC<TransactionHistoryProps> = props => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  function intl(id:string) {
    return formatMessage({id})
  }

  const $t = intl;
  const trader = useSelector((state:RootStore) => state.user.selectedAddress);
  const [records, setRecords] = useState<RewardsHistoryRecord[]>([]);

  const getHistoryRecord = useCallback((trader, type:RewardsType,page = 0,pageNum = 10) => {

    if(!trader) {
      return;
    }

    let getHistoryAction = null;

    if(type === RewardsType.USDT) {
      getHistoryAction = RewardModel.actions.getTraderPMRBalance(trader, page, pageNum);
    }

    if(type === RewardsType.eDRF) {
      getHistoryAction = RewardModel.actions.getTraderEdrfHistory(trader, page, pageNum);
    }

    if(type === RewardsType.bDRF) {
      getHistoryAction = RewardModel.actions.getTraderBondBalance(trader, page, pageNum);
    }

    if(getHistoryAction === null){
      return setRecords([]);
    }

    let results:RewardsHistoryRecord[] = [];
    if(page > 0){
      results = results.concat(records);
    }


    getHistoryAction(dispatch).then((rows) => {
      results = results.concat(rows);

      setRecords(results);
    }).catch(e => {
      console.error("getHistoryAction error", e)
    });

  }, []);

  useEffect(() => {
    if(!props.visible){
      return
    }

    getHistoryRecord(trader, props.type);
  }, [props.type,props.visible])

  const modalTitleMap = {
    "USDT": <p>{$t("Rewards.Mining.History.PositionMining")}{$t("Rewards.Mining.History.PositionMining")}</p>,
    "eDRF": <p>eDRF&nbsp;{$t("Rewards.Staking.Card.TransactionHistory")}</p>,
    "bDRF": <p>eDRF&nbsp;{$t("Rewards.Mining.History.PositionMining")}</p>,
  };
  return (
    <Modal
      {...props}
      title={modalTitleMap[props.type]}
      width={400}
    >
      <Row>
        <Col flex="100%">
          <Row justify="space-between" style={{ marginBottom: 24 }}>
            {listTitleMap[props.type].map(item => (
              <Col key={item} flex="25%">
                {formatMessage({ id: item })}
              </Col>
            ))}
          </Row>
        </Col>
        {records.map((item, i) => (
          <Col flex="100%" key={i}>
            <Row justify="space-between" style={{ marginBottom: 10 }}>
              <Col flex="25%">{$t(item.type)}</Col>
              <Col flex="25%">
                <div className={classNames(item.amount > 0 ? "main-green" : "main-red")}>{amountFormt(item.amount,2, true,"--")}</div>
                <div>{item.amoutToken}</div>
              </Col>
              <Col flex="25%">
                <div className="main-white">{amountFormt(item.balance,2,false, "--")}</div>
                <div>{item.balanceToken}</div>
              </Col>
              <Col flex="25%">
                <div className="main-white">{dateFormat(new Date(item.time),"yyyy-MM-dd")}</div>
                <div>{dateFormat(new Date(item.time),"hh:mm:ss")}</div>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

export default TransactionHistory;
