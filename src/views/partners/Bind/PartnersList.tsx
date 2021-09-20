import React, {useEffect, useState} from "react";
import IconFont from "@/components/IconFont";
import { Row, Col, Avatar, Space, Pagination } from "antd";
import classNames from "classnames";
import {BrokerInfo, getBrokerList} from "@/api/broker";

export type Partners = {
  name: string;
  key: string;
  address: string;
};
const list: Partners[] = [
  {
    name: "Coinbaby's Playground",
    key: "@coinbaby",
    address: "0x8503ea9bB20b74a0c8287ed225cE82...",
  },
  {
    name: "Coinbaby's Playground",
    key: "@coinbaby",
    address: "0x8503ea9bB20b74a0c8287ed225cE82...",
  },
  {
    name: "Coinbaby's Playground",
    key: "@coinbaby",
    address: "0x8503ea9bB20b74a0c8287ed225cE82...",
  },
  {
    name: "Coinbaby's Playground",
    key: "@coinbaby",
    address: "0x8503ea9bB20b74a0c8287ed225cE82...",
  },
  {
    name: "Coinbaby's Playground",
    key: "@coinbaby",
    address: "0x8503ea9bB20b74a0c8287ed225cE82...",
  },
  {
    name: "Coinbaby's Playground",
    key: "@coinbaby",
    address: "0x8503ea9bB20b74a0c8287ed225cE82...",
  },
];
interface PartnersListProps {
  onSelectBroker: (val: BrokerInfo) => void;
}
const PartnersList: React.FC<PartnersListProps> = ({ onSelectBroker }) => {
  const [index, setIndex] = useState<Partial<number>>();

  const [brokers,setBrokers] = useState<BrokerInfo[]>([]);
  const [pageNum,setPageNum] = useState<number>(0);

  const pageSize = 10;
  useEffect(() => {
    getBrokerList(pageNum,pageSize).then((rows) => {
      if(pageNum === 0){
        brokers.splice(0);
        setIndex(undefined);
      }

      setBrokers(brokers.concat(rows));
    }).catch(e => console.error("getBrokerList error", e));
  },[pageNum])

  console.log('init', brokers)
  return (
    <Row
      className="partners-list-wrapper"
      gutter={[0, 20]}
      justify="space-between"
    >
      {brokers.map((item, i) => (
        <Col
          flex="30%"
          key={i}
          onClick={() => {
            setIndex(i);
            onSelectBroker(item);
          }}
        >
          <Row
            wrap={false}
            className={classNames(["item", i === index && "active"])}
          >
            <div className="icon">
              <IconFont type="icon-Group-" size={16} />
            </div>
            <Space>
              <Col>
                <Avatar size={80} src={item.logo}/>
              </Col>
              <Col>
                <Row>
                  <Col flex="100%">{item.name}</Col>
                  <Col flex="100%">{item.id}</Col>
                  <Col flex="100%">{item.broker}</Col>
                </Row>
              </Col>
            </Space>
          </Row>
        </Col>
      ))}
      <Col flex="100%">
        <Row justify="center">
          <Pagination defaultCurrent={6} total={500} showSizeChanger={false} />
        </Row>
      </Col>
    </Row>
  );
};

export default PartnersList;
