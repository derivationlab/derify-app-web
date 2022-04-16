import React, {useEffect, useState} from "react";
import IconFont from "@/components/IconFont";
import {Row, Col, Avatar, Pagination, Spin, Popover} from "antd";
import classNames from "classnames";
import {BrokerInfo, getBrokerList} from "@/api/broker";
import {Pagenation} from "@/api/types";
import TextOverflowView, {ShowPosEnum} from "@/components/TextOverflowView";
import {FormattedMessage, useIntl} from "react-intl";
import {amountFormt, countLength, cutLength} from "@/utils/utils";
import Broker from "@/components/broker";
import Button from "@/components/buttons/borderButton";
import "./PartnersList.less"
import data from './data.json'

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
    setPagenation(data.data as any);
    setLoading(false)
  }, [])

  // useEffect(() => {
  //   setLoading(true);
  //   getBrokerList(pagenation.current, pagenation.pageSize).then((pagenation) => {
  //     setIndex(undefined);
  //     setPagenation(pagenation);
  //   }).catch(e => console.error("getBrokerList error", e)).finally(() => setLoading(false));
  // },[pagenation.current, pagenation.pageSize]);

  return (
    <Spin spinning={loading}>
      <div className="partners-list-wrapper">
        {pagenation.records.map((item, i) => (
          <div className='broker-detail'>
            <Broker data={item} key={i} className="list-broker" />
            <div className="detail">{item.introduction}</div>
            <div className="operate">
                <Button className='add-btn' click={() => {
                    console.log(1111)
                }} text='Set as my broker' />
            </div>
          </div>
        ))}
        {
          pagenation.totalItems > 1 ? (<Col flex="100%">
            <Row justify="center">
              <Pagination onChange={(pageNum, pageSize) => {
                pagenation.current = pageNum;
                if(pageSize){
                  pagenation.pageSize = pageSize;
                }
                setPagenation(Object.assign({}, pagenation,{current: pageNum, pageSize}));
              }} defaultCurrent={pagenation.current} pageSize={pagenation.pageSize} total={pagenation.totalItems} showSizeChanger={false} />
            </Row>
          </Col>) : <></>
        }
      </div>
    </Spin>
  );
};

export default PartnersList;
