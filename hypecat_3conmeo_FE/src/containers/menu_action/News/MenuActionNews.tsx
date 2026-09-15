/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import InfoIcon from "@mui/icons-material/Info";
import { Button, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import config from "../../../configs";
import DeleteNewsDialog from "../../news/popup/DeleteNewsDialog";

export default function MenuActionTableNews({
    newsData,
    isDeleted,
    introId,
    fetchNews,
}: {
    newsData: any;
    isDeleted?: boolean;
    introId?: string;
    fetchNews: () => void;
}) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

    const actions = [
        {
            label: "Chi Tiết",
            icon: <InfoIcon sx={{ mr: 1 }} color="info" />,
            action: () => {
                navigate(config.adminRoutes.detailNews.replace(":id", newsData.id));
            },
        },
        {
            label: "Chỉnh sửa",
            icon: <EditIcon sx={{ mr: 1, color: "#9ADE7B" }} />,
            action: () => {
                navigate(
                    config.adminRoutes.editNews.replace(":id", newsData.id)
                );
            },
        },
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
                <DeleteNewsDialog
                    open={openDeleteDialog}
                    handleClose={handleCloseDelete}
                    news={newsData}
                    fetchData={fetchNews}
                />
            )}
        </div>
    );
}
