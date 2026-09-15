import React from "react";
import {
  Box,
  Button,
  Chip,
  Typography,
  Card,
  Grid,
  CardContent,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  Paper,
  useTheme,
  alpha,
  Fade,
  Slide,
  Container,
  useMediaQuery,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RestoreFromTrashOutlinedIcon from "@mui/icons-material/RestoreFromTrashOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import ProductImageGallery from "./ProductImages";
import LogTable from "./LogTable";
import { toast } from "react-toastify";
import DeleteProduct from "./popup/DeleteProduct";
import BatchProductTable from "./BatchProductTable";
import type { Product } from "../../types/ProductType";
import productApi from "../../api/services/ProductApi/productAPI";
import config from "../../configs";
import { useNavigate } from "react-router-dom";

type DetailProductProps = {
  id: string;
};

const DetailProduct: React.FC<DetailProductProps> = ({ id }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [product, setProduct] = React.useState<Product | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const navigate = useNavigate();

  const statusMap: Record<
    string,
    {
      label: string;
      color: "success" | "error" | "warning" | "info" | "default";
      bgColor: string;
      textColor: string;
    }
  > = {
    Available: {
      label: "Còn hàng",
      color: "success",
      bgColor: alpha(theme.palette.success.main, 0.1),
      textColor: theme.palette.success.dark,
    },
    OutOfStock: {
      label: "Hết hàng",
      color: "error",
      bgColor: alpha(theme.palette.error.main, 0.1),
      textColor: theme.palette.error.dark,
    },
    Incoming: {
      label: "Hàng về",
      color: "info",
      bgColor: alpha(theme.palette.info.main, 0.1),
      textColor: theme.palette.info.dark,
    },
    Discontinued: {
      label: "Ngừng",
      color: "default",
      bgColor: alpha(theme.palette.grey[500], 0.1),
      textColor: theme.palette.grey[700],
    },
    PendingApproval: {
      label: "Phê duyệt",
      color: "warning",
      bgColor: alpha(theme.palette.warning.main, 0.1),
      textColor: theme.palette.warning.dark,
    },
    Damaged: {
      label: "Hư hỏng",
      color: "error",
      bgColor: alpha(theme.palette.error.main, 0.1),
      textColor: theme.palette.error.dark,
    },
    Expired: {
      label: "Hết hạn",
      color: "error",
      bgColor: alpha(theme.palette.error.main, 0.1),
      textColor: theme.palette.error.dark,
    },
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data: Product = await productApi.getProductById(id);
      if (data) {
        setProduct(data);
      }
    } catch (error) {
      toast.error("Lấy thông tin sản phẩm thất bại");
      console.error("Lỗi khi lấy sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProduct();
  }, []);

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(!openDeleteDialog);
  };

  const handleGoBack = () => {
    navigate(config.adminRoutes.manageProduct);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        sx={{
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.light,
            0.05
          )} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: { xs: 2, sm: 3, md: 4 },
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: "blur(10px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
            maxWidth: { xs: "90%", sm: "400px" },
            width: "100%",
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <Box
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: "50%",
                background: `conic-gradient(${theme.palette.primary.main}, transparent)`,
                animation: "spin 1s linear infinite",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            />
            <Typography
              variant={isSmallScreen ? "body1" : "h6"}
              color="text.secondary"
              fontWeight={500}
              textAlign="center"
            >
              Đang tải thông tin sản phẩm...
            </Typography>
          </Stack>
        </Paper>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        px={{ xs: 2, sm: 3, md: 4 }}
      >
        <Typography
          variant={isSmallScreen ? "body1" : "h6"}
          color="error"
          textAlign="center"
        >
          Không tìm thấy sản phẩm
        </Typography>
      </Box>
    );
  }

  const StatusChip = ({ status }: { status: string }) => {
    const statusInfo = statusMap[status] || statusMap.Discontinued;
    return (
      <Chip
        label={statusInfo.label}
        size={isSmallScreen ? "small" : "medium"}
        sx={{
          backgroundColor: statusInfo.bgColor,
          color: statusInfo.textColor,
          fontWeight: 600,
          fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
          height: isSmallScreen ? 28 : 36,
          "& .MuiChip-label": {
            px: isSmallScreen ? 1 : 2,
          },
          border: `1px solid ${alpha(statusInfo.textColor, 0.2)}`,
        }}
      />
    );
  };

  const InfoCard = ({
    title,
    icon,
    children,
    color = "primary",
  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  }) => (
    <Fade in timeout={600}>
      <Card
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${alpha(
            theme.palette[color].light,
            0.05
          )} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
          backdropFilter: "blur(10px)",
          border: `1px solid ${alpha(theme.palette[color].main, 0.12)}`,
          borderRadius: { xs: 2, sm: 3 },
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: isMobile ? "none" : "translateY(-4px)",
            boxShadow: `0 ${isMobile ? 8 : 20}px ${
              isMobile ? 16 : 40
            }px ${alpha(theme.palette[color].main, 0.15)}`,
            border: `1px solid ${alpha(theme.palette[color].main, 0.25)}`,
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            mb={2}
            flexWrap={isSmallScreen ? "wrap" : "nowrap"}
          >
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette[color].main, 0.1),
                color: theme.palette[color].main,
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
              }}
            >
              {icon}
            </Avatar>
            <Typography
              variant={isSmallScreen ? "subtitle1" : "h6"}
              fontWeight={600}
              color="text.primary"
            >
              {title}
            </Typography>
          </Stack>
          {children}
        </CardContent>
      </Card>
    </Fade>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.light,
          0.02
        )} 0%, ${alpha(theme.palette.secondary.light, 0.02)} 100%)`,
      }}
    >
      {/* Enhanced Header */}
      <Paper
        elevation={0}
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3 },
          zIndex: 10,
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 } }}>
          <Slide direction="down" in timeout={400}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 2, sm: 3 }}
              flexWrap={isSmallScreen ? "wrap" : "nowrap"}
            >
              <Tooltip title="Quay lại" arrow>
                <IconButton
                  sx={{
                    background: `linear-gradient(135deg, ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                    color: theme.palette.primary.main,
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    "&:hover": {
                      background: `linear-gradient(135deg, ${alpha(
                        theme.palette.primary.main,
                        0.2
                      )} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
                      transform: isMobile ? "none" : "scale(1.05)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                  onClick={handleGoBack}
                >
                  <ArrowBackOutlinedIcon
                    fontSize={isSmallScreen ? "small" : "medium"}
                  />
                </IconButton>
              </Tooltip>

              <Box flex={1} minWidth={0}>
                <Typography
                  variant={isSmallScreen ? "h5" : isTablet ? "h4" : "h4"}
                  fontWeight={700}
                  color="text.primary"
                  sx={{
                    background: `linear-gradient(135deg, ${
                      theme.palette.text.primary
                    } 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    wordBreak: "break-word",
                    lineHeight: 1.2,
                  }}
                >
                  {product.name}
                </Typography>
                <Stack
                  direction={isSmallScreen ? "column" : "row"}
                  alignItems={isSmallScreen ? "flex-start" : "center"}
                  spacing={isSmallScreen ? 1 : 2}
                  mt={1}
                  flexWrap="wrap"
                >
                  <Typography
                    variant={isSmallScreen ? "caption" : "body2"}
                    color="text.secondary"
                  >
                    Mã sản phẩm: #{id} • Ngày tạo:{" "}
                    {new Date(product.createDate).toLocaleDateString("vi-VN")}
                  </Typography>
                  {!isSmallScreen && (
                    <Divider orientation="vertical" flexItem />
                  )}
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{ gap: 1 }}
                  >
                    <StatusChip status={product.status} />
                    <Chip
                      label={
                        product.isDeleted ? "Không hoạt động" : "Đang hoạt động"
                      }
                      color={product.isDeleted ? "error" : "success"}
                      variant="outlined"
                      size={isSmallScreen ? "small" : "small"}
                      sx={{ fontWeight: 500 }}
                    />
                  </Stack>
                </Stack>
              </Box>

              {!product.isDeleted && (
                <Tooltip title="Chỉnh sửa sản phẩm" arrow>
                  <Button
                    variant="contained"
                    startIcon={<EditOutlinedIcon />}
                    onClick={() => {
                      navigate(
                        config.adminRoutes.EditProductDetail.replace(
                          ":id",
                          product.id
                        )
                      );
                    }}
                    size={isSmallScreen ? "small" : "medium"}
                    sx={{
                      borderRadius: { xs: 2, sm: 3 },
                      px: { xs: 2, sm: 3 },
                      py: { xs: 1, sm: 1.5 },
                      fontSize: isSmallScreen ? "0.875rem" : "1rem",
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      boxShadow: `0 ${isSmallScreen ? 4 : 8}px ${
                        isSmallScreen ? 12 : 24
                      }px ${alpha(theme.palette.primary.main, 0.3)}`,
                      "&:hover": {
                        transform: isMobile ? "none" : "translateY(-2px)",
                        boxShadow: `0 ${isSmallScreen ? 6 : 12}px ${
                          isSmallScreen ? 16 : 32
                        }px ${alpha(theme.palette.primary.main, 0.4)}`,
                      },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      minWidth: { xs: "auto", sm: "120px" },
                    }}
                  >
                    {isSmallScreen ? "Sửa" : "Chỉnh sửa"}
                  </Button>
                </Tooltip>
              )}
            </Stack>
          </Slide>
        </Container>
      </Paper>

      {/* Enhanced Content */}
      <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 } }}>
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {/* Enhanced Images Section */}
            <Grid size={{ mobile: 12, laptop: 6 }}>
              <InfoCard
                title="Hình ảnh sản phẩm"
                icon={<InventoryOutlinedIcon />}
                color="info"
              >
                {product.images.length > 0 && product.cover ? (
                  <ProductImageGallery
                    images={product.images}
                    cover={product.cover}
                  />
                ) : (
                  <Box
                    sx={{
                      height: { xs: 250, sm: 300, md: 400 },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `linear-gradient(135deg, ${alpha(
                        theme.palette.grey[100],
                        0.5
                      )} 0%, ${alpha(theme.palette.grey[50], 0.8)} 100%)`,
                      borderRadius: { xs: 2, sm: 3 },
                      border: `2px dashed ${alpha(
                        theme.palette.grey[400],
                        0.3
                      )}`,
                    }}
                  >
                    <InventoryOutlinedIcon
                      sx={{
                        fontSize: { xs: 48, sm: 56, md: 64 },
                        color: alpha(theme.palette.grey[400], 0.6),
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant={isSmallScreen ? "body2" : "body1"}
                      color="text.secondary"
                      fontWeight={500}
                      textAlign="center"
                    >
                      Chưa có hình ảnh
                    </Typography>
                  </Box>
                )}
              </InfoCard>
            </Grid>

            {/* Enhanced Product Info */}
            <Grid size={{ mobile: 12, laptop: 6 }}>
              <Stack spacing={{ xs: 2, sm: 3 }}>
                {/* Category Info */}
                <InfoCard
                  title="Thông tin danh mục"
                  icon={<CategoryOutlinedIcon />}
                  color="secondary"
                >
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.secondary.main, 0.1),
                          color: theme.palette.secondary.main,
                          width: { xs: 28, sm: 32 },
                          height: { xs: 28, sm: 32 },
                        }}
                      >
                        <CategoryOutlinedIcon fontSize="small" />
                      </Avatar>
                      <Box flex={1} minWidth={0}>
                        <Typography
                          variant={isSmallScreen ? "caption" : "body2"}
                          color="text.secondary"
                        >
                          Danh mục sản phẩm
                        </Typography>
                        <Typography
                          variant={isSmallScreen ? "body2" : "h6"}
                          fontWeight={600}
                          color="text.primary"
                          sx={{ wordBreak: "break-word" }}
                        >
                          {product.category.name}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.secondary.main, 0.1),
                          color: theme.palette.secondary.main,
                          width: { xs: 28, sm: 32 },
                          height: { xs: 28, sm: 32 },
                        }}
                      >
                        <CategoryOutlinedIcon fontSize="small" />
                      </Avatar>
                      <Box flex={1} minWidth={0}>
                        <Typography
                          variant={isSmallScreen ? "caption" : "body2"}
                          color="text.secondary"
                        >
                          Ngôn ngữ sản phẩm
                        </Typography>
                        <Typography
                          variant={isSmallScreen ? "body2" : "h6"}
                          fontWeight={600}
                          color="text.primary"
                        >
                          {product.language}
                        </Typography>
                      </Box>
                    </Stack>

                    {product.packsPerUnit > 0 && (
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                            color: theme.palette.secondary.main,
                            width: { xs: 28, sm: 32 },
                            height: { xs: 28, sm: 32 },
                          }}
                        >
                          <CategoryOutlinedIcon fontSize="small" />
                        </Avatar>
                        <Box flex={1} minWidth={0}>
                          <Typography
                            variant={isSmallScreen ? "caption" : "body2"}
                            color="text.secondary"
                          >
                            Số lượng mỗi hộp
                          </Typography>
                          <Typography
                            variant={isSmallScreen ? "body2" : "h6"}
                            fontWeight={600}
                            color="text.primary"
                          >
                            {product.packsPerUnit}
                          </Typography>
                        </Box>
                      </Stack>
                    )}
                  </Stack>
                </InfoCard>

                {/* Enhanced Action Card */}
                <InfoCard
                  title="Hành động"
                  icon={<InfoOutlinedIcon />}
                  color={product.isDeleted ? "success" : "error"}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    size={isSmallScreen ? "medium" : "large"}
                    color={product.isDeleted ? "success" : "error"}
                    startIcon={
                      product.isDeleted ? (
                        <RestoreFromTrashOutlinedIcon />
                      ) : (
                        <DeleteOutlinedIcon />
                      )
                    }
                    onClick={() => setOpenDeleteDialog(true)}
                    sx={{
                      borderRadius: { xs: 2, sm: 3 },
                      py: { xs: 1.5, sm: 2 },
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      fontWeight: 600,
                      textTransform: "none",
                      boxShadow: `0 ${isSmallScreen ? 4 : 8}px ${
                        isSmallScreen ? 12 : 24
                      }px ${alpha(
                        product.isDeleted
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                        0.3
                      )}`,
                      "&:hover": {
                        transform: isMobile ? "none" : "translateY(-2px)",
                        boxShadow: `0 ${isSmallScreen ? 6 : 12}px ${
                          isSmallScreen ? 16 : 32
                        }px ${alpha(
                          product.isDeleted
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                          0.4
                        )}`,
                      },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {product.isDeleted
                      ? "Khôi phục sản phẩm"
                      : "Ngừng hoạt động"}
                  </Button>
                </InfoCard>
              </Stack>
            </Grid>
          </Grid>

          {/* Enhanced Batch Section */}
          {product.batchDetails && product.batchDetails.length > 0 && (
            <Fade in timeout={800}>
              <Box mt={{ xs: 4, sm: 5, md: 6 }}>
                <InfoCard
                  title="Thông tin lô hàng"
                  icon={<InventoryOutlinedIcon />}
                  color="info"
                >
                  <Box sx={{ overflowX: "auto" }}>
                    <BatchProductTable batchDetails={product.batchDetails} />
                  </Box>
                </InfoCard>
              </Box>
            </Fade>
          )}

          {/* Enhanced History Section */}
          {product.logs && product.logs.length > 0 && (
            <Fade in timeout={1000}>
              <Box mt={{ xs: 4, sm: 5, md: 6 }}>
                <InfoCard
                  title="Lịch sử thay đổi"
                  icon={<HistoryOutlinedIcon />}
                  color="secondary"
                >
                  <Box sx={{ overflowX: "auto" }}>
                    <LogTable logs={product.logs} />
                  </Box>
                </InfoCard>
              </Box>
            </Fade>
          )}
        </Box>
      </Container>

      {/* Dialogs */}
      {openDeleteDialog && (
        <DeleteProduct
          open={openDeleteDialog}
          handleClose={handleCloseDeleteDialog}
          product={product}
          fetchData={fetchProduct}
        />
      )}
    </Box>
  );
};

export default DetailProduct;
