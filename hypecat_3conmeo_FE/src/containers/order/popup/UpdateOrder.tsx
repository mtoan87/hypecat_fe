/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import type { Product } from "../../../types/ProductType";
import productApi from "../../../api/services/ProductApi/productAPI";
import orderApi from "../../../api/services/OrderApi/orderAPI";
import { colors, font_weight } from "../../../styles/config-file";
import { FormProvider, RHFSelect, RHFTextField } from "../../../components/hook-form";

interface UpdateOrderProps {
  orderData: any;
  open: boolean;
  handleClose: () => void;
  fetchData: () => void;
}

interface OrderDetailForm {
  productId: number;
  quantity: number;
}

interface UpdateOrderForm {
  name: string;
  phone: string;
  address: string;
  email: string;
  orderDetails: OrderDetailForm[];
}

const UpdateOrder: React.FC<UpdateOrderProps> = ({
  orderData,
  open,
  handleClose,
  fetchData,
}) => {
  console.log(orderData);
  const [listProduct, setListProduct] = React.useState<Product[]>([]);
  const initialProductIdsRef = React.useRef<number[]>([]);

  const defaultValues: UpdateOrderForm = {
    name: "",
    phone: "",
    address: "",
    email: "",
    orderDetails: [],
  };

  const getListProduct = async () => {
    try {
      const res: any = await productApi.getAvailableProductList({
        pageIndex: 0,
        pageSize: 100,
      });
      setListProduct(res.items);
    } catch (error) {
      toast.error("Có lỗi xảy ra trong quá trình lấy danh sách sản phẩm");
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  React.useEffect(() => {
    getListProduct();
  }, []);

  const orderDetailSchema = Yup.object().shape({
    productId: Yup.number()
      .required("Vui lòng chọn sản phẩm")
      .min(1, "Sản phẩm không hợp lệ"),
    quantity: Yup.number()
      .required("Vui lòng nhập số lượng")
      .min(1, "Số lượng phải lớn hơn 0"),
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Vui lòng nhập tên người đặt"),
    phone: Yup.string().required("Vui lòng nhập số điện thoại"),
    address: Yup.string().required("Vui lòng nhập địa chỉ"),
    email: Yup.string().email("Email không hợp lệ").notRequired(),
    orderDetails: Yup.array()
      .of(orderDetailSchema)
      .min(1, "Vui lòng chọn ít nhất một sản phẩm"),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "orderDetails",
  });

  React.useEffect(() => {
    if (orderData) {
      const initialOrderDetails = orderData.orderDetails?.length
        ? orderData.orderDetails.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
        : [{ productId: 0, quantity: 1 }];

      initialProductIdsRef.current =
        orderData.orderDetails?.map((item: any) => item.productId) || [];

      reset({
        name: orderData.name || "",
        phone: orderData.phone || "",
        address: orderData.address || "",
        email: orderData.email || "",
        orderDetails: initialOrderDetails,
      });
    }
  }, [orderData, reset]);

  const updateOrder = async (data: any) => {
    try {
      const currentProductIds = data.orderDetails.map(
        (item: any) => item.productId
      );
      const deletedProductIds = initialProductIdsRef.current.filter(
        (id) => !currentProductIds.includes(id)
      );

      const payload = {
        ...data,
        deletedProductIds,
      };

      const res = await orderApi.updateOrder(orderData.id, payload);
      console.log("Phản hồi từ API:", res);
      toast.success("Cập nhật đơn hàng thành công");
      handleClose();
      fetchData();
    } catch (error: any) {
      toast.error("Cập nhật đơn hàng thất bại");
      console.error(
        "Lỗi cập nhật đơn hàng:",
        error.response?.data || error.message
      );
    }
  };

  const handleAddProduct = () => {
    append({ productId: 0, quantity: 1 });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(updateOrder)}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 1,
            bgcolor: colors.primary,
            color: colors.white,
          }}
        >
          <DialogTitle
            sx={{
              textTransform: "uppercase",
              fontWeight: font_weight.regular,
            }}
          >
            Cập nhật đơn hàng
          </DialogTitle>
          <IconButton onClick={handleClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid size={12}>
              <RHFTextField name="name" label="Tên người đặt" />
            </Grid>
            <Grid size={12}>
              <RHFTextField name="phone" label="Số điện thoại" />
            </Grid>
            <Grid size={12}>
              <RHFTextField name="address" label="Địa chỉ" />
            </Grid>
            <Grid size={12}>
              <RHFTextField name="email" label="Email" />
            </Grid>
            {fields.map((item, index) => (
              <React.Fragment key={item.id}>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={8}>
                    <RHFSelect
                      name={`orderDetails.${index}.productId`}
                      label="Sản Phẩm"
                      fullWidth
                    >
                      <option value={0}>Chọn sản phẩm</option>
                      {listProduct?.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid size={3}>
                    <RHFTextField
                      name={`orderDetails.${index}.quantity`}
                      label="Số lượng"
                      type="number"
                    />
                  </Grid>
                  <Grid size={1}>
                    <IconButton onClick={() => remove(index)} color="error">
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </React.Fragment>
            ))}
            <Grid size={12}>
              <Button onClick={handleAddProduct} variant="outlined">
                Thêm sản phẩm
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang tạo..." : "Cập nhật đơn hàng"}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default UpdateOrder;
