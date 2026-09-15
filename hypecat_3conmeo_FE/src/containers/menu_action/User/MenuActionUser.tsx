/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  MoreHoriz as MoreHorizIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import config from "../../../configs";
import type { UserData } from "../../../types/Usertype";
import DeleteUser from "../../user/popup/DeleteUserDialog";

interface MenuActionUserProps {
  userData: UserData;
  isDeleted?: boolean;
  introId?: string;
  onOpenDetail?: any;
  fetchData?: () => void;
  onOpenDelete: () => void;
  onOpenEdit?: () => void;
  onOpenRestore?: () => void;
  onOpenBlock?: () => void;
}

export default function MenuActionUser({
  userData,
  introId,
  fetchData,
  onOpenDelete,
  onOpenRestore,
}: MenuActionUserProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const handleDelete = () => {
    if (onOpenDelete) {
      onOpenDelete();
    }
    setOpenDelete(true);
    setAnchorEl(null);
  };

  const handleRestore = () => {
    if (onOpenRestore) {
      onOpenRestore();
    }
    setAnchorEl(null);
  };

  // Check user status to determine available actions
  const isActive = userData.status?.toLowerCase() === "active";
  const isInactive = userData.status?.toLowerCase() === "unactive";
  const isBanned = userData.status?.toLowerCase() === "banned";

  const actions = [
    {
      label: "Chi tiết",
      icon: <InfoIcon color="info" />,
      action: () => {
        navigate(
          config.adminRoutes.detailUser.replace(":id", userData?.id.toString())
        );
        setAnchorEl(null);
      },
      condition: true, // Always show detail
      color: "#2196f3",
    },
    {
      label: "Xóa người dùng",
      icon: <DeleteIcon color="error" />,
      action: handleDelete,
      condition: isActive, // Can delete if active or inactive
      color: "#f44336",
      divider: true,
    },
    {
      label: "Khôi phục người dùng",
      icon: <RestoreIcon sx={{ color: "#4caf50" }} />,
      action: handleRestore,
      condition: isInactive || isBanned, // Can restore if inactive or banned
      color: "#4caf50",
    },
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Prevent event bubbling
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateSuccess = () => {
    if (fetchData) {
      fetchData();
    }
    setOpenDelete(false);
  };

  // Filter actions based on conditions
  const availableActions = actions.filter((action) => action.condition);

  console.log(availableActions);

  return (
    <div>
      <Tooltip title="Tùy chọn khác">
        <Button
          id={introId}
          aria-controls={open ? "user-action-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          variant="outlined"
          size="small"
          sx={{
            minWidth: "40px",
            width: "40px",
            height: "40px",
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            "&:hover": {
              border: "1px solid #6464CD",
              bgcolor: "rgba(100, 100, 205, 0.04)",
            },
          }}
        >
          <MoreHorizIcon
            sx={{
              color: "#6464CD",
              fontSize: "20px",
            }}
          />
        </Button>
      </Tooltip>

      <Menu
        id="user-action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
          },
        }}
      >
        {availableActions.length > 0 ? (
          availableActions
            .map((action, index) => [
              <MenuItem
                key={`action-${index}`}
                onClick={action.action}
                sx={{
                  py: 1.5,
                  px: 2,
                  "&:hover": {
                    bgcolor: `${action.color}10`,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "36px" }}>
                  {action.icon}
                </ListItemIcon>
                <ListItemText
                  primary={action.label}
                  sx={{
                    "& .MuiTypography-root": {
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    },
                  }}
                />
              </MenuItem>,
              ...(action.divider && index < availableActions.length - 1
                ? [<Divider key={`divider-${index}`} sx={{ my: 0.5 }} />]
                : []),
            ])
            .flat()
        ) : (
          <MenuItem disabled>
            <ListItemText primary="Không có hành động khả dụng" />
          </MenuItem>
        )}
      </Menu>

      {openDelete && (
        <DeleteUser
          onOpen={openDelete}
          onClose={() => setOpenDelete(false)}
          data={userData}
          fetchData={handleUpdateSuccess}
        />
      )}
    </div>
  );
}
