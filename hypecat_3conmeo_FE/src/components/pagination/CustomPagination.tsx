import React, { useState, type CSSProperties } from "react";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Chip,
  Stack,
  Fade,
  Pagination,
  Button,
  Container,
} from "@mui/material";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";

// 🌑 Giao diện tối + màu xanh dương hiện đại
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4A9EFF",
    },
    background: {
      default: "#1a1a1a",
      paper: "#2d2d2d",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
    divider: "#404040",
  },
});

interface CustomPaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  showQuickJump?: boolean;
  sibling?: number;
  boundaryCount?: number;
  showFirstLast?: boolean;
  size?: "small" | "medium" | "large";
  sx?: CSSProperties;
}

// 🧱 Container pagination
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "16px",
  backgroundColor: "#2d2d2d",
  border: "1px solid #404040",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  color: "white",
}));

// 🎯 Pagination chính
const StyledPagination = styled(Pagination)(() => ({
  "& .MuiPaginationItem-root": {
    fontWeight: 600,
    minWidth: "40px",
    height: "40px",
    borderRadius: "10px",
    color: "#ffffff",
    backgroundColor: "#2d2d2d",
    border: "1px solid #404040",
    transition: "0.2s",

    "&:hover": {
      backgroundColor: "#4A9EFF",
      color: "#ffffff",
      borderColor: "#4A9EFF",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 12px rgba(74, 158, 255, 0.3)",
    },

    "&.Mui-selected": {
      backgroundColor: "#4A9EFF",
      color: "#ffffff",
      borderColor: "#4A9EFF",
      boxShadow: "0 4px 10px rgba(74, 158, 255, 0.4)",

      "&:hover": {
        backgroundColor: "#2E7BD6",
        transform: "translateY(-2px)",
      },
    },

    "&.Mui-disabled": {
      color: "#777",
      backgroundColor: "#1a1a1a",
      borderColor: "#2d2d2d",
    },
  },
}));

// 🔹 Chip thông báo
const InfoChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "#4A9EFF",
  color: "#ffffff",
  fontWeight: 600,
  fontSize: "0.875rem",
  "& .MuiChip-label": {
    padding: theme.spacing(1, 2),
  },
}));

// 🔎 Ô nhập nhảy trang
const QuickJumpContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  borderRadius: "12px",
  backgroundColor: "#1a1a1a",
  border: "1px solid #404040",
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#2d2d2d",
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "#404040",
    },
    "&:hover fieldset": {
      borderColor: "#4A9EFF",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#4A9EFF",
    },
  },
  "& .MuiInputBase-input": {
    color: "#ffffff",
    textAlign: "center",
    width: "60px",
  },
}));

const CustomPagination: React.FC<CustomPaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  showInfo = true,
  showQuickJump = true,
  sibling = 1,
  boundaryCount = 1,
  showFirstLast = true,
  size = "large",
  sx,
}) => {
  const [quickJumpValue, setQuickJumpValue] = useState("");
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    onPageChange(page);
  };

  const handleQuickJump = () => {
    const page = parseInt(quickJumpValue);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setQuickJumpValue("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleQuickJump();
    }
  };

  if (totalPages <= 1) return null;

  return (
    <ThemeProvider theme={darkTheme}>
      <Fade in timeout={500}>
        <Container sx={{ ...sx }}>
          <StyledPaper>
            <Stack spacing={3}>
              {/* ✅ Thông tin kết quả */}
              {showInfo && (
                <Box display="flex" justifyContent="center">
                  <InfoChip
                    label={`Hiển thị ${startItem} - ${endItem} trên tổng ${totalItems} kết quả`}
                  />
                </Box>
              )}

              {/* ✅ Phân trang */}
              <Box display="flex" justifyContent="center">
                <StyledPagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  size={size}
                  shape="rounded"
                  variant="outlined"
                  siblingCount={sibling}
                  boundaryCount={boundaryCount}
                  showFirstButton={showFirstLast}
                  showLastButton={showFirstLast}
                />
              </Box>

              {/* ✅ Chuyển nhanh và trang hiện tại */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
              >
                {showQuickJump && (
                  <QuickJumpContainer>
                    <Typography variant="body2" color="text.secondary">
                      Đi tới trang:
                    </Typography>
                    <StyledTextField
                      size="small"
                      type="number"
                      value={quickJumpValue}
                      onChange={(e) => setQuickJumpValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      inputProps={{ min: 1, max: totalPages }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleQuickJump}
                      disabled={!quickJumpValue}
                      sx={{
                        borderRadius: "8px",
                        backgroundColor: "#4A9EFF",
                        "&:hover": {
                          backgroundColor: "#2E7BD6",
                        },
                      }}
                    >
                      Đi
                    </Button>
                  </QuickJumpContainer>
                )}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  Trang {currentPage} / {totalPages}
                </Typography>
              </Stack>
            </Stack>
          </StyledPaper>
        </Container>
      </Fade>
    </ThemeProvider>
  );
};

export default CustomPagination;
