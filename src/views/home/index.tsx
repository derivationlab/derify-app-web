import React from 'react';
import { RouteProps } from '@/router/types'
import { Switch, Route, Redirect } from "react-router-dom";

import Nav from './nav'
import IntlPro from '@/locales/index'

import './index.less'


interface HomeProps extends RouteProps {

}


const Home: React.FC<HomeProps> = (props) => {
  
  const { routes } = props;
  
  return (
    <>
      <IntlPro >
        <Nav ></Nav>
        <div className="main">
          <Switch>
            {routes.map((route, i) => (
              <Route
                path={route.path}
                exact={route.exact}
                key={i}
                render={props => (
                  <route.component {...props} routes={route.routes} />
                )}
              />
            ))}
            <Redirect from="/home" to="/home/trade" />
          </Switch>
        </div>
      </IntlPro>
    </>

  );
}

export default Home;
