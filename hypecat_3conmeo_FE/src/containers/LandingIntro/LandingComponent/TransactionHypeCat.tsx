import React from "react";
import { Box, Typography, Container, Grid, Card, Button } from "@mui/material";
import { Verified, LocalOffer, Security } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import config from "../../../configs";

const TransactionHypeCat: React.FC = () => {
  const navigation = useNavigate();
  const tradingFeatures = [
    {
      title: "Xác thực thẻ bài",
      description: "Hệ thống xác thực chuyên nghiệp đảm bảo tính chính hãng",
      icon: <Verified sx={{ fontSize: "3rem" }} />,
      color: "#4CAF50",
    },
    {
      title: "Giá cả minh bạch",
      description: "Bảng giá cập nhật liên tục theo thị trường quốc tế",
      icon: <LocalOffer sx={{ fontSize: "3rem" }} />,
      color: "#FF9800",
    },
    {
      title: "Giao dịch an toàn",
      description: "Hệ thống bảo mật đa lớp, thanh toán qua ví điện tử",
      icon: <Security sx={{ fontSize: "3rem" }} />,
      color: "#2196F3",
    },
  ];

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h3"
        sx={{
          color: "white",
          mb: 1,
          fontWeight: "bold",
          textAlign: "center",
          textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
        }}
      >
        🏪 Chợ Thẻ Bài Uy Tín
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "rgba(255,255,255,0.8)",
          mb: 6,
          textAlign: "center",
          fontSize: "1.1rem",
        }}
      >
        Nơi trao đổi, mua bán thẻ bài Pokémon TCG chính hãng và uy tín nhất
      </Typography>

      {/* Trading Features */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {tradingFeatures.map((feature, index) => (
          <Grid size={{ mobile: 12, tablet: 4, laptop: 4 }} key={index}>
            <Card
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                p: 4,
                textAlign: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  borderColor: feature.color,
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  boxShadow: `0 12px 24px ${feature.color}30`,
                },
              }}
            >
              <Box sx={{ color: feature.color, mb: 2 }}>{feature.icon}</Box>
              <Typography
                variant="h5"
                sx={{ color: "white", mb: 2, fontWeight: "bold" }}
              >
                {feature.title}
              </Typography>
              <Typography
                sx={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}
              >
                {feature.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CTA */}
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Button
          variant="contained"
          size="large"
          sx={{
            bgcolor: "#4CAF50",
            px: 6,
            py: 2,
            fontSize: "1.2rem",
            fontWeight: "bold",
            borderRadius: "25px",
            "&:hover": {
              bgcolor: "#45a049",
              transform: "translateY(-2px)",
            },
          }}
          onClick={() => navigation(config.customerRoutes.productList)}
        >
          🛒 Xem Tất Cả Sản Phẩm
        </Button>
      </Box>
    </Container>
  );
};

export default TransactionHypeCat;
