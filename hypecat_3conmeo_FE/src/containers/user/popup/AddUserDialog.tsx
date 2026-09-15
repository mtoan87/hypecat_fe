/* eslint-disable @typescript-eslint/no-explicit-any */

import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../../../api/services/user_api/userAPI";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import { colors, font_weight } from "../../../styles/config-file";

interface AddUserProps {
  open: boolean;
  handleClose: () => void;
  fetchData?: any;
}

const AddUser: React.FC<AddUserProps> = ({ open, handleClose, fetchData }) => {
  const theme = useTheme();

  const defaultValues = {
    name: "",
    phone: "",
    province: "",
    ward: "",
    street: "",
    userImages: [],
    roleId: 2,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Tên người dùng là bắt buộc"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Số điện thoại chỉ được chứa số")
      .min(10, "Số điện thoại phải có ít nhất 10 số")
      .required("Số điện thoại là bắt buộc"),
    province: Yup.string().required("Tỉnh/Thành phố là bắt buộc"),
    ward: Yup.string().required("Phường/Xã là bắt buộc"),
    street: Yup.string().required("Đường là bắt buộc"),
    roleId: Yup.number(),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const createUser = async (data: any) => {
    try {
      await userApi.createNewUser(data);
      toast.success("Tạo mới người dùng thành công");
      reset();
      handleClose();
      fetchData?.();
    } catch (error) {
      toast.error("Tạo người dùng thất bại");
      console.log("error", error);
    }
  };

  const handleDialogClose = () => {
    reset();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 24,
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(createUser)}>
        {/* Header */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${
              colors.originPrimary
            } 0%, ${alpha(colors.originPrimary, 0.8)} 100%)`,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              width: "100px",
              height: "100px",
              background: `radial-gradient(circle, ${alpha(
                "#fff",
                0.1
              )} 0%, transparent 70%)`,
              transform: "translate(30px, -30px)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 3,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: alpha("#fff", 0.15),
                  backdropFilter: "blur(10px)",
                }}
              >
                <PersonAddIcon sx={{ color: "#fff", fontSize: 24 }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#fff",
                    fontWeight: font_weight.bold || 600,
                    letterSpacing: 0.5,
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  Tạo mới người dùng
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: alpha("#fff", 0.8),
                    fontWeight: 400,
                  }}
                >
                  Thêm thông tin người dùng mới vào hệ thống
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={handleDialogClose}
              sx={{
                color: "#fff",
                backgroundColor: alpha("#fff", 0.1),
                backdropFilter: "blur(10px)",
                "&:hover": {
                  backgroundColor: alpha("#fff", 0.2),
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Form Content */}
        <DialogContent sx={{ p: 0 }}>
          <Paper
            elevation={0}
            sx={{ p: 4, backgroundColor: theme.palette.background.default }}
          >
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: font_weight.bold || 500,
                    color: theme.palette.text.primary,
                    mb: 2,
                  }}
                >
                  Thông tin cơ bản
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Box>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <RHFTextField name="name" label="Tên người dùng" fullWidth />
                </Grid>
                <Grid size={12}>
                  <RHFTextField name="phone" label="Số điện thoại" fullWidth />
                </Grid>
                <Grid size={12}>
                  <RHFTextField
                    name="province"
                    label="Tỉnh / Thành phố"
                    fullWidth
                  />
                </Grid>
                <Grid size={12}>
                  <RHFTextField name="ward" label="Phường / Xã" fullWidth />
                </Grid>
                <Grid size={12}>
                  <RHFTextField name="street" label="Đường" fullWidth />
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </DialogContent>

        {/* Actions */}
        <DialogActions
          sx={{
            p: 3,
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: "blur(20px)",
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
            <Button
              onClick={handleDialogClose}
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: font_weight.medium || 500,
              }}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                flex: 1,
                borderRadius: 2,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: font_weight.bold || 600,
                background: `linear-gradient(135deg, ${
                  colors.originPrimary
                } 0%, ${alpha(colors.originPrimary, 0.8)} 100%)`,
                boxShadow: `0 4px 12px ${alpha(colors.originPrimary, 0.3)}`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${alpha(
                    colors.originPrimary,
                    0.9
                  )} 0%, ${alpha(colors.originPrimary, 0.7)} 100%)`,
                  boxShadow: `0 6px 16px ${alpha(colors.originPrimary, 0.4)}`,
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  background: alpha(theme.palette.action.disabled, 0.12),
                  color: theme.palette.action.disabled,
                },
              }}
            >
              {isSubmitting ? "Đang tạo..." : "Tạo người dùng"}
            </Button>
          </Stack>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default AddUser;
