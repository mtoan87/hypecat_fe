/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import BlockIcon from "@mui/icons-material/Block";
import { Button, Menu, MenuItem } from "@mui/material";
import DeleteProduct from "../../product/popup/DeleteProduct";
import { useNavigate } from "react-router-dom";
import config from "../../../configs";

export default function MenuActionTableProduct({
  product,
  isDeleted,
  introId,
  fetchProduct,
}: {
  product: any;
  isDeleted: boolean;
  introId?: string;
  fetchProduct: () => void;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      label: "Chi Tiết",
      icon: <InfoIcon sx={{ mr: 1 }} color="info" />,
      action: () => {
        navigate(
          config.adminRoutes.ManageProductDetail.replace(":id", product.id)
        );
      },
    },
    ...(!isDeleted
      ? [
          {
            label: "Chỉnh sửa",
            icon: <EditIcon sx={{ mr: 1, color: "#9ADE7B" }} />,
            action: () => {
              navigate(
                config.adminRoutes.EditProductDetail.replace(":id", product.id)
              );
            },
          },
        ]
      : []),
    {
      label: isDeleted === true ? "Khôi phục" : "Ngừng",
      icon:
        isDeleted === true ? (
          <AddIcon sx={{ mr: 1 }} color="success" />
        ) : (
          <BlockIcon sx={{ mr: 1 }} color="error" />
        ),
      action: () => {
        setOpenDeleteDialog(true);
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
  const handleCloseDelete = () => {
    setOpenDeleteDialog(!openDeleteDialog);
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
      {openDeleteDialog == true && (
        <DeleteProduct
          open={openDeleteDialog}
          handleClose={handleCloseDelete}
          product={product}
          fetchData={fetchProduct}
        />
      )}
    </div>
  );
}
