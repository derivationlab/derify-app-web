import React, {useCallback, useEffect, useState} from "react";
import {Row, Col, Tabs, Table, Spin} from "antd";
import { ColumnsType } from "antd/es/table";
import {useIntl} from "react-intl";
import {BrokerHistoryRecord, getbrokerBindTraders, getBrokerRewardHistory} from "@/api/broker";
import {amountFormt, dateFormat} from "@/utils/utils";
import classNames from "classnames";
import {useSelector} from "react-redux";
import {RootStore} from "@/store";
const { TabPane } = Tabs;

interface AcType {
  balance: string;
  balanceType: string;
  amount: string;
  amountType: string;
  type: string;
  time: string;
}
interface Trader {
  address: string;
  time: string;
}

function getUpdateType(type:string|number) {
  return 'Rewards.Bond.History.Type' + type;
}

function Record() {
  const {formatMessage} = useIntl();
  const trader = useSelector<RootStore,string>(state => state.user.selectedAddress||"")

  const [brokerTradeRecords, setBrokerTradeRecords] = useState<BrokerHistoryRecord[]>([]);
  const [rewardPageNum, setRewardPageNum] = useState<number>(0);

  const [brokerTraders, setBrokerTraders] = useState<{trader:string,update_time:Date}[]>([]);
  const [tradersPageNum, setTradersPageNum] = useState<number>(0);

  const [sping, setSping] = useState<boolean>(true);

  function intl<T>(id:string,values:T[] = []) {

    const intlValues:{[key:number]:T} = {}

    values.forEach((item, index) => {
      intlValues[index] = item
    })


    return formatMessage({id}, intlValues)
  }

  const $t = intl;

  const fetchBrokerRewardHistory = useCallback((rewardPageNum) => {

    getBrokerRewardHistory(trader,rewardPageNum,10).then((rows)=>{
      if(rewardPageNum === 0){
        brokerTradeRecords.splice(0);
      }

      rows.forEach(row => {
        brokerTradeRecords.push(row);
      });

      setBrokerTradeRecords(brokerTradeRecords);
    }).finally(() => setSping(false));

  },[trader,rewardPageNum]);

  const fetchBrokerTraders = useCallback((tradersPageNum) => {

    getbrokerBindTraders(trader,tradersPageNum,10).then((rows)=>{
      if(tradersPageNum === 0){
        brokerTraders.splice(0);
      }

      rows.forEach(row => {
        brokerTraders.push(row);
      })
      setBrokerTraders(brokerTraders);
    }).finally(() => setSping(false));

  },[trader,tradersPageNum]);

  useEffect(() => {
    fetchBrokerRewardHistory(0)
  }, [trader,tradersPageNum])


  const AcColumns: ColumnsType<BrokerHistoryRecord> = [
    {
      title: $t("Broker.Broker.History.Type"),
      dataIndex: "update_type",
      key: "update_type",
      render:(_,data) => {
        return (
          <div>{$t(getUpdateType(data.update_type))}</div>
        );
      }
    },
    {
      title: $t("Broker.Broker.History.Amount"),
      dataIndex: "amount",
      key: "amount",
      render: (_, data) => {
        return (
          <div>
            <div className={classNames(data.amount > 0? "main-green":"main-red")}>{amountFormt(data.amount,2, true, '--')}</div>
            <div>USDT</div>
          </div>
        );
      },
    },
    {
      title: $t("Broker.Broker.History.Balance"),
      dataIndex: "balance",
      key: "balance",
      render: (_, data) => {
        return (
          <div>
            <div>{amountFormt(data.balance,2, false, '--')}</div>
            <div>USDT</div>
          </div>
        );
      },
    },
    {
      title: $t("Broker.Broker.History.Time"),
      dataIndex: "time",
      key: "time",
      render: (_,data) => {
        return (
          <div>
            <div>{dateFormat(new Date(data.event_time), "yyyy-MM-dd")}</div>
            <div>{dateFormat(new Date(data.event_time), "hh:mm:ss")}</div>
          </div>
        )
      }
    },
  ];
  const TraderColumns: ColumnsType<{ trader:string, update_time:Date}> = [
    {
      title: $t("Broker.Broker.TraderInfo.TraderAddress"),
      dataIndex: "address",
      key: "address",
      render: (_,data) =>{
        return (<div>{data.trader}</div>)
      }
    },
    {
      title: $t("Broker.Broker.TraderInfo.RegistrationDate"),
      dataIndex: "time",
      key: "time",
      render: (_,data) =>{
        return (
          <div>
            <div>{dateFormat(new Date(data.update_time), "yyyy-MM-dd")}</div>
            <div>{dateFormat(new Date(data.update_time), "hh:mm:ss")}</div>
          </div>
        )
      }
    },
  ];


  return (
    <Row className="main-block record-container">
      <Col flex="100%">
        <Tabs defaultActiveKey="reward" onChange={(key) => {
          console.log(key)
          if(key === "reward"){
            fetchBrokerRewardHistory(0);
          }else{
            fetchBrokerTraders(0);
          }
        }}>
            <TabPane tab={$t("Broker.Broker.History.AccountHistory")} key="reward">
              <Spin spinning={sping}>
                <Table
                  columns={AcColumns}
                  dataSource={brokerTradeRecords}
                  rowKey={'tx'}
                  // pagination={{
                  //   position: ["bottomCenter"],
                  //   defaultCurrent: 1,
                  //   total: 200,
                  //   showSizeChanger: false,
                  // }}

                />
              </Spin>
            </TabPane>
            <TabPane tab={$t("Broker.Broker.TraderInfo.TraderInfo")} key="trader">
              <Spin spinning={sping}>
                <Table columns={TraderColumns}  rowKey={'trader'} dataSource={brokerTraders} pagination={false} />
              </Spin>
            </TabPane>

        </Tabs>
      </Col>
    </Row>
  );
}

export default Record;
