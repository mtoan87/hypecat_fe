import type { MenuItem } from "../../../types/menu";
import config from "../../../configs";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export const menuItems: MenuItem[] = [
    {
        label: "Thông tin tài khoản",
        icon: <AccountCircleIcon />,
        path: config.customerRoutes.userProfile,
    },
    {
        label: "Quản lý đơn hàng",
        icon: <ShoppingCartIcon />,
        path: config.customerRoutes.order,
    },
    {
        label: "Sổ địa chỉ",
        icon: <LocationOnIcon />,
        path: config.customerRoutes.address,
    },
];
