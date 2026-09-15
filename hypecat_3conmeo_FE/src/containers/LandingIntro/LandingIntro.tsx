/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import {
  Home as HomeIcon,
  Store,
  VideoCall,
  Star,
  ShoppingCart,
  Support,
} from "@mui/icons-material";
import IntroductionHypeCat from "./LandingComponent/IntroductionHypeCat";
import TransactionHypeCat from "./LandingComponent/TransactionHypeCat";
import LiveStreamHypeCat from "./LandingComponent/LiveStreamHypeCat";
import WhyChooseHypeCat from "./LandingComponent/WhyChooseHypeCat";
import { useResponsive } from "../../hooks/useResponsive";

// Declare AOS type cho TypeScript
declare global {
  interface Window {
    AOS: any;
  }
}

const LandingIntro: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeLeftNav, setActiveLeftNav] = useState(0);
  const [activeRightNav, setActiveRightNav] = useState(0);
  const {isMobile}  = useResponsive();

  useEffect(() => {
    // Đảm bảo AOS đã load xong
    const initAOS = () => {
      if (window.AOS) {
        window.AOS.init({
          duration: 1200,
          easing: "ease-out-cubic",
          once: false,
          offset: 100,
          delay: 100,
          mirror: true,
          anchorPlacement: "top-bottom",
        });

        // Refresh AOS sau khi init
        setTimeout(() => {
          window.AOS.refresh();
        }, 100);
      } else {
        // Retry nếu AOS chưa load
        setTimeout(initAOS, 100);
      }
    };

    initAOS();

    // Handle scroll effect for header
    const handleScroll = () => {
      const isScrolled = window.scrollY > 80;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Intersection Observer for section detection
    const observerOptions = {
      root: null,
      rootMargin: "-80px 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: any) => {
      entries.forEach((entry: any) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const sectionIndex = [
            "introduction",
            "transaction",
            "livestream",
            "whychoose",
          ].indexOf(sectionId);

          if (sectionIndex !== -1) {
            setActiveLeftNav(sectionIndex);
            setActiveRightNav(sectionIndex);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all sections
    const sections = ["introduction", "transaction", "livestream", "whychoose"];

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  // Refresh AOS khi state thay đổi
  useEffect(() => {
    if (window.AOS) {
      window.AOS.refresh();
    }
  }, [activeLeftNav, activeRightNav]);

  const scrollToSection = (sectionId: string, index: number) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Update immediately for better UX
      setActiveLeftNav(index);
      setActiveRightNav(index);

      // Refresh AOS sau khi scroll
      setTimeout(() => {
        if (window.AOS) {
          window.AOS.refresh();
        }
      }, 500);
    }
  };

  const leftNavItems = [
    {
      icon: <HomeIcon />,
      label: "Trang Chủ HypeCat",
      section: "introduction",
      description: "Giới thiệu về cộng đồng",
    },
    {
      icon: <Store />,
      label: "Chợ Thẻ Bài",
      section: "transaction",
      description: "Mua bán trao đổi thẻ bài",
    },
    {
      icon: <VideoCall />,
      label: "Live Stream",
      section: "livestream",
      description: "Xem stream kéo thẻ trực tiếp",
    },
    {
      icon: <Star />,
      label: "Tại Sao Chọn HypeCat",
      section: "whychoose",
      description: "Ưu điểm vượt trội",
    },
    {
      icon: <Support />,
      label: "Hỗ Trợ 24/7",
      section: "whychoose",
      description: "Liên hệ hỗ trợ",
    },
  ];

  const rightNavItems = [
    {
      icon: "🎮",
      label: "Pokémon TCG",
      section: "introduction",
      description: "Thế giới Pokémon",
    },
    {
      icon: "💳",
      label: "Giao Dịch An Toàn",
      section: "transaction",
      description: "Thanh toán bảo mật",
    },
    {
      icon: "📱",
      label: "TikTok Live",
      section: "livestream",
      description: "Theo dõi trên TikTok",
    },
    {
      icon: "🏆",
      label: "Chất Lượng #1",
      section: "whychoose",
      description: "Dịch vụ hàng đầu",
    },
    {
      icon: "💬",
      label: "Cộng Đồng",
      section: "introduction",
      description: "Kết nối trainer",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        background:
          'url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&h=1080&fit=crop") center/cover',
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(135deg, rgba(6, 74, 74, 0.85) 0%, rgba(39, 78, 82, 0.85) 50%, rgba(14, 45, 51, 0.85) 100%)",
          zIndex: 0,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(255, 230, 109, 0.05) 0%, transparent 50%)
        `,
          zIndex: 1,
        },
      }}
    >
      {/* Left Navigation */}
     {!isMobile && ( 
      <Box
        sx={{
          position: "fixed",
          left: 15,
          top: "50%",
          transform: "translateY(-50%)",
          height: "auto",
          width: "65px",
          bgcolor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(25px)",
          borderRadius: "35px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 2.5,
          border: "2px solid rgba(255,255,255,0.15)",
          boxShadow: "0 15px 50px rgba(0,0,0,0.4)",
        }}
      >
        {leftNavItems.map((item, index) => (
          <Tooltip
            key={index}
            title={
              <Box>
                <Box sx={{ fontWeight: "bold", mb: 0.5, fontSize: "0.9rem" }}>
                  {item.label}
                </Box>
                <Box sx={{ fontSize: "0.8rem", opacity: 0.8 }}>
                  {item.description}
                </Box>
              </Box>
            }
            placement="right"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "rgba(0,0,0,0.9)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  backdropFilter: "blur(10px)",
                },
              },
            }}
          >
            <IconButton
              onClick={() => scrollToSection(item.section, index)}
              sx={{
                width: 48,
                height: 48,
                mb: 1.5,
                color:
                  activeLeftNav === index ? "#e91e63" : "rgba(255,255,255,0.8)",
                borderRadius: "50%",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                bgcolor:
                  activeLeftNav === index
                    ? "rgba(233, 30, 99, 0.2)"
                    : "transparent",
                border:
                  activeLeftNav === index
                    ? "2px solid #e91e63"
                    : "2px solid transparent",
                transform: activeLeftNav === index ? "scale(1.1)" : "scale(1)",
                "&:hover": {
                  bgcolor: "rgba(233, 30, 99, 0.15)",
                  transform: "scale(1.15)",
                  border: "2px solid rgba(233, 30, 99, 0.6)",
                  color: "#e91e63",
                  boxShadow: "0 8px 25px rgba(233, 30, 99, 0.4)",
                },
              }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}

        {/* Progress indicator */}
        <Box
          sx={{
            position: "absolute",
            right: -12,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {leftNavItems.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor:
                  activeLeftNav === index ? "#e91e63" : "rgba(255,255,255,0.3)",
                transition: "all 0.4s ease",
                cursor: "pointer",
                border:
                  activeLeftNav === index
                    ? "2px solid rgba(233, 30, 99, 0.5)"
                    : "none",
                transform: activeLeftNav === index ? "scale(1.2)" : "scale(1)",
                boxShadow:
                  activeLeftNav === index
                    ? "0 0 15px rgba(233, 30, 99, 0.6)"
                    : "none",
                "&:hover": {
                  transform: "scale(1.3)",
                  bgcolor: "#e91e63",
                },
              }}
              onClick={() =>
                scrollToSection(leftNavItems[index].section, index)
              }
            />
          ))}
        </Box>
      </Box>)}
      {/* Right Navigation */}
     {!isMobile && (
      <Box
        sx={{
          position: "fixed",
          right: 15,
          top: "50%",
          transform: "translateY(-50%)",
          height: "auto",
          width: "65px",
          bgcolor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(25px)",
          borderRadius: "35px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 2.5,
          border: "2px solid rgba(255,255,255,0.15)",
          boxShadow: "0 15px 50px rgba(0,0,0,0.4)",
        }}
      >
        {rightNavItems.map((item, index) => (
          <Tooltip
            key={index}
            title={
              <Box>
                <Box sx={{ fontWeight: "bold", mb: 0.5, fontSize: "0.9rem" }}>
                  {item.label}
                </Box>
                <Box sx={{ fontSize: "0.8rem", opacity: 0.8 }}>
                  {item.description}
                </Box>
              </Box>
            }
            placement="left"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "rgba(0,0,0,0.9)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  backdropFilter: "blur(10px)",
                },
              },
            }}
          >
            <Box
              onClick={() => scrollToSection(item.section, index)}
              sx={{
                width: 48,
                height: 48,
                mb: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                cursor: "pointer",
                borderRadius: "50%",
                bgcolor:
                  activeRightNav === index
                    ? "rgba(74, 144, 226, 0.2)"
                    : "transparent",
                border:
                  activeRightNav === index
                    ? "2px solid #4A90E2"
                    : "2px solid transparent",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: activeRightNav === index ? "scale(1.1)" : "scale(1)",
                filter:
                  activeRightNav === index
                    ? "drop-shadow(0 0 15px rgba(74, 144, 226, 0.6))"
                    : "none",
                "&:hover": {
                  bgcolor: "rgba(74, 144, 226, 0.15)",
                  transform: "scale(1.15)",
                  border: "2px solid rgba(74, 144, 226, 0.6)",
                  filter: "drop-shadow(0 0 20px rgba(74, 144, 226, 0.8))",
                  boxShadow: "0 8px 25px rgba(74, 144, 226, 0.4)",
                },
              }}
            >
              {item.icon}
            </Box>
          </Tooltip>
        ))}

        {/* Progress indicator */}
        <Box
          sx={{
            position: "absolute",
            left: -12,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {rightNavItems.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor:
                  activeRightNav === index
                    ? "#4A90E2"
                    : "rgba(255,255,255,0.3)",
                transition: "all 0.4s ease",
                cursor: "pointer",
                border:
                  activeRightNav === index
                    ? "2px solid rgba(74, 144, 226, 0.5)"
                    : "none",
                transform: activeRightNav === index ? "scale(1.2)" : "scale(1)",
                boxShadow:
                  activeRightNav === index
                    ? "0 0 15px rgba(74, 144, 226, 0.6)"
                    : "none",
                "&:hover": {
                  transform: "scale(1.3)",
                  bgcolor: "#4A90E2",
                },
              }}
              onClick={() =>
                scrollToSection(rightNavItems[index].section, index)
              }
            />
          ))}
        </Box>
      </Box>)}

      

      {/* Main Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          minHeight: "100vh",
        }}
      >
        {/* Navigation Header */}
        <AppBar
          position="fixed"
          sx={{
            bgcolor: scrolled ? "rgba(0, 0, 0, 0.8)" : "transparent",
            backdropFilter: scrolled ? "blur(20px)" : "none",
            transition: "all 0.4s ease",
            boxShadow: scrolled ? "0 8px 30px rgba(0,0,0,0.4)" : 0,
            borderBottom: scrolled ? "1px solid rgba(255,255,255,0.1)" : "none",
            left: 0,
            right: 0,
            width: "100%",
          }}
        >
          <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
            <Box
              sx={{
                bgcolor: "linear-gradient(45deg, #e91e63, #4A90E2)",
                background: "linear-gradient(45deg, #e91e63, #4A90E2)",
                color: "white",
                px: 3,
                py: 1.5,
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: "1.2rem",
                mr: 4,
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(233, 30, 99, 0.3)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(233, 30, 99, 0.4)",
                },
              }}
              onClick={() => scrollToSection("introduction", 0)}
            >
              🐱 HypeCat
            </Box>

            <Button
              data-aos="fade-right"
              data-aos-duration="800"
              data-aos-delay="600"
              onClick={() => scrollToSection("introduction", 0)}
              sx={{
                color:
                  activeLeftNav === 0 ? "#e91e63" : "rgba(255,255,255,0.8)",
                mr: 3,
                px: 2,
                py: 1,
                borderRadius: "8px",
                fontWeight: "600",
                bgcolor:
                  activeLeftNav === 0
                    ? "rgba(233, 30, 99, 0.1)"
                    : "transparent",
                "&:hover": {
                  bgcolor: "rgba(233, 30, 99, 0.1)",
                  color: "#e91e63",
                },
              }}
            >
              <HomeIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
              Trang Chủ
            </Button>

            <Button
              onClick={() => scrollToSection("transaction", 1)}
              sx={{
                color:
                  activeLeftNav === 1 ? "#4A90E2" : "rgba(255,255,255,0.8)",
                mr: 3,
                px: 2,
                py: 1,
                borderRadius: "8px",
                fontWeight: "600",
                bgcolor:
                  activeLeftNav === 1
                    ? "rgba(74, 144, 226, 0.1)"
                    : "transparent",
                "&:hover": {
                  bgcolor: "rgba(74, 144, 226, 0.1)",
                  color: "#4A90E2",
                },
              }}
            >
              <Store sx={{ mr: 1, fontSize: "1.2rem" }} />
              Chợ Thẻ
            </Button>

            <Button
              onClick={() => scrollToSection("livestream", 2)}
              sx={{
                color:
                  activeLeftNav === 2 ? "#FF9800" : "rgba(255,255,255,0.8)",
                mr: 3,
                px: 2,
                py: 1,
                borderRadius: "8px",
                fontWeight: "600",
                bgcolor:
                  activeLeftNav === 2
                    ? "rgba(255, 152, 0, 0.1)"
                    : "transparent",
                "&:hover": {
                  bgcolor: "rgba(255, 152, 0, 0.1)",
                  color: "#FF9800",
                },
              }}
            >
              <VideoCall sx={{ mr: 1, fontSize: "1.2rem" }} />
              Live Stream
            </Button>

            <Button
              onClick={() => scrollToSection("whychoose", 3)}
              sx={{
                color:
                  activeLeftNav === 3 ? "#4CAF50" : "rgba(255,255,255,0.8)",
                mr: 3,
                px: 2,
                py: 1,
                borderRadius: "8px",
                fontWeight: "600",
                bgcolor:
                  activeLeftNav === 3
                    ? "rgba(76, 175, 80, 0.1)"
                    : "transparent",
                "&:hover": {
                  bgcolor: "rgba(76, 175, 80, 0.1)",
                  color: "#4CAF50",
                },
              }}
            >
              <Star sx={{ mr: 1, fontSize: "1.2rem" }} />
              Tại Sao Chọn
            </Button>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              sx={{
                color: "#4A90E2",
                border: "2px solid #4A90E2",
                mr: 2,
                px: 3,
                py: 1,
                borderRadius: "25px",
                fontWeight: "600",
                "&:hover": {
                  bgcolor: "rgba(74, 144, 226, 0.1)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(74, 144, 226, 0.3)",
                },
              }}
            >
              <ShoppingCart sx={{ mr: 1, fontSize: "1.1rem" }} />
              Giỏ hàng (0)
            </Button>

            <IconButton
              sx={{
                bgcolor: "linear-gradient(45deg, #e91e63, #c2185b)",
                background: "linear-gradient(45deg, #e91e63, #c2185b)",
                color: "white",
                width: 48,
                height: 48,
                "&:hover": {
                  bgcolor: "linear-gradient(45deg, #c2185b, #ad1457)",
                  background: "linear-gradient(45deg, #c2185b, #ad1457)",
                  transform: "scale(1.05)",
                  boxShadow: "0 8px 20px rgba(233, 30, 99, 0.4)",
                },
              }}
            >
              🔒
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* All Sections with enhanced AOS animations */}
        <Box
          id="introduction"
          sx={{
            width: "100%",
            minHeight: "100vh",
            scrollMarginTop: "80px",
          }}
        >
          <IntroductionHypeCat />
        </Box>

        <Box
          data-aos="fade-up"
          data-aos-duration="1500"
          data-aos-delay="200"
          data-aos-easing="ease-out-cubic"
          data-aos-mirror="true"
          id="transaction"
          sx={{
            width: "100%",
            minHeight: "100vh",
            scrollMarginTop: "80px",
          }}
        >
          <TransactionHypeCat />
        </Box>

        <Box
          data-aos="fade-right"
          data-aos-duration="1500"
          data-aos-delay="300"
          data-aos-easing="ease-out-cubic"
          data-aos-mirror="true"
          id="livestream"
          sx={{
            width: "100%",
            minHeight: "100vh",
            scrollMarginTop: "80px",
          }}
        >
          <LiveStreamHypeCat />
        </Box>

        <Box
          data-aos="fade-up"
          data-aos-duration="1500"
          data-aos-delay="400"
          data-aos-easing="ease-out-cubic"
          data-aos-mirror="true"
          id="whychoose"
          sx={{
            width: "100%",
            minHeight: "100vh",
            scrollMarginTop: "80px",
          }}
        >
          <WhyChooseHypeCat />
        </Box>

        {/* Enhanced Footer */}
        <Box
          sx={{
            py: 8,
            bgcolor: "rgba(0,0,0,0.9)",
            backdropFilter: "blur(20px)",
            borderTop: "2px solid rgba(255,255,255,0.1)",
            width: "100%",
          }}
        >
          <Box maxWidth="lg" sx={{ mx: "auto", px: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 4,
                mb: 6,
              }}
            >
              {[
                {
                  label: "🏠 Giới Thiệu",
                  section: "introduction",
                  color: "#e91e63",
                },
                {
                  label: "🛒 Chợ Thẻ",
                  section: "transaction",
                  color: "#4A90E2",
                },
                {
                  label: "📺 Live Stream",
                  section: "livestream",
                  color: "#FF9800",
                },
                {
                  label: "⭐ Tại Sao Chọn",
                  section: "whychoose",
                  color: "#4CAF50",
                },
              ].map((item, index) => (
                <Button
                  key={index}
                  onClick={() => scrollToSection(item.section, index)}
                  sx={{
                    color: "white",
                    bgcolor: `${item.color}20`,
                    border: `2px solid ${item.color}60`,
                    px: 4,
                    py: 2,
                    borderRadius: "25px",
                    fontWeight: "600",
                    fontSize: "1rem",
                    "&:hover": {
                      bgcolor: `${item.color}30`,
                      transform: "translateY(-3px)",
                      boxShadow: `0 10px 25px ${item.color}40`,
                      border: `2px solid ${item.color}`,
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* <Box
              sx={{
                textAlign: "center",
                color: "rgba(255,255,255,0.7)",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                pt: 6,
                fontSize: "1.1rem",
              }}
            >
              <Box sx={{ mb: 2, fontSize: "1.2rem", fontWeight: "600" }}>
                🐱 © 2024 HypeCat - Cộng đồng Pokémon TCG hàng đầu Việt Nam 🐱
              </Box>
              <Box sx={{ opacity: 0.8 }}>
                Kết nối • Chia sẻ • Trải nghiệm • Chiến thắng
              </Box>
            </Box> */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingIntro;
