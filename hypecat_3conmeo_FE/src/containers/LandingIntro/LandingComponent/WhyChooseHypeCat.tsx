import React from "react";
import { Box, Typography, Container, Grid, Card } from "@mui/material";
import {
  Videocam,
  SportsEsports,
  EmojiEvents,
  Security,
  Speed,
  Support,
} from "@mui/icons-material";

const WhyChooseHypeCat: React.FC = () => {
  const reasons = [
    {
      icon: <Security sx={{ fontSize: "3rem" }} />,
      title: "Uy Tín & Bảo Mật",
      description:
        "Hệ thống bảo mật đa lớp, giao dịch an toàn 100%. Được tin tưởng bởi hàng nghìn người chơi.",
      color: "#00E676", // Bright green for security
      stats: "99.9% độ tin cậy",
    },
    {
      icon: <Videocam sx={{ fontSize: "3rem" }} />,
      title: "Live Stream Chất Lượng",
      description:
        "Stream HD 1080p, đa góc camera, âm thanh crystal clear. Trải nghiệm như ở shop thật.",
      color: "#FF1744", // Bright red for live stream
      stats: "24/7 live stream",
    },
    {
      icon: <SportsEsports sx={{ fontSize: "3rem" }} />,
      title: "Cộng Đồng Sôi Động",
      description:
        "Hơn 50K thành viên active, chat tương tác real-time, events thường xuyên.",
      color: "#2196F3", // Bright blue for community
      stats: "50K+ thành viên",
    },
    {
      icon: <EmojiEvents sx={{ fontSize: "3rem" }} />,
      title: "Event Độc Quyền",
      description:
        "Các event mở pack đặc biệt, hunt thẻ rare, tournament với giải thưởng khủng.",
      color: "#FFD700", // Gold for exclusive events
      stats: "Event hàng tuần",
    },
    {
      icon: <Speed sx={{ fontSize: "3rem" }} />,
      title: "Giao Hàng Nhanh",
      description:
        "Ship toàn quốc trong 24h, đóng gói cẩn thận, bảo hiểm hàng hóa.",
      color: "#FF6D00", // Orange for fast delivery
      stats: "Giao trong 24h",
    },
    {
      icon: <Support sx={{ fontSize: "3rem" }} />,
      title: "Hỗ Trợ 24/7",
      description:
        "Đội ngũ hỗ trợ chuyên nghiệp, tư vấn tận tình, giải đáp mọi thắc mắc của bạn.",
      color: "#66ffe0", // Pink for support
      stats: "Phản hồi < 5 phút",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          color: "white",
          mb: 2,
          fontWeight: "bold",
          textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
        }}
      >
        🌟 Tại Sao Chọn HypeCat?
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
        6 lý do khiến HypeCat trở thành lựa chọn số 1 của cộng đồng Pokémon TCG
        Việt Nam
      </Typography>

      <Grid container spacing={4}>
        {reasons.map((reason, index) => (
          <Grid size={{ mobile: 12, tablet: 6, laptop: 4 }} key={index}>
            <Card
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.08)", // Reduced opacity for darker background
                backdropFilter: "blur(20px)",
                border: `1px solid rgba(255,255,255,0.15)`,
                borderRadius: "16px",
                p: 4,
                textAlign: "center",
                transition: "all 0.4s ease",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  borderColor: reason.color,
                  bgcolor: "rgba(255, 255, 255, 0.12)",
                  boxShadow: `0 20px 40px ${reason.color}30`,
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: `linear-gradient(90deg, ${reason.color}, ${reason.color}80)`,
                  borderRadius: "16px 16px 0 0",
                },
              }}
            >
              {/* Icon with glow effect */}
              <Box
                sx={{
                  color: reason.color,
                  mb: 3,
                  filter: `drop-shadow(0 0 15px ${reason.color}40)`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    filter: `drop-shadow(0 0 25px ${reason.color}60)`,
                    transform: "scale(1.1)",
                  },
                }}
              >
                {reason.icon}
              </Box>

              {/* Title */}
              <Typography
                variant="h5"
                sx={{
                  color: "white",
                  mb: 2,
                  fontWeight: "bold",
                  fontSize: "1.3rem",
                  textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                }}
              >
                {reason.title}
              </Typography>

              {/* Description */}
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: 1.6,
                  mb: 3,
                  fontSize: "0.95rem",
                }}
              >
                {reason.description}
              </Typography>

              {/* Stats badge */}
              <Box
                sx={{
                  bgcolor: `${reason.color}15`, // More subtle background
                  border: `1px solid ${reason.color}50`,
                  borderRadius: "20px",
                  px: 2,
                  py: 1,
                  display: "inline-block",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: reason.color,
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                  }}
                >
                  ⭐ {reason.stats}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Summary section */}
      <Box
        sx={{
          mt: 8,
          p: 4,
          bgcolor: "rgba(255, 255, 255, 0.06)", // Very subtle background
          backdropFilter: "blur(20px)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.15)",
          textAlign: "center",
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
              "linear-gradient(45deg, rgba(0, 230, 118, 0.05), rgba(33, 150, 243, 0.05), rgba(255, 215, 0, 0.05))",
            zIndex: -1,
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "white",
            mb: 3,
            fontWeight: "bold",
            textShadow: "2px 2px 6px rgba(0,0,0,0.6)",
          }}
        >
          🏆 Đội Ngũ HypeCat Cam Kết
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ mobile: 12, tablet: 6, laptop: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  color: "#00E676",
                  fontWeight: "bold",
                  textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                }}
              >
                50K+
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>
                Thành viên tin tưởng
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ mobile: 12, tablet: 6, laptop: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  color: "#FF1744",
                  fontWeight: "bold",
                  textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                }}
              >
                99.9%
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>
                Đánh giá tích cực
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ mobile: 12, tablet: 6, laptop: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  color: "#2196F3",
                  fontWeight: "bold",
                  textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                }}
              >
                24/7
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>
                Hỗ trợ không ngừng
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ mobile: 12, tablet: 6, laptop: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  color: "#FFD700",
                  fontWeight: "bold",
                  textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                }}
              >
                #1
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>
                Cộng đồng Pokémon TCG
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography
          variant="body1"
          sx={{
            color: "rgba(255,255,255,0.9)",
            mt: 4,
            fontSize: "1.1rem",
            fontStyle: "italic",
            textShadow: "1px 1px 2px rgba(0,0,0,0.4)",
          }}
        >
          "Không chỉ là nơi mua bán thẻ bài, HypeCat là gia đình lớn của những
          người yêu Pokémon TCG"
        </Typography>
      </Box>
    </Container>
  );
};

export default WhyChooseHypeCat;
