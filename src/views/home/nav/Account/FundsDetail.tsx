import React from "react";
import { Modal, Row, Col, Table } from "antd";
import { ModalProps } from "antd/es/modal";

interface FundDetailsProps extends ModalProps {}

const dataSource: any[] = [];

const columns = [
  {
    title: "操作类型",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "金额",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "余额",
    dataIndex: "balance",
    key: "balance",
  },
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
  },
];
const FundDetails: React.FC<FundDetailsProps> = props => {
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
