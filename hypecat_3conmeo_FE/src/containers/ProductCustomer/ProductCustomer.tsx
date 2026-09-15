/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Paper,
  InputAdornment,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Search, Category, MonetizationOn } from "@mui/icons-material";
import productApi from "../../api/services/ProductApi/productAPI";
import { formatMoney } from "../../utils/fn";
import CustomPagination from "../../components/pagination/CustomPagination";
import categoryApi from "../../api/services/CategoryApi/categoryAPI";
import { type CategoryType } from "../../types/CategoryType";
import { useNavigate, useSearchParams } from "react-router-dom";
import config from "../../configs";

// Types
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
  description: string;
  status: string;
  category: ProductCategory;
  images: ProductImage[];
  batchDetails: (BatchDetail | null)[];
  boxId?: number;
  cover?: string;
}

const ProductCustomer: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId: string = searchParams.get("CategoryId")?.toString() ?? "";
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategory] = useState<CategoryType[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Search term state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeSearchTerm, setActiveSearchTerm] = useState<string>(""); // The search term being used for API calls
  const [filters, setFilters] = useState<{ [key: string]: string }>({
    Category: "",
  });

  const postsPerPage = 8;
  const [page, setPage] = useState<number>(1);
  const productRef = useRef<HTMLElement>(null);

  const updateFilter = (key: string, value: string) => {
    if (key === "SearchTerm") {
      setSearchTerm(value); // Update the input field immediately
      searchParams.set("SearchTerm", value);
      setSearchParams(searchParams);
    } else {
      setSearchTerm("");
      setFilters((prev) => ({ ...prev, [key]: value }));

      const data = categories.filter((cate) => {
        const cateId = cate?.name?.toLowerCase() == value?.toLowerCase();
        return cateId;
      });

      searchParams.set(
        "CategoryId",
        data.map((cate: any) => cate.id).join(",")
      );
      setSearchParams(searchParams);
      // Reset page to 1 when filtering
      setPage(1);
    }
  };

  // Handle search when Enter is pressed or search icon is clicked
  const handleSearch = () => {
    setActiveSearchTerm(searchTerm);
    setPage(1);
  };

  // Handle Enter key press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const fetchCategories = async () => {
    const params = {
      pageSize: 1000,
    };
    const response: any = await categoryApi.getCategoryList(params);
    setCategory(response?.items);

    //check if category search from home page
    if (categoryId) {
      const data = response?.items?.filter(
        (item: any) => item.id == categoryId
      );
      updateFilter(
        "Category",
        data.map((value: any) => value.name)
      );
    } else {
      return;
    }
  };

  const fetchProducts = async (
    pageIndex: number,
    pageSize: number,
    searchTerm: string,
    otherFilters: any
  ) => {
    try {
      const params = {
        pageIndex,
        pageSize,
        // Only include SearchTerm if it has a value
        ...(searchTerm.trim() && { SearchTerm: searchTerm.trim() }),
        ...otherFilters,
      };
      setLoading(true);
      const response = await productApi.getProductCustomerList(params);
      setProducts(response.items);
      setTotalItems(response.totalItemsCount);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(page - 1, postsPerPage, activeSearchTerm, filters);
  }, [page, activeSearchTerm, filters]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (productRef.current) {
      productRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [products]);

  useEffect(() => {
    const currentCategoryId = searchParams.get("CategoryId") ?? "";
    const currentSearchTerm = searchParams.get("SearchTerm") ?? "";

    // Cập nhật filters nếu URL thay đổi
    if (currentCategoryId || currentSearchTerm) {
      const matchedCategory = categories.find(
        (cate) => String(cate.id) === currentCategoryId
      );

      if (matchedCategory) {
        setFilters({
          Category: matchedCategory.name,
        });
      }

      setActiveSearchTerm(currentSearchTerm);
    }
  }, [searchParams, categories]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        position: "relative",
        top: 100,
        paddingBottom: "200px",
        scrollMarginTop: "170px",
      }}
      component="div"
      ref={productRef}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
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
          <Grid container spacing={3}>
            {/* Sidebar */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  position: "sticky",
                  top: 20,
                  background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    background: "linear-gradient(45deg, #2196F3, #21CBF3)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Search sx={{ mr: 1, color: "#2196F3" }} />
                  Bộ Lọc
                </Typography>

                {/* Search Box */}
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => updateFilter("SearchTerm", e.target.value)}
                  onKeyDown={handleKeyPress}
                  sx={{ mb: 3 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleSearch}
                            edge="end"
                            aria-label="search"
                            sx={{
                              color: "primary.main",
                              "&:hover": {
                                backgroundColor: "primary.light",
                                color: "white",
                              },
                            }}
                          >
                            <Search />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                {/* Category Filter */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    value={filters.Category}
                    label="Danh mục"
                    onChange={(e) => updateFilter("Category", e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Tất cả danh mục</em>
                    </MenuItem>
                    {categories?.map((category) => (
                      <MenuItem key={category.id} value={category.name}>
                        <Category sx={{ mr: 1 }} />
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Results Count */}
                <Paper
                  elevation={1}
                  sx={{ p: 2, textAlign: "center", bgcolor: "#e3f2fd" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Tìm thấy <strong>{products.length}</strong> sản phẩm
                  </Typography>
                </Paper>
              </Paper>
            </Grid>

            {/* Main Content */}
            <Grid size={{ xs: 12, md: 9 }}>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
                    <Box
                      onClick={() =>
                        navigate(
                          config.customerRoutes.productDetail.replace(
                            ":id",
                            product.id.toString()
                          )
                        )
                      }
                    >
                      <Card
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
                          image={
                            product.cover ||
                            "https://via.placeholder.com/300x200?text=No+Image"
                          }
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
                            <Chip
                              label={product.status}
                              color="success"
                              size="small"
                              sx={{ minWidth: "auto" }}
                            />
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2, minHeight: "40px" }}
                          >
                            {product.description}
                          </Typography>

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
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <CustomPagination
                currentPage={page}
                onPageChange={handleChangePage}
                itemsPerPage={postsPerPage}
                totalItems={totalItems}
                sibling={2}
                sx={{ marginTop: 2, maxWidth: "100% !important" }}
              />

              {products.length === 0 && !loading && (
                <Paper elevation={1} sx={{ p: 4, textAlign: "center", mt: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ProductCustomer;
