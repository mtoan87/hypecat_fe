/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Stack,
  Typography,
  Box,
  Divider,
  Chip,
  IconButton,
  alpha,
  useTheme,
} from "@mui/material";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { useForm, FormProvider } from "react-hook-form";

import { colors, font_weight } from "../../../styles/config-file";
import categoryApi from "../../../api/services/CategoryApi/categoryAPI";
import { RHFSelect, RHFTextField } from "../../../components/hook-form";


interface CreateCategoryProps {
  open: boolean;
  handleClose: () => void;
  fetchData: () => void;
}

type FormValues = {
  name: string;
  cateType: "Product" | "News";
};

const CreateCategory: React.FC<CreateCategoryProps> = ({
  open,
  handleClose,
  fetchData,
}) => {
  const theme = useTheme();
  const methods = useForm<FormValues>({
    defaultValues: {
      name: "",
      cateType: "Product",
    },
  });
  const { handleSubmit, reset, register, formState, watch } = methods;
  const { errors, isSubmitting } = formState;

  const getErrorMessage = (error: any): string => {
    const message = error?.response?.data?.message;

    switch (message) {
      case "Category already exists.":
        return "Loại sản phẩm đã tồn tại.";
      default:
        if (message) return message;
        if (error.response?.status === 500)
          return "Lỗi máy chủ. Vui lòng thử lại sau.";
        if (error.request) return "Không nhận được phản hồi từ máy chủ.";
        return "Đã xảy ra lỗi. Vui lòng thử lại.";
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await categoryApi.createCategory(data);
      toast.success("Tạo thành công", {
        position: "top-right",
        autoClose: 3000,
      });
      reset();
      handleClose();
      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error), {
        autoClose: 5000,
        position: "top-right",
      });
      console.error("Lỗi khi tạo:", error);
    }
  };

  const handleCloseDialog = () => {
    if (!isSubmitting) {
      reset();
      handleClose();
    }
  };

  const name = watch("name");

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: {
          backgroundColor: alpha(theme.palette.common.black, 0.6),
          backdropFilter: "blur(4px)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.originPrimary} 0%, ${colors.originPrimary}cc 100%)`,
          color: colors.white,
          position: "relative",
        }}
      >
        <DialogTitle
          sx={{
            color: "white",
            pb: 2,
            pr: 6,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.common.white, 0.15),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <CategoryOutlinedIcon sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ color: "white" }}>
                Tạo loại sản phẩm mới
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: alpha(theme.palette.common.white, 0.8) }}
              >
                Thêm loại sản phẩm vào danh mục
              </Typography>
            </Box>
          </Stack>

          <IconButton
            onClick={handleCloseDialog}
            disabled={isSubmitting}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "white",
              backgroundColor: alpha(theme.palette.common.white, 0.1),
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.2),
              },
              "&:disabled": {
                color: alpha(theme.palette.common.white, 0.5),
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ px: 4, py: 3 }}>
            <Stack spacing={3}>
              <Chip
                icon={<CategoryOutlinedIcon />}
                label="Tên loại sản phẩm phải là duy nhất"
                variant="outlined"
                size="small"
                sx={{
                  alignSelf: "flex-start",
                  borderColor: theme.palette.info.main,
                  color: theme.palette.info.main,
                  backgroundColor: alpha(theme.palette.info.main, 0.05),
                }}
              />

              <RHFSelect name="cateType" label="Loại danh mục">
                <option value="Product">Sản phẩm</option>
                <option value="News">Tin tức</option>
              </RHFSelect>

              <Box>
                <RHFTextField
                  {...register("name", { required: "Vui lòng nhập tên loại sản phẩm" })}
                  placeholder="Nhập tên loại sản phẩm..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit(onSubmit)();
                    }
                  }}
                // style={{
                //   width: "100%",
                //   padding: "16.5px 14px",
                //   borderRadius: 8,
                //   border: `1px solid ${errors.name ? "red" : theme.palette.divider}`,
                //   fontSize: 16,
                // }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: name?.trim()
                      ? theme.palette.success.main
                      : theme.palette.text.secondary,
                  }}
                >
                  {name?.trim()
                    ? `Độ dài: ${name.trim().length} ký tự`
                    : errors.name?.message || "Vui lòng nhập tên loại sản phẩm"}
                </Typography>
              </Box>
            </Stack>
          </DialogContent>

          <Divider sx={{ mx: 3 }} />

          <DialogActions sx={{ px: 4, py: 3, gap: 2 }}>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              disabled={isSubmitting}
              size="large"
              sx={{
                borderRadius: 2,
                minWidth: 100,
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              size="large"
              startIcon={isSubmitting ? undefined : <AddIcon />}
              sx={{
                flex: 1,
                borderRadius: 2,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: font_weight.bold || 600,
                background: `linear-gradient(135deg, ${colors.originPrimary
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
                transition: "all 0.2s ease-in-out",
              }}
            >
              {isSubmitting ? "Đang tạo..." : "Tạo mới"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default CreateCategory;
