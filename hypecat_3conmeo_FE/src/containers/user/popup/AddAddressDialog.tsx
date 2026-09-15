/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
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
  IconButton,
  Autocomplete,
  Chip,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import addressApi from "../../../api/services/AddressApi/addressAPI";

interface AddAddressDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  userId: string | undefined;
}

interface AddressFormData {
  recipientName: string;
  phone: string;
  street: string;
  ward: string;
  province: string;
  type: string;
  isDefault: boolean;
}

const AddAddressDialog: React.FC<AddAddressDialogProps> = ({
  open,
  onClose,
  onSave,
  userId,
}) => {
  const [formData, setFormData] = useState<AddressFormData>({
    recipientName: "",
    phone: "",
    street: "",
    ward: "",
    province: "",
    type: "home",
    isDefault: false,
  });
  const [errors, setErrors] = useState<Partial<AddressFormData>>({});
  const [loading, setLoading] = useState(false);

  // Sample data for autocomplete - in real app, this would come from API
  const vietnamProvinces = [
    "Hà Nội",
    "Hồ Chí Minh",
    "Đà Nẵng",
    "Hải Phòng",
    "Cần Thơ",
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bạc Liêu",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Định",
    "Bình Dương",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cao Bằng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Tĩnh",
    "Hải Dương",
    "Hậu Giang",
    "Hòa Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Phú Yên",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<AddressFormData> = {};

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = "Tên người nhận là bắt buộc";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.street.trim()) {
      newErrors.street = "Địa chỉ đường/số nhà là bắt buộc";
    }

    if (!formData.ward.trim()) {
      newErrors.ward = "Phường/Xã là bắt buộc";
    }

    if (!formData.province.trim()) {
      newErrors.province = "Tỉnh/Thành phố là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof AddressFormData,
    value: string | boolean
  ) => {
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
      const param = {
        ...formData,
        userId: userId,
      };
      await addressApi.createAddress(param);
      onSave(formData);
      handleClose();
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      recipientName: "",
      phone: "",
      street: "",
      ward: "",
      province: "",
      type: "home",
      isDefault: false,
    });
    setErrors({});
    onClose();
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
              <AddIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Thêm địa chỉ mới
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {/* Recipient Name */}
          <TextField
            fullWidth
            label="Tên người nhận"
            value={formData.recipientName}
            onChange={(e) => handleInputChange("recipientName", e.target.value)}
            error={!!errors.recipientName}
            helperText={errors.recipientName}
            variant="outlined"
            placeholder="Nhập tên người nhận"
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

          {/* Phone Number */}
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

          {/* Street Address */}
          <TextField
            fullWidth
            label="Địa chỉ đường/Số nhà"
            value={formData.street}
            onChange={(e) => handleInputChange("street", e.target.value)}
            error={!!errors.street}
            helperText={errors.street}
            variant="outlined"
            placeholder="Ví dụ: 123 Đường Nguyễn Văn Linh"
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

          {/* Ward */}
          <TextField
            fullWidth
            label="Phường/Xã"
            value={formData.ward}
            onChange={(e) => handleInputChange("ward", e.target.value)}
            error={!!errors.ward}
            helperText={errors.ward}
            variant="outlined"
            placeholder="Ví dụ: Phường Bến Nghé"
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

          {/* Province with Autocomplete */}
          <Autocomplete
            options={vietnamProvinces}
            value={formData.province}
            onChange={(_, newValue) =>
              handleInputChange("province", newValue || "")
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tỉnh/Thành phố"
                error={!!errors.province}
                helperText={errors.province}
                variant="outlined"
                placeholder="Chọn tỉnh/thành phố"
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
            )}
            sx={{
              "& .MuiAutocomplete-popupIndicator": {
                color: "#667eea",
              },
            }}
          />

          {/* Default Address Option */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 2,
              bgcolor: "#f8fafc",
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: "#f1f5f9",
              },
            }}
            onClick={() => handleInputChange("isDefault", !formData.isDefault)}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: "2px solid #667eea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: formData.isDefault ? "#667eea" : "transparent",
                transition: "all 0.2s",
              }}
            >
              {formData.isDefault && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "white",
                  }}
                />
              )}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Đặt làm địa chỉ mặc định
            </Typography>
          </Box>

          {/* Address Preview */}
          {formData.street && formData.ward && formData.province && (
            <Box
              sx={{
                p: 3,
                bgcolor: "#f0f9ff",
                borderRadius: 2,
                border: "1px solid #bae6fd",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Xem trước địa chỉ
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                {formData.isDefault && (
                  <Chip label="Mặc định" size="small" color="primary" />
                )}
              </Box>
              <Typography variant="body2" sx={{ color: "#64748b", mb: 1 }}>
                <strong>Người nhận:</strong> {formData.recipientName}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", mb: 1 }}>
                <strong>Số điện thoại:</strong> {formData.phone}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                <strong>Địa chỉ:</strong> {formData.street}, {formData.ward},{" "}
                {formData.province}
              </Typography>
            </Box>
          )}

          {/* Info Alert */}
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <Typography variant="body2">
              Địa chỉ này sẽ được sử dụng để giao hàng và liên hệ. Bạn có thể
              chỉnh sửa hoặc xóa sau.
            </Typography>
          </Alert>
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
          disabled={
            loading ||
            !formData.recipientName ||
            !formData.phone ||
            !formData.street ||
            !formData.ward ||
            !formData.province
          }
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
          {loading ? "Đang thêm..." : "Thêm địa chỉ"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAddressDialog;
