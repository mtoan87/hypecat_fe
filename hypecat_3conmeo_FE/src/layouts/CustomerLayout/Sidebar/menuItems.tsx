import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import config from "../../../configs";

export const customerMenuItems = [
    { label: "Trang chủ", icon: <HomeIcon />, path: config.customerRoutes.test },
    { label: "Đơn hàng", icon: <ShoppingCartIcon />, path: "/orders" },
];
