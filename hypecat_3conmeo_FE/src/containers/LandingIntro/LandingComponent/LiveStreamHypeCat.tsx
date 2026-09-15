import React from "react";
import { Box, Typography, Container, Grid, Button, Chip } from "@mui/material";
import { LiveTv } from "@mui/icons-material";

const LiveStreamHypeCat: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Live Badge */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Chip
          label="🔴 LIVE MỖI NGÀY 7:00 PM"
          sx={{
            bgcolor: "#e91e63",
            color: "white",
            fontWeight: "bold",
            fontSize: "1rem",
            px: 2,
            py: 3,
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%, 100%": { opacity: 1, transform: "scale(1)" },
              "50%": { opacity: 0.8, transform: "scale(1.05)" },
            },
          }}
        />
      </Box>

      {/* Header */}
      <Typography
        variant="h3"
        sx={{
          color: "white",
          mb: 2,
          fontWeight: "bold",
          textAlign: "center",
          textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
        }}
      >
        📺 Live Stream Kéo Thẻ
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "rgba(255,255,255,0.9)",
          mb: 6,
          textAlign: "center",
          fontSize: "1.2rem",
        }}
      >
        Theo dõi các streamer hàng đầu mở pack và hunt thẻ hiếm trực tiếp
      </Typography>

      {/* Schedule Card */}
      <Box
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(20px)",
          borderRadius: "20px",
          border: "2px solid rgba(255,255,255,0.3)",
          p: 5,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "white",
            mb: 4,
            fontWeight: "bold",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <LiveTv sx={{ fontSize: "2.5rem" }} />⏰ Lịch Stream
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          <Grid size={{ mobile: 12, tablet: 8, laptop: 6 }}>
            <Box
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.15)",
                borderRadius: "16px",
                p: 4,
                border: "2px solid rgba(255,255,255,0.2)",
                textAlign: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.25)",
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
                },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "#FFD700",
                  fontWeight: "bold",
                  mb: 2,
                  fontSize: "1.8rem",
                }}
              >
                🕖 7:00 PM Mỗi Ngày
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontWeight: "600",
                  mb: 2,
                  lineHeight: 1.6,
                }}
              >
                Stream trực tiếp trên kênh TikTok
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "1.1rem",
                  lineHeight: 1.8,
                }}
              >
                Nhấn vào nút bên dưới để tham gia và không bỏ lỡ những pha mở
                pack cực kỳ thú vị! 🎁✨
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* CTA Button */}
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Button
          variant="contained"
          href="https://www.tiktok.com/@hypecat.tcg"
          target="_blank"
          rel="noopener noreferrer"
          size="large"
          startIcon={<LiveTv />}
          sx={{
            bgcolor: "#e91e63",
            color: "white",
            px: 8,
            py: 2.5,
            fontSize: "1.3rem",
            fontWeight: "bold",
            borderRadius: "50px",
            boxShadow: "0 6px 20px rgba(233, 30, 99, 0.4)",
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: "#c2185b",
              transform: "translateY(-3px)",
              boxShadow: "0 8px 25px rgba(233, 30, 99, 0.6)",
            },
          }}
        >
          📺 Tham Gia Live Stream Ngay
        </Button>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255,255,255,0.8)",
            mt: 2,
            fontSize: "1rem",
          }}
        >
          Theo dõi @hypecat.tcg trên TikTok
        </Typography>
      </Box>
    </Container>
  );
};

export default LiveStreamHypeCat;
