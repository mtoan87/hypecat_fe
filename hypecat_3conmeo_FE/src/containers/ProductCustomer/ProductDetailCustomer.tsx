/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Chip,
  Box,
  Button,
  IconButton,
  Divider,
  Paper,
  Stack,
  TextField,
  Alert,
  Snackbar,
  Fade,
  Skeleton,
} from "@mui/material";
import {
  Add,
  Remove,
  ShoppingCart,
  LocalShipping,
  Security,
  Phone,
  ArrowBack,
  CheckCircle,
} from "@mui/icons-material";
import productApi from "../../api/services/ProductApi/productAPI";
import { formatMoney } from "../../utils/fn";
import { useAuthContext } from "../../hooks/useAuth";
import config from "../../configs";
import cartApi from "../../api/services/CartApi/cartAPI";

interface Category {
  id: number;
  name: string;
}

interface Image {
  id: number;
  urlPath: string;
}

interface BatchDetail {
  id: number;
  sellingPrice: number;
  remainingQuantity: number;
}

interface Product {
  id: number;
  name: string;
  packsPerUnit: number;
  language: string;
  description: string;
  status: string;
  cover: string;
  category: Category;
  images: Image[];
  batchDetails: BatchDetail[];
}

const CustomerProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const { auth } = useAuthContext();
  const location = useLocation();

  const productRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID not found");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const productData: any = await productApi.getProductCustomerById(id);
        setProduct(productData);
        setSelectedImage(productData.cover);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!loading && productRef.current) {
      productRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [loading]);

  const cartService = {
    addToCart: async (productId: number, quantity: number) => {
      if (!auth) {
        navigate(config.authRoutes.authenticate);
        localStorage.setItem("redirectAfterLogin", location.pathname);
        return;
      } else {
        const response: any = await cartApi.CreateCartItem({
          productId,
          quantity,
        });

        setSnackbar({
          open: true,
          message: response.message || "Thêm vào giỏ hàng thành công",
        });
      }
    },
  };

  const handleQuantityChange = (action: "increase" | "decrease") => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      cartService.addToCart(product.id, quantity);
      setQuantity(1); // Reset quantity after adding to cart
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          py: 15,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ mobile: 12, tablet: 6, laptop: 6 }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={500}
                sx={{ borderRadius: 2 }}
              />
              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    width={80}
                    height={80}
                    sx={{ borderRadius: 1 }}
                  />
                ))}
              </Box>
            </Grid>
            <Grid size={{ mobile: 12, tablet: 6, laptop: 6 }}>
              <Skeleton variant="text" width="70%" height={60} />
              <Skeleton variant="text" width="40%" height={40} sx={{ mt: 2 }} />
              <Skeleton variant="text" width="30%" height={50} sx={{ mt: 2 }} />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={200}
                sx={{ mt: 3, borderRadius: 2 }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          py: 15,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Card sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error || "Không tìm thấy sản phẩm"}
            </Alert>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/products")}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              }}
            >
              Quay lại danh sách sản phẩm
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  const allImages = [
    product.cover,
    ...product.images.map((img) => img.urlPath),
  ];
  const currentPrice = product.batchDetails[0]?.sellingPrice || 0;
  const totalPrice = currentPrice * quantity;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 12,
        scrollMarginTop: "170px",
      }}
      ref={productRef}
      component="div"
    >
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            {/* Back Button */}
            <Grid container spacing={4}>
              {/* Image Section */}
              <Grid size={{ mobile: 12, tablet: 6, laptop: 6 }}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      height: { xs: 350, md: 500 },
                      objectFit: "contain",
                      cursor: "pointer",

                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                    image={selectedImage}
                    alt={product.name}
                  />
                </Card>

                {/* Thumbnail Images */}
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {allImages.map((image, index) => (
                    <Card
                      key={index}
                      elevation={selectedImage === image ? 8 : 2}
                      sx={{
                        cursor: "pointer",
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        transform:
                          selectedImage === image ? "scale(1.1)" : "scale(1)",
                        border: selectedImage === image ? 3 : 0,
                        borderColor: "primary.main",
                        "&:hover": {
                          transform: "scale(1.05)",
                          elevation: 6,
                        },
                      }}
                      onClick={() => setSelectedImage(image)}
                    >
                      <CardMedia
                        component="img"
                        sx={{ width: 80, height: 80, objectFit: "cover" }}
                        image={image}
                        alt={`${product.name} ${index + 1}`}
                      />
                    </Card>
                  ))}
                </Box>
              </Grid>

              {/* Product Info Section */}
              <Grid size={{ mobile: 12, tablet: 6, laptop: 6 }}>
                <Card
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    height: "fit-content",
                  }}
                >
                  {/* Header */}
                  <Box sx={{ mb: 3 }}>
                    <Stack
                      display="flex"
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                          fontWeight: 700,
                          background:
                            "linear-gradient(45deg, #1976d2, #42a5f5)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          mb: 2,
                        }}
                      >
                        {product.name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 3,
                        }}
                      >
                        <Chip
                          icon={<CheckCircle />}
                          label={
                            product.status === "Available"
                              ? "Còn hàng"
                              : "Hết hàng"
                          }
                          color={
                            product.status === "Available" ? "success" : "error"
                          }
                          variant="filled"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            borderRadius: 2,
                          }}
                        />
                      </Box>
                    </Stack>

                    {/* Price */}
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        color: "black",
                        mb: 3,
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        {formatMoney(currentPrice)}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Giá đã bao gồm VAT • Miễn phí vận chuyển •{" "}
                        <strong>Giá có thể thay đổi tùy theo lô hàng</strong>
                      </Typography>
                    </Box>
                  </Box>

                  {/* Product Details */}
                  <Stack spacing={3} sx={{ mb: 4 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Mô tả sản phẩm
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ lineHeight: 1.7 }}
                      >
                        {product.description}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 3 }} />

                  {/* Quantity and Actions */}
                  <Box sx={{ mb: 4 }}>
                    <Stack display="flex" direction="row" spacing={2} mb={2}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Số lượng
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 400, mb: 2 }}>
                        hiện có {product.batchDetails[0].remainingQuantity}
                      </Typography>
                    </Stack>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          border: "2px solid",
                          borderColor: "primary.main",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <IconButton
                          onClick={() => handleQuantityChange("decrease")}
                          disabled={quantity <= 1}
                          sx={{
                            color: "primary.main",
                            "&:hover": { backgroundColor: "primary.50" },
                          }}
                        >
                          <Remove />
                        </IconButton>
                        <TextField
                          value={quantity}
                          size="small"
                          sx={{
                            width: 100,
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { border: "none" },
                              height: 48,
                              fontWeight: 600,
                              fontSize: "1.1rem",
                            },
                          }}
                          onChange={(e) => {
                            const max =
                              product.batchDetails[0].remainingQuantity;
                            let value: number = parseInt(e.target.value) || 1;
                            if (value > max) value = max;
                            setQuantity(Math.max(1, value));
                          }}
                          slotProps={{
                            input: {
                              inputProps: {
                                min: 1,
                                max: product.batchDetails[0].remainingQuantity,
                                style: { textAlign: "center" },
                              },
                            },
                          }}
                        />
                        <IconButton
                          onClick={() => handleQuantityChange("increase")}
                          sx={{
                            color: "primary.main",
                            "&:hover": { backgroundColor: "primary.50" },
                          }}
                          disabled={
                            quantity >=
                            product.batchDetails[0].remainingQuantity
                          }
                        >
                          <Add />
                        </IconButton>
                      </Box>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        = {product.packsPerUnit * quantity} gói
                      </Typography>
                    </Box>

                    {/* Total Price */}
                    <Paper
                      elevation={3}
                      sx={{
                        mb: 3,
                        p: 3,
                        borderRadius: 2,
                        background:
                          "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: "#d84315" }}
                      >
                        Tổng tiền: {formatMoney(totalPrice)}
                      </Typography>
                    </Paper>

                    {/* Action Buttons */}
                    <Stack spacing={3}>
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<ShoppingCart />}
                          onClick={handleAddToCart}
                          disabled={product.status !== "Available"}
                          sx={{
                            flex: 1,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            fontSize: "1rem",
                            background:
                              "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                            "&:hover": {
                              background:
                                "linear-gradient(45deg, #1976D2 30%, #1BA1E2 90%)",
                              transform: "translateY(-2px)",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          Thêm vào giỏ
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>

                  {/* Services */}
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
                    }}
                  >
                    <Stack spacing={2}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <LocalShipping
                          sx={{ color: "#2e7d32", fontSize: 24 }}
                        />
                        <Typography variant="body1" fontWeight={500}>
                          Miễn phí vận chuyển cho đơn hàng trên 500.000₫
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Security sx={{ color: "#2e7d32", fontSize: 24 }} />
                        <Typography variant="body1" fontWeight={500}>
                          Đảm bảo chất lượng - Đổi trả trong 7 ngày
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Phone sx={{ color: "#2e7d32", fontSize: 24 }} />
                        <Typography variant="body1" fontWeight={500}>
                          Hỗ trợ 24/7: 1900-xxxx
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Card>
              </Grid>
            </Grid>

            {/* Product Details Tabs */}
          </Box>
        </Fade>

        {/* Enhanced Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          sx={{
            "& .MuiSnackbarContent-root": {
              backgroundColor: "#4caf50",
              borderRadius: 2,
              fontWeight: 500,
            },
          }}
        />
      </Container>
    </Box>
  );
};

export default CustomerProductDetail;
