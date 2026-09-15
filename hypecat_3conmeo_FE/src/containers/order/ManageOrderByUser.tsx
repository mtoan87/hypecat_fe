import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Divider,
  Stack,
  Paper,
  Tabs,
  Tab,
  Grid,
  Chip,
  Avatar,
  Container,
  Badge,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Skeleton,
  Fade,
} from "@mui/material";
import {
  ShoppingBag,
  Receipt,
  LocalShipping,
  CheckCircle,
  Cancel,
  Schedule,
  Payment,
  Refresh,
} from "@mui/icons-material";
import {
  OrderStatusLabelMap,
  type OrderStatusType,
} from "../../enum/OrderStatus";
import orderApi from "../../api/services/OrderApi/orderAPI";

type Product = { id: number; name: string };

type OrderDetail = {
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: Product;
};

type Order = {
  id: number;
  orderAmount: number;
  orderDate: string;
  orderStatus: OrderStatusType;
  orderDetails: OrderDetail[];
};

// Skeleton Components
const OrderSkeletonCard: React.FC = () => {
  const theme = useTheme();
  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
      }}
    >
      {/* Status Header Skeleton */}
      <Box sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Skeleton variant="text" width={150} height={32} />
            <Skeleton
              variant="rectangular"
              width={100}
              height={24}
              sx={{ borderRadius: 2 }}
            />
          </Box>
          <Box textAlign="right">
            <Skeleton variant="text" width={80} height={20} />
            <Skeleton variant="text" width={100} height={24} />
          </Box>
        </Box>
      </Box>

      {/* Order Content Skeleton */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={2}>
          {/* Order Details Skeleton */}
          {[1, 2].map((index) => (
            <Card
              key={index}
              variant="outlined"
              sx={{
                p: 2.5,
                bgcolor: alpha(theme.palette.grey[50], 0.5),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.grey[200], 0.8)}`,
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box>
                      <Skeleton variant="text" width={200} height={24} />
                      <Skeleton variant="text" width={80} height={20} />
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4, md: 2 }}>
                  <Box textAlign="center">
                    <Skeleton
                      variant="text"
                      width={60}
                      height={20}
                      sx={{ mx: "auto" }}
                    />
                    <Skeleton
                      variant="text"
                      width={40}
                      height={32}
                      sx={{ mx: "auto" }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 4, md: 3 }}>
                  <Box textAlign="center">
                    <Skeleton
                      variant="text"
                      width={60}
                      height={20}
                      sx={{ mx: "auto" }}
                    />
                    <Skeleton
                      variant="text"
                      width={80}
                      height={24}
                      sx={{ mx: "auto" }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 4, md: 3 }}>
                  <Box textAlign="center">
                    <Skeleton
                      variant="text"
                      width={80}
                      height={20}
                      sx={{ mx: "auto" }}
                    />
                    <Skeleton
                      variant="text"
                      width={100}
                      height={32}
                      sx={{ mx: "auto" }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Stack>

        {/* Total Skeleton */}
        <Divider sx={{ my: 3 }} />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            p: 2,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Skeleton variant="text" width={100} height={32} />
          <Skeleton variant="text" width={150} height={40} />
        </Box>
      </Box>
    </Paper>
  );
};

const TabsSkeleton: React.FC = () => (
  <Paper elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
    <Box sx={{ p: 2 }}>
      <Stack direction="row" spacing={3}>
        {[1, 2, 3, 4, 5].map((index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={120}
            height={48}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Stack>
    </Box>
  </Paper>
);

const ManageOrderByUser: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"All" | OrderStatusType>("All");
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  const fetchOrders = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      const res = await orderApi.getOrderByUser();
      setOrders(res);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChangeTab = (
    _event: React.SyntheticEvent,
    newValue: "All" | OrderStatusType
  ) => {
    setTab(newValue);
  };

  const handleRefresh = () => {
    fetchOrders(true);
  };

  const filteredOrders = (
    tab === "All" ? orders : orders.filter((order) => order.orderStatus === tab)
  ).sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  );

  // Status configuration
  const getStatusConfig = (status: OrderStatusType) => {
    const configs: Record<
      OrderStatusType,
      {
        color: "warning" | "info" | "primary" | "success" | "error";
        icon: React.ReactElement;
        bgColor: string;
      }
    > = {
      PENDING: {
        color: "warning",
        icon: <Schedule fontSize="small" />,
        bgColor: alpha(theme.palette.warning.main, 0.1),
      },
      PROCESSING: {
        color: "info",
        icon: <Payment fontSize="small" />,
        bgColor: alpha(theme.palette.info.main, 0.1),
      },
      SHIPPED: {
        color: "primary",
        icon: <LocalShipping fontSize="small" />,
        bgColor: alpha(theme.palette.primary.main, 0.1),
      },
      DELIVERED: {
        color: "success",
        icon: <CheckCircle fontSize="small" />,
        bgColor: alpha(theme.palette.success.main, 0.1),
      },
      CANCELLED: {
        color: "error",
        icon: <Cancel fontSize="small" />,
        bgColor: alpha(theme.palette.error.main, 0.1),
      },
    };
    return configs[status as OrderStatusType] || configs.PENDING;
  };

  const getOrderCount = (status: "All" | OrderStatusType) => {
    return status === "All"
      ? orders.length
      : orders.filter((order) => order.orderStatus === status).length;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header Skeleton */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box>
              <Skeleton variant="text" width={200} height={32} />
              <Skeleton variant="text" width={300} height={20} />
            </Box>
          </Box>
          <Skeleton variant="circular" width={48} height={48} />
        </Box>

        {/* Tabs Skeleton */}
        <TabsSkeleton />

        {/* Orders List Skeleton */}
        <Stack spacing={3}>
          {[1, 2, 3].map((index) => (
            <Fade key={index} in={true} timeout={300 * index}>
              <div>
                <OrderSkeletonCard />
              </div>
            </Fade>
          ))}
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Fade in={true} timeout={600}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <ShoppingBag />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Quản lý đơn hàng
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Theo dõi và quản lý tất cả đơn hàng của bạn
              </Typography>
            </Box>
          </Box>
          <Tooltip title="Làm mới">
            <IconButton
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.2) },
              }}
            >
              <Refresh
                sx={{
                  animation: refreshing ? "spin 1s linear infinite" : "none",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>
      </Fade>

      {/* Enhanced Tabs */}
      <Fade in={true} timeout={800}>
        <Paper elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
          <Tabs
            value={tab}
            onChange={handleChangeTab}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
                minHeight: 64,
              },
            }}
          >
            <Tab
              label={
                <Badge
                  badgeContent={getOrderCount("All")}
                  color="primary"
                  max={999}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Receipt fontSize="small" />
                    Tất cả
                  </Box>
                </Badge>
              }
              value="All"
            />
            {Object.entries(OrderStatusLabelMap).map(([value, label]) => {
              const count = getOrderCount(value as OrderStatusType);
              const config = getStatusConfig(value as OrderStatusType);
              return (
                <Tab
                  key={value}
                  label={
                    <Badge badgeContent={count} color={config.color} max={999}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {config.icon}
                        {label}
                      </Box>
                    </Badge>
                  }
                  value={value as OrderStatusType}
                />
              );
            })}
          </Tabs>
        </Paper>
      </Fade>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Fade in={true} timeout={1000}>
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              bgcolor: alpha(theme.palette.grey[100], 0.5),
              borderRadius: 3,
            }}
          >
            <ShoppingBag
              sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Không có đơn hàng nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tab === "All"
                ? "Bạn chưa có đơn hàng nào."
                : `Không có đơn hàng nào ở trạng thái ${
                    OrderStatusLabelMap[tab as OrderStatusType]
                  }.`}
            </Typography>
          </Paper>
        </Fade>
      ) : (
        <Stack spacing={3}>
          {filteredOrders.map((order, index) => {
            const statusConfig = getStatusConfig(order.orderStatus);
            return (
              <Fade key={order.id} in={true} timeout={300 * (index + 1)}>
                <Paper
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      elevation: 4,
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  {/* Status Header */}
                  <Box
                    sx={{
                      bgcolor: statusConfig.bgColor,
                      p: 2,
                      borderBottom: `1px solid ${alpha(
                        theme.palette.grey[300],
                        0.3
                      )}`,
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="h6" fontWeight="bold">
                          Đơn hàng #{order.id}
                        </Typography>
                        <Chip
                          icon={statusConfig.icon}
                          label={OrderStatusLabelMap[order.orderStatus]}
                          color={statusConfig.color}
                          size="small"
                          variant="filled"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="body2" color="text.secondary">
                          Ngày đặt
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {new Date(order.orderDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Order Content */}
                  <Box sx={{ p: 3 }}>
                    {/* Order Details */}
                    <Stack spacing={2}>
                      {order.orderDetails.map((detail, detailIndex) => (
                        <Card
                          key={detailIndex}
                          variant="outlined"
                          sx={{
                            p: 2.5,
                            bgcolor: alpha(theme.palette.grey[50], 0.5),
                            borderRadius: 2,
                            border: `1px solid ${alpha(
                              theme.palette.grey[200],
                              0.8
                            )}`,
                          }}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12, md: 4 }}>
                              <Box display="flex" alignItems="center" gap={2}>
                                <Avatar
                                  sx={{
                                    bgcolor: alpha(
                                      theme.palette.primary.main,
                                      0.1
                                    ),
                                    color: "primary.main",
                                    width: 40,
                                    height: 40,
                                  }}
                                >
                                  <ShoppingBag fontSize="small" />
                                </Avatar>
                                <Box>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="medium"
                                  >
                                    {detail.product.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    ID: {detail.productId}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 4, md: 2 }}>
                              <Box textAlign="center">
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Số lượng
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                  {detail.quantity}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 4, md: 3 }}>
                              <Box textAlign="center">
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Đơn giá
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {detail.unitPrice.toLocaleString()}₫
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 4, md: 3 }}>
                              <Box textAlign="center">
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Thành tiền
                                </Typography>
                                <Typography
                                  variant="h6"
                                  fontWeight="bold"
                                  color="primary"
                                >
                                  {detail.totalPrice.toLocaleString()}₫
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Card>
                      ))}
                    </Stack>

                    {/* Total */}
                    <Divider sx={{ my: 3 }} />
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                      }}
                    >
                      <Typography variant="h6" fontWeight="medium">
                        Tổng cộng
                      </Typography>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="primary"
                      >
                        {order.orderAmount.toLocaleString()}₫
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Fade>
            );
          })}
        </Stack>
      )}
    </Container>
  );
};

export default ManageOrderByUser;
