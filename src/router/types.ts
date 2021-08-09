

import { RouteComponentProps } from "react-router";


export type RouteItem = ({
    path: string;
    exact?: boolean,
    component: any,
    routes: RouteItem
} | {
    path: string;
    exact?: boolean,
    component: any,
    routes: RouteItem
})[]

export  interface RouteProps extends RouteComponentProps {
    routes: RouteItem

}