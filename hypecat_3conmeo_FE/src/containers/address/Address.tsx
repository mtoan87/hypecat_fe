/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Paper,
  Fade,
  Skeleton,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import AddressDialog from "./popup/AddressPopup";
import addressApi from "../../api/services/AddressApi/addressAPI";
import userApi from "../../api/services/user_api/userAPI";
import type { AddressFormInput, MappedAddress } from "../../types/AddressType";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  transition: "all 0.3s ease-in-out",
  height: "100%",
  borderRadius: 12,
  border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
}));

const DefaultChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  "&.default": {
    backgroundColor: alpha(theme.palette.warning.main, 0.1),
    color: theme.palette.warning.main,
    border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
  },
  "&.regular": {
    backgroundColor: alpha(theme.palette.grey[500], 0.1),
    color: theme.palette.grey[700],
    border: `1px solid ${alpha(theme.palette.grey[500], 0.3)}`,
  },
}));

// Skeleton Components
const AddressSkeletonCard: React.FC = () => {
  return (
    <StyledCard elevation={2}>
      <CardContent
        sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Box flex={1}>
          {/* Name and Status Skeleton */}
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Skeleton variant="text" width={120} height={28} />
            <Skeleton
              variant="rectangular"
              width={80}
              height={24}
              sx={{ borderRadius: 2 }}
            />
          </Stack>

          {/* Contact Info Skeleton */}
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Skeleton variant="circular" width={18} height={18} />
            <Skeleton variant="text" width={100} height={20} />
          </Stack>

          {/* Address Skeleton */}
          <Stack direction="row" alignItems="flex-start" spacing={1} mb={2}>
            <Skeleton variant="circular" width={18} height={18} />
            <Box flex={1}>
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="80%" height={20} />
            </Box>
          </Stack>
        </Box>

        {/* Action Buttons Skeleton */}
        <Stack spacing={1} alignItems="stretch">
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Skeleton variant="text" width={60} height={24} />
            <Skeleton variant="text" width={8} height={24} />
            <Skeleton variant="text" width={40} height={24} />
          </Stack>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={32}
            sx={{ borderRadius: 1 }}
          />
        </Stack>
      </CardContent>
    </StyledCard>
  );
};

const HeaderSkeleton: React.FC = () => (
  <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Box display="flex" alignItems="center" gap={2}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="text" width={300} height={20} />
        </Box>
      </Box>
      <Skeleton variant="circular" width={48} height={48} />
    </Stack>
  </Paper>
);

const AddressManager: React.FC = () => {
  const [addresses, setAddresses] = useState<MappedAddress[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressFormInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const theme = useTheme();

  const fetchAddresses = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      const res = await addressApi.getAddressByUserId();
      const mapped: MappedAddress[] = res.map((item: any) => ({
        id: item.id.toString(),
        name: item.recipientName,
        phone: item.phone,
        province: item.province,
        ward: item.ward,
        street: item.street,
        address: `${item.street}, ${item.ward}, ${item.province}`,
        isDefault: item.isDefault,
        label: item.isDefault ? "Mặc định" : "Địa chỉ lấy hàng",
      }));
      setAddresses(mapped);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await userApi.getProfile();
      setUserId(res.id);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin:", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchProfile();
  }, []);

  const handleRefresh = () => {
    fetchAddresses(true);
  };

  const handleAdd = () => {
    setEditingAddress(null);
    setOpenDialog(true);
  };

  const handleEdit = (address: AddressFormInput) => {
    setEditingAddress(address);
    setOpenDialog(true);
  };

  const handleSave = async (data: AddressFormInput) => {
    if (!userId) return;

    const payload = {
      userId,
      recipientName: data.name,
      phone: data.phone,
      province: data.province,
      ward: data.ward,
      street: data.street,
      isDefault: data.isDefault,
    };

    try {
      if (editingAddress && editingAddress.id !== undefined) {
        await addressApi.updateAddress(Number(editingAddress.id), payload);
      } else {
        await addressApi.createAddress(payload);
      }
      fetchAddresses();
    } catch (error) {
      console.error("Lỗi khi lưu địa chỉ:", error);
    }

    setOpenDialog(false);
  };

  const handleDeleteClick = (id: string) => {
    setAddressToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!addressToDelete) return;

    try {
      await addressApi.DeleteOrEnable(addressToDelete, 1);
      fetchAddresses();
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ:", error);
    }

    setDeleteDialogOpen(false);
    setAddressToDelete(null);
  };

  const handleSetDefault = async (id: string) => {
    if (!userId) {
      console.error("Không tìm thấy userId, chưa thể đặt mặc định.");
      return;
    }
    try {
      await addressApi.setDefaultAddress({
        addressId: Number(id),
        isDefault: 1,
        userId: userId,
      });
      fetchAddresses();
    } catch (error) {
      console.error("Lỗi khi đặt địa chỉ mặc định:", error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Skeleton */}
        <HeaderSkeleton />

        {/* Action Bar Skeleton */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Skeleton variant="text" width={120} height={32} />
          <Skeleton
            variant="rectangular"
            width={150}
            height={40}
            sx={{ borderRadius: 2 }}
          />
        </Box>

        {/* Address Cards Skeleton */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: 2,
          }}
        >
          {[1, 2, 3, 4].map((index) => (
            <Fade key={index} in={true} timeout={300 * index}>
              <div>
                <AddressSkeletonCard />
              </div>
            </Fade>
          ))}
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Enhanced Header */}
      <Fade in={true} timeout={600}>
        <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                <HomeIcon />
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  color="text.primary"
                >
                  Địa chỉ của tôi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quản lý tất cả địa chỉ giao hàng của bạn
                </Typography>
              </Box>
            </Box>
            <Tooltip title="Làm mới">
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <RefreshIcon
                  sx={{
                    animation: refreshing ? "spin 1s linear infinite" : "none",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
          </Stack>
        </Paper>
      </Fade>

      {/* Address List */}
      <Fade in={true} timeout={800}>
        <Box mb={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontWeight="semibold" color="text.primary">
              Địa chỉ ({addresses.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{
                backgroundColor: "#ff6b35",
                borderRadius: 2,
                px: 3,
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: theme.shadows[2],
                "&:hover": {
                  backgroundColor: "#e55a2b",
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              Thêm địa chỉ mới
            </Button>
          </Box>

          {/* Empty State */}
          {addresses.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 8,
                textAlign: "center",
                borderRadius: 3,
                bgcolor: alpha(theme.palette.grey[100], 0.5),
              }}
            >
              <HomeIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Chưa có địa chỉ nào
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Thêm địa chỉ đầu tiên của bạn để bắt đầu sử dụng dịch vụ
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
                sx={{
                  backgroundColor: "#ff6b35",
                  "&:hover": { backgroundColor: "#e55a2b" },
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Thêm địa chỉ mới
              </Button>
            </Paper>
          ) : (
            /* Grid Layout for Addresses */
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, 1fr)",
                },
                gap: 3,
              }}
            >
              {addresses.map((address, index) => (
                <Fade key={address.id} in={true} timeout={300 * (index + 1)}>
                  <StyledCard elevation={2}>
                    <CardContent
                      sx={{
                        p: 3,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box flex={1}>
                        {/* Name and Status */}
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={2}
                          mb={2}
                          flexWrap="wrap"
                          useFlexGap
                        >
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="text.primary"
                          >
                            {address.name}
                          </Typography>
                          <DefaultChip
                            icon={
                              address.isDefault ? (
                                <StarIcon />
                              ) : (
                                <StarBorderIcon />
                              )
                            }
                            label={address.label}
                            size="small"
                            className={
                              address.isDefault ? "default" : "regular"
                            }
                          />
                        </Stack>

                        {/* Contact Info */}
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          mb={1.5}
                        >
                          <PhoneIcon
                            sx={{
                              fontSize: 18,
                              color: "text.secondary",
                              p: 0.5,
                              bgcolor: alpha(theme.palette.grey[500], 0.1),
                              borderRadius: 1,
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight="medium"
                          >
                            {address.phone}
                          </Typography>
                        </Stack>

                        {/* Address */}
                        <Stack
                          direction="row"
                          alignItems="flex-start"
                          spacing={1}
                          mb={2}
                        >
                          <LocationIcon
                            sx={{
                              fontSize: 18,
                              color: "text.secondary",
                              mt: 0.2,
                              p: 0.5,
                              bgcolor: alpha(theme.palette.grey[500], 0.1),
                              borderRadius: 1,
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}
                          >
                            {address.address}
                          </Typography>
                        </Stack>
                      </Box>

                      {/* Action Buttons */}
                      <Stack spacing={1.5} alignItems="stretch">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(address)}
                            sx={{
                              color: "primary.main",
                              "&:hover": {
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          {!address.isDefault && (
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(address.id)}
                              sx={{
                                color: "error.main",
                                "&:hover": {
                                  bgcolor: alpha(theme.palette.error.main, 0.1),
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Stack>

                        {!address.isDefault && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<StarIcon />}
                            onClick={() => handleSetDefault(address.id)}
                            sx={{
                              fontSize: "0.875rem",
                              textTransform: "none",
                              fontWeight: 500,
                              borderColor: alpha(
                                theme.palette.primary.main,
                                0.3
                              ),
                              color: "primary.main",
                              "&:hover": {
                                borderColor: "primary.main",
                                backgroundColor: alpha(
                                  theme.palette.primary.main,
                                  0.05
                                ),
                              },
                            }}
                          >
                            Thiết lập mặc định
                          </Button>
                        )}
                      </Stack>
                    </CardContent>
                  </StyledCard>
                </Fade>
              ))}
            </Box>
          )}
        </Box>
      </Fade>

      {/* Add/Edit Dialog */}
      <AddressDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        editingAddress={editingAddress}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Xác nhận xóa địa chỉ
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary">
            Bạn có chắc chắn muốn xóa địa chỉ này không? Hành động này không thể
            hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ textTransform: "none" }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddressManager;
