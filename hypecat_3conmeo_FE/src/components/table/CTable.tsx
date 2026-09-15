/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Alert,
  TablePagination,
  Skeleton,
  useMediaQuery,
  Chip,
} from "@mui/material";
import { alpha, keyframes, styled } from "@mui/material/styles";
import React, { type ReactNode, useMemo } from "react";
import moment from "moment";
import { colors } from "../../styles/Color/color";
import { OrderStatus } from "../../enum/OrderStatus";

interface CTableProps {
  tableHeaderTitle?: any;
  data?: any;
  title?: string;
  menuAction?: (row: any) => React.ReactNode;
  selectedData?: any;
  searchTool?: ReactNode;
  eventAction?: ReactNode;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  handleChangeRowsPerPage?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  total: number;
  size: number;
  page: number;
  loading?: boolean;
  emptyMessage?: string;
  sx?: any;
  onRowClick?: (row: any) => void;
  selectedRow?: any;
  hideRowsPerPageOptions?: boolean;
  // New responsive props
  responsiveConfig?: {
    hideFormatsOnMobile?: string[]; // Column formats to hide on mobile (e.g., ['datetime', 'boolean'])
    hideFormatsOnTablet?: string[]; // Column formats to hide on tablet
    hideColumnsOnMobile?: string[]; // Specific column IDs to hide on mobile
    hideColumnsOnTablet?: string[]; // Specific column IDs to hide on tablet
  };
}

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(10px)",
  borderRadius: 16,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
  border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: "70vh",
  overflow: "auto",

  "& .MuiTable-root": {
    minWidth: 650,

    // Responsive table adjustments
    [theme.breakpoints.down("md")]: {
      minWidth: 500,
    },
    [theme.breakpoints.down("sm")]: {
      minWidth: 320,
    },
  },

  "& .MuiTableCell-root": {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    padding: theme.spacing(1.5),
    fontSize: "0.875rem",

    // Responsive padding
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(1),
      fontSize: "0.8rem",
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(0.75),
      fontSize: "0.75rem",
    },
  },

  "& .MuiTableHead-root": {
    backgroundColor: alpha(theme.palette.primary.main, 1),
    position: "sticky",
    top: 0,
    zIndex: 10,

    "& .MuiTableCell-head": {
      fontWeight: 600,
      fontSize: "0.875rem",
      color: colors.white,
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
      borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,

      "&:first-of-type": {
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
      },
      "&:last-of-type": {
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
      },

      [theme.breakpoints.down("md")]: {
        fontSize: "0.8rem",
      },
      [theme.breakpoints.down("sm")]: {
        fontSize: "0.75rem",
      },
    },
  },

  "& .MuiTableBody-root": {
    "& .MuiTableRow-root": {
      transition: "all 0.2s ease-in-out",
      cursor: "default",

      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.06),
        transform: "translateY(-1px)",
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
      },

      "&.clickable": {
        cursor: "pointer",
      },

      "&.selected": {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),

        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.16),
        },
      },

      // Custom row styling based on data attributes
      '&[data-expired="true"]': {
        backgroundColor: alpha(theme.palette.error.main, 0.05),

        "&:hover": {
          backgroundColor: alpha(theme.palette.error.main, 0.1),
        },
      },

      '&[data-expiring-soon="true"]': {
        backgroundColor: alpha(theme.palette.warning.main, 0.05),

        "&:hover": {
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
        },
      },
    },
  },
}));

// Animations
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const LoadingSkeleton = styled(Skeleton)(({ theme }) => ({
  background: `linear-gradient(90deg, ${alpha(
    theme.palette.grey[300],
    0.1
  )} 25%, ${alpha(theme.palette.grey[300], 0.2)} 50%, ${alpha(
    theme.palette.grey[300],
    0.1
  )} 75%)`,
  backgroundSize: "200px 100%",
  animation: `${shimmer} 2s infinite linear`,
  borderRadius: 8,
}));

const CTable: React.FC<CTableProps> = ({
  data,
  tableHeaderTitle,
  title,
  menuAction,
  selectedData,
  searchTool,
  handleChangePage,
  handleChangeRowsPerPage,
  eventAction,
  page,
  size,
  total,
  loading = false,
  emptyMessage = "Không có dữ liệu",
  sx,
  onRowClick,
  selectedRow,
  responsiveConfig,
  hideRowsPerPageOptions,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Default responsive configuration - hide columns by format type
  const defaultResponsiveConfig = useMemo(() => {
    return {
      // Hide these formats on mobile (small screens)
      hideFormatsOnMobile: ["datetime", "date", "boolean", "array", "number"],
      // Hide these formats on tablet (medium screens)
      hideFormatsOnTablet: ["datetime", "boolean"],
      // You can also hide specific column IDs
      hideColumnsOnMobile: [],
      hideColumnsOnTablet: [],
    };
  }, []);

  const finalResponsiveConfig = responsiveConfig || defaultResponsiveConfig;

  // Filter visible columns based on screen size and format types
  const visibleColumns = useMemo(() => {
    if (!tableHeaderTitle) return [];

    return tableHeaderTitle.filter((column: any) => {
      // Check if column format should be hidden on mobile
      if (isMobile) {
        if (
          finalResponsiveConfig.hideFormatsOnMobile?.includes(column.format)
        ) {
          return false;
        }
        if (finalResponsiveConfig.hideColumnsOnMobile?.includes(column.id)) {
          return false;
        }
      }

      // Check if column format should be hidden on tablet (but not mobile)
      if (isTablet && !isMobile) {
        if (
          finalResponsiveConfig.hideFormatsOnTablet?.includes(column.format)
        ) {
          return false;
        }
        if (finalResponsiveConfig.hideColumnsOnTablet?.includes(column.id)) {
          return false;
        }
      }

      return true;
    });
  }, [tableHeaderTitle, isMobile, isTablet, finalResponsiveConfig]);

  function getNestedValue(obj: any, path: any) {
    return path
      .split(".")
      .reduce((acc: any, part: any) => acc && acc[part], obj);
  }
  const StyledChip = styled(Chip)(({ theme }) => ({
    fontWeight: 600,
    borderRadius: 12,
    fontSize: "0.75rem",
    height: 28,
    border: "1px solid",
    backdropFilter: "blur(8px)",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.15)}`,
    },
  }));
  function formatValue(value: any, column: any, row?: any) {
    // Check if column has custom render function
    if (column.render && typeof column.render === "function") {
      return column.render(value, row);
    }

    // Date formatting
    if (column.format === "date") {
      return value ? moment(value).format("DD/MM/YYYY") : "-";
    }

    // DateTime formatting - show shorter format on mobile
    if (column.format === "datetime") {
      if (!value) return "không có thời hạn";
      return isMobile
        ? moment(value).format("DD/MM")
        : moment(value).format("DD/MM/YYYY HH:mm");
    }

    // Number formatting
    if (column.format === "number") {
      return typeof value === "number" ? value.toLocaleString("vi-VN") : "-";
    }

    // Boolean formatting
    if (column.format === "boolean") {
      return value ? "Có" : "Không";
    }

    // Array formatting - truncate on mobile
    if (column.format === "array") {
      if (Array.isArray(value)) {
        const joined = value.join(", ");
        return isMobile && joined.length > 20
          ? joined.substring(0, 20) + "..."
          : joined;
      }
      return value || "-";
    }

    // Role formatting
    if (column.format === "role") {
      const roleMap: { [key: string]: string } = {
        Customer: "Khách hàng",
        Admin: "Quản trị viên",
        Manager: "Quản lý",
        Staff: "Nhân viên",
      };
      return roleMap[value] || "-";
    }

    // Price formatting - shorter format on mobile
    if (column.format === "price") {
      if (typeof value === "number") {
        const formatted = value.toLocaleString("vi-VN");
        return isMobile ? formatted + "đ" : formatted + " VND";
      }
      return "N/A";
    }

    if (column.format && column.format === "image") {
      const imageSize = isMobile ? 40 : 56;
      return (
        <Box
          sx={{
            position: "relative",
            display: "inline-block",
            "&:hover": {
              transform: "scale(1.1)",
              transition: "transform 0.2s ease-in-out",
            },
          }}
        >
          <img
            src={value}
            alt="product"
            style={{
              width: `${imageSize}px`,
              height: `${imageSize}px`,
              borderRadius: isMobile ? "8px" : "12px",
              objectFit: "cover",
              border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
            }}
          />
        </Box>
      );
    }

    //IMAGES formatting - smaller on mobile
    if (column.format && column.format === "images") {
      if (Array.isArray(value) && value.length > 0) {
        const imageSize = isMobile ? 40 : 56;
        return (
          <Box
            sx={{
              position: "relative",
              display: "inline-block",
              "&:hover": {
                transform: "scale(1.1)",
                transition: "transform 0.2s ease-in-out",
              },
            }}
          >
            <img
              src={value[0]?.urlPath}
              alt="product"
              style={{
                width: `${imageSize}px`,
                height: `${imageSize}px`,
                borderRadius: isMobile ? "8px" : "12px",
                objectFit: "cover",
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: `0 4px 12px ${alpha(
                  theme.palette.common.black,
                  0.1
                )}`,
              }}
            />
          </Box>
        );
      }
    }

    // Deleted status
    if (column.format && column.format === "deleted") {
      switch (value) {
        case true:
          return (
            <StyledChip
              label="Không khả dụng"
              sx={{
                bgcolor: alpha(colors.red_200, 0.9),
                color: colors.red_800,
                borderColor: colors.red_400,
              }}
            />
          );
        case false:
          return (
            <StyledChip
              label="Đang khả dụng"
              sx={{
                bgcolor: alpha(colors.green_200, 0.9),
                color: colors.green_800,
                borderColor: colors.green_400,
              }}
            />
          );
        default:
          return "-";
      }
    }

    ///// Status formatting
    if (column.format && column.format === "status") {
      switch (value) {
        case "Active":
          return (
            <StyledChip
              label="Hoạt động"
              sx={{
                bgcolor: alpha(colors.green_200, 0.9),
                color: colors.green_800,
                borderColor: colors.green_400,
              }}
            />
          );
        case "InActive":
          return (
            <StyledChip
              label="Không hoạt động"
              sx={{
                bgcolor: alpha(colors.red_200, 0.9),
                color: colors.red_600,
                borderColor: colors.red_400,
              }}
            />
          );
        default:
          return "-";
      }
    }

    // Truncate long text on mobile
    if (typeof value === "string" && isMobile && value.length > 30) {
      return value.substring(0, 30) + "...";
    }
    // Order status formatting
    if (column.format && column.format === "orderStatus") {
      const statusConfig = {
        [OrderStatus.PENDING]: {
          label: "Chờ xử lý",
          bgcolor: alpha(colors.yellow_200, 0.9),
          color: colors.yellow_800,
          borderColor: colors.yellow_400,
        },
        [OrderStatus.FINISH]: {
          label: "Đã thanh toán",
          bgcolor: alpha(colors.green_200, 0.9),
          color: colors.green_800,
          borderColor: colors.green_400,
        },
        [OrderStatus.CANCELED]: {
          label: "Đã hủy",
          bgcolor: alpha(colors.red_200, 0.9),
          color: colors.red_800,
          borderColor: colors.red_400,
        },
        [OrderStatus.PREPARED]: {
          label: "Đã chuẩn bị",
          bgcolor: alpha(colors.blue_200, 0.9),
          color: colors.blue_800,
          borderColor: colors.blue_400,
        },
      };

      const config = statusConfig[value];
      if (config) {
        return (
          <StyledChip
            label={config.label}
            sx={{
              bgcolor: config.bgcolor,
              color: config.color,
              borderColor: config.borderColor,
            }}
          />
        );
      }
      return "-";
    }

    //category type formatting
    if (column.format && column.format === "categoryType") {
      if (value === "Product") {
        return <Typography variant="body2">Loại sản phẩm</Typography>;
      } else if (value === "News") {
        return <Typography variant="body2">Loại tin tức</Typography>;
      }
    }

    return value;
  }

  const renderSkeletonRows = () => {
    return Array.from({ length: size }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell>
          <LoadingSkeleton variant="text" width={30} height={20} />
        </TableCell>
        {visibleColumns?.map((column: any) => (
          <TableCell key={`skeleton-${column.id}-${index}`}>
            <LoadingSkeleton
              variant="rectangular"
              width={Math.random() * 100 + 80}
              height={20}
            />
          </TableCell>
        ))}
        {menuAction && (
          <TableCell>
            <LoadingSkeleton variant="circular" width={32} height={32} />
          </TableCell>
        )}
      </TableRow>
    ));
  };

  const isClickableRow = Boolean(onRowClick || selectedData);
  const hasData = data && data.length > 0;

  return (
    <Box
      sx={{
        minWidth: isMobile ? "100%" : "600px",
        mx: "auto",
        p: isMobile ? 1 : 2,
        ...sx,
      }}
    >
      <StyledCard>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          {title && (
            <CardHeader
              title={
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {title}
                </Typography>
              }
              sx={{ pb: 0, textAlign: isMobile ? "center" : "left" }}
            />
          )}
          {eventAction && (
            <Box
              sx={{
                pr: isMobile ? 0 : 2,
                display: "flex",
                gap: 1,
                justifyContent: isMobile ? "center" : "flex-end",
                width: isMobile ? "100%" : "auto",
              }}
            >
              {eventAction}
            </Box>
          )}
        </Box>

        {/* Search Tool Section */}
        {searchTool && <Box sx={{ px: 2, pb: 1 }}>{searchTool}</Box>}

        <CardContent sx={{ pt: 1, px: isMobile ? 1 : 2 }}>
          <Box sx={{ position: "relative" }}>
            {/* Loading Overlay */}
            {loading && renderSkeletonRows()}

            <StyledTableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        minWidth: isMobile ? "40px" : "60px",
                        padding: isMobile ? "8px 4px" : undefined,
                      }}
                    >
                      #
                    </TableCell>
                    {visibleColumns?.map((column: any) => (
                      <TableCell
                        key={column.id}
                        align={column.align || "left"}
                        sx={{
                          fontWeight: "bold",
                          minWidth: isMobile
                            ? column.minWidth
                              ? Math.min(column.minWidth, 100)
                              : "auto"
                            : column.minWidth || "auto",
                          maxWidth: isMobile
                            ? column.maxWidth
                              ? Math.min(column.maxWidth, 150)
                              : "150px"
                            : column.maxWidth || "none",
                          padding: isMobile ? "8px 4px" : undefined,
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                    {menuAction && (
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          minWidth: isMobile ? "60px" : "100px",
                          textAlign: "center",
                          padding: isMobile ? "8px 4px" : undefined,
                        }}
                      >
                        {isMobile ? "..." : "Thao tác"}
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!hasData ? (
                    <TableRow>
                      <TableCell
                        colSpan={
                          (visibleColumns?.length || 0) + (menuAction ? 2 : 1)
                        }
                        align="center"
                        sx={{ py: 6 }}
                      >
                        <Alert
                          severity="info"
                          sx={{
                            border: "none",
                            bgcolor: "transparent",
                            justifyContent: "center",
                          }}
                        >
                          {emptyMessage}
                        </Alert>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((row: any, index: number) => (
                      <TableRow
                        key={row.id || index}
                        data-expired={row["data-expired"]}
                        data-expiring-soon={row["data-expiring-soon"]}
                        className={`
                          ${isClickableRow ? "clickable" : ""}
                          ${selectedRow === row ? "selected" : ""}
                        `.trim()}
                        onClick={() => {
                          if (onRowClick) onRowClick(row);
                          if (selectedData) selectedData(row);
                        }}
                      >
                        <TableCell
                          sx={{
                            fontWeight: "medium",
                            padding: isMobile ? "8px 4px" : undefined,
                          }}
                        >
                          {page * size + index + 1}
                        </TableCell>
                        {visibleColumns?.map((column: any) => (
                          <TableCell
                            key={column.id}
                            align={column.align || "left"}
                            sx={{
                              minWidth: isMobile
                                ? column.minWidth
                                  ? Math.min(column.minWidth, 100)
                                  : "auto"
                                : column.minWidth || "auto",
                              maxWidth: isMobile
                                ? column.maxWidth
                                  ? Math.min(column.maxWidth, 150)
                                  : "150px"
                                : column.maxWidth || "none",
                              wordBreak: column.wordBreak || "normal",
                              padding: isMobile ? "8px 4px" : undefined,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {column.id === "imageURL" ? (
                              <Box
                                component="img"
                                src={getNestedValue(row, column.id)}
                                alt="Thumbnail"
                                sx={{
                                  width: isMobile ? 40 : 50,
                                  height: isMobile ? 40 : 50,
                                  borderRadius: 2,
                                  objectFit: "cover",
                                  border: `1px solid ${alpha(
                                    theme.palette.divider,
                                    0.2
                                  )}`,
                                }}
                                onError={(e: any) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : column.id === "imageURLs" ? (
                              <Box
                                component="img"
                                src={getNestedValue(row, column.id)?.[0]}
                                alt="Thumbnail"
                                sx={{
                                  width: isMobile ? 40 : 50,
                                  height: isMobile ? 40 : 50,
                                  borderRadius: 2,
                                  objectFit: "cover",
                                  border: `1px solid ${alpha(
                                    theme.palette.divider,
                                    0.2
                                  )}`,
                                }}
                                onError={(e: any) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              formatValue(
                                getNestedValue(row, column.id),
                                column,
                                row
                              )
                            )}
                          </TableCell>
                        ))}
                        {menuAction && (
                          <TableCell
                            align="center"
                            sx={{
                              padding: isMobile ? "8px 4px" : undefined,
                            }}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click
                            }}
                          >
                            {menuAction(row)}
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <TablePagination
                rowsPerPageOptions={
                  hideRowsPerPageOptions
                    ? []
                    : isMobile
                    ? [5, 10, 25]
                    : [5, 10, 25, 50, 100]
                }
                component="div"
                count={total ?? 0}
                rowsPerPage={size ?? 10}
                page={page ?? 0}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={isMobile ? "Rows:" : "Số hàng trên trang:"}
                labelDisplayedRows={({ from, to, count }) => {
                  return `${from}–${to} trên ${
                    count !== -1 ? count : `nhiều hơn ${to}`
                  }`;
                }}
                showFirstButton={!isMobile}
                showLastButton={!isMobile}
                sx={{
                  "& .MuiTablePagination-toolbar": {
                    paddingLeft: isMobile ? 1 : 2,
                    paddingRight: isMobile ? 1 : 2,
                  },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    {
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                    },
                }}
              />
            </StyledTableContainer>
          </Box>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default CTable;
