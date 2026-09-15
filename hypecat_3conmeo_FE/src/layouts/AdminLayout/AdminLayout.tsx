// StaffLayout.tsx
import React, { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import SidebarHeader, {
  drawerWidth,
} from "./Header/SidebarHeader/SidebarHeader";
import classNames from "classnames/bind";
import styles from "./LayoutAdmin.module.scss";

const cx = classNames.bind(styles);

const AdminLayout: React.FC = () => {
  const [open, setOpen] = useState(true); //track drawer

  return (
    <div className={cx("staff-layout")}>
      {/* Pass `open` and `setOpen` to SidebarHeader */}
      <SidebarHeader open={open} setOpen={setOpen} />
      <Box
        component="main"
        className={cx("main-content")}
        sx={{
          transition: "margin 0.3s ease", // for smooth transition
          marginLeft: open ? `${drawerWidth}px` : "0px",
          width: open ? `calc(100% -${drawerWidth}px)` : "100%",
          backgroundColor: "#fafafa",
        }}
      >
        {/* This Toolbar pushes the content below the AppBar */}
        <Toolbar />
        <Outlet />
      </Box>
    </div>
  );
};

export default AdminLayout;
