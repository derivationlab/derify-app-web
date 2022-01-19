import React, {useEffect, useState} from "react";
import { Row, Col, Space } from "antd";
import { useIntl } from "react-intl";
import {useDispatch} from "react-redux";
import {DataModel} from "@/store";
import {fck} from "@/utils/utils";

function Info() {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const [tokenData, setTokenData] = useState<{edrfPrice: number, drfPrice: number, drfBuyBack: number, bdrfPrice: number, drfBurnt: number}>({
    drfPrice: 0,
    drfBurnt: 0,
    drfBuyBack: 0,
    bdrfPrice:0,
    edrfPrice: 0
  });

  const listArr: Array<{
    pre?: string;
    aft?: string;
    key: string;
    val: number|string;
    type: string;
  }> = [
    { pre: "DRF", key: "Data.Data.Token.Price", val: fck(tokenData.drfPrice,0,2), type: "USDT" },
    {
      pre: "DRF",
      key: "Data.Data.Token.TotalDestroyedVolume",
      val: fck(tokenData.drfBurnt,0,2),
      type: "DRF",
    },
    {
      pre: "",
      aft: "(USDT)",
      key: "Data.Data.Token.BuyBackFundBalance",
      val: fck(tokenData.drfBuyBack,0,2),
      type: "USDT",
    },
    { pre: "eDRF", key: "Data.Data.Token.Price", val: tokenData.edrfPrice, type: "USDT" },
    { pre: "bDRF", key: "Data.Data.Token.Price", val: tokenData.bdrfPrice, type: "USDT" },
    // { key: "", val: "", type: "" },
  ];

  useEffect(() => {
    const loadTokenInfoDataAction = DataModel.actions.loadTokenInfoData();
    loadTokenInfoDataAction(dispatch).then((data) => {
      setTokenData(data.current);
    }).catch(e => {
      console.log("loadTokenInfoDataAction", e)
    })
  }, [])


  return (
    <Row className="main-block info-container" gutter={[0, 33]}>
      <Col flex="100%">
        <Row justify="space-between" align="middle">
          <Col className="title">{formatMessage({ id: "Data.Data.Token.TokenInfo" })}</Col>
        </Row>
      </Col>
      {listArr.map((item,i) => (
        <Col flex="100%" key={i}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space size={10}>
                {item.pre}
                {formatMessage({ id: item.key })}
                {item.aft}
              </Space>
            </Col>
            <Col>
              <span className="yellow-text">{item.val}</span> {item.type}
            </Col>
          </Row>
        </Col>
      ))}
      <Col flex="100%">
        <Row justify="space-between" align="middle">
          <Col>&nbsp;</Col>
          <Col>&nbsp;</Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Info;
