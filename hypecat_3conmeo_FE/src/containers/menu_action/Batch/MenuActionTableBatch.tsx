/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import InfoIcon from "@mui/icons-material/Info";
import { Button, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import config from "../../../configs";

export default function MenuActionTableBatch({
  batchData,
  introId,
}: {
  batchData: any;
  isDeleted?: boolean;
  introId?: string;
  onOpenDetail?: any;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const actions = [
    {
      label: "Chi Tiết",
      icon: <InfoIcon sx={{ mr: 1 }} color="info" />,
      action: () => {
        navigate(
          config.adminRoutes.manageBatchDetail.replace(":id", batchData.id)
        );
      },
    },
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.currentTarget;
    setTimeout(() => {
      setAnchorEl(target);
    }, 0);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id={introId}
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ width: "20px" }}
      >
        <MoreHorizIcon
          sx={{
            color: "#6464CD",
          }}
        />
      </Button>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {actions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              action.action();
              handleClose();
            }}
          >
            {action.icon}
            <span>{action.label}</span>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
