import Layout from "@/views/layout";
import Home from "@/views/home";
import ErrorPage from "@/views/error";

import Trade from "@/views/trade";
import Data from "@/views/data";
import Earn from "@/views/earn/main";
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
            path: "/broker/:id",
            exact:true,
            component: Trade,
          },
          {
            path: "/data",
            exact: false,
            component: Data,
          },
          {
            path: "/earn",
            exact: false,
            component: Earn,
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
