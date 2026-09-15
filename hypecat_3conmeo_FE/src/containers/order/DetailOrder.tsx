/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderStatus } from "../../enum/OrderStatus";
import {
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  Print as PrintIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import moment from "moment";
import React, { useRef } from "react";
import { toast } from "react-toastify";
import orderApi from "../../api/services/OrderApi/orderAPI";
import type { OrderDetailType } from "../../types/OrderDetailType";
import { colors, font_weight } from "../../styles/config-file";

interface DetailOrderProps {
  orderId: string;
}

const DetailOrder: React.FC<DetailOrderProps> = ({ orderId }) => {
  //define state
  const [orderDetailData, setOrderDetailData] =
    React.useState<OrderDetailType>();
  const [loading, setLoading] = React.useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  //call api to get order detail
  const getOrderDetail = async () => {
    setLoading(true);
    try {
      const res: any = await orderApi.getOrderDetail(orderId);
      setOrderDetailData(res);
      console.log(res);
    } catch (error) {
      toast.error("Có lỗi xảy ra trong quá trình lấy chi tiết đơn hàng");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getOrderDetail();
  }, []);

  //status format with improved styling
  const statusFormat = (status?: string) => {
    const statusConfig = {
      [OrderStatus.PENDING]: {
        label: "Chờ xử lý",
        color: "#FFA726",
        bgColor: "#FFF3E0",
        icon: "⏳",
      },
      [OrderStatus.FINISH]: {
        label: "Đã thanh toán",
        color: "#66BB6A",
        bgColor: "#E8F5E8",
        icon: "✅",
      },
      [OrderStatus.CANCELED]: {
        label: "Đã hủy",
        color: "#EF5350",
        bgColor: "#FFEBEE",
        icon: "❌",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return "-";

    return (
      <Chip
        label={
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </Box>
        }
        sx={{
          bgcolor: config.bgColor,
          color: config.color,
          fontWeight: font_weight.semiBold,
          borderRadius: 2,
          px: 1,
          "& .MuiChip-label": {
            px: 1,
          },
        }}
      />
    );
  };

  // Calculate total amount
  const totalAmount =
    orderDetailData?.orderDetails?.reduce(
      (total, item) => total + item.totalPrice,
      0
    ) || 0;

  // Handle print function
  const handlePrint = () => {
    const content = receiptRef.current?.innerHTML;
    const printWindow = window.open("", "", "width=320,height=700");
    if (printWindow && content) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Hóa đơn bán hàng</title>
            <meta charset="UTF-8">
            <style>
              @media print {
                @page {
                  size: 80mm auto;
                  margin: 3mm;
                }
                body {
                  margin: 0;
                  padding: 0;
                }
              }

              * {
                box-sizing: border-box;
              }

              body {
                font-family: 'Courier New', monospace;
                font-size: 12px;
                width: 80mm;
                padding: 5mm;
                margin: 0 auto;
                background: white;
                color: #000;
                line-height: 1.3;
              }

              .receipt-header {
                text-align: center;
                margin-bottom: 15px;
                border-bottom: 2px solid #000;
                padding-bottom: 10px;
              }

              .store-name {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 5px;
                text-transform: uppercase;
                letter-spacing: 1px;
              }

              .store-address {
                font-size: 11px;
                margin-bottom: 8px;
                color: #333;
              }

              .receipt-title {
                font-size: 16px;
                font-weight: bold;
                margin: 10px 0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }

              .separator {
                text-align: center;
                margin: 8px 0;
                font-size: 14px;
                color: #666;
              }

              .info-section {
                margin: 10px 0;
                border-bottom: 1px dashed #666;
                padding-bottom: 8px;
              }

              .info-line {
                display: flex;
                justify-content: space-between;
                margin: 4px 0;
                font-size: 12px;
              }

              .info-label {
                font-weight: bold;
                color: #333;
              }

              .info-value {
                color: #000;
              }

              .table-section {
                margin: 15px 0;
              }

              .table-header {
                display: flex;
                justify-content: space-between;
                font-weight: bold;
                font-size: 11px;
                border-bottom: 1px solid #000;
                padding-bottom: 5px;
                margin-bottom: 8px;
                background: #f5f5f5;
                padding: 5px 2px;
              }

              .table-row {
                display: flex;
                justify-content: space-between;
                margin: 6px 0;
                font-size: 11px;
                border-bottom: 1px dotted #ccc;
                padding-bottom: 4px;
              }

              .item-info {
                flex: 1;
                padding-right: 8px;
              }

              .item-number {
                width: 20px;
                flex-shrink: 0;
                font-weight: bold;
                color: #666;
              }

              .item-name {
                font-weight: bold;
                margin-bottom: 2px;
                word-wrap: break-word;
                line-height: 1.2;
              }

              .item-details {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 10px;
                color: #666;
              }

              .item-prices {
                display: flex;
                gap: 8px;
                align-items: center;
                font-size: 10px;
              }

              .quantity {
                background: #f0f0f0;
                padding: 2px 6px;
                border-radius: 3px;
                font-weight: bold;
              }

              .unit-price {
                color: #666;
              }

              .total-price {
                font-weight: bold;
                color: #000;
              }

              .summary-section {
                margin: 15px 0;
                border-top: 2px solid #000;
                padding-top: 10px;
              }

              .summary-line {
                display: flex;
                justify-content: space-between;
                margin: 5px 0;
                font-size: 12px;
              }

              .summary-label {
                font-weight: bold;
              }

              .summary-value {
                font-weight: bold;
              }

              .grand-total {
                font-size: 14px;
                font-weight: bold;
                border-top: 1px solid #000;
                padding-top: 8px;
                margin-top: 8px;
                background: #f5f5f5;
                padding: 8px 4px;
                text-align: center;
              }

              .footer-section {
                text-align: center;
                margin-top: 15px;
                border-top: 1px dashed #666;
                padding-top: 10px;
                font-size: 11px;
              }

              .thank-you {
                font-weight: bold;
                margin-bottom: 5px;
              }

              .contact-info {
                font-size: 10px;
                color: #666;
                margin-top: 5px;
              }

              .qr-placeholder {
                width: 40px;
                height: 40px;
                border: 1px solid #ccc;
                margin: 8px auto;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 8px;
                color: #666;
              }

              .print-date {
                font-size: 9px;
                color: #999;
                margin-top: 8px;
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${content}
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Đang tải...
        </Typography>
      </Box>
    );
  }

  return (
    <Paper>
      <Box sx={{ p: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
        {/* Hidden receipt content for printing */}
        <div ref={receiptRef} style={{ display: "none" }}>
          <div>
            {/* Header */}
            <div className="receipt-header">
              <div className="store-name">HypeCat Shop</div>
              <div className="store-address">
                123 Đường ABC, Quận XYZ, TP.HCM
              </div>
              <div className="store-address">
                ☎ 0123.456.789 | 📧 HypeCat@store.com
              </div>
              <div className="receipt-title">HÓA ĐƠN BÁN HÀNG</div>
            </div>

            {/* Order Information */}
            <div className="info-section">
              <div className="info-line">
                <span className="info-label">Số HĐ:</span>
                <span className="info-value">#{orderId}</span>
              </div>
              <div className="info-line">
                <span className="info-label">Ngày:</span>
                <span className="info-value">
                  {moment(orderDetailData?.orderDate).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                </span>
              </div>
              <div className="info-line">
                <span className="info-label">Khách hàng:</span>
                <span className="info-value">
                  {orderDetailData?.name || "Khách lẻ"}
                </span>
              </div>
              {orderDetailData?.phone && (
                <div className="info-line">
                  <span className="info-label">SĐT:</span>
                  <span className="info-value">{orderDetailData.phone}</span>
                </div>
              )}
              {orderDetailData?.address && (
                <div className="info-line">
                  <span className="info-label">Địa chỉ:</span>
                  <span className="info-value">{orderDetailData.address}</span>
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="table-section">
              <div className="table-header">
                <span style={{ width: "20px" }}>#</span>
                <span style={{ flex: 1 }}>Sản phẩm</span>
                <span style={{ width: "60px", textAlign: "right" }}>
                  Thành tiền
                </span>
              </div>

              {orderDetailData?.orderDetails?.map((item, index) => (
                <div key={index} className="table-row">
                  <div className="item-number">{index + 1}</div>
                  <div className="item-info">
                    <div className="item-name">{item.product.name}</div>
                    <div className="item-details">
                      <div className="item-prices">
                        <span className="quantity">{item.quantity}</span>
                        <span>×</span>
                        <span className="unit-price">
                          {item.unitPrice.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                      <span className="total-price">
                        {item.totalPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="summary-section">
              <div className="summary-line">
                <span className="summary-label">Tổng số lượng:</span>
                <span className="summary-value">
                  {orderDetailData?.orderDetails?.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  ) || 0}{" "}
                  sản phẩm
                </span>
              </div>
              <div className="summary-line">
                <span className="summary-label">Tổng tiền hàng:</span>
                <span className="summary-value">
                  {totalAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>
              {orderDetailData?.orderStatus === OrderStatus.FINISH && (
                <div className="summary-line">
                  <span className="summary-label">Thanh toán:</span>
                  <span className="summary-value">
                    {orderDetailData?.paymentMethod || "Tiền mặt"}
                  </span>
                </div>
              )}
              <div className="grand-total">
                <div>TỔNG CỘNG: {totalAmount.toLocaleString("vi-VN")}đ</div>
                <div style={{ fontSize: "10px", marginTop: "4px" }}>
                  ({new Intl.NumberFormat("vi-VN").format(totalAmount)} đồng)
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="footer-section">
              <div className="thank-you">✨ CẢM ƠN QUÝ KHÁCH! ✨</div>
              <div>Hẹn gặp lại quý khách!</div>
              <div className="contact-info">
                🌐 Website: www.ngocbich.com | 📱 Facebook: /ngocbichstore
              </div>
              <div className="qr-placeholder">QR CODE</div>
              <div className="print-date">
                In lúc: {moment().format("DD/MM/YYYY HH:mm:ss")}
              </div>
            </div>
          </div>
        </div>

        {/* Header with title and print button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: font_weight.semiBold,
                color: colors.dark,
                mb: 1,
              }}
            >
              Chi tiết đơn hàng
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mã đơn hàng: #{orderId}
            </Typography>
          </Box>

          <Tooltip title="In đơn hàng">
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{
                bgcolor: colors.primary,
                color: "white",
                borderRadius: 2,
                px: 3,
                py: 1.5,
                textTransform: "none",
                fontWeight: font_weight.semiBold,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                "&:hover": {
                  bgcolor: colors.blue_200,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                },
              }}
            >
              In đơn hàng
            </Button>
          </Tooltip>
        </Box>

        <Grid container spacing={3}>
          {/* Order Information Card */}
          <Grid size={{ mobile: 12, tablet: 4, laptop: 4 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid #e0e7ff",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: colors.primary,
                        width: 32,
                        height: 32,
                      }}
                    >
                      <ReceiptIcon fontSize="small" />
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: font_weight.semiBold }}
                    >
                      Thông tin đơn hàng
                    </Typography>
                  </Box>
                  {statusFormat(orderDetailData?.orderStatus)}
                </Box>

                <Stack spacing={2.5}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <PersonIcon sx={{ color: colors.primary, fontSize: 20 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Khách hàng
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: font_weight.medium }}
                      >
                        {orderDetailData?.name || "Không có thông tin"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <LocationIcon
                      sx={{ color: colors.primary, fontSize: 20 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Địa chỉ
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: font_weight.medium }}
                      >
                        {orderDetailData?.address || "Không có thông tin"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <PhoneIcon sx={{ color: colors.primary, fontSize: 20 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Số điện thoại
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: font_weight.medium }}
                      >
                        {orderDetailData?.phone || "Không có thông tin"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CalendarIcon
                      sx={{ color: colors.primary, fontSize: 20 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Ngày đặt hàng
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: font_weight.medium }}
                      >
                        {moment(orderDetailData?.orderDate).format(
                          "DD/MM/YYYY HH:mm"
                        ) || "Không có thông tin"}
                      </Typography>
                    </Box>
                  </Box>

                  {orderDetailData?.orderStatus === OrderStatus.FINISH && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <PaymentIcon
                        sx={{ color: colors.primary, fontSize: 20 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Phương thức thanh toán
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: font_weight.medium }}
                        >
                          {orderDetailData?.paymentMethod ||
                            "Không có thông tin"}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Items Table */}
          <Grid size={{ mobile: 12, tablet: 8, laptop: 8 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid #e0e7ff",
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, pb: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: font_weight.semiBold, mb: 2 }}
                  >
                    Sản phẩm đã đặt
                  </Typography>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f8fafc" }}>
                        <TableCell
                          sx={{
                            fontWeight: font_weight.semiBold,
                            color: colors.dark,
                            borderBottom: "2px solid #e0e7ff",
                          }}
                        >
                          #
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: font_weight.semiBold,
                            color: colors.dark,
                            borderBottom: "2px solid #e0e7ff",
                          }}
                        >
                          Tên sản phẩm
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: font_weight.semiBold,
                            color: colors.dark,
                            borderBottom: "2px solid #e0e7ff",
                          }}
                        >
                          Đơn giá
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: font_weight.semiBold,
                            color: colors.dark,
                            borderBottom: "2px solid #e0e7ff",
                          }}
                        >
                          Số lượng
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontWeight: font_weight.semiBold,
                            color: colors.dark,
                            borderBottom: "2px solid #e0e7ff",
                          }}
                        >
                          Thành tiền
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderDetailData?.orderDetails?.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:nth-of-type(odd)": {
                              backgroundColor: "#fafbfc",
                            },
                            "&:hover": {
                              backgroundColor: "#f0f4ff",
                            },
                          }}
                        >
                          <TableCell
                            sx={{
                              fontWeight: font_weight.medium,
                              color: colors.primary,
                            }}
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell sx={{ fontWeight: font_weight.medium }}>
                            {row.product.name}
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: font_weight.medium,
                                color: colors.grey_600,
                              }}
                            >
                              {row.unitPrice.toLocaleString("vi-VN")}₫
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={row.quantity}
                              size="small"
                              sx={{
                                bgcolor: "#e3f2fd",
                                color: "#1976d2",
                                fontWeight: font_weight.semiBold,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: font_weight.semiBold,
                                color: colors.primary,
                              }}
                            >
                              {row.totalPrice.toLocaleString("vi-VN")}₫
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Total Section */}
                <Box sx={{ p: 3, pt: 2 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      bgcolor: "#f8fafc",
                      p: 2,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: font_weight.semiBold }}
                    >
                      Tổng tiền sản phẩm:
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: font_weight.bold,
                        color: colors.primary,
                      }}
                    >
                      {totalAmount.toLocaleString("vi-VN")}₫
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default DetailOrder;
