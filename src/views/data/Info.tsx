import React, { useEffect, useState } from "react";
import { Row, Col, Space } from "antd";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { DataModel } from "@/store";
import { fck } from "@/utils/utils";
import { getUSDTokenName } from "@/config";

function Info() {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [tokenData, setTokenData] = useState<{
    edrfPrice: number;
    drfPrice: number;
    drfBuyBack: number;
    bdrfPrice: number;
    drfBurnt: number;
  }>({
    drfPrice: 0,
    drfBurnt: 0,
    drfBuyBack: 0,
    bdrfPrice: 0,
    edrfPrice: 0,
  });

  const listArr: Array<{
    pre?: string;
    aft?: string;
    key: string;
    val: number | string;
    type: string;
  }> = [
    {
      pre: "DRF",
      key: "Data.Data.Token.Price",
      val: fck(tokenData.drfPrice, 0, 2),
      type: getUSDTokenName(),
    },
    {
      pre: "DRF",
      key: "Data.Data.Token.TotalDestroyedVolume",
      val: fck(tokenData.drfBurnt, 0, 2),
      type: "DRF",
    },
    {
      pre: "",
      aft: `(${getUSDTokenName()})`,
      key: "Data.Data.Token.BuyBackFundBalance",
      val: fck(tokenData.drfBuyBack, 0, 2),
      type: getUSDTokenName(),
    },
    {
      pre: "eDRF",
      key: "Data.Data.Token.Price",
      val: tokenData.edrfPrice,
      type: getUSDTokenName(),
    },
    {
      pre: "bDRF",
      key: "Data.Data.Token.Price",
      val: tokenData.bdrfPrice,
      type: getUSDTokenName(),
    },
  ];

  useEffect(() => {
    const loadTokenInfoDataAction = DataModel.actions.loadTokenInfoData();
    loadTokenInfoDataAction(dispatch)
      .then(data => {
        setTokenData(data.current);
      })
      .catch(e => {
        console.log("loadTokenInfoDataAction", e);
      });
  }, []);

  return (
    <Row className="main-block info-container">
      {listArr.map((item, i) => {
        let { val } = item;
        let arr = (val + "").split(".");
        return (
          <Col key={i}>
            <Col className="line1">
              <Space size={10}>
                {item.pre}
                {formatMessage({ id: item.key })}
                {item.aft}
              </Space>
            </Col>
            <Col className="line2">
              <span className="yellow-text num">
                {arr[0]}
                {arr[1] !== undefined && <span>.{arr[1]}</span>}
              </span>
              <span className="unit">{item.type}</span>
            </Col>
          </Col>
        );
      })}
    </Row>
  );
}

export default Info;
