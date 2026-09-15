/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import images from "../../constants/images";
import { font_size } from "../../styles/config-file";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HttpsIcon from "@mui/icons-material/Https";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  Fade,
  alpha,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import config from "../../configs";
import { AuthApi } from "../../api/services/AuthApi/AuthApi";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = AuthApi();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
    };
    let isValid = true;

    if (!registerForm.name) {
      newErrors.name = "Vui lòng nhập họ tên";
      isValid = false;
    }

    if (!registerForm.email) {
      newErrors.email = "Vui lòng nhập email";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    if (!registerForm.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
      isValid = false;
    } else if (registerForm.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      isValid = false;
    }

    if (!registerForm.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
      isValid = false;
    } else if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      isValid = false;
    }

    if (!registerForm.address) {
      newErrors.address = "Vui lòng nhập địa chỉ";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      // Call your register API here
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...dataToSend } = registerForm;
      const res: any = await register(dataToSend);
      if (res) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate(config.authRoutes.authenticate);
      }
    } catch (error: any) {
      console.log("Register error", error);
      toast.error(error.response?.data?.message || "Đăng ký thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setRegisterForm({ ...registerForm, [field]: value });
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: "" });
    }

    // Clear confirm password error when password changes
    if (field === "password" && errors.confirmPassword) {
      setErrors({ ...errors, password: "", confirmPassword: "" });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleRegister();
    }
  };

  const HypecatLogo = () => (
    <Box
      onClick={() => navigate(config.customerRoutes.home)}
      sx={{
        width: 90,
        height: 90,
        mx: "auto",
        mb: 2.5,
        borderRadius: "22px",
        background: "rgba(255, 255, 255, 0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          "0 15px 50px rgba(0, 0, 0, 0.3), 0 0 0 4px rgba(255, 255, 255, 0.2)",
        border: "3px solid #fff",
        position: "relative",
        transition: "all 0.4s ease",
        "&:hover": {
          transform: "translateY(-8px) scale(1.05)",
          boxShadow: "0 20px 60px rgba(147, 51, 234, 0.5)",
        },
      }}
    >
      <img
        src={images.logo}
        alt="logo"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "18px",
        }}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${images.loginBackground})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)
          `,
          zIndex: 1,
        },
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          position: "relative",
          zIndex: 2,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 5,
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(5px)",
              boxShadow:
                "0 30px 90px rgba(147, 51, 234, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.08)",
              position: "relative",
            }}
          >
            {/* Header Section */}
            <Box
              sx={{
                p: 4,
                pt: 5,
                textAlign: "center",
                position: "relative",
              }}
            >
              <Box sx={{ position: "relative", zIndex: 2 }}>
                <HypecatLogo />

                <Typography
                  variant="h4"
                  fontWeight="800"
                  gutterBottom
                  sx={{
                    color: "white",
                    textShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
                    letterSpacing: "-0.5px",
                    mb: 0.5,
                    fontSize: { xs: "1.75rem", sm: "2rem" },
                  }}
                >
                  Tạo tài khoản mới
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.95)",
                    textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
                    fontWeight: 500,
                    fontSize: "1rem",
                    mb: 3,
                  }}
                >
                  Đăng ký để trải nghiệm Hypecat
                </Typography>
              </Box>
            </Box>

            {/* Form Section */}
            <Box sx={{ p: 4, pt: 2 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  id="name"
                  name="name"
                  type="text"
                  variant="outlined"
                  value={registerForm.name}
                  error={!!errors.name}
                  helperText={errors.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onKeyPress={handleKeyPress}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircleIcon
                            sx={{
                              color: errors.name ? "error.main" : "#7c3aed",
                              fontSize: "1.4rem",
                            }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "#f8f7ff",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#f3f0ff",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(124, 58, 237, 0.15)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#fff",
                        boxShadow: "0 0 0 4px rgba(124, 58, 237, 0.15)",
                        transform: "translateY(-2px)",
                      },
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0d4ff",
                      borderWidth: "2px",
                    },
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#7c3aed",
                      },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#7c3aed",
                      fontWeight: 600,
                    },
                    "& .MuiInputLabel-root": {
                      fontWeight: 500,
                      color: "#6b5b8c",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  variant="outlined"
                  value={registerForm.email}
                  error={!!errors.email}
                  helperText={errors.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onKeyPress={handleKeyPress}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon
                            sx={{
                              color: errors.email ? "error.main" : "#7c3aed",
                              fontSize: "1.4rem",
                            }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "#f8f7ff",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#f3f0ff",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(124, 58, 237, 0.15)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#fff",
                        boxShadow: "0 0 0 4px rgba(124, 58, 237, 0.15)",
                        transform: "translateY(-2px)",
                      },
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0d4ff",
                      borderWidth: "2px",
                    },
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#7c3aed",
                      },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#7c3aed",
                      fontWeight: 600,
                    },
                    "& .MuiInputLabel-root": {
                      fontWeight: 500,
                      color: "#6b5b8c",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Mật khẩu"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={registerForm.password}
                  error={!!errors.password}
                  helperText={errors.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  onKeyPress={handleKeyPress}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <HttpsIcon
                            sx={{
                              color: errors.password ? "error.main" : "#7c3aed",
                              fontSize: "1.4rem",
                            }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{
                              color: "#7c3aed",
                              "&:hover": {
                                backgroundColor: alpha("#7c3aed", 0.1),
                                transform: "scale(1.15)",
                              },
                            }}
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "#f8f7ff",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#f3f0ff",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(124, 58, 237, 0.15)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#fff",
                        boxShadow: "0 0 0 4px rgba(124, 58, 237, 0.15)",
                        transform: "translateY(-2px)",
                      },
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0d4ff",
                      borderWidth: "2px",
                    },
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#7c3aed",
                      },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#7c3aed",
                      fontWeight: 600,
                    },
                    "& .MuiInputLabel-root": {
                      fontWeight: 500,
                      color: "#6b5b8c",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Xác nhận mật khẩu"
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  variant="outlined"
                  value={registerForm.confirmPassword}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  onKeyPress={handleKeyPress}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <HttpsIcon
                            sx={{
                              color: errors.confirmPassword
                                ? "error.main"
                                : "#7c3aed",
                              fontSize: "1.4rem",
                            }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                            sx={{
                              color: "#7c3aed",
                              "&:hover": {
                                backgroundColor: alpha("#7c3aed", 0.1),
                                transform: "scale(1.15)",
                              },
                            }}
                          >
                            {showConfirmPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "#f8f7ff",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#f3f0ff",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(124, 58, 237, 0.15)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#fff",
                        boxShadow: "0 0 0 4px rgba(124, 58, 237, 0.15)",
                        transform: "translateY(-2px)",
                      },
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0d4ff",
                      borderWidth: "2px",
                    },
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#7c3aed",
                      },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#7c3aed",
                      fontWeight: 600,
                    },
                    "& .MuiInputLabel-root": {
                      fontWeight: 500,
                      color: "#6b5b8c",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Địa chỉ"
                  id="address"
                  name="address"
                  type="text"
                  variant="outlined"
                  value={registerForm.address}
                  error={!!errors.address}
                  helperText={errors.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  onKeyPress={handleKeyPress}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon
                            sx={{
                              color: errors.address ? "error.main" : "#7c3aed",
                              fontSize: "1.4rem",
                            }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "#f8f7ff",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#f3f0ff",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(124, 58, 237, 0.15)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#fff",
                        boxShadow: "0 0 0 4px rgba(124, 58, 237, 0.15)",
                        transform: "translateY(-2px)",
                      },
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0d4ff",
                      borderWidth: "2px",
                    },
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#7c3aed",
                      },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#7c3aed",
                      fontWeight: 600,
                    },
                    "& .MuiInputLabel-root": {
                      fontWeight: 500,
                      color: "#6b5b8c",
                    },
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  onClick={handleRegister}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      <PersonAddIcon sx={{ fontSize: "1.4rem" }} />
                    )
                  }
                  sx={{
                    py: 2.5,
                    mt: 1.5,
                    borderRadius: 3,
                    fontSize: font_size.buttonFontSize || "1.1rem",
                    fontWeight: "700",
                    textTransform: "none",
                    background:
                      "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)",
                    backgroundSize: "200% 100%",
                    boxShadow: "0 12px 35px rgba(124, 58, 237, 0.4)",
                    transition: "all 0.4s ease",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                      transition: "left 0.5s ease",
                    },
                    "&:hover": {
                      backgroundPosition: "100% 0",
                      boxShadow: "0 18px 50px rgba(124, 58, 237, 0.6)",
                      transform: "translateY(-4px)",
                      "&::before": {
                        left: "100%",
                      },
                    },
                    "&:active": {
                      transform: "translateY(-2px)",
                    },
                    "&:disabled": {
                      background: alpha("#7c3aed", 0.5),
                      boxShadow: "0 6px 20px rgba(124, 58, 237, 0.2)",
                      transform: "none",
                    },
                  }}
                >
                  {isLoading ? "Đang đăng ký..." : "Đăng ký"}
                </Button>

                <Typography
                  variant="body2"
                  sx={{
                    textAlign: "center",
                    color: "#6b5b8c",
                    fontWeight: 500,
                    mt: 2,
                  }}
                >
                  Đã có tài khoản?{" "}
                  <Box
                    component="span"
                    onClick={() => navigate(config.authRoutes.authenticate)}
                    sx={{
                      color: "#7c3aed",
                      fontWeight: 700,
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Đăng nhập ngay
                  </Box>
                </Typography>
              </Stack>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                background:
                  "linear-gradient(180deg, rgba(124, 58, 237, 0.03) 0%, rgba(124, 58, 237, 0.08) 100%)",
                borderTop: "1px solid rgba(124, 58, 237, 0.1)",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "#6b5b8c",
                  letterSpacing: "0.3px",
                }}
              >
                © 2025 Hypecat. All rights reserved.
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register;
