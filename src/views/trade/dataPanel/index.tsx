import React, { useState } from "react";
import IconFont from "@/components/IconFont";
import { Row, Col, Radio, Space, Modal, Statistic } from "antd";
import { RightOutlined } from "@ant-design/icons";

import Chart from "./chart";
import { FormattedMessage } from "react-intl";
import classNames from "classnames";

const timeOptions: Array<{ label: string; value: string }> = [
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
  { label: "15m", value: "15m" },
  { label: "1h", value: "1h" },
  { label: "4h", value: "4h" },
  { label: "D", value: "D" },
];

function DataPanel() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <Row className="main-block data-panel-container">
      <Col
        flex="100%"
        className="derify-pointer"
        onClick={() => {
          setIsModalVisible(true);
        }}
      >
        <span>ETH/USDT</span>
        <RightOutlined />
      </Col>
      <Col flex="100%">
        <Row justify={"space-between"} align="bottom">
          <Col>
            <Row className="trade-data">
              <Col>1234.56</Col>
              <Col>
                <span>+9999.8%</span>
              </Col>
            </Row>
          </Col>
          <Col className="text-right">
            <Row>
              <Col flex="100%">
                <Space size={4}>
                  <FormattedMessage id="trade.pcf.rate" />
                  <span>: -0.1234%</span>
                  <IconFont type="icon-wenhao" />
                </Space>
              </Col>
              <Col flex="100%">
                <Space size={4}>
                  持仓挖矿奖励
                  <span>
                    <span className="main-red">多</span> 0.01%/{" "}
                    <span className="main-green">空</span> 0.01%
                  </span>
                  <IconFont type="icon-wenhao" />
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col flex="100%">
        <Radio.Group
          className="time-radio"
          options={timeOptions}
          optionType="button"
        />
      </Col>
      <Col flex="100%">
        <Chart />
      </Col>
      <Modal
        title={"连接钱包"}
        footer={null}
        getContainer={false}
        focusTriggerAfterClose={false}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <Row className="currency-list-wrapper">
          <Col flex="100%" className="active">
            <Row justify="space-between" align="middle">
              <Col className="currency">ETH / USDT</Col>
              <Col>
                <div>2345.67</div>
                <div>
                  <Statistic
                    className={classNames(
                      -123.41 > 0 ? "main-green" : "main-red "
                    )}
                    value={Math.abs(-123.41)}
                    prefix={-123.41 > 0 ? "+" : "-"}
                    suffix="%"
                  />
                </div>
              </Col>
            </Row>
          </Col>
          <Col flex="100%">
            <Row justify="space-between" align="middle">
              <Col>ETH / USDT</Col>
              <Col>
                <div>2345.67</div>
                <Statistic
                  className={classNames(
                    +123.41 > 0 ? "main-green" : "main-red "
                  )}
                  value={+123.41}
                  prefix={+123.41 > 0 ? "+" : "-"}
                  suffix="%"
                />
              </Col>
            </Row>
          </Col>
          <Col flex="100%">
            <Row justify="space-between" align="middle">
              <Col>ETH / USDT</Col>
              <Col>
                <div>2345.67</div>
                <Statistic
                  className={classNames(
                    +123.41 > 0 ? "main-green" : "main-red "
                  )}
                  value={+123.41}
                  prefix={+123.41 > 0 ? "+" : "-"}
                  suffix="%"
                />
              </Col>
            </Row>
          </Col>
          <Col flex="100%">
            <Row justify="space-between" align="middle">
              <Col>ETH / USDT</Col>
              <Col>
                <div>2345.67</div>
                <Statistic
                  className={classNames(
                    +123.41 > 0 ? "main-green" : "main-red "
                  )}
                  value={+123.41}
                  prefix={+123.41 > 0 ? "+" : "-"}
                  suffix="%"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    </Row>
  );
}

export default DataPanel;
