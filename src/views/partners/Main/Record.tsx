import React, {useCallback, useEffect, useState} from "react";
import {Row, Col, Tabs, Table, Spin, Pagination} from "antd";
import { ColumnsType } from "antd/es/table";
import {useIntl} from "react-intl";
import {BrokerHistoryRecord, getbrokerBindTraders, getBrokerRewardHistory} from "@/api/broker";
import {amountFormt, dateFormat} from "@/utils/utils";
import classNames from "classnames";
import {useSelector} from "react-redux";
import {RootStore} from "@/store";
import {Pagenation} from "@/api/types";
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
  const trader = useSelector<RootStore,string>(state => state.user.trader)

  const [sping, setSping] = useState<boolean>(true);
  const [traderPagenation,setTraderPagenation] = useState<Pagenation>(new Pagenation());
  const [rewardPagenation,setRewardPagenation] = useState<Pagenation>(new Pagenation());


  function intl<T>(id:string,values:T[] = []) {

    const intlValues:{[key:number]:T} = {}

    values.forEach((item, index) => {
      intlValues[index] = item
    })


    return formatMessage({id}, intlValues)
  }

  const $t = intl;

  const fetchBrokerRewardHistory = useCallback(() => {

    if(!trader){
      setSping(false)
      return;
    }

    setSping(true);
    getBrokerRewardHistory(trader,rewardPagenation.current,10).then((pagenation)=>{
      setRewardPagenation(pagenation);
    }).finally(() => setSping(false));

  },[trader,rewardPagenation.current,rewardPagenation.pageSize]);

  const fetchBrokerTraders = useCallback(() => {
    if(!trader){
      setSping(false)
      return;
    }

    setSping(true);
    getbrokerBindTraders(trader,traderPagenation.current,traderPagenation.pageSize).then((pagenation)=>{
      setTraderPagenation(pagenation);
    }).finally(() => setSping(false));

  },[trader,traderPagenation.current,traderPagenation.pageSize]);

  const onTraderPageChange = useCallback((pageNum, pageSize) => {
    traderPagenation.current = pageNum;
    if(pageSize){
      traderPagenation.pageSize = pageSize;
    }
    setTraderPagenation(traderPagenation);
  },[]);

  const onRewardPageChange = useCallback((pageNum, pageSize) => {
    rewardPagenation.current = pageNum;
    if(pageSize){
      rewardPagenation.pageSize = pageSize;
    }
    setRewardPagenation(rewardPagenation);
  },[]);


  useEffect(() => {
    fetchBrokerRewardHistory()
  }, [trader,rewardPagenation.current,rewardPagenation.pageSize])

  useEffect(() => {
    fetchBrokerTraders()
  }, [trader,traderPagenation.current,traderPagenation.pageSize])

  const AcColumns: ColumnsType<BrokerHistoryRecord> = [
    {
      title: $t("Broker.Broker.History.Type"),
      dataIndex: "update_type",
      key: "update_type",
      render:(_,data) => {
        return (
          <div>
            <div className={"main-white"}>{data.trader}</div>
            <div>{$t(getUpdateType(data.update_type))}</div>
          </div>
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
            <div>{dateFormat(new Date(data.update_time), "yyyy-MM-dd hh:mm:ss")}</div>
          </div>
        )
      }
    },
  ];


  return (
    <Row className="main-block record-container">
      <Col flex="100%">
        <Tabs defaultActiveKey="reward" onChange={(key) => {
          if(key === "reward"){
            setRewardPagenation(rewardPagenation);
          }else{
            setTraderPagenation(traderPagenation);
          }
        }}>
            <TabPane tab={$t("Broker.Broker.History.AccountHistory")} key="reward">
              <Spin spinning={sping}>
                <Table
                  columns={AcColumns}
                  dataSource={rewardPagenation.records}
                  rowKey={'tx'}
                  pagination={false}
                />
                <Col flex="100%">
                  <Row justify="center">
                    {
                      rewardPagenation.totalItems > 1 ? (<Pagination pageSize={rewardPagenation.pageSize} onChange={onRewardPageChange} defaultCurrent={rewardPagenation.current} total={rewardPagenation.totalItems} showSizeChanger={false} />) : <></>
                    }
                  </Row>
                </Col>
              </Spin>
            </TabPane>
            <TabPane tab={$t("Broker.Broker.TraderInfo.TraderInfo")} key="trader">
              <Spin spinning={sping}>
                <Table columns={TraderColumns}  rowKey={'trader'} dataSource={traderPagenation.records} pagination={false} />
                {
                  traderPagenation.totalItems > 1 ? (<Col flex="100%">
                    <Row justify="center">
                      <Pagination onChange={onTraderPageChange} pageSize={traderPagenation.pageSize} defaultCurrent={traderPagenation.current} total={traderPagenation.totalItems} showSizeChanger={false} />
                    </Row>
                  </Col>) : <></>
                }
              </Spin>
            </TabPane>

        </Tabs>
      </Col>
    </Row>
  );
}

export default Record;
