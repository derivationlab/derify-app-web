
import Layout from "@/views/layout";
import Home from '@/views/home'
import ErrorPage from "@/views/error";


import Trade from '@/views/trade';
import Data from '@/views/data';
import Rewards from '@/views/rewards';


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
                        exact: true,
                        component: Trade,

                    },
                    {
                        path: "/home/data",
                        exact: true,
                        component: Data,
                    },
                    {
                        path: "/home/rewards",
                        exact: true,
                        component: Rewards,
                    },
                    {
                        path: "/home/broker",
                        exact: true,
                        component: ErrorPage,
                    }

                ],
            },
            {
                path: "/error",
                component: ErrorPage,
            }

        ],
    }

];


export default routes


