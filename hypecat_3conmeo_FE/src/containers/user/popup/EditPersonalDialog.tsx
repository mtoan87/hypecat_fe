/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  Person as PersonIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  // PhotoCamera as PhotoCameraIcon,
} from "@mui/icons-material";
import type { UserData } from "../../../types/Usertype";
import userApi from "../../../api/services/user_api/userAPI";

interface EditPersonalDialogProps {
  open: boolean;
  onClose: () => void;
  userData?: UserData;
  onSave: (data: any) => void;
}

interface PersonalFormData {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

const EditPersonalDialog: React.FC<EditPersonalDialogProps> = ({
  open,
  onClose,
  userData,
  onSave,
}) => {
  const [formData, setFormData] = useState<PersonalFormData>({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<PersonalFormData>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        avatar: userData.images?.[0]?.urlPath || "",
      });
    }
  }, [userData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<PersonalFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Họ và tên là bắt buộc";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PersonalFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await userApi.updateAccount(userData?.id, formData);
      onSave(formData);
      handleClose();
    } catch (error) {
      console.error("Error updating personal info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: userData?.name || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      avatar: userData?.images?.[0]?.urlPath || "",
    });
    setErrors({});
    onClose();
  };

  // const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     // In a real app, you would upload the file to a server
  //     const imageUrl = URL.createObjectURL(file);
  //     setFormData((prev) => ({ ...prev, avatar: imageUrl }));
  //   }
  // };

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
              <PersonIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Chỉnh sửa thông tin cá nhân
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {/* Avatar Section */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={formData.avatar}
                sx={{
                  width: 100,
                  height: 100,
                  border: "4px solid #f1f5f9",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {formData.name.charAt(0)}
                </Typography>
              </Avatar>
              {/* <Tooltip title="Thay đổi ảnh đại diện">
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: -8,
                    right: -8,
                    bgcolor: "#667eea",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#5a67d8",
                    },
                  }}
                  component="label"
                >
                  <PhotoCameraIcon fontSize="small" />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAvatarChange}
                  />
                </IconButton>
              </Tooltip> */}
            </Box>
          </Box>

          {/* Form Fields */}
          <TextField
            fullWidth
            label="Họ và tên"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#667eea",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#667eea",
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#667eea",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#667eea",
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Số điện thoại"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
            variant="outlined"
            placeholder="Ví dụ: 0123456789"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#667eea",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#667eea",
                },
              },
            }}
          />
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
          disabled={loading}
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

export default EditPersonalDialog;
