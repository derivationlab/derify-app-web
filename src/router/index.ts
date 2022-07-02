import Layout from "@/views/layout";
import Home from "@/views/home";
import ErrorPage from "@/views/error";

import Trade from "@/views/trade";
import Data from "@/views/data";
import Earn from "@/views/earn";
import Partners from "@/views/partners";
import BindPartners from "@/views/partners/Bind";
import MainPartners from "@/views/partners/Main";
import BrokerList from "@/views/partners/brokerList/index";
import Faucet from "@/views/faucet";
import Broker from '@/views/Broker';

const routes: Array<any> = [
  {
    path: "/",
    component: Layout,
    routes: [
      {
        path: "/",
        exact: false,
        component: Home,
        routes: [

          {
            path: "/trade",
            exact: false,
            component: Trade,
          },
          {
            path: "/broker/:id",
            exact: true,
            component: Trade,
          },
          {
            path: "/dashboard",
            exact: false,
            component: Data,
          },
          {
            path: "/earn",
            exact: false,
            component: Earn,
          },
          {
            path: "/broker-list",
            exact: true,
            component: BrokerList,
          },
          {
            path: "/broker",
            exact: false,
            component: Partners,
            routes: [
              {
                path: "/broker",
                exact: true,
                component: MainPartners,
              },
              {
                path: "/bind",
                exact: true,
                component: BindPartners,
              },
            ],
          },
          {
            path: "/brokers",
            exact: false,
            component: Broker
          },
          {
            path: "/faucet",
            exact: false,
            component: Faucet,
          },
        ],
      },
      {
        path: "/error",
        component: ErrorPage,
      },
    ],
  },
];

export default routes;
