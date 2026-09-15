/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  Radio,
  Stack,
  Container,
  Fade,
  Paper,
  useTheme,
  alpha,
  Divider,
  Avatar,
  FormControlLabel,
  RadioGroup,
  Chip,
  Grid,
} from "@mui/material";
import {
  Payment,
  LocalAtm,
  Security,
  CheckCircle,
  TrendingUp,
  Discount,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../configs";
import { useForm } from "react-hook-form";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import orderApi from "../../api/services/OrderApi/orderAPI";
import { toast } from "react-toastify";
import { CartSummary } from "../cart/CartSummary";

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  isRecommended?: boolean;
  discount?: string;
  processingTime: string;
  features: string[];
}

interface FormValues {
  note: string;
}

const PaymentMethods: React.FC = () => {
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const addressId = location.state?.addressId;
  const subtotal = location.state?.subtotal;
  const itemCount = location.state?.itemCount;

  const methods = useForm<FormValues>({
    defaultValues: {
      note: "",
    },
  });

  const { getValues } = methods;

  const paymentMethods: PaymentMethod[] = [
    // {
    //     id: "vnpay",
    //     name: "VNPay",
    //     description: "Thanh toán qua ví điện tử VNPay",
    //     icon: Wallet,
    //     color: "#1976d2",
    //     isRecommended: true,
    //     discount: "Giảm 2%",
    //     processingTime: "Tức thì",
    //     features: ["Bảo mật cao", "Không phí giao dịch", "Hoàn tiền nhanh"]
    // },
    // {
    //     id: "momo",
    //     name: "MoMo",
    //     description: "Thanh toán bằng ví MoMo",
    //     icon: Payment,
    //     color: "#d32f2f",
    //     discount: "Giảm 1%",
    //     processingTime: "Tức thì",
    //     features: ["Ví điện tử phổ biến", "Tích điểm", "Khuyến mãi đặc biệt"]
    // },
    // {
    //     id: "banking",
    //     name: "Internet Banking",
    //     description: "Chuyển khoản qua ngân hàng",
    //     icon: AccountBalance,
    //     color: "#388e3c",
    //     processingTime: "1-3 phút",
    //     features: ["Hỗ trợ tất cả ngân hàng", "Bảo mật tuyệt đối", "Không giới hạn số tiền"]
    // },
    // {
    //     id: "credit_card",
    //     name: "Thẻ tín dụng/Ghi nợ",
    //     description: "Thanh toán bằng thẻ Visa, Master, JCB",
    //     icon: CreditCard,
    //     color: "#f57c00",
    //     processingTime: "Tức thì",
    //     features: ["Visa, Master, JCB", "Thanh toán quốc tế", "Bảo vệ giao dịch"]
    // },
    // {
    //     id: "qr_code",
    //     name: "Quét mã QR",
    //     description: "Quét mã QR để thanh toán",
    //     icon: QrCode2,
    //     color: "#7b1fa2",
    //     processingTime: "Tức thì",
    //     features: ["Đơn giản, tiện lợi", "Không cần nhập thông tin", "An toàn"]
    // },
    {
      id: "cod",
      name: "Thanh toán khi nhận hàng (COD)",
      description: "Trả tiền mặt khi nhận được hàng",
      icon: LocalAtm,
      color: "#795548",
      processingTime: "Khi giao hàng",
      features: [
        "Không cần thanh toán trước",
        "Kiểm tra hàng trước khi trả tiền",
        "Phí COD 15,000đ",
      ],
    },
  ];

  useEffect(() => {
    if (!addressId && !subtotal && !itemCount) {
      navigate(config.customerRoutes.cart, { replace: true });
    }
  }, [addressId, subtotal, itemCount, navigate]);

  useEffect(() => {
    // Set recommended payment method as default
    const recommended = paymentMethods.find((method) => method.isRecommended);
    if (recommended) {
      setSelectedPaymentId(recommended.id);
    }
  }, []);

  const handleContinue = async () => {
    if (!selectedPaymentId) return;
    setLoading(true);

    try {
      const { note } = getValues();

      const params = {
        addressId,
        paymentMethod: selectedPaymentId,
        note,
      };

      await orderApi.CreateOrderFromCart(params);
      toast.success("Đơn hàng của bạn đã được tạo thành công!");
      navigate(config.customerRoutes.order);
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      toast.error("Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const selectedMethod = paymentMethods.find(
    (method) => method.id === selectedPaymentId
  );

  return (
    <FormProvider methods={methods}>
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 7 }} sx={{ order: { xs: 2, md: 1 } }}>
                {/* Header */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    textAlign: "center",
                    background: `linear-gradient(135deg, ${alpha(
                      theme.palette.success.main,
                      0.1
                    )} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                    borderRadius: 2,
                  }}
                >
                  <Payment
                    sx={{
                      fontSize: 48,
                      color: "primary.main",
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="h4"
                    gutterBottom
                    fontWeight={700}
                    color="primary.main"
                  >
                    Chọn phương thức thanh toán
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Chọn cách thức thanh toán phù hợp với bạn
                  </Typography>
                </Paper>

                {/* Payment Methods */}
                <RadioGroup
                  value={selectedPaymentId}
                  onChange={(e) => setSelectedPaymentId(e.target.value)}
                >
                  <Stack spacing={2} sx={{ mb: 3 }}>
                    {paymentMethods.map((method, index) => (
                      <Fade
                        in={true}
                        timeout={300}
                        style={{ transitionDelay: `${index * 100}ms` }}
                        key={method.id}
                      >
                        <Card
                          sx={{
                            p: 0,
                            border: 2,
                            borderColor:
                              selectedPaymentId === method.id
                                ? "primary.main"
                                : alpha(theme.palette.divider, 0.12),
                            borderRadius: 2,
                            boxShadow:
                              selectedPaymentId === method.id
                                ? `0 8px 24px ${alpha(
                                    theme.palette.primary.main,
                                    0.15
                                  )}`
                                : theme.shadows[1],
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            cursor: "pointer",
                            position: "relative",
                            overflow: "visible",
                            "&:hover": {
                              boxShadow:
                                selectedPaymentId === method.id
                                  ? `0 12px 32px ${alpha(
                                      theme.palette.primary.main,
                                      0.2
                                    )}`
                                  : theme.shadows[4],
                              transform: "translateY(-2px)",
                            },
                          }}
                          onClick={() => setSelectedPaymentId(method.id)}
                        >
                          {/* Selection indicator */}
                          {selectedPaymentId === method.id && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: -8,
                                right: 16,
                                bgcolor: "primary.main",
                                borderRadius: "50%",
                                p: 0.5,
                                zIndex: 1,
                              }}
                            >
                              <CheckCircle
                                sx={{ color: "white", fontSize: 20 }}
                              />
                            </Box>
                          )}

                          {/* Recommended badge */}
                          {method.isRecommended && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: -8,
                                left: 16,
                                bgcolor: "success.main",
                                color: "white",
                                px: 2,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                zIndex: 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <TrendingUp sx={{ fontSize: 14 }} />
                              Đề xuất
                            </Box>
                          )}

                          <Box sx={{ p: 3 }}>
                            <Box display="flex" alignItems="flex-start">
                              <FormControlLabel
                                value={method.id}
                                control={<Radio sx={{ mt: -0.5 }} />}
                                label=""
                                sx={{ mr: 2, mt: 0 }}
                              />

                              {/* Method icon */}
                              <Avatar
                                sx={{
                                  bgcolor: alpha(method.color, 0.1),
                                  color: method.color,
                                  width: 56,
                                  height: 56,
                                  mr: 2,
                                }}
                              >
                                <method.icon sx={{ fontSize: 28 }} />
                              </Avatar>

                              <Stack flexGrow={1} spacing={1}>
                                {/* Method name and badges */}
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  gap={1}
                                  flexWrap="wrap"
                                >
                                  <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    color="text.primary"
                                  >
                                    {method.name}
                                  </Typography>
                                  {method.discount && (
                                    <Chip
                                      icon={<Discount sx={{ fontSize: 14 }} />}
                                      label={method.discount}
                                      color="error"
                                      size="small"
                                      sx={{
                                        fontWeight: 600,
                                        fontSize: "0.75rem",
                                      }}
                                    />
                                  )}
                                </Box>

                                {/* Description */}
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 1 }}
                                >
                                  {method.description}
                                </Typography>

                                {/* Processing time */}
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Security
                                    sx={{ fontSize: 16, color: "success.main" }}
                                  />
                                  <Typography
                                    variant="caption"
                                    color="success.main"
                                    fontWeight={600}
                                  >
                                    Xử lý: {method.processingTime}
                                  </Typography>
                                </Box>

                                {/* Features */}
                                <Box
                                  display="flex"
                                  flexWrap="wrap"
                                  gap={0.5}
                                  sx={{ mt: 1 }}
                                >
                                  {method.features.map((feature, idx) => (
                                    <Chip
                                      key={idx}
                                      label={feature}
                                      variant="outlined"
                                      size="small"
                                      sx={{
                                        fontSize: "0.7rem",
                                        height: 24,
                                        borderColor: alpha(method.color, 0.3),
                                        color: method.color,
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Stack>
                            </Box>
                          </Box>
                        </Card>
                      </Fade>
                    ))}
                  </Stack>
                </RadioGroup>

                {/* Selected Payment Summary */}
                {selectedMethod && (
                  <Fade in={!!selectedMethod} timeout={300}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 2,
                        border: `2px solid ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        gutterBottom
                        color="primary.main"
                      >
                        Phương thức thanh toán đã chọn
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(selectedMethod.color, 0.1),
                            color: selectedMethod.color,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <selectedMethod.icon sx={{ fontSize: 24 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            {selectedMethod.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedMethod.description}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="success.main"
                            fontWeight={600}
                          >
                            Thời gian xử lý: {selectedMethod.processingTime}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Fade>
                )}

                {/* Note field */}
                <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Ghi chú đơn hàng
                  </Typography>
                  <RHFTextField
                    name="note"
                    label="Ghi chú"
                    placeholder="Ví dụ: Giao hàng ngoài giờ hành chính"
                    multiline
                    rows={3}
                  />
                </Paper>

                {/* Continue Button */}
                <Paper
                  elevation={2}
                  sx={{ p: 3, borderRadius: 2, textAlign: "center" }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    disabled={!selectedPaymentId || loading}
                    onClick={handleContinue}
                    sx={{
                      py: 1.5,
                      px: 6,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 700,
                      minWidth: 200,
                      boxShadow: selectedPaymentId
                        ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
                        : "none",
                    }}
                  >
                    {loading ? "Đang xử lý..." : "Tiếp tục thanh toán"}
                  </Button>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mt: 1 }}
                  >
                    Thông tin thanh toán của bạn được bảo mật tuyệt đối
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 1, md: 2 } }}>
                <CartSummary
                  subtotal={subtotal}
                  itemCount={itemCount}
                  hideContinueButton
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </FormProvider>
  );
};

export default PaymentMethods;
