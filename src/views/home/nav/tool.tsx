import React, { useCallback, useState } from "react";
import { Button, Row, Col, Select, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@/store/index";
import { changeLang } from "@/store/modules/app/actions";
import { FormattedMessage } from "react-intl";
import IconFont from "@/components/IconFont";

import Eth from "@/assets/images/Eth.png";
import HECO from "@/assets/images/huobi-token-ht-logo.png";
import Binance from "@/assets/images/binance-coin-bnb-logo.png";
import Solana from "@/assets/images/Solana.png";
import Wallet from "@/assets/images/Metamask.png";
import classNames from "classnames";

const { Option } = Select;

const networkList: { url: string; name: string }[] = [
  { url: Eth, name: "Ethereum (xDai)" },
  { url: HECO, name: "HECO" },
  { url: Binance, name: "Binance" },
  { url: Solana, name: "Solana" },
];
function Tool() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const locale: string = useSelector((state: RootStore) => state.app.locale);

  const [network, setNetwork] = useState(0);

  const dispatch = useDispatch();
  const handelChangeIntl = useCallback((val: string) => {
    dispatch(changeLang(val));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Row align={"middle"} className="tool">
      <Col>
        <Button
          type="primary"
          onClick={() => {
            setIsModalVisible(true);
          }}
          shape="round"
          icon={<IconFont size={18} type="icon-link" style={{marginRight: '10px'}}/>}
        >
          <FormattedMessage id="app.connect.wallet" />
        </Button>
      </Col>
      <Col>
        <span className="tool-item">H</span>
      </Col>
      <Col>
        <Select value={locale} onChange={handelChangeIntl}>
          <Option value="en">EN</Option>
          <Option value="zh-CN">zh-CN</Option>
        </Select>
        <span></span>
      </Col>
      <Modal
        title={<FormattedMessage id="app.connect.wallet" />}
        footer={null}
        getContainer={false}
        focusTriggerAfterClose={false}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <Row>
          <Col style={{ marginBottom: "10px" }}>
            <FormattedMessage id="app.choose.network" />
          </Col>
          <Col flex="100%">
            <Row className="network-list" justify="space-between">
              {networkList.map((item, i) => (
                <Col
                  className={classNames({ active: i === network })}
                  onClick={() => {
                    setNetwork(i);
                  }}
                  key={i}
                >
                  {i === network && <IconFont size={18} type="icon-Group-" />}
                  <img src={item.url} alt="" />
                  <div>{item.name}</div>
                </Col>
              ))}
            </Row>
          </Col>
          <Col style={{ margin: "40px 0 10px" }}>
            <FormattedMessage id="app.choose.wallet" />
          </Col>
          <Col flex="100%">
            <Row className="wallet-list">
              <Col className="active">
                <IconFont size={18} type="icon-Group-" />
                <img src={Wallet} alt="" />
                <div>Metamask</div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    </Row>
  );
}

export default Tool;
