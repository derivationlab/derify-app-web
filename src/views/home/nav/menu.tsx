import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import classNames from "classnames";
import { useIntl } from "react-intl";
import { _findIndex } from "@/utils/loash";
import { withRouter, RouteComponentProps } from "react-router-dom";

interface MenuProps extends RouteComponentProps {}
const menu: Array<{ path:string,key:string }> = [
  {path: "trade", key: "Trade.navbar.Trade"},
  {path: "reward", key: "Trade.navbar.Rewards"},
  {path: "broker", key: "Trade.navbar.Broker"},
  {path: "data", key: "Trade.navbar.Data"},
  {path: "faucet", key: "Faucet.Faucet"},
];

const Menu: React.FC<MenuProps> = props => {
  const { location, history } = props;

  const { formatMessage } = useIntl();

  const [index, setIndex] = useState<number>(0);
  const activeRoute = (index: number): void => {
    history.push(`/${menu[index].path}`);
    setIndex(index);
  };

  const initMenu = () => {
    const currentPath: string = location.pathname.split("/")[1];
    const index = _findIndex(menu, o => o.path === currentPath);
    setIndex(index);
  };

  useEffect(() => {
    initMenu();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Row align={"middle"} className="menu">
      {menu.map((item, i: number) => (
        <Col key={i}>
          <span
            onClick={() => activeRoute(i)}
            className={classNames("menu-item", { active: index === i })}
          >
            {formatMessage({ id: item.key })}
          </span>
        </Col>
      ))}
    </Row>
  );
};

export default withRouter(Menu);
