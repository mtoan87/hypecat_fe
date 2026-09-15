import {
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    IconButton,
    useMediaQuery,
    ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { customerMenuItems } from "./menuItems";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";

export default function CustomerSidebar() {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const drawerContent = (
        <List>
            {customerMenuItems.map((item, index) => (
                <ListItemButton key={index} component={Link} to={item.path}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                </ListItemButton>
            ))}
        </List>
    );

    return isMobile ? (
        <>
            <IconButton onClick={() => setOpen(true)} sx={{ m: 1 }}>
                <MenuIcon />
            </IconButton>
            <Drawer open={open} onClose={() => setOpen(false)}>
                {drawerContent}
            </Drawer>
        </>
    ) : (
        <Drawer variant="permanent" open>
            {drawerContent}
        </Drawer>
    );
}
