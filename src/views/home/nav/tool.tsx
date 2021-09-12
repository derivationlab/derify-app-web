import React, { useCallback, useEffect, useState } from "react";
import { Button, Row, Col, Select, Modal, Popover, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@/store/index";
import { changeLang } from "@/store/modules/app/actions";
import { FormattedMessage } from "react-intl";
import IconFont from "@/components/IconFont";
import Web3Class from "@/utils/web3Instance";
import Account from "./Account";

import Eth from "@/assets/images/Eth.png";
import HECO from "@/assets/images/huobi-token-ht-logo.png";
import Binance from "@/assets/images/binance-coin-bnb-logo.png";
import Solana from "@/assets/images/Solana.png";
import Wallet from "@/assets/images/Metamask.png";
import EnIcon from "@/assets/images/en.png";
import ZhIcon from "@/assets/images/zh.png";
import classNames from "classnames";
import * as web3Utils from '@/utils/web3Utils'

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

  const [network, setNetwork] = useState<Partial<number>>();
  const [wallet, setWallet] = useState<Partial<string>>();
  const [account, setAccount] = useState<Partial<string>>();
  const [blance, setBlance] = useState<Partial<string>>();
  const dispatch = useDispatch();
  const handelChangeIntl = useCallback((val: string) => {
    dispatch(changeLang(val));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (wallet && network !== undefined) {
      Web3Class.getInstance().then(async res => {
        const account = await res.eth.getAccounts();
        const blance = await res.eth.getBalance(account[0]);
        setBlance(blance);
        setAccount(account[0]);
      });
      setIsModalVisible(false);
    }
  }, [wallet, network]);

  return (
    <Row align={"middle"} className="tool">
      <Col style={{ marginRight: "10px" }}>
        {account ? (
          <Popover
            content={<Account {...{ account, blance }} />}
            trigger="hover"
          >
            <Button
              className="account-wrapper"
              shape="round"
              icon={<IconFont size={14} type="icon-link" />}
              type="primary"
            >
              {account}
            </Button>
          </Popover>
        ) : (
          <Button
            type="primary"
            onClick={() => {
              setIsModalVisible(true);
            }}
            shape="round"
            icon={
              <IconFont
                size={14}
                type="icon-link"
                style={{ marginRight: "10px" }}
              />
            }
          >
            <FormattedMessage id="Trade.navbar.ConnectWallet" />
          </Button>
        )}
      </Col>

      <Col>
        <Select value={locale} onChange={handelChangeIntl}>
          <Option value="en">
            <Space>
              <img src={EnIcon} alt="" /><span>English</span>
            </Space>
          </Option>
          <Option value="zh-CN">
            <Space>
              <img src={ZhIcon} alt="" />
              <span>繁体中文</span>
            </Space>
          </Option>
          <Option value="zh-CN">
            <Space>
              <img src={ZhIcon} alt="" />
              <span>简体中文</span>
            </Space>
          </Option>
        </Select>
        <span></span>
      </Col>
      <Modal
        title={<FormattedMessage id="Trade.navbar.ConnectWallet" />}
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
            <FormattedMessage id="Trade.Wallet.ChooseNetwork" />
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
                  <IconFont size={18} type="icon-Group-" />
                  <img src={item.url} alt="" />
                  <div>{item.name}</div>
                </Col>
              ))}
            </Row>
          </Col>
          <Col style={{ margin: "40px 0 10px" }}>
            <FormattedMessage id="Trade.Wallet.ChooseWallet" />
          </Col>
          <Col flex="100%">
            <Row className="wallet-list">
              <Col
                className={classNames({ active: wallet === "metamask" })}
                onClick={() => {
                  setWallet("metamask");
                }}
              >
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
