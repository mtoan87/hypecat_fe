/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Avatar,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Divider,
  Fade,
  Skeleton,
  Alert,
  Snackbar,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  PhotoCamera as PhotoCameraIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import type { UserData } from "../../types/Usertype";
import { uploadImageToFirebase } from "../../firebase/uploadImageToFirebase";
import userApi from "../../api/services/user_api/userAPI";
import { useForm } from "react-hook-form";
import { FormProvider, RHFTextField } from "../../components/hook-form";

// Styled components
const GradientBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  padding: theme.spacing(4),
  position: "relative",
  borderRadius: "16px 16px 0 0",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
    backdropFilter: "blur(10px)",
  },
}));

const AvatarContainer = styled(Box)(() => ({
  position: "relative",
  display: "inline-block",
  "&:hover .photo-overlay": {
    opacity: 1,
  },
}));

const PhotoOverlay = styled(Box)(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
}));

const StyledCard = styled(Card)(() => ({
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 12px 48px rgba(0, 0, 0, 0.15)",
  },
}));

const InfoItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.2s ease",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: 25,
  padding: theme.spacing(1, 3),
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
}));

// Component
const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserData>();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await userApi.getProfile();
      reset({
        ...res,
        userImages: res.images.map((img) => ({ userImages: img.urlPath })),
      });
      setProfile(res);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin:", err);
      setSnackbar({
        open: true,
        message: "Không thể tải thông tin hồ sơ",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const methods = useForm<UserData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      images: [],
      addresses: [],
      userImages: [],
    },
  });
  const { handleSubmit, setValue, reset, trigger } = methods;

  const handleEdit = () => {
    if (!profile) return;
    setEditMode(true);
    fetchProfile();
  };

  const handleCancel = () => {
    if (!profile) return;
    fetchProfile();
    setEditMode(false);
  };

  const handleSave = async (data: UserData) => {
    const isValid = await trigger(["name", "email", "phone"]);
    if (!isValid) {
      setSnackbar({
        open: true,
        message: "Vui lòng kiểm tra lại thông tin",
        severity: "error",
      });
      return;
    }
    try {
      const uploadedImages =
        Array.isArray(data.userImages) && data.userImages.length > 0
          ? data.userImages.map((img) => img.userImages)
          : (profile?.images || []).map((img) => img.urlPath);

      await userApi.updateProfile(data.id, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        userImages: uploadedImages,
      });

      fetchProfile();
      setEditMode(false);
      setSnackbar({
        open: true,
        message: "Cập nhật thông tin thành công!",
        severity: "success",
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật thông tin:", err);
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi cập nhật",
        severity: "error",
      });
    }
  };

  const handleAvatarClick = async () => {
    if (!editMode) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        setUploading(true);
        const downloadUrl: string = await uploadImageToFirebase(file);
        setValue("userImages", [{ userImages: downloadUrl }]);
        setSnackbar({
          open: true,
          message: "Tải ảnh lên thành công!",
          severity: "success",
        });
      } catch (error) {
        console.error("Lỗi khi upload ảnh:", error);
        setSnackbar({
          open: true,
          message: "Không thể tải ảnh lên",
          severity: "error",
        });
      } finally {
        setUploading(false);
      }
    };

    input.click();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Container maxWidth="md">
          <Box textAlign="center" mb={4}>
            <Skeleton
              variant="text"
              width="300px"
              height={60}
              sx={{ mx: "auto" }}
            />
            <Skeleton
              variant="text"
              width="200px"
              height={30}
              sx={{ mx: "auto" }}
            />
          </Box>
          <StyledCard>
            <Box sx={{ p: 4 }}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={3}
              >
                <Skeleton variant="circular" width={120} height={120} />
              </Box>
              <Box display="flex" flexDirection="column" gap={3}>
                <Skeleton variant="rectangular" height={80} />
                <Skeleton variant="rectangular" height={80} />
                <Skeleton variant="rectangular" height={80} />
              </Box>
            </Box>
          </StyledCard>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Container maxWidth="md">
        <Fade in={true} timeout={800}>
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Hồ Sơ Cá Nhân
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Quản lý thông tin cá nhân của bạn
            </Typography>
          </Box>
        </Fade>

        <Fade in={true} timeout={1000}>
          <StyledCard>
            <GradientBox>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                position="relative"
                zIndex={1}
              >
                <AvatarContainer>
                  <Avatar
                    src={
                      editMode
                        ? methods.watch("userImages")?.[0]?.userImages
                        : profile?.images?.[0]?.urlPath
                    }
                    sx={{
                      width: 120,
                      height: 120,
                      border: "4px solid rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                      transition: "all 0.3s ease",
                    }}
                    onClick={handleAvatarClick}
                  />
                  {editMode && (
                    <PhotoOverlay className="photo-overlay">
                      <IconButton
                        onClick={handleAvatarClick}
                        disabled={uploading}
                      >
                        {uploading ? (
                          <CloudUploadIcon
                            sx={{ color: "white", fontSize: 28 }}
                          />
                        ) : (
                          <PhotoCameraIcon
                            sx={{ color: "white", fontSize: 28 }}
                          />
                        )}
                      </IconButton>
                    </PhotoOverlay>
                  )}
                </AvatarContainer>

                <Box mt={2} textAlign="center">
                  <Typography variant="h5" fontWeight="bold">
                    {profile?.name || "Chưa cập nhật"}
                  </Typography>
                  <Chip
                    label={editMode ? "Đang chỉnh sửa" : "Chế độ xem"}
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                </Box>
              </Box>

              <Box position="absolute" top={16} right={16} zIndex={2}>
                {!editMode ? (
                  <IconButton
                    onClick={handleEdit}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                      },
                    }}
                  >
                    <EditIcon sx={{ color: "white" }} />
                  </IconButton>
                ) : (
                  <Box display="flex" gap={1}>
                    <IconButton
                      onClick={handleSubmit(handleSave)}
                      sx={{
                        backgroundColor: "#4caf50",
                        "&:hover": { backgroundColor: "#45a049" },
                      }}
                    >
                      <SaveIcon sx={{ color: "white" }} />
                    </IconButton>
                    <IconButton
                      onClick={handleCancel}
                      sx={{
                        backgroundColor: "#f44336",
                        "&:hover": { backgroundColor: "#d32f2f" },
                      }}
                    >
                      <CancelIcon sx={{ color: "white" }} />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </GradientBox>

            <CardContent sx={{ p: 4 }}>
              <FormProvider methods={methods}>
                <Box display="flex" flexDirection="column" gap={3}>
                  {/* Name */}
                  <InfoItem>
                    <Box display="flex" alignItems="center" mb={2}>
                      <PersonIcon sx={{ color: "#667eea", mr: 1.5 }} />
                      <Typography variant="subtitle1" fontWeight="600">
                        Họ và tên
                      </Typography>
                    </Box>
                    <RHFTextField
                      name="name"
                      disabled={!editMode}
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&.Mui-disabled": {
                            backgroundColor: "transparent",
                          },
                        },
                      }}
                    />
                  </InfoItem>

                  {/* Email */}
                  <InfoItem>
                    <Box display="flex" alignItems="center" mb={2}>
                      <EmailIcon sx={{ color: "#4caf50", mr: 1.5 }} />
                      <Typography variant="subtitle1" fontWeight="600">
                        Email
                      </Typography>
                    </Box>
                    <RHFTextField
                      name="email"
                      disabled={!editMode}
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&.Mui-disabled": {
                            backgroundColor: "transparent",
                          },
                        },
                      }}
                    />
                  </InfoItem>

                  {/* Phone */}
                  <InfoItem>
                    <Box display="flex" alignItems="center" mb={2}>
                      <PhoneIcon sx={{ color: "#ff9800", mr: 1.5 }} />
                      <Typography variant="subtitle1" fontWeight="600">
                        Số điện thoại
                      </Typography>
                    </Box>
                    <RHFTextField
                      name="phone"
                      disabled={!editMode}
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&.Mui-disabled": {
                            backgroundColor: "transparent",
                          },
                        },
                      }}
                    />
                  </InfoItem>
                </Box>
              </FormProvider>
            </CardContent>

            {/* Footer */}
            {editMode && (
              <Fade in={editMode} timeout={300}>
                <Box>
                  <Divider />
                  <Box
                    p={3}
                    display="flex"
                    justifyContent="flex-end"
                    gap={2}
                    bgcolor="rgba(0, 0, 0, 0.02)"
                  >
                    <AnimatedButton
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      color="inherit"
                    >
                      Hủy bỏ
                    </AnimatedButton>
                    <AnimatedButton
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSubmit(handleSave)}
                      sx={{
                        background:
                          "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)",
                        },
                      }}
                    >
                      Lưu thay đổi
                    </AnimatedButton>
                  </Box>
                </Box>
              </Fade>
            )}
          </StyledCard>
        </Fade>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Profile;
