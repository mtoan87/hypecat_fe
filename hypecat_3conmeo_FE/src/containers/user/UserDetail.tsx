/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Chip,
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Paper,
  Container,
  CircularProgress,
  Fade,
  Slide,
  Badge,
  IconButton,
  Tooltip,
  Stack,
  Button,
  Snackbar,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  AdminPanelSettings as AdminIcon,
  SupervisedUserCircle as CustomerIcon,
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import userApi from "../../api/services/user_api/userAPI";
import type { UserData } from "../../types/Usertype";
import EditPersonalDialog from "./popup/EditPersonalDialog";
import EditAccountDialog from "./popup/EditAccountDialog";
import AddAddressDialog from "./popup/AddAddressDialog";
import CustomPagination from "../../components/pagination/CustomPagination";

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserData>();
  const [loading, setLoading] = useState<boolean>(true);
  const [editPersonalDialog, setEditPersonalDialog] = useState<boolean>(false);
  const [editAccountDialog, setEditAccountDialog] = useState<boolean>(false);
  const [editAddressDialog, setEditAddressDialog] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage: number = 5;

  const fetchData = async () => {
    try {
      if (!id) return;
      const response: any = await userApi.getAccountById(id);
      setUser(response);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "default" => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "warning";
      case "banned":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      case "inactive":
        return <WarningIcon sx={{ fontSize: 16 }} />;
      case "banned":
        return <ErrorIcon sx={{ fontSize: 16 }} />;
      default:
        return <PersonIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <AdminIcon sx={{ fontSize: 16 }} />;
      case "customer":
        return <CustomerIcon sx={{ fontSize: 16 }} />;
      default:
        return <PersonIcon sx={{ fontSize: 16 }} />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbarMessage("Đã sao chép vào clipboard!");
    setSnackbarOpen(true);
  };

  const handlePersonalUpdate = (updatedData: any) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : prev));
    setEditPersonalDialog(false);
    setSnackbarMessage("Cập nhật thông tin cá nhân thành công!");
    setSnackbarOpen(true);
  };

  const handleAccountUpdate = () => {
    fetchData();
    setEditAccountDialog(false);
    setSnackbarMessage("Cập nhật thông tin tài khoản thành công!");
    setSnackbarOpen(true);
  };

  const handleAddressAdd = () => {
    fetchData();
    setEditAddressDialog(false);
    setSnackbarMessage("Thêm địa chỉ thành công!");
    setSnackbarOpen(true);
  };

  //paginate
  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const lastIndexOfPage = currentPage * postsPerPage;
  const firstIndexOfPage = lastIndexOfPage - postsPerPage;

  const currentAddress = user?.addresses.slice(
    firstIndexOfPage,
    lastIndexOfPage
  );

  const InfoCard = ({
    icon,
    title,
    children,
    actions,
  }: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
  }) => (
    <Card
      sx={{
        height: "100%",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: 3,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 20px 64px rgba(0, 0, 0, 0.12)",
          border: "1px solid rgba(102, 126, 234, 0.3)",
        },
      }}
    >
      <CardHeader
        avatar={
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 2,
              p: 1.5,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(102, 126, 234, 0.4)",
            }}
          >
            {icon}
          </Box>
        }
        title={
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#1a202c",
              letterSpacing: "-0.025em",
            }}
          >
            {title}
          </Typography>
        }
        action={actions}
        sx={{ pb: 2 }}
      />
      <CardContent sx={{ pt: 0 }}>{children}</CardContent>
    </Card>
  );

  const StyledListItem = ({
    icon,
    primary,
    secondary,
    copyable = false,
  }: {
    icon: React.ReactNode;
    primary: any;
    secondary: any;
    copyable?: boolean;
  }) => (
    <ListItem
      sx={{
        borderRadius: 2,
        mb: 1.5,
        bgcolor: "rgba(248, 250, 252, 0.6)",
        border: "1px solid rgba(226, 232, 240, 0.5)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          bgcolor: "rgba(248, 250, 252, 1)",
          transform: "translateX(4px)",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
        },
      }}
    >
      <ListItemIcon>
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 2,
            p: 1,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
          }}
        >
          {icon}
        </Box>
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "#2d3748",
              letterSpacing: "-0.025em",
            }}
          >
            {primary}
          </Typography>
        }
        secondary={
          <Typography
            variant="body2"
            sx={{
              color: "#4a5568",
              mt: 0.5,
              fontWeight: 500,
            }}
            component="span"
          >
            {secondary}
          </Typography>
        }
      />
      {copyable && (
        <Tooltip title="Sao chép vào clipboard">
          <IconButton
            size="small"
            onClick={() => copyToClipboard(secondary)}
            sx={{
              ml: 1,
              color: "#64748b",
              "&:hover": {
                bgcolor: "rgba(102, 126, 234, 0.1)",
                color: "#667eea",
              },
            }}
          >
            <CopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </ListItem>
  );

  return (
    <Paper>
      <Container sx={{ py: 4, maxWidth: "100% !important" }}>
        <Fade in={!loading} timeout={800}>
          <Box>
            {/* Header Card */}
            <Paper
              elevation={0}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderRadius: 4,
                mb: 4,
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 20px 64px rgba(102, 126, 234, 0.3)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                  radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
                `,
                },
              }}
            >
              <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      badgeContent={
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            bgcolor:
                              getStatusColor(user?.status || "default") ===
                              "success"
                                ? "#10b981"
                                : getStatusColor(user?.status || "default") ===
                                  "warning"
                                ? "#f59e0b"
                                : "#ef4444",
                            border: "4px solid white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          {getStatusIcon(user?.status || "default")}
                        </Box>
                      }
                    >
                      <Avatar
                        src={user?.images?.[0]?.urlPath}
                        sx={{
                          width: 140,
                          height: 140,
                          border: "4px solid rgba(255, 255, 255, 0.3)",
                          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
                        }}
                      >
                        <Typography variant="h2" sx={{ fontWeight: "bold" }}>
                          {user?.name?.charAt(0)}
                        </Typography>
                      </Avatar>
                    </Badge>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: "bold",
                          mb: 1,
                          letterSpacing: "-0.025em",
                        }}
                      >
                        {user?.name}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ opacity: 0.9, mb: 2, fontWeight: 500 }}
                      >
                        Mã người dùng: #{user?.id}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip
                          icon={getStatusIcon(user ? user?.status : "default")}
                          label={user?.status}
                          sx={{
                            bgcolor: "rgba(255, 255, 255, 0.25)",
                            color: "white",
                            fontWeight: 600,
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            "& .MuiChip-icon": { color: "white" },
                          }}
                        />
                        <Chip
                          icon={getRoleIcon(
                            user ? user.role?.roleName : "default"
                          )}
                          label={user?.role?.roleName}
                          sx={{
                            bgcolor: "rgba(255, 255, 255, 0.15)",
                            color: "white",
                            fontWeight: 600,
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            "& .MuiChip-icon": { color: "white" },
                          }}
                        />
                        {user?.role?.roleName === "admin" && (
                          <Chip
                            icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
                            label="Đã xác thực"
                            size="small"
                            sx={{
                              bgcolor: "rgba(16, 185, 129, 0.2)",
                              color: "white",
                              fontWeight: 600,
                              border: "1px solid rgba(16, 185, 129, 0.3)",
                              "& .MuiChip-icon": { color: "white" },
                            }}
                          />
                        )}
                      </Stack>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Paper>

            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ height: 300 }}
              >
                <CircularProgress
                  size={60}
                  thickness={4}
                  sx={{ color: "#667eea" }}
                />
              </Box>
            ) : (
              <Slide direction="up" in={!loading} timeout={600}>
                <Grid container spacing={3}>
                  {/* Personal Information */}
                  <Grid size={{ mobile: 12, tablet: 6, laptop: 6 }}>
                    <InfoCard
                      icon={<PersonIcon />}
                      title="Thông tin cá nhân"
                      actions={
                        <Tooltip title="Chỉnh sửa thông tin cá nhân">
                          <IconButton
                            size="small"
                            sx={{ color: "#64748b" }}
                            onClick={() => setEditPersonalDialog(true)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      }
                    >
                      <List sx={{ p: 0 }}>
                        <StyledListItem
                          icon={<PersonIcon sx={{ fontSize: 20 }} />}
                          primary="Họ và tên"
                          secondary={user?.name}
                          copyable
                        />
                        <StyledListItem
                          icon={<EmailIcon sx={{ fontSize: 20 }} />}
                          primary="Email"
                          secondary={user?.email}
                          copyable
                        />
                        <StyledListItem
                          icon={<PhoneIcon sx={{ fontSize: 20 }} />}
                          primary="Số điện thoại"
                          secondary={user?.phone}
                          copyable
                        />
                      </List>
                    </InfoCard>
                  </Grid>

                  {/* Account Information */}
                  <Grid size={{ mobile: 12, tablet: 6, laptop: 6 }}>
                    <InfoCard
                      icon={<SecurityIcon />}
                      title="Thông tin tài khoản"
                      actions={
                        <Tooltip title="Cài đặt tài khoản">
                          <IconButton
                            size="small"
                            sx={{ color: "#64748b" }}
                            onClick={() => setEditAccountDialog(true)}
                          >
                            <SecurityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      }
                    >
                      <List sx={{ p: 0 }}>
                        <StyledListItem
                          icon={<SecurityIcon sx={{ fontSize: 20 }} />}
                          primary="Mã người dùng"
                          secondary={`#${user?.id}`}
                          copyable
                        />
                        <StyledListItem
                          icon={getRoleIcon(user?.role?.roleName || "default")}
                          primary="Vai trò"
                          secondary={`${user?.role?.roleName} (ID: ${user?.role?.id})`}
                        />
                        <StyledListItem
                          icon={getStatusIcon(user?.status || "default")}
                          primary="Trạng thái tài khoản"
                          secondary={
                            <Chip
                              size="small"
                              icon={getStatusIcon(user?.status || "default")}
                              label={user?.status}
                              color={getStatusColor(user?.status || "default")}
                              sx={{
                                fontWeight: 600,
                                borderRadius: 2,
                              }}
                            />
                          }
                        />
                      </List>
                    </InfoCard>
                  </Grid>

                  {/* Addresses Section */}
                  <Grid size={{ mobile: 12, tablet: 12, laptop: 12 }}>
                    <InfoCard
                      icon={<HomeIcon />}
                      title="Địa chỉ"
                      actions={
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<LocationIcon />}
                          onClick={() => setEditAddressDialog(true)}
                          sx={{
                            color: "#667eea",
                            borderColor: "#667eea",
                            "&:hover": {
                              bgcolor: "rgba(102, 126, 234, 0.1)",
                              borderColor: "#667eea",
                            },
                          }}
                        >
                          Thêm địa chỉ
                        </Button>
                      }
                    >
                      {Array.isArray(user?.addresses) &&
                      user.addresses.length > 0 ? (
                        <>
                          <List sx={{ p: 0 }}>
                            {currentAddress?.map((address, index) => (
                              <StyledListItem
                                key={address.id}
                                icon={<LocationIcon sx={{ fontSize: 20 }} />}
                                primary={
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      fontWeight={600}
                                    >
                                      Địa chỉ {index + 1}
                                    </Typography>
                                    {address.isDefault && (
                                      <Chip
                                        label="Mặc định"
                                        size="small"
                                        color="primary"
                                        sx={{
                                          fontSize: "0.75rem",
                                          height: 22,
                                          borderRadius: 1,
                                          fontWeight: 600,
                                          px: 1.2,
                                        }}
                                      />
                                    )}
                                  </Stack>
                                }
                                secondary={
                                  <Stack spacing={0.5} mt={0.5}>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      <strong>Tên người nhận:</strong>{" "}
                                      {address.recipientName}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      <strong>SĐT:</strong> {address.phone}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      <strong>Địa chỉ:</strong>{" "}
                                      {`${address.street}, ${address.ward}, ${address.province}`}
                                    </Typography>
                                  </Stack>
                                }
                                copyable
                              />
                            ))}
                          </List>
                          <CustomPagination
                            currentPage={currentPage}
                            totalItems={user.addresses.length}
                            onPageChange={handleChangePage}
                            itemsPerPage={postsPerPage}
                          />
                        </>
                      ) : (
                        <Alert
                          severity="info"
                          sx={{
                            bgcolor: "rgba(59, 130, 246, 0.05)",
                            border: "1px solid rgba(59, 130, 246, 0.2)",
                            borderRadius: 2,
                            "& .MuiAlert-icon": {
                              color: "#3b82f6",
                            },
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Chưa có địa chỉ nào được thêm. Nhấn "Thêm địa chỉ"
                            để thêm địa chỉ mới.
                          </Typography>
                        </Alert>
                      )}
                    </InfoCard>
                  </Grid>
                </Grid>
              </Slide>
            )}

            {/* Dialog Components */}
            <EditPersonalDialog
              open={editPersonalDialog}
              onClose={() => setEditPersonalDialog(false)}
              userData={user}
              onSave={handlePersonalUpdate}
            />

            <EditAccountDialog
              open={editAccountDialog}
              onClose={() => setEditAccountDialog(false)}
              userData={user}
              onSave={handleAccountUpdate}
            />

            <AddAddressDialog
              open={editAddressDialog}
              onClose={() => setEditAddressDialog(false)}
              onSave={handleAddressAdd}
              userId={user?.id.toString()}
            />

            {/* Snackbar for notifications */}
            <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)}
              message={snackbarMessage}
              sx={{
                height: "40px",
                "& .MuiSnackbarContent-root": {
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontWeight: 500,
                },
              }}
            />
          </Box>
        </Fade>
      </Container>
    </Paper>
  );
};

export default UserDetail;
