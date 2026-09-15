/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
} from "@mui/material";
import {
  Security as SecurityIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  AdminPanelSettings as AdminIcon,
  SupervisedUserCircle as CustomerIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import type { UserData } from "../../../types/Usertype";
import userApi from "../../../api/services/user_api/userAPI";

interface EditAccountDialogProps {
  open: boolean;
  onClose: () => void;
  userData?: UserData;
  onSave: (data: any) => void;
}

interface AccountFormData {
  roleId: string;
}

const EditAccountDialog: React.FC<EditAccountDialogProps> = ({
  open,
  onClose,
  userData,
  onSave,
}) => {
  const [formData, setFormData] = useState<AccountFormData>({
    roleId: "",
  });
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    {
      value: "active",
      label: "Hoạt động",
      color: "success",
      icon: <CheckCircleIcon />,
    },
    {
      value: "inactive",
      label: "Không hoạt động",
      color: "warning",
      icon: <WarningIcon />,
    },
    {
      value: "banned",
      label: "Bị cấm",
      color: "error",
      icon: <ErrorIcon />,
    },
  ];

  const roleOptions = [
    { value: "1", label: "Quản trị viên", icon: <AdminIcon /> },
    { value: "2", label: "Khách hàng", icon: <CustomerIcon /> },
    { value: "3", label: "Nhân viên bán hàng", icon: <PersonIcon /> },
  ];

  useEffect(() => {
    if (userData && userData.role) {
      // Convert role ID to string and ensure it matches available options
      const roleId = userData.role.id ? userData.role.id.toString() : "";
      const validRoleId = roleOptions.find((option) => option.value === roleId)
        ? roleId
        : "2"; // Default to customer

      setFormData({
        roleId: validRoleId,
      });
    }
  }, [userData]);

  const getStatusDetails = (status: string) => {
    return (
      statusOptions.find((option) => option.value === status) ||
      statusOptions[0]
    );
  };

  const getRoleDetails = (roleId: string) => {
    return (
      roleOptions.find((option) => option.value === roleId) || roleOptions[1] // Default to customer
    );
  };

  const getCurrentRoleDetails = () => {
    if (!userData?.role?.id) return roleOptions[1]; // Default to customer
    const currentRoleId = userData.role.id.toString();
    return getRoleDetails(currentRoleId);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await userApi.updateAccount(userData?.id, formData);
      onSave({ roleId: parseInt(formData.roleId) }); // Convert back to number for API
      handleClose();
    } catch (error) {
      console.error("Error updating account info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form data when closing
    if (userData && userData.role) {
      const roleId = userData.role.id ? userData.role.id.toString() : "";
      const validRoleId = roleOptions.find((option) => option.value === roleId)
        ? roleId
        : "2";
      setFormData({ roleId: validRoleId });
    }
    onClose();
  };

  const getRoleChangeWarning = () => {
    const currentRoleId = userData?.role?.id?.toString() || "2";
    const newRoleId = formData.roleId;

    if (newRoleId === "1" && currentRoleId !== "1") {
      return {
        type: "info" as const,
        message: "Lưu ý: Người dùng sẽ có quyền quản trị viên.",
      };
    }
    if (currentRoleId === "1" && newRoleId !== "1") {
      return {
        type: "warning" as const,
        message: "Cảnh báo: Quyền quản trị viên sẽ bị thu hồi.",
      };
    }
    if (newRoleId === "3" && currentRoleId !== "3") {
      return {
        type: "info" as const,
        message: "Lưu ý: Người dùng sẽ có quyền nhân viên bán hàng.",
      };
    }
    return null;
  };

  const hasChanges = () => {
    const currentRoleId = userData?.role?.id?.toString() || "2";
    return formData.roleId !== currentRoleId;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          boxShadow: "0 20px 64px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: 2,
                p: 1,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SecurityIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Chỉnh sửa thông tin tài khoản
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {/* Current User Info */}
          <Box
            sx={{
              p: 3,
              bgcolor: "#f8fafc",
              borderRadius: 2,
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Người dùng hiện tại
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
              {userData?.name} (ID: #{userData?.id})
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                icon={getStatusDetails(userData?.status || "active").icon}
                label={getStatusDetails(userData?.status || "active").label}
                color={
                  getStatusDetails(userData?.status || "active").color as any
                }
                size="small"
              />
              <Chip
                icon={getCurrentRoleDetails().icon}
                label={getCurrentRoleDetails().label}
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>

          {/* Role Selection */}
          <FormControl fullWidth>
            <InputLabel>Vai trò</InputLabel>
            <Select
              value={formData.roleId}
              onChange={(e) =>
                setFormData({ ...formData, roleId: e.target.value as string })
              }
              label="Vai trò"
              sx={{
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#667eea",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#667eea",
                },
              }}
            >
              {roleOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {option.icon}
                    <Typography>{option.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Role Descriptions */}
          <Box
            sx={{
              p: 2,
              bgcolor: "#fefce8",
              borderRadius: 2,
              border: "1px solid #fde047",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Mô tả vai trò
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ color: "#65651d" }}>
                • <strong>Quản trị viên:</strong> Toàn quyền quản lý hệ thống,
                người dùng và dữ liệu
              </Typography>
              <Typography variant="body2" sx={{ color: "#65651d" }}>
                • <strong>Khách hàng:</strong> Quyền mua hàng, xem sản phẩm và
                quản lý tài khoản cá nhân
              </Typography>
              <Typography variant="body2" sx={{ color: "#65651d" }}>
                • <strong>Nhân viên bán hàng:</strong> Quyền quản lý đơn hàng và
                hỗ trợ khách hàng
              </Typography>
            </Stack>
          </Box>

          {/* Warnings */}
          {getRoleChangeWarning() && (
            <Alert
              severity={getRoleChangeWarning()!.type}
              sx={{ borderRadius: 2 }}
            >
              {getRoleChangeWarning()!.message}
            </Alert>
          )}

          {/* Preview Changes */}
          {hasChanges() && (
            <Box
              sx={{
                p: 3,
                bgcolor: "#f0f9ff",
                borderRadius: 2,
                border: "1px solid #bae6fd",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Thay đổi sẽ áp dụng
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Vai trò mới:
                </Typography>
                <Chip
                  icon={getRoleDetails(formData.roleId).icon}
                  label={getRoleDetails(formData.roleId).label}
                  color="primary"
                  size="small"
                />
              </Box>
            </Box>
          )}

          {!hasChanges() && (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                Chưa có thay đổi nào được thực hiện.
              </Typography>
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            color: "#64748b",
            borderColor: "#e2e8f0",
            "&:hover": {
              borderColor: "#cbd5e1",
              bgcolor: "#f8fafc",
            },
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={loading || !hasChanges()}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 2,
            px: 3,
            "&:hover": {
              background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
            },
            "&:disabled": {
              background: "#e2e8f0",
              color: "#94a3b8",
            },
          }}
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAccountDialog;
