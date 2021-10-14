import Layout from "@/views/layout";
import Home from "@/views/home";
import ErrorPage from "@/views/error";

import Trade from "@/views/trade";
import Data from "@/views/data";
import Rewards from "@/views/rewards";
import Partners from "@/views/partners";
import BindPartners from "@/views/partners/Bind";
import MainPartners from "@/views/partners/Main";
import Faucet from "@/views/faucet";

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
            exact:false,
            component: Trade,
          },
          {
            path: "/data",
            exact: false,
            component: Data,
          },
          {
            path: "/reward",
            exact: false,
            component: Rewards,
          },
          {
            path: "/broker",
            exact: false,
            component: Partners,
            routes: [
              {
                path: "/broker-main",
                exact: true,
                component: MainPartners,
              },
              {
                path: "/broker-bind",
                exact: true,
                component: BindPartners,
              },
            ],
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
