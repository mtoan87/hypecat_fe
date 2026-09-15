import React from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent,
  Link,
} from "@mui/material";
import {
  LocalShipping,
  AttachMoney,
  CheckCircle,

  CurrencyExchange,
  SupportAgent,
  Security,
  Grade,
} from "@mui/icons-material";

const Policy: React.FC = () => {
  const policySections = [
    {
      icon: <CurrencyExchange sx={{ fontSize: 40 }} />,
      title: "💱 Tỷ Giá Quy Đổi",
      color: "#e91e63",
      content: (
        <>
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <strong>Thông tin:</strong> Giá sản phẩm được tính theo tỷ giá ngoại tệ thời gian thực
          </Alert>
          <Grid container spacing={3}>
            <Grid size={{ mobile: 12, tablet: 6, md: 6 }}>
              <Card
                sx={{
                  p: 3,
                  background: "linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)",
                  color: "white",
                  borderRadius: 3,
                  boxShadow: "0 8px 16px rgba(76, 175, 80, 0.3)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    🇺🇸 USD (Dollar Mỹ)
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                    1 USD = 25,000 VNĐ
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Áp dụng cho thẻ nhập khẩu từ Mỹ
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ mobile: 12, tablet: 6, md: 6 }}>
              <Card
                sx={{
                  p: 3,
                  background: "linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)",
                  color: "white",
                  borderRadius: 3,
                  boxShadow: "0 8px 16px rgba(33, 150, 243, 0.3)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    🇯🇵 JPY (Yên Nhật)
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                    1 JPY = 180 VNĐ
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Áp dụng cho thẻ nhập khẩu từ Nhật
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Alert
            severity="warning"
            sx={{
              mt: 3,
              borderRadius: 2,
              background: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)",
            }}
          >
            <strong>Lưu ý:</strong> Tỷ giá có thể thay đổi theo thời gian thực.
            Giá cuối cùng sẽ được xác nhận khi đặt hàng.
          </Alert>
        </>
      )
    },
    {
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      title: "💰 Chính Sách Giá",
      color: "#4CAF50",
      content: (
        <Grid container spacing={2}>
          {[
            {
              primary: "Giá cả minh bạch",
              secondary: "Giá bán = Giá gốc (USD/JPY) × Tỷ giá + Chi phí vận chuyển và thuế"
            },
            {
              primary: "Không phí ẩn",
              secondary: "Mọi chi phí đều được công khai và thông báo trước khi thanh toán"
            },
            {
              primary: "Cập nhật giá định kỳ",
              secondary: "Giá được cập nhật hàng tuần theo thị trường quốc tế"
            }
          ].map((item, index) => (
            <Grid size={{ mobile: 12, tablet: 4, md: 4 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  p: 2,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                  border: "1px solid #dee2e6",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  }
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Grade sx={{ fontSize: 40, color: "#4CAF50", mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {item.primary}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.secondary}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Enhanced Header */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography
          variant="h2"
          sx={{
            color: "white",
            fontWeight: "bold",
            mb: 3,
            textShadow: "2px 2px 12px rgba(0,0,0,0.6)",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          📋 Chính Sách Mua Bán
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "rgba(255,255,255,0.9)",
            maxWidth: "600px",
            margin: "0 auto",
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          HypeCat TCG - Minh bạch, uy tín, chất lượng
        </Typography>
      </Box>

      {/* Exchange Rate */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box
            sx={{
              p: 2,
              mr: 2,
              background: "linear-gradient(135deg, #e91e63 0%, #ad1457 100%)",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(233, 30, 99, 0.3)",
            }}
          >
            <CurrencyExchange sx={{ fontSize: 40, color: "white" }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
            💱 Tỷ Giá Quy Đổi
          </Typography>
        </Box>
        {policySections[0].content}
      </Paper>

      {/* Pricing Policy */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box
            sx={{
              p: 2,
              mr: 2,
              background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
            }}
          >
            <AttachMoney sx={{ fontSize: 40, color: "white" }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
            💰 Chính Sách Giá
          </Typography>
        </Box>
        {policySections[1].content}
      </Paper>

      {/* Enhanced Shipping Policy */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box
            sx={{
              p: 2,
              mr: 2,
              background: "linear-gradient(135deg, #FF9800 0%, #EF6C00 100%)",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)",
            }}
          >
            <LocalShipping sx={{ fontSize: 40, color: "white" }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
            🚚 Chính Sách Giao Nhận
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ mobile: 12, tablet: 6, md: 6 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#e91e63" }}>
                  📍 Khu Vực Giao Hàng
                </Typography>
                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: "#4CAF50" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="TP. Hồ Chí Minh"
                      secondary="Giao hàng trong 1-2 ngày làm việc"
                      primaryTypographyProps={{ fontWeight: "bold" }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: "#4CAF50" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Các tỉnh thành khác"
                      secondary="Giao hàng trong 3-5 ngày làm việc"
                      primaryTypographyProps={{ fontWeight: "bold" }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ mobile: 12, tablet: 6, md: 6 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#e91e63" }}>
                  💵 Phí Vận Chuyển
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ mobile: 12, tablet: 12, md: 12 }}>
                    <Box sx={{
                      p: 2,
                      bgcolor: "#f8f9fa",
                      borderRadius: 2,
                      border: "2px solid #4CAF50",
                    }}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Nội thành TP.HCM
                      </Typography>
                      <Typography sx={{ color: "#4CAF50", fontSize: "1.5rem", fontWeight: "bold" }}>
                        20,000 VNĐ
                      </Typography>
                      <Chip
                        label="Miễn phí cho đơn > 500k"
                        size="small"
                        color="success"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ mobile: 12, tablet: 12, md: 12 }}>
                    <Box sx={{
                      p: 2,
                      bgcolor: "#f8f9fa",
                      borderRadius: 2,
                      border: "2px solid #FF9800",
                    }}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Ngoại thành & Tỉnh khác
                      </Typography>
                      <Typography sx={{ color: "#FF9800", fontSize: "1.5rem", fontWeight: "bold" }}>
                        30,000 - 50,000 VNĐ
                      </Typography>
                      <Chip
                        label="Miễn phí cho đơn > 1tr"
                        size="small"
                        color="warning"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Enhanced Contact Section */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          background: "linear-gradient(135deg, rgba(233, 30, 99, 0.15) 0%, rgba(156, 39, 176, 0.15) 100%)",
          borderRadius: "20px",
          border: "2px solid #e91e63",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            background: "linear-gradient(135deg, #e91e63 0%, #ad1457 100%)",
            borderRadius: "50%",
            opacity: 0.1,
          }}
        />
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <SupportAgent sx={{ fontSize: 60, color: "#e91e63", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              📞 Liên Hệ Hỗ Trợ
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondary" }}>
              Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid size={{ mobile: 12, tablet: 6, md: 6 }}>
              <Card sx={{ textAlign: "center", p: 2, borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#e91e63" }}>
                    📱 Hotline
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    039 821 8047
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hỗ trợ 24/7
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ mobile: 12, tablet: 6, md: 6 }}>
              <Card sx={{ textAlign: "center", p: 2, borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#e91e63" }}>
                    💬 Facebook
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    <Link
                      href="https://www.facebook.com/Hypecat.tcg/"
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      sx={{ color: "inherit" }}
                    >
                      Hypecat
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tin nhắn trực tiếp
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Trust Badges */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid >
            <Chip
              icon={<Security />}
              label="Bảo mật giao dịch"
              color="primary"
              variant="outlined"
              sx={{ fontSize: '1rem', p: 2 }}
            />
          </Grid>
          <Grid >
            <Chip
              icon={<Grade />}
              label="Uy tín 5 sao"
              color="secondary"
              variant="outlined"
              sx={{ fontSize: '1rem', p: 2 }}
            />
          </Grid>
          <Grid >
            <Chip
              icon={<LocalShipping />}
              label="Giao hàng nhanh"
              color="success"
              variant="outlined"
              sx={{ fontSize: '1rem', p: 2 }}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Policy;