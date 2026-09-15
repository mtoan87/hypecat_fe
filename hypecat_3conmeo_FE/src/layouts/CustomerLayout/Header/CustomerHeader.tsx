import { AppBar, Toolbar, Typography } from "@mui/material";

export default function CustomerHeader() {
    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Khách Hàng
                </Typography>
                {/* Avatar / Info / Logout nếu cần */}
            </Toolbar>
        </AppBar>
    );
}
