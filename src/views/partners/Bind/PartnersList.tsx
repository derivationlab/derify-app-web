import React, {useEffect, useState} from "react";
import IconFont from "@/components/IconFont";
import { Row, Col, Avatar, Space, Pagination } from "antd";
import classNames from "classnames";
import {BrokerInfo, getBrokerList} from "@/api/broker";
import {Pagenation} from "@/api/types";

export type Partners = {
  name: string;
  key: string;
  address: string;
};

interface PartnersListProps {
  onSelectBroker: (val: BrokerInfo) => void;
}
const PartnersList: React.FC<PartnersListProps> = ({ onSelectBroker }) => {
  const [index, setIndex] = useState<Partial<number>>();

  const [pagenation,setPagenation] = useState<Pagenation>(new Pagenation());

  useEffect(() => {
    getBrokerList(pagenation.current,pagenation.pageSize).then((pagenation) => {
      setIndex(undefined);
      setPagenation(pagenation);
    }).catch(e => console.error("getBrokerList error", e));
  },[pagenation.current,pagenation.pageSize])

  return (
    <Row
      className="partners-list-wrapper"
      gutter={[0, 20]}
      justify="space-between"
    >
      {pagenation.records.map((item, i) => (
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
      {
        pagenation.totalPage > 1 ? (<Col flex="100%">
          <Row justify="center">
            <Pagination onChange={(pageNum, pageSize) => {
              pagenation.current = pageNum;
              if(pageSize){
                pagenation.pageSize = pageSize;
              }
              setPagenation(pagenation);
            }} defaultCurrent={pagenation.current} total={pagenation.totalPage} showSizeChanger={false} />
          </Row>
        </Col>) : <></>
      }
    </Row>
  );
};

export default PartnersList;
