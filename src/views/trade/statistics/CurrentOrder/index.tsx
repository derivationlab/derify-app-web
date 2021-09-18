import React, {useCallback, useEffect, useState} from "react";
import IconFont from "@/components/IconFont";
import { ColumnsType } from "antd/es/table";

import { Row, Col, Table, Button,  Popover, Space } from "antd";
import { useIntl } from "react-intl";
import contractModel, {OrderPositionData} from "@/store/modules/contract";
import {PositionView} from "@/utils/contractUtil";
import {useDispatch, useSelector} from "react-redux";
import {RootStore} from "@/store";

const dataSource = [
  {
    key: "1",
    type: "ETH/USDT",
  },
  {
    key: "2",
    type: "ETH/USDT",
  },
];
function CurrentOrder() {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  function intl(id:string) {
    return formatMessage({id})
  }

  const $t = intl

  const [dataSource, setDataSource] = useState<OrderPositionData[]>([]);

  const walletInfo = useSelector((state:RootStore) => state.user);

  const tokenPairs = useSelector((state:RootStore) => state.contract.pairs);


  const getPairByAddress = (token:string) => {
    const pair = tokenPairs.find((pair) => pair.address === token)
    if(!pair){
      return {name: 'unknown', key: 'unknown'}
    }

    return pair
  }

  const loadMyPositionData = useCallback(() => {

    const trader = walletInfo.selectedAddress
    if(!trader) {
      return
    }

    const loadPositionDataAction = contractModel.actions.loadPositionData(trader)

    loadPositionDataAction(dispatch).then((rows) => {

      if(!rows || rows.length < 1) {
        return
      }

      const positions:OrderPositionData[] = [];
      rows.forEach(position => {

        position.positionData?.orderPositions.forEach((positionView:OrderPositionData) => {
          positionView.tx = "tx" + positions.length
          positions.push(positionView)
        })
      })

      setDataSource(positions)

    }).catch(e => {
      console.error(`loadPositionDataAction exception: ${e}`)
    })

  }, [walletInfo])

  useEffect(() => {
    loadMyPositionData()
  }, [loadMyPositionData])

  const columns: ColumnsType<any> = [
    {
      title: $t("Trade.CurrentOrder.List.Volume"),
      dataIndex: "type",
      key: "type",
    },
    {
      title: $t("Trade.CurrentOrder.List.Type"),
      dataIndex: "age",
      key: "age",
      width: 120,
    },
    {
      title: (
        <Popover
          placement="bottom"
          content={
            <Row>
              <Col className="title" flex="100%">
                {formatMessage({ id: "Trade.CurrentOrder.Hint.OrderPrice" })}
              </Col>
              <Col>
                {" "}
                {formatMessage({ id: "Trade.CurrentOrder.Hint.OrderPriceDetail" })}
              </Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "Trade.CurrentOrder.List.Price" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "price",
      key: "price",
    },
    {
      title: (
        <Popover
          placement="bottom"
          content={
            <Row>
              <Col className="title" flex="100%">
                {formatMessage({ id: "Trade.CurrentOrder.Hint.OrderVolume" })}
              </Col>
              <Col>
                {formatMessage({ id: "Trade.CurrentOrder.Hint.OrderVolumeDetail" })}
              </Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "Trade.CurrentOrder.List.Volume" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "size",
      key: "size",
    },
    {
      title: (
        <Popover
          placement="bottom"
          content={
            <Row>
              <Col className="title" flex="100%">
                {formatMessage({ id: "Trade.CurrentOrder.Hint.OrderTime" })}：
              </Col>
              <Col> {formatMessage({ id: "Trade.CurrentOrder.Hint.OrderTimeDetail" })}</Col>
            </Row>
          }
          trigger="hover"
        >
          <Space>
            {formatMessage({ id: "Trade.CurrentOrder.List.Time" })}
            <IconFont type="icon-wenhao" />
          </Space>
        </Popover>
      ),
      dataIndex: "time",
      key: "time",
    },
    {
      dataIndex: "operate",
      key: "operate",
      width: 100,
      render: () => <Button type="link">{$t("Trade.CurrentOrder.List.Cancel")}</Button>,
    },
  ];

  return (
    <Row>
      <Col flex="100%">
        <Table dataSource={dataSource} columns={columns} pagination={false}  rowKey="tx" />
      </Col>
    </Row>
  );
}

export default CurrentOrder;
