import React from "react";
import { Box, Typography, Button, Container, Grid } from "@mui/material";

const IntroductionHypeCat: React.FC = () => {
  return (
    <Box
      sx={{
        pt: 25,
        pb: 8,
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ mobile: 12, tablet: 12, laptop: 12 }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  mb: 1,
                  borderBottom: "3px solid #4A90E2",
                  display: "inline-block",
                  pb: 1,
                }}
              >
                Về HypeCat ℹ️
              </Typography>
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "3rem", md: "4rem" },
                fontWeight: "bold",
                color: "white",
                mb: 4,
                lineHeight: 1.2,
                textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              HypeCat
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "1.2rem",
                lineHeight: 1.8,
                mb: 4,
                textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
              }}
            >
              HypeCat là cộng đồng hàng đầu dành cho những người đam mê Pokémon
              TCG tại Việt Nam. Chúng tôi là nơi kết nối các Trainer với nhau,
              chia sẻ niềm đam mê về những lá bài hiếm và tạo ra một không gian
              giao lưu thân thiện. Từ những người mới bắt đầu đến các chuyên
              gia, HypeCat chào đón tất cả mọi người cùng khám phá thế giới
              Pokémon đầy màu sắc!
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="large"
                href="https://www.tiktok.com/@hypecat.tcg/"
                target="_blank"
                sx={{
                  bgcolor: "#e91e63",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  boxShadow: "0 8px 25px rgba(233, 30, 99, 0.4)",
                  "&:hover": {
                    bgcolor: "#c2185b",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 35px rgba(233, 30, 99, 0.6)",
                  },
                }}
              >
                ▶ Tham Gia Cộng Đồng
              </Button>

              <Button
                variant="outlined"
                size="large"
                href="https://www.facebook.com/Hypecat.tcg/"
                target="_blank"
                sx={{
                  borderColor: "white",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  borderWidth: "2px",
                  "&:hover": {
                    borderWidth: "2px",
                    bgcolor: "rgba(255,255,255,0.1)",
                    borderColor: "white",
                  },
                }}
              >
                Khám Phá Thêm
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default IntroductionHypeCat;
