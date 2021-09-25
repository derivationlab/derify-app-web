import React, {useCallback, useEffect, useState} from "react";
import {Modal, Row, Col, Table, Pagination} from "antd";
import { ModalProps } from "antd/es/modal";
import {useDispatch, useSelector} from "react-redux";
import {RootStore} from "@/store";
import contractModel from "@/store/modules/contract"
import {getTradeBalanceDetail, TradeBalanceDetail} from "@/api/trade";
import {useIntl} from "react-intl";
import {amountFormt, dateFormat, fck} from "@/utils/utils";
import {Pagenation} from "@/api/types";
import classNames from "classnames";

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
      render: (amount:string) => (
        <div>
          <div className={classNames(parseFloat(amount) > 0 ? "main-green":"main-red")}>{amountFormt(amount, 2,true, "--")}</div>
        </div>
      )
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
      render: (event_time:string) => dateFormat(new Date(event_time),"yyyy-MM-dd hh:mm:ss")
    },
  ];

  const dispatch = useDispatch()
  const [pagenation,setPagenation] = useState<Pagenation>(new Pagenation());
  const [loading,setLoading] = useState(true);


  useEffect(() => {

    if(!walletInfo.selectedAddress && !props.visible) {
      return
    }

    setLoading(true);
    getTradeBalanceDetail(walletInfo.selectedAddress, pagenation.current, pagenation.pageSize).then((pagenation) => {
      setPagenation(pagenation);
    }).catch(e => {
      console.log(`getTradeList ${e}`)
    }).finally(() => {
      setLoading(false);
    });

  },[walletInfo.selectedAddress,props.visible,pagenation.current, pagenation.pageSize]);


  const onPageChange = useCallback((pageNum, pageSize) => {
    pagenation.current = pageNum;
    if(pageSize){
      pagenation.pageSize = pageSize;
    }
    setPagenation(pagenation);
  },[]);

  return (
    <Modal {...props} title={intl("Trade.Account.MarginAccount.BalanceHistory")} width={600} footer={null}>
      <Row style={{ width: "100%" }}>
        <Col flex="100%">
          <Table loading={loading} dataSource={pagenation.records} columns={columns} pagination={false} />
        </Col>
        {
          pagenation.totalItems > 1 ? (<Col flex="100%">
            <Row justify="center">
              <Pagination pageSize={pagenation.pageSize} onChange={onPageChange} defaultCurrent={pagenation.current} total={pagenation.totalItems} showSizeChanger={false} />
            </Row>
          </Col>) : <></>
        }
      </Row>
    </Modal>
  );
};

export default FundDetails;
