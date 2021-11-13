import React, {useEffect, useState} from "react";
import IconFont from "@/components/IconFont";
import {Row, Col, Avatar, Space, Pagination, Spin, Button, Popconfirm, Popover} from "antd";
import classNames from "classnames";
import {BrokerInfo, getBrokerList} from "@/api/broker";
import {Pagenation} from "@/api/types";
import TextOverflowView, {ShowPosEnum} from "@/components/TextOverflowView";
import {FormattedMessage, useIntl} from "react-intl";
import {amountFormt} from "@/utils/utils";
import "./PartnersList.less"

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
  const [loading, setLoading] = useState(true);
  const { formatMessage } = useIntl();
  const [intrMap, setIntrMap] = useState<{[key:string]:boolean}>({})

  function intl<T>(id:string,values:T[] = []) {

    const intlValues:{[key:number]:T} = {}

    values.forEach((item, index) => {
      intlValues[index] = item
    })


    return formatMessage({id}, intlValues)
  }

  const $t = intl;

  useEffect(() => {
    setLoading(true);
    getBrokerList(pagenation.current,pagenation.pageSize).then((pagenation) => {
      setIndex(undefined);
      setPagenation(pagenation);
    }).catch(e => console.error("getBrokerList error", e)).finally(() => setLoading(false));
  },[pagenation.current,pagenation.pageSize])

  return (
    <Spin spinning={loading}>
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
              <Row align={"middle"} gutter={[10,0]} style={{flex: "1",width:"0",overflow:"hidden"}}>
                <Col>
                  <Avatar size={80} src={item.logo}/>
                </Col>
                <Col  style={{flex:"1",overflow:"hidden",textOverflow:"ellipsis"}}>
                  <Row style={{overflow:"hidden",textOverflow:"ellipsis"}}>
                    <Col flex="100%">{item.name}</Col>
                    <Col flex="100%">@{item.id}</Col>
                    <Col flex="100%" style={{overflow:"hidden",textOverflow:"ellipsis"}}>
                      <div className={"intr-desc"}>
                      <TextOverflowView showPos={ShowPosEnum.right} text={item.introduction} len={!!intrMap[item.broker] ? item.introduction.length : 25}/>
                      <Popover
                        placement="bottom"
                        content={
                          <Row>
                            <Col className="title" flex="100%">
                              {item.name}-{$t("Broker.Broker.InfoEdit.Introduction")}
                            </Col>
                            <Col>
                              {item.introduction}
                            </Col>
                          </Row>
                        }
                        trigger="hover"
                      >
                        <Button style={{display:!item.introduction?"none":""}} type={"link"}>{$t("Broker.Broker.InfoEdit.Introduction")}</Button>
                      </Popover>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Row>
          </Col>
        ))}
        {
          pagenation.totalItems > 1 ? (<Col flex="100%">
            <Row justify="center">
              <Pagination onChange={(pageNum, pageSize) => {
                pagenation.current = pageNum;
                if(pageSize){
                  pagenation.pageSize = pageSize;
                }
                setPagenation(pagenation);
              }} defaultCurrent={pagenation.current} pageSize={pagenation.pageSize} total={pagenation.totalItems} showSizeChanger={false} />
            </Row>
          </Col>) : <></>
        }
      </Row>
    </Spin>
  );
};

export default PartnersList;
