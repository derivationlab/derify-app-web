import Layout from "@/views/layout";
import Home from "@/views/home";
import ErrorPage from "@/views/error";

import Trade from "@/views/trade";
import Data from "@/views/data";
import Rewards from "@/views/rewards";
import Partners from "@/views/partners";
import BindPartners from "@/views/partners/Bind";
import MainPartners from "@/views/partners/Main";

const routes: Array<any> = [
  {
    path: "/",
    component: Layout,
    routes: [
      {
        path: "/home",
        exact: false,
        component: Home,
        routes: [
          {
            path: "/home/trade",
            exact:false,
            component: Trade,
          },
          {
            path: "/home/data",
            exact: false,
            component: Data,
          },
          {
            path: "/home/rewards",
            exact: false,
            component: Rewards,
          },
          {
            path: "/home/partners",
            exact: false,
            component: Partners,
            routes: [
              {
                path: "/home/partners/main",
                exact: true,
                component: MainPartners,
              },
              {
                path: "/home/partners/bind",
                exact: true,
                component: BindPartners,
              },
            ],
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
