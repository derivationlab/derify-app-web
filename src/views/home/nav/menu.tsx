import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import classNames from "classnames";
import { useIntl } from "react-intl";
import { _findIndex } from "@/utils/loash";
import { withRouter, RouteComponentProps } from "react-router-dom";
import {useSelector} from "react-redux";
import {RootStore} from "@/store";

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
  let {hasBroker} = useSelector((state:RootStore) => state.user);

  const { formatMessage } = useIntl();

  const [index, setIndex] = useState<number>(0);
  const activeRoute = (index: number): void => {

    if(hasBroker){
      history.push(`/${menu[index].path}`);
      setIndex(index);
    }
  };

  const initMenu = () => {
    const [currentPath,bindBrokerId] = location.pathname.split("/");
    const isBindBroker = currentPath === "broker" && bindBrokerId;
    const index = isBindBroker ? menu.findIndex((o) => o.path === 'trade') : _findIndex(menu, o => currentPath.startsWith(o.path));
    setIndex(Math.max(index, 0));
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
