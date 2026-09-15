/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Fade,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import type { EditProductFormInput } from "../../types/ProductType";
import { uploadImageToFirebase } from "../../firebase/uploadImageToFirebase";
import productApi from "../../api/services/ProductApi/productAPI";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFUploadMultiFile,
  RHFUploadSingleFile,
} from "../../components/hook-form";
import { useNavigate } from "react-router-dom";
import config from "../../configs";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Tên sản phẩm là bắt buộc"),
  categoryId: Yup.number()
    .typeError("Phải là số")
    .required("Danh mục sản phẩm là bắt buộc"),
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
  status: Yup.string().required("Trạng thái là bắt buộc"),
  language: Yup.string().required("Loại ngôn ngữ là bắt buộc"),
  cover: Yup.string().required("Ảnh sản phẩm là bắt buộc"),
  productImages: Yup.array()
    .min(1, "Ảnh sản phẩm là bắt buộc")
    .required("Ảnh sản phẩm là bắt buộc"),
});

const EditProduct = ({ id }: { id: string }) => {
  const navigate = useNavigate();
  const methods = useForm<EditProductFormInput>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      categoryId: 0,
      packsPerUnit: 0,
      status: "",
      productImages: [],
      language: "",
      cover: "",
    },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, isDirty },
  } = methods;

  const values = watch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productApi.getProductById(id);
        console.log(data);
        reset({
          ...data,
          productImages: Array.isArray(data.images)
            ? data.images
                .map((img) => img?.urlPath)
                .filter((url) => typeof url === "string" && url)
            : [],
        });
      } catch (error) {
        toast.error("Lấy thông tin sản phẩm thất bại");
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    if (id) fetchProduct();
  }, [id, reset]);

  const onSubmit = async (data: EditProductFormInput) => {
    try {
      await productApi.UpdateProduct(id, data);
      toast.success("Cập nhật sản phẩm thành công");
    } catch (error) {
      toast.error("Cập nhật sản phẩm thất bại");
      console.error("Cập nhật sản phẩm thất bại:", error);
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

  const handleDropImage = useCallback(
    async (acceptedFiles: any) => {
      const images = values.productImages || [];

      const uploadedImages = await Promise.all(
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

  const handleGoBack = () => {
    navigate(config.adminRoutes.ManageProductDetail.replace(":id", id));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box>
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Tooltip title="Quay lại">
                <IconButton
                  sx={{
                    mr: 2,
                    backgroundColor: "background.paper",
                    boxShadow: 2,
                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "white",
                      transform: "translateX(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  onClick={handleGoBack}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background:
                      "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1,
                  }}
                >
                  Chỉnh sửa sản phẩm
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip
                    icon={<EditIcon />}
                    label={`ID: ${id}`}
                    variant="outlined"
                    color="primary"
                    size="small"
                  />
                  {isDirty && (
                    <Chip
                      label="Có thay đổi chưa lưu"
                      color="warning"
                      size="small"
                      sx={{
                        animation: "pulse 2s infinite",
                        "@keyframes pulse": {
                          "0%": { opacity: 1 },
                          "50%": { opacity: 0.7 },
                          "100%": { opacity: 1 },
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </Box>

          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Basic Information Card */}
              <Grid size={{ mobile: 12, desktop: 12 }}>
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: (theme) => theme.shadows[8],
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <EditIcon color="primary" />
                        Thông tin cơ bản
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                      <Grid size={{ mobile: 12 }}>
                        <RHFTextField
                          name="name"
                          label="Tên sản phẩm"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "primary.main",
                                },
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid size={{ mobile: 12, desktop: 6 }}>
                        <RHFTextField
                          name="packsPerUnit"
                          label="Số gói/đơn vị"
                          placeholder="Nhập số gói mỗi đơn vị"
                          fullWidth
                          type="number"
                          slotProps={{
                            htmlInput: {
                              min: 0,
                            },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              transition: "all 0.3s ease",
                            },
                          }}
                        />
                      </Grid>

                      <Grid size={{ mobile: 12, desktop: 6 }}>
                        <RHFSelect
                          name="language"
                          label="Ngôn ngữ"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        >
                          <option value="Tiếng Nhật">Tiếng Nhật</option>
                          <option value="Tiếng Anh">Tiếng Anh</option>
                          <option value="Tiếng Trung">Tiếng Trung</option>
                        </RHFSelect>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Image Upload Cards */}
              <Grid size={{ mobile: 12, desktop: 6 }}>
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: (theme) => theme.shadows[8],
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <CloudUploadIcon color="primary" />
                        Ảnh đại diện
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <RHFUploadSingleFile
                      name="cover"
                      label="Ảnh sản phẩm"
                      onDrop={handleDrop}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ mobile: 12, desktop: 6 }}>
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: (theme) => theme.shadows[8],
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <CloudUploadIcon color="secondary" />
                        Thư viện ảnh
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <RHFUploadMultiFile
                      name="productImages"
                      showPreview
                      label="Ảnh sản phẩm"
                      onDrop={handleDropImage}
                      onRemove={handleRemove}
                      onRemoveAll={handleRemoveAll}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ position: "relative", mt: 4 }}>
              {/* Background Decorative Elements */}
              <Box
                sx={{
                  position: "absolute",
                  top: -20,
                  left: -20,
                  right: -20,
                  bottom: -20,
                  background:
                    "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                  borderRadius: 4,
                  zIndex: -1,
                }}
              />

              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)",
                    zIndex: 0,
                  },
                }}
              >
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Box
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    justifyContent="flex-end"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    gap={3}
                  >
                    {/* Status Section */}
                    {/* <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        backgroundColor: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 2,
                        p: 2,
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: isDirty ? "#ff9800" : "#4caf50",
                          boxShadow: isDirty
                            ? "0 0 12px rgba(255, 152, 0, 0.6)"
                            : "0 0 12px rgba(76, 175, 80, 0.6)",
                          animation: isDirty ? "pulse 2s infinite" : "none",
                          "@keyframes pulse": {
                            "0%": {
                              boxShadow: isDirty
                                ? "0 0 12px rgba(255, 152, 0, 0.6)"
                                : "0 0 12px rgba(76, 175, 80, 0.6)",
                            },
                            "50%": {
                              boxShadow: isDirty
                                ? "0 0 20px rgba(255, 152, 0, 0.8)"
                                : "0 0 20px rgba(76, 175, 80, 0.8)",
                            },
                            "100%": {
                              boxShadow: isDirty
                                ? "0 0 12px rgba(255, 152, 0, 0.6)"
                                : "0 0 12px rgba(76, 175, 80, 0.6)",
                            },
                          },
                        }}
                      /> */}
                    {/* <Typography
                        variant="body2"
                        sx={{
                          color: "white",
                          fontWeight: 500,
                          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                        }}
                      >
                        {isDirty
                          ? "Có thay đổi chưa được lưu"
                          : "Tất cả đã được lưu"}
                      </Typography> */}
                    {/* </Box> */}

                    {/* Action Buttons */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        sx={{
                          borderColor: "rgba(255,255,255,0.7)",
                          color: "white",
                          flex: { xs: 1, sm: "none" },
                          borderRadius: 3,
                          py: 1.5,
                          px: 3,
                          fontWeight: 600,
                          textTransform: "none",
                          fontSize: "0.95rem",
                          backdropFilter: "blur(10px)",
                          backgroundColor: "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(255,255,255,0.3)",
                          "&:hover": {
                            borderColor: "white",
                            backgroundColor: "rgba(255,255,255,0.2)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                          },
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                        onClick={handleGoBack}
                      >
                        Quay lại
                      </Button>

                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={isSubmitting ? null : <SaveIcon />}
                        disabled={isSubmitting}
                        sx={{
                          background:
                            "linear-gradient(45deg, #ffffff 0%, #f8f9fa 100%)",
                          color: "#667eea",
                          flex: { xs: 1, sm: "none" },
                          borderRadius: 3,
                          py: 1.5,
                          px: 4,
                          fontWeight: 700,
                          textTransform: "none",
                          fontSize: "0.95rem",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                          border: "1px solid rgba(255,255,255,0.8)",
                          "&:hover": {
                            background:
                              "linear-gradient(45deg, #f8f9fa 0%, #e9ecef 100%)",
                            transform: "translateY(-3px)",
                            boxShadow: "0 12px 35px rgba(0,0,0,0.3)",
                          },
                          "&:disabled": {
                            background: "rgba(255,255,255,0.6)",
                            color: "rgba(102, 126, 234, 0.5)",
                            transform: "none",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                          },
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          position: "relative",
                          overflow: "hidden",
                          "&::before": isSubmitting
                            ? {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: "-100%",
                                width: "100%",
                                height: "100%",
                                background:
                                  "linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.2), transparent)",
                                animation: "shimmer 1.5s infinite",
                                "@keyframes shimmer": {
                                  "0%": { left: "-100%" },
                                  "100%": { left: "100%" },
                                },
                              }
                            : {},
                        }}
                      >
                        {isSubmitting ? "Đang cập nhật..." : "Lưu thay đổi"}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </FormProvider>
        </Box>
      </Fade>
    </Container>
  );
};

export default EditProduct;
