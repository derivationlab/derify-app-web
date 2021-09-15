import React, {useEffect, useState} from "react";
import { Modal, Row, Col, Table } from "antd";
import { ModalProps } from "antd/es/modal";
import {useDispatch, useSelector} from "react-redux";
import {RootStore} from "@/store";
import contractModel from "@/store/modules/contract"
import {getTradeBalanceDetail, TradeBalanceDetail} from "@/api/trade";
import {useIntl} from "react-intl";
import {fck} from "@/utils/utils";

interface FundDetailsProps extends ModalProps {}

const feeTypeMap:{[key:number]:string} = {
  0: "Trade.Account.FinanceDetail.TradFee", //-TradingFee,
  1: "Trade.Account.FinanceDetail.PCF", //-PositionChangeFee
  2: "Trade.Account.FinanceDetail.Profit", //-ProfitAndLoss
  3: "Trade.Account.FinanceDetail.RealizedPnL", //-ProfitAndLossAuto
  4: "Trade.Account.FinanceDetail.Gas", //-GasFee
  5: "Trade.Account.FinanceDetail.LiqCost", //-Liquidation
  6: "Trade.Account.FinanceDetail.Compensation", //-SysCompensation
  7: "Trade.Account.FinanceDetail.SysLoss", //-SysLossApportionment
  100: "Trade.Account.FinanceDetail.Deposit", //-Deposit
  101: "Trade.Account.FinanceDetail.Withdraw" //-Withdraw
}

const FundDetails: React.FC<FundDetailsProps> = props => {

  const walletInfo = useSelector((state:RootStore) => state.user);
  const [dataSource,setDataSource] = useState<TradeBalanceDetail[]>([])

  const {formatMessage} = useIntl()

  function intl(id:string) {
    return formatMessage({id})
  }

  const columns = [
    {
      title: intl('Trade.Account.FinanceDetail.Type'),
      dataIndex: "fee_type",
      key: "fee_type",
      render: (fee_type:number) => {
        const feeTypeDesc = feeTypeMap[fee_type]

        return feeTypeDesc ? intl(feeTypeDesc) : 'unknown'
      }
    },
    {
      title: intl('Trade.Account.FinanceDetail.Amount'),
      dataIndex: "amount",
      key: "amount",
      render: (amount:string) => fck(amount, 0, 2)
    },
    {
      title: intl('Trade.Account.FinanceDetail.Balance'),
      dataIndex: "balance",
      key: "balance",
      render: (balance:string) => fck(balance, 0, 2)
    },
    {
      title: intl('Trade.Account.FinanceDetail.Time'),
      dataIndex: "event_time",
      key: "event_time",
      render: (event_time:string) => {{new Date(event_time).Format("yyyy-MM-dd hh:mm:ss")}}
    },
  ];

  const dispatch = useDispatch()

  useEffect(() => {

    if(!walletInfo.selectedAddress) {
      return
    }

    getTradeBalanceDetail(walletInfo.selectedAddress, 0, 50).then((data:TradeBalanceDetail[]) => {
      if(data.length > 0){
        data.forEach(item => dataSource.push(item))
      }
    }).catch(e => {
      console.log(`getTradeList ${e}`)
    })

  },[walletInfo])

  return (
    <Modal {...props} title={"资金明细"} width={400} footer={null}>
      <Col flex="100%">
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </Col>
      <Row style={{ width: "100%" }}></Row>
    </Modal>
  );
};

export default FundDetails;
