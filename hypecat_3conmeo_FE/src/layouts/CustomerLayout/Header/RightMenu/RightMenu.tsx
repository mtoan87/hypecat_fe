import React from "react";
import { Link } from "react-router-dom";
import AccountSection from "../AccountSection";
import config from "../../../../configs";
// import { useAuthContext } from "../../../../context/AuthContext";
import {
  Box,
  Button,
  Badge,
  IconButton,
  Tooltip,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import { useAuthContext } from "../../../../hooks/useAuth";

// Styled components using MUI's styled API
const StyledRightMenu = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 2),
}));

const StyledCartButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  fontWeight: 500,
  textTransform: "none",
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: theme.palette.primary.dark,
    backgroundColor: theme.palette.primary.main + "14", // 8% opacity
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${theme.palette.primary.main}33`, // 20% opacity
  },
}));

const StyledLoginButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  textTransform: "none",
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2.5),
  boxShadow: `0 2px 8px ${theme.palette.primary.main}4D`, // 30% opacity
  transition: "all 0.3s ease",
  "&:hover": {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    transform: "translateY(-2px)",
    boxShadow: `0 6px 16px ${theme.palette.primary.main}66`, // 40% opacity
  },
  "&:active": {
    transform: "translateY(0)",
  },
}));

const StyledCartIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.main + "14", // 8% opacity
    transform: "scale(1.05)",
  },
}));

const StyledLink = styled(Link)({
  textDecoration: "none",
  color: "inherit",
});

const RightMenu: React.FC = () => {
  const { auth } = useAuthContext();

  const cartItemsCount = 3; // This would come from your cart context/state

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <StyledRightMenu>
      {auth ? (
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            gap: { xs: 1, sm: 2 },
          }}
        >
          <Tooltip title="Giỏ hàng" arrow>
            <StyledLink to={config.customerRoutes.cart}>
              <StyledCartIconButton
                size={isMobile ? "medium" : "large"}
                aria-label="shopping cart"
              ></StyledCartIconButton>
            </StyledLink>
          </Tooltip>

          <Box sx={{ ml: 1 }}>
            <AccountSection />
          </Box>
        </Stack>
      ) : (
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{
            gap: { xs: 1, sm: 1.5 },
          }}
        >
          <Tooltip title="Giỏ hàng" arrow>
            <StyledLink to={config.customerRoutes.cart}>
              <StyledCartButton
                startIcon={
                  <Badge
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      },
                    }}
                  >
                    <ShoppingCartIcon />
                  </Badge>
                }
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                }}
              >
                Giỏ hàng
              </StyledCartButton>

              {/* Mobile cart icon only */}
              <StyledCartIconButton
                size="medium"
                sx={{
                  display: { xs: "inline-flex", sm: "none" },
                }}
              >
                <Badge
                  badgeContent={cartItemsCount}
                  color="primary"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    },
                  }}
                >
                  <ShoppingCartIcon />
                </Badge>
              </StyledCartIconButton>
            </StyledLink>
          </Tooltip>

          <StyledLink to={config.authRoutes.authenticate}>
            <StyledLoginButton
              variant="contained"
              startIcon={<LoginIcon />}
              size={isMobile ? "small" : "medium"}
              sx={{
                px: { xs: 1.5, sm: 2.5 },
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
              }}
            >
              {isTablet ? "Đăng nhập" : "Đăng nhập"}
            </StyledLoginButton>
          </StyledLink>
        </Stack>
      )}
    </StyledRightMenu>
  );
};

export default RightMenu;
