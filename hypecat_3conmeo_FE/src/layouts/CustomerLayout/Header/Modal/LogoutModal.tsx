import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
// import { useAuthContext } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import config from "../../../../configs";
import { Box } from "@mui/material";
import { useAuthContext } from "../../../../hooks/useAuth";
// import { useCheckout } from "../../../../zustand/useCheckout";
// import { useAddress } from "../../../../zustand/useAddress";

interface LogoutProps {
  open: boolean;
  handleClose: VoidFunction;
}

export default function LogoutModal({ open, handleClose }: LogoutProps) {
  const { setAuth } = useAuthContext();

  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem("userInfor");
    localStorage.removeItem("historyPath");
    setTimeout(() => {
      navigate(config.customerRoutes.home);
    }, 700);
  };
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box
          sx={{
            minWidth: "320px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <DialogTitle id="alert-dialog-title" sx={{ color: "red" }}>
            Đăng xuất
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bạn có muốn đăng xuất?
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Button variant="outlined" onClick={handleClose}>
              Huỷ
            </Button>
            <Button variant="outlined" onClick={handleLogout} autoFocus>
              Đồng ý
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
