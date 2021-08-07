import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import classNames from "classnames";
import { useIntl } from 'react-intl';
import { _findIndex } from '@/utils/loash';
import { withRouter, RouteComponentProps } from "react-router-dom"

interface MenuProps extends RouteComponentProps { }
const menu: Array<string> = ['app.trade', 'app.data', 'app.rewards', 'app.partners'];

const Menu: React.FC<MenuProps> = (props) => {
  const { history, location } = props
  const { formatMessage } = useIntl();

  const [index, setIndex] = useState<number>(0);
  const activeRoute = (index: number): void => {
    history.push(menu[index].split('.')[1])
    setIndex(index);
  }

  const initMenu = () => {
    const currentPath:string = location.pathname.split('/')[2]
    const index = _findIndex(menu, (o) => o.indexOf(currentPath) !== -1)
    setIndex(index)
  }

  useEffect(() => {
    initMenu()
  }, [location.pathname]);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Row align={'middle'} className="menu">
      {
        menu.map((item: string, i: number) => <Col key={i}>
          <span onClick={() => activeRoute(i)} className={classNames(
            "menu-item",
            { "active": index === i },
          )} >{formatMessage({ 'id': item })}</span>
        </Col>)
      }
    </Row>
  );
}

export default withRouter(Menu);
