/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Typography,
  //RadioGroup,
  //FormControlLabel,
  //Radio,
  Divider,
  Button,
  Card,
  Chip,
  LinearProgress,
  useTheme,
  alpha,
} from "@mui/material";
import {
  //LocalShipping,
  //Store,
  //FlashOn,
  Lock,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../configs";

interface CartSummaryProps {
  subtotal: number;
  //shipping: number;
  //onShippingChange: (cost: number) => void;
  itemCount?: number;
  navigateTo?: string;
  hideContinueButton?: boolean;
  extraState?: Record<string, any>;
}

export const CartSummary = ({
  subtotal,
  //shipping,
  //onShippingChange,
  itemCount = 0,
  navigateTo,
  hideContinueButton = false,
  extraState = {},
}: CartSummaryProps) => {
  const theme = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  //const freeShippingThreshold = 500000; // 500k VND
  //const progressToFreeShip = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  //const remainingForFreeShip = Math.max(freeShippingThreshold - subtotal, 0);

  const total = subtotal;

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Mock checkout process
    setTimeout(() => {
      navigate(navigateTo || config.customerRoutes.cart, {
        state: { subtotal, itemCount, ...extraState },
      });
      setIsProcessing(false);
    }, 2000);
  };

  // const shippingOptions = [
  //     {
  //         value: '0',
  //         cost: 0,
  //         icon: <LocalShipping />,
  //         title: 'Miễn phí vận chuyển',
  //         subtitle: 'Giao hàng 3-5 ngày',
  //         condition: subtotal >= freeShippingThreshold
  //     },
  //     {
  //         value: '25000',
  //         cost: 25000,
  //         icon: <FlashOn />,
  //         title: 'Giao hàng nhanh',
  //         subtitle: 'Giao hàng trong 24h',
  //         condition: true
  //     },
  //     {
  //         value: '15000',
  //         cost: 15000,
  //         icon: <Store />,
  //         title: 'Nhận tại cửa hàng',
  //         subtitle: 'Miễn phí, nhận ngay',
  //         condition: true
  //     },
  // ];

  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        borderRadius: 3,
        bgcolor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h5" fontWeight="700">
          Tóm tắt đơn hàng
        </Typography>
        <Chip
          label={`${itemCount} sản phẩm`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Order Summary */}
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="body1">Tạm tính</Typography>
          <Typography variant="body1" fontWeight="600">
            {subtotal.toLocaleString()}₫
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Total */}
      <Box display="flex" flexDirection="column" mb={3}>
        <Typography variant="h5" fontWeight="700">
          Tổng cộng:
        </Typography>
        <Typography
          variant="h4"
          fontWeight="700"
          color="primary.main"
          alignSelf="flex-end"
        >
          {total.toLocaleString()}₫
        </Typography>
      </Box>

      {/* Checkout Button */}
      {!hideContinueButton && (
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleCheckout}
          disabled={isProcessing}
          startIcon={isProcessing ? null : <Lock />}
          sx={{
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: "600",
            borderRadius: 2,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            boxShadow: theme.shadows[4],
            "&:hover": {
              background: "linear-gradient(45deg, #1976D2 30%, #0288D1 90%)",
              boxShadow: theme.shadows[8],
            },
            "&:disabled": {
              background: alpha(theme.palette.action.disabled, 0.12),
            },
          }}
        >
          {isProcessing ? "Đang xử lý..." : "Tiếp tục"}
        </Button>
      )}

      {isProcessing && <LinearProgress sx={{ mt: 2, borderRadius: 1 }} />}

      {/* Security Badge */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        mt={2}
        gap={1}
      >
        <Lock fontSize="small" color="success" />
        <Typography variant="caption" color="text.secondary">
          Thanh toán được bảo mật bởi SSL 256-bit
        </Typography>
      </Box>
    </Card>
  );
};
