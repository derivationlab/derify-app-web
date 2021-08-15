import React from "react";
import { Row, Col, Tabs, Table } from "antd";
import { ColumnsType } from "antd/es/table";
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
const AcColumns: ColumnsType<AcType> = [
  {
    title: "类型",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "金额",
    dataIndex: "amount",
    key: "amount",
    render: (_, record) => {
      return (
        <>
          <div>{record.amount}</div>
          <div>{record.amountType}</div>
        </>
      );
    },
  },
  {
    title: "余额",
    dataIndex: "balance",
    key: "balance",
    render: (_, record) => {
      return (
        <>
          <div>{record.balance}</div>
          <div>{record.balanceType}</div>
        </>
      );
    },
  },
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
  },
];
const TraderColumns: ColumnsType<Trader> = [
  {
    title: "交易者地址",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
  },
];
const TraderData: Trader[] = [
  {
    address: "0x40d276e6a7C80562BB1848e3ACB7B7629234C5a6",
    time: "2021-12-3123:59:51",
  },
  {
    address: "0x40d276e6a7C80562BB1848e3ACB7B7629234C5a6",
    time: "2021-12-3123:59:52",
  },
  {
    address: "0x40d276e6a7C80562BB1848e3ACB7B7629234C5a6",
    time: "2021-12-3123:59:53",
  },
];
const ACdata: AcType[] = [
  {
    type: "提现",
    balance: "+ 12345.67",
    amount: "7890.12",
    time: "2021-12-3123:59:59",
    balanceType: "USTD",
    amountType: "USTD",
  },
  {
    type: "提现",
    balance: "+ 12345.67",
    amount: "7890.12",
    time: "2021-12-3123:59:60",
    balanceType: "USTD",
    amountType: "USTD",
  },
];

function Record() {
  return (
    <Row className="main-block record-container">
      <Col flex="100%">
        <Tabs defaultActiveKey="1">
          <TabPane tab={"账户流水"} key="1">
            <Table<AcType>
              columns={AcColumns}
              dataSource={ACdata}
              rowKey={'time'}
              pagination={{
                position: ["bottomCenter"],
                defaultCurrent: 1,
                total: 200,
                showSizeChanger: false,
              }}
             
            />
          </TabPane>
          <TabPane tab={"交易者信息"} key="2">
            <Table columns={TraderColumns}  rowKey={'time'} dataSource={TraderData} pagination={false} />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
}

export default Record;
