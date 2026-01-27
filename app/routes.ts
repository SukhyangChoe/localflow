import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("common/page/home.tsx"),
    route("auth/join", "auth/page/join.tsx"),
    route("select", "common/page/select-home.tsx"),
    route("board/search", "board/pages/boad-list.tsx"),
] satisfies RouteConfig;
