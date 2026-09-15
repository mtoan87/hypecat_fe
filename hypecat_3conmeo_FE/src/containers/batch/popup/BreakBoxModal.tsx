import React from "react";
import { toast } from "react-toastify";
//api
import {
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import {
  FormProvider,
  RHFTextField,
  RHFTextFieldNumber,
} from "../../../components/hook-form";
import config from "../../../configs";
import type { ProductInBatch } from "../../../types/BatchType";
import BatchAPI from "../../../api/services/BatchApi/batchAPI";

interface ModalCategory {
  ProductData: ProductInBatch | null | undefined;
  openPopup: boolean;
  handleCLose: () => void;
  onUpdateSuccess: () => void;
}

interface BreakBoxRequest {
  isAddMorePacks: boolean;
  sellingPrice: number;
  quantity: number;
}

const BreakBoxModal: React.FC<ModalCategory> = ({
  ProductData,
  openPopup,
  handleCLose,
  onUpdateSuccess,
}) => {
  const ProductSchema = Yup.object().shape({
    isAddMorePacks: Yup.boolean().required("Trường này là bắt buộc"),
    sellingPrice: Yup.number()
      .required("Giá bán là bắt buộc")
      .min(0, "Giá bán không thể âm"),
    quantity: Yup.number()
      .required("Số lượng là bắt buộc")
      .min(0, "Số lượng không thể âm"),
  });

  const defaultValues = {
    batchDetailParentId: 0,
    boxId: 0,
    isAddMorePacks: false,
    sellingPrice: 0,
    quantity: 0,
  };

  const methods = useForm<BreakBoxRequest>({
    resolver: yupResolver(ProductSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: BreakBoxRequest) => {
    try {
      if (!ProductData) {
        toast.error("Không có dữ liệu sản phẩm để cập nhật");
        return;
      }

      const requestBody = {
        batchDetailParentId: ProductData.id,
        boxId: ProductData.productId,
        isAddMorePacks: data.isAddMorePacks,
        sellingPrice: data.sellingPrice,
        quantity: data.quantity,
      };

      const response = await BatchAPI.BreakBox(requestBody);
      if (response) {
        onUpdateSuccess();
        toast.success("Tách hộp thẻ thành công");
      }
      reset();
    } catch (error) {
      toast.error(
        config.AdminMessageNotice.FailAddQuantity || "Cập nhật thất bại"
      );

      console.error(error);
    } finally {
      handleCLose();
    }
  };

  return (
    <Dialog
      open={openPopup}
      onClose={(_event, reason) => {
        if (reason === "backdropClick") return;
        handleCLose();
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          Tách Hộp Thẻ - {ProductData?.productName}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{ mb: 2, p: 3, mt: 1 }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: "16px",
                marginBottom: "16px",
                display: "block",
                fontWeight: 500,
              }}
            >
              Tên hộp: {ProductData?.productName}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <RHFTextFieldNumber
                name="sellingPrice"
                label="Giá bán"
                type="number"
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: <Box sx={{ mr: 1 }}>VND</Box>,
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <RHFTextField
                name="quantity"
                label="Số lượng"
                type="number"
                fullWidth
              />
            </Box>
          </Card>
        </FormProvider>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={handleCLose} sx={{ mr: 1 }}>
          Huỷ
        </Button>
        <Button
          loading={isSubmitting}
          disabled={
            ProductData?.remainingQuantity === 0 ||
            !!ProductData?.isChild ||
            ProductData?.categoryName === "pack"
          }
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          sx={{ minWidth: 120 }}
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BreakBoxModal;
