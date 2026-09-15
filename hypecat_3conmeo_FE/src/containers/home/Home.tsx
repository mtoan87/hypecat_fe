import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Category,
  MonetizationOn,
  ArrowForward,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import config from "../../configs";
import images from "../../constants/images";
import productApi from "../../api/services/ProductApi/productAPI";
import { formatMoney } from "../../utils/fn";


interface Slide {
  id: number;
  title?: string;
  subtitle?: string;
  gradient?: string;
  image: string;
}

interface BatchDetail {
  id: number;
  sellingPrice: number;
}

interface ProductCategory {
  id: number;
  name: string;
}

interface ProductImage {
  id: number;
  urlPath: string;
}

interface Product {
  id: number;
  name: string;
  language: string;
  description?: string;
  status: string;
  category: ProductCategory;
  images: ProductImage[];
  batchDetails: (BatchDetail | null)[];
  boxId?: number;
  cover?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: images.loginBackground,
  },
  {
    id: 2,
    image: images.slide2,
  },
  {
    id: 3,
    image: images.slide3,
  },
  {
    id: 4,
    image: images.slide4,
  },
  {
    id: 5,
    image: images.slide5,
  },
];



const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [pokemonProducts, setPokemonProducts] = useState<Product[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  // Swipe functionality
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swipe left
      nextSlide();
    }

    if (touchStartX.current - touchEndX.current < -50) {
      // Swipe right
      prevSlide();
    }
  };

  const scrollToProducts = (): void => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleViewAllProducts = (): void => {
    navigate(config.customerRoutes.productList);
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        const param = {
          pageIndex: 0,
          pageSize: 8,
          IsDescending: true
        }
        const productData = await productApi.getProductCustomerList(param);
        setPokemonProducts(productData?.items)
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchProductData();
  }, []);
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Slider */}
      <Container maxWidth="xl" sx={{ pt: 4, mb: 6 }}>
        <Box
          ref={sliderRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          sx={{
            position: "relative",
            height: isMobile ? 350 : 800,
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(255,215,0,0.3)",
          }}
        >
          {slides.map((slide, index) => (
            <Box
              key={slide.id}
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                opacity: currentSlide === index ? 1 : 0,
                transition: "opacity 1s ease-in-out",
              }}
            >
              {/* Background Image */}
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  objectFit: "contain"
                }}
              />

              {/* Content */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  textAlign: "center",
                  px: 3,
                }}
              >
                <Box
                  sx={{
                    animation:
                      currentSlide === index ? "slideIn 0.8s ease-out" : "none",
                    "@keyframes slideIn": {
                      from: { transform: "translateY(30px)", opacity: 0 },
                      to: { transform: "translateY(0)", opacity: 1 },
                    },
                  }}
                >
                  {slide.title && (
                    <Typography
                      variant={isMobile ? "h3" : "h2"}
                      sx={{
                        fontWeight: "bold",
                        mb: 2,
                        textShadow: "3px 3px 6px rgba(0,0,0,0.5)",
                      }}
                    >
                      {slide.title}
                    </Typography>
                  )}
                  {slide.subtitle && (
                    <Typography
                      variant={isMobile ? "body1" : "h6"}
                      sx={{ mb: 4, textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                    >
                      {slide.subtitle}
                    </Typography>
                  )}
                  {(slide.title || slide.subtitle) && (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={scrollToProducts}
                      sx={{
                        bgcolor: "white",
                        color: "#FF0000",
                        fontWeight: "bold",
                        px: 4,
                        py: 1.5,
                        borderRadius: 50,
                        fontSize: "1.1rem",
                        "&:hover": {
                          bgcolor: "#FFD700",
                          color: "#000",
                          transform: "translateY(-3px)",
                          boxShadow: "0 8px 25px rgba(255,215,0,0.5)",
                        },
                        transition: "all 0.3s",
                      }}
                    >
                      Browse Cards
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          ))}

          {/* Previous Button */}
          <IconButton
            onClick={prevSlide}
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255, 255, 255, 0.8)",
              color: "#333",
              zIndex: 10,
              "&:hover": {
                bgcolor: "rgba(255, 215, 0, 0.9)",
              },
              width: 48,
              height: 48,
            }}
          >
            <ChevronLeft fontSize="large" />
          </IconButton>

          {/* Next Button */}
          <IconButton
            onClick={nextSlide}
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255, 255, 255, 0.8)",
              color: "#333",
              zIndex: 10,
              "&:hover": {
                bgcolor: "rgba(255, 215, 0, 0.9)",
              },
              width: 48,
              height: 48,
            }}
          >
            <ChevronRight fontSize="large" />
          </IconButton>

          {/* Slider Navigation Dots */}
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 1,
              zIndex: 10,
            }}
          >
            {slides.map((_, index) => (
              <Box
                key={index}
                onClick={() => goToSlide(index)}
                sx={{
                  width: currentSlide === index ? 30 : 12,
                  height: 12,
                  borderRadius: currentSlide === index ? 1 : "50%",
                  bgcolor:
                    currentSlide === index
                      ? "#FFD700"
                      : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </Box>
        </Box>
      </Container>

      {/* Products Section */}
      <Container maxWidth="xl" sx={{ pb: 8 }} id="products">
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            mb: 2,
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Sản phẩm
        </Typography>
        <Divider sx={{ mb: 3, borderColor: "rgba(0,0,0,1)", borderWidth: 2 }} />
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {pokemonProducts.map((product) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                  <Card
                    onClick={() => navigate(config.customerRoutes.productDetail.replace(":id", product?.id.toString()))}
                    elevation={3}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.cover}
                      alt={product.name}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{ fontWeight: 600, fontSize: "1.1rem" }}
                        >
                          {product.name}
                        </Typography>


                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={product.category.name}
                          variant="outlined"
                          size="small"
                          icon={<Category />}
                          sx={{ mr: 1, mb: 1 }}
                        />
                      </Box>

                      {product.batchDetails &&
                        product.batchDetails[0] &&
                        product.batchDetails[0]?.sellingPrice ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <MonetizationOn
                            sx={{ color: "primary.main", mr: 0.5 }}
                          />
                          <Typography
                            variant="h6"
                            color="primary"
                            sx={{ fontWeight: 700 }}
                          >
                            {formatMoney(
                              product.batchDetails[0].sellingPrice
                            )}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontStyle: "italic" }}
                        >
                          Liên hệ để biết giá
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* View All Products Button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 6,
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleViewAllProducts}
                endIcon={<ArrowForward />}
                sx={{
                  background:
                    "linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)",
                  color: "white",
                  fontWeight: "bold",
                  px: 5,
                  py: 1.5,
                  borderRadius: 50,
                  fontSize: "1.1rem",
                  boxShadow: "0 4px 15px rgba(33, 150, 243, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #1976D2 0%, #1CB5E0 100%)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 25px rgba(33, 150, 243, 0.5)",
                  },
                  transition: "all 0.3s",
                }}
              >
                Xem tất cả sản phẩm
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Home;