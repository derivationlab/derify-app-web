import React, { useState } from "react";
import IconFont from "@/components/IconFont";
import { Row, Col, Avatar, Space, Pagination } from "antd";
import classNames from "classnames";

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
  selectParners: (val: Partners) => void;
}
const PartnersList: React.FC<PartnersListProps> = ({ selectParners }) => {
  const [index, setIndex] = useState<Partial<number>>();
  return (
    <Row
      className="partners-list-wrapper"
      gutter={[0, 20]}
      justify="space-between"
    >
      {list.map((item, i) => (
        <Col
          flex="30%"
          key={i}
          onClick={() => {
            setIndex(i);
            selectParners(item);
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
                <Avatar size={80} />
              </Col>
              <Col>
                <Row>
                  <Col flex="100%">{item.name}</Col>
                  <Col flex="100%">{item.key}</Col>
                  <Col flex="100%">{item.address}</Col>
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
