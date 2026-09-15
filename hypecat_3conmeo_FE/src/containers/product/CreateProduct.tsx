/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
  Stack,
  TextField,
  Autocomplete,
} from "@mui/material";
import { toast } from "react-toastify";
import type { Category } from "../../types/CategoryType";
import type { CreateProductFormInput, Product } from "../../types/ProductType";
import { uploadImageToFirebase } from "../../firebase/uploadImageToFirebase";
import categoryApi from "../../api/services/CategoryApi/categoryAPI";
import productApi from "../../api/services/ProductApi/productAPI";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFTextFieldNumber,
  RHFUploadMultiFile,
  RHFUploadSingleFile,
} from "../../components/hook-form";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Tên sản phẩm là bắt buộc"),
  categoryId: Yup.number().required("Loại sản phẩm là bắt buộc"),
  packsPerUnit: Yup.number()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        const normalized = originalValue.replace(/,/g, "");
        return parseFloat(normalized);
      }
      return value;
    })
    .typeError("Phải là số")
    .required("Số gói mỗi đơn vị là bắt buộc"),
  language: Yup.string().required("Ngôn ngữ là bắt buộc"),
  description: Yup.string().required("Mô tả sản phẩm là bắt buộc"),
  status: Yup.string().required("Trạng thái là bắt buộc"),
  cover: Yup.string().required("Ảnh sản phẩm là bắt buộc"),
  productImages: Yup.array()
    .min(1, "Ảnh sản phẩm là bắt buộc")
    .required("Ảnh sản phẩm là bắt buộc"),
});

const CreateProduct = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [boxID, setBoxID] = React.useState<Product[]>([]);
  const [selectedBoxID, setSelectedBoxID] = React.useState<string | null>(null);

  const methods = useForm<CreateProductFormInput>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      categoryId: 0,
      packsPerUnit: 0,
      language: "Tiếng Nhật",
      description: "",
      status: "Available",
      productImages: [],
      cover: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    watch,
  } = methods;

  const values = watch();
  // Get categories
  React.useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await categoryApi.getCategoryActive();
        setCategories(res.items);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách loại sản phẩm:", error);
        toast.error("Không thể tải danh sách loại sản phẩm");
      }
    };

    const getProducts = async () => {
      try {
        const res: any = await productApi.getProductList({
          pageIndex: 0,
          pageSize: 1000,
        });
        setBoxID(res.items);
      } catch (error) {
        toast.error("Lấy sản phẩm thất bại");
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    Promise.allSettled([getCategories(), getProducts()]);
  }, []);

  const onSubmit = async (data: CreateProductFormInput) => {
    try {
      const productData = {
        ...data,
        boxId: selectedBoxID,
      };
      await productApi.CreateProduct(productData);
      toast.success("Tạo sản phẩm thành công!");
      // Reset form after successful submission
      methods.reset();
    } catch (error) {
      toast.error("Tạo sản phẩm thất bại");
      console.error("Tạo sản phẩm thất bại:", error);
    }
  };

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      try {
        const coverImage = await uploadImageToFirebase(file);
        if (typeof coverImage === "string") {
          setValue("cover", coverImage, { shouldValidate: true });
          toast.success("Tải ảnh lên thành công!");
        }
      } catch (error) {
        toast.error("Tải ảnh lên thất bại");
        console.error("Upload error:", error);
      }
    },
    [setValue]
  );

  const handleGoBack = () => {
    // Add your navigation logic here
    window.history.back();
  };

  const handleDropImage = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (acceptedFiles: any) => {
      const images = values.productImages || [];

      const uploadedImages = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        acceptedFiles.map(async (file: any) => {
          const downloadURL = await uploadImageToFirebase(file);
          return downloadURL;
        })
      );

      setValue("productImages", [...images, ...uploadedImages]);
    },
    [setValue, values.productImages]
  );

  const handleRemoveAll = () => {
    setValue("productImages", []);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = values.productImages?.filter(
      (_file) => _file !== file
    );
    setValue("productImages", filteredItems);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Tạo Sản Phẩm Mới
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Điền thông tin chi tiết để tạo sản phẩm mới trong hệ thống
        </Typography>
      </Box>

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          overflow: "visible",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Basic Information Section */}
              <Grid size={{ mobile: 12 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    📋 Thông tin cơ bản
                  </Typography>
                  <Divider />
                </Box>
              </Grid>

              <Grid size={{ mobile: 12, laptop: 6 }}>
                <RHFTextField
                  name="name"
                  label="Tên sản phẩm"
                  placeholder="Nhập tên sản phẩm"
                  fullWidth
                />
              </Grid>

              <Grid size={{ mobile: 12, laptop: 6 }}>
                <RHFSelect name="categoryId" label="Loại sản phẩm" fullWidth>
                  <option value={0}>Chọn loại sản phẩm</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </RHFSelect>
              </Grid>

              <Grid size={{ mobile: 12 }}>
                <RHFTextField
                  name="description"
                  label="Mô tả sản phẩm"
                  placeholder="Nhập mô tả chi tiết về sản phẩm"
                  multiline
                  rows={4}
                  fullWidth
                />
              </Grid>

              {/* Product Specifications Section */}
              <Grid size={{ mobile: 12 }}>
                <Box sx={{ my: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    📦 Thông số kỹ thuật
                  </Typography>
                  <Divider />
                </Box>
              </Grid>

              <Grid size={{ mobile: 12, laptop: 6 }}>
                <Autocomplete
                  renderInput={(params) => (
                    <TextField {...params} label="ID Thùng (không bắt buộc)" />
                  )}
                  options={boxID}
                  getOptionLabel={(option: Product) => option.name}
                  onChange={(_event, value) => {
                    setSelectedBoxID(value ? value.id : null);
                  }}
                />
              </Grid>

              <Grid size={{ mobile: 12, laptop: 6 }}>
                <RHFTextFieldNumber
                  name="packsPerUnit"
                  label="Số gói/đơn vị"
                  placeholder="Nhập số gói mỗi đơn vị"
                  fullWidth
                />
              </Grid>

              {/* Settings Section */}
              <Grid size={{ mobile: 12 }}>
                <Box sx={{ my: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    ⚙️ Cài đặt
                  </Typography>
                  <Divider />D
                </Box>
              </Grid>

              <Grid size={{ mobile: 12, laptop: 6 }}>
                <RHFSelect name="language" label="Ngôn ngữ" fullWidth>
                  <option value="Tiếng Nhật">Tiếng Nhật</option>
                  <option value="Tiếng Anh">Tiếng Anh</option>
                  <option value="Tiếng Trung">Tiếng Trung</option>
                </RHFSelect>
              </Grid>

              {/* Image Upload Section */}
              <Grid size={{ mobile: 12 }}>
                <Box sx={{ my: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    🖼️ Hình ảnh đại diện
                  </Typography>
                  <Divider />
                </Box>
              </Grid>

              <Grid size={{ mobile: 12 }}>
                <RHFUploadSingleFile
                  name="cover"
                  label="Ảnh sản phẩm"
                  onDrop={handleDrop}
                />
              </Grid>

              <Grid size={{ mobile: 12 }}>
                <Box sx={{ my: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    🖼️ Các hình ảnh khác của sản phẩm
                  </Typography>
                  <Divider />
                </Box>
              </Grid>

              <Grid size={{ mobile: 12 }}>
                <RHFUploadMultiFile
                  name="productImages"
                  showPreview
                  label="Ảnh sản phẩm"
                  onDrop={handleDropImage}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="flex-end"
                alignItems="center"
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleGoBack}
                  sx={{
                    minWidth: 120,
                    height: 48,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    order: { xs: 2, sm: 1 },
                  }}
                >
                  Quay lại
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    minWidth: 160,
                    height: 48,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    background:
                      "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)",
                      boxShadow: "0 6px 16px rgba(33, 150, 243, 0.4)",
                    },
                    "&:disabled": {
                      background: "rgba(0, 0, 0, 0.12)",
                      boxShadow: "none",
                    },
                    order: { xs: 1, sm: 2 },
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Box
                        component="span"
                        sx={{
                          width: 16,
                          height: 16,
                          border: "2px solid",
                          borderColor: "currentColor",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                          mr: 1,
                          "@keyframes spin": {
                            "0%": { transform: "rotate(0deg)" },
                            "100%": { transform: "rotate(360deg)" },
                          },
                        }}
                      />
                      Đang tạo...
                    </>
                  ) : (
                    "✨ Tạo sản phẩm"
                  )}
                </Button>
              </Stack>
            </Box>
          </FormProvider>
        </CardContent>
      </Card>

      {/* Status Chips */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          flexWrap="wrap"
        >
          <Chip
            label="Tự động lưu"
            color="success"
            variant="outlined"
            size="small"
            sx={{ borderRadius: 2 }}
          />
          <Chip
            label="Validation thời gian thực"
            color="info"
            variant="outlined"
            size="small"
            sx={{ borderRadius: 2 }}
          />
          <Chip
            label="Upload ảnh an toàn"
            color="warning"
            variant="outlined"
            size="small"
            sx={{ borderRadius: 2 }}
          />
        </Stack>
      </Box>
    </Container>
  );
};

export default CreateProduct;
