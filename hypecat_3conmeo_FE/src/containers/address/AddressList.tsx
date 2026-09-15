import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Typography,
    Card,
    Radio,
    Stack,
    Chip,
    Container,
    Fade,
    Paper,
    useTheme,
    alpha,
    Grid,
} from "@mui/material";
import {
    AddLocationAlt,
    Person,
    Phone,
    LocationOn,
    CheckCircle,
} from "@mui/icons-material";
import type { Address, AddressFormInput } from "../../types/AddressType";
import addressApi from "../../api/services/AddressApi/addressAPI";
import CreateAddressDialog from "./popup/CreateAddressPopup";
import userApi from "../../api/services/user_api/userAPI";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../configs";
import { CartSummary } from "../cart/CartSummary";

const AddressList: React.FC = () => {
    const [addressList, setAddressList] = useState<Address[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const subtotal = location.state?.subtotal;
    const itemCount = location.state?.itemCount;

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const res = await addressApi.getAddressByUserId();
            const sorted = [...res].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
            setAddressList(sorted);

            const defaultAddr = sorted.find((a) => a.isDefault);
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr.id);
            }
        } finally {
            setLoading(false);
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

    useEffect(() => {
        if (!subtotal && !itemCount) {
            navigate(config.customerRoutes.cart, { replace: true });
        }
    }, [subtotal, itemCount, navigate]);

    const handleAddAddress = () => {
        setOpenDialog(true);
    };

    const handleSave = async (data: AddressFormInput) => {
        if (!userId) return;

        const payload: Omit<Address, "id"> = {
            userId,
            recipientName: data.name,
            phone: data.phone,
            province: data.province,
            ward: data.ward,
            street: data.street,
            isDefault: data.isDefault,
        };

        try {
            const newAddress = await addressApi.createAddress(payload);
            setAddressList((prev) => [newAddress, ...prev]);
            setSelectedAddressId(newAddress.id);
            toast.success("Thêm địa chỉ thành công!");

            setTimeout(() => {
                const firstCard = document.querySelector(".address");
                firstCard?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        } catch (error) {
            console.error("Lỗi khi lưu địa chỉ:", error);
            toast.error("Lỗi khi lưu địa chỉ");
        }
        setOpenDialog(false);
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="40vh"
                >
                    <CircularProgress size={48} thickness={4} />
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                        Đang tải danh sách địa chỉ...
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Box className="address">
                        {/* Header */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 3,
                                textAlign: "center",
                                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                                borderRadius: 2,
                            }}
                        >
                            <LocationOn
                                sx={{
                                    fontSize: 48,
                                    color: "primary.main",
                                    mb: 1
                                }}
                            />
                            <Typography
                                variant="h4"
                                gutterBottom
                                fontWeight={700}
                                color="primary.main"
                            >
                                Chọn địa chỉ giao hàng
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Chọn địa chỉ bạn muốn nhận hàng hoặc thêm địa chỉ mới
                            </Typography>
                        </Paper>

                        {addressList.length === 0 ? (
                            <Fade in={true} timeout={500}>
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 6,
                                        textAlign: "center",
                                        borderRadius: 3,
                                        border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                                    }}
                                >
                                    <AddLocationAlt
                                        sx={{
                                            fontSize: 72,
                                            color: alpha(theme.palette.primary.main, 0.5),
                                            mb: 2
                                        }}
                                    />
                                    <Typography
                                        variant="h6"
                                        color="text.primary"
                                        gutterBottom
                                        fontWeight={600}
                                    >
                                        Chưa có địa chỉ giao hàng
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        paragraph
                                        sx={{ maxWidth: 400, mx: "auto" }}
                                    >
                                        Bạn chưa có địa chỉ nào trong danh sách. Hãy thêm địa chỉ mới để có thể đặt hàng.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<AddLocationAlt />}
                                        onClick={handleAddAddress}
                                        sx={{
                                            mt: 2,
                                            py: 1.5,
                                            px: 4,
                                            borderRadius: 2,
                                            textTransform: "none",
                                            fontWeight: 600,
                                        }}
                                    >
                                        Thêm địa chỉ đầu tiên
                                    </Button>
                                </Paper>
                            </Fade>
                        ) : (
                            <>
                                <Stack spacing={2} sx={{ mb: 3 }}>
                                    {addressList.map((addr, index) => (
                                        <Fade
                                            in={true}
                                            timeout={300}
                                            style={{ transitionDelay: `${index * 100}ms` }}
                                            key={addr.id}
                                        >
                                            <Card
                                                className="address-card"
                                                sx={{
                                                    p: 0,
                                                    border: 2,
                                                    borderColor: selectedAddressId === addr.id
                                                        ? "primary.main"
                                                        : alpha(theme.palette.divider, 0.12),
                                                    borderRadius: 2,
                                                    boxShadow: selectedAddressId === addr.id
                                                        ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`
                                                        : theme.shadows[1],
                                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                    cursor: "pointer",
                                                    position: "relative",
                                                    overflow: "visible",
                                                    "&:hover": {
                                                        boxShadow: selectedAddressId === addr.id
                                                            ? `0 12px 32px ${alpha(theme.palette.primary.main, 0.2)}`
                                                            : theme.shadows[4],
                                                        transform: "translateY(-2px)",
                                                    }
                                                }}
                                                onClick={() => setSelectedAddressId(addr.id)}
                                            >
                                                {/* Selection indicator */}
                                                {selectedAddressId === addr.id && (
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            top: -8,
                                                            right: 16,
                                                            bgcolor: "primary.main",
                                                            borderRadius: "50%",
                                                            p: 0.5,
                                                            zIndex: 1,
                                                        }}
                                                    >
                                                        <CheckCircle sx={{ color: "white", fontSize: 20 }} />
                                                    </Box>
                                                )}

                                                <Box sx={{ p: 3 }}>
                                                    <Box display="flex" alignItems="flex-start">
                                                        <Radio
                                                            checked={selectedAddressId === addr.id}
                                                            onChange={() => setSelectedAddressId(addr.id)}
                                                            sx={{
                                                                mr: 2,
                                                                mt: -0.5,
                                                                color: alpha(theme.palette.primary.main, 0.6),
                                                            }}
                                                        />

                                                        <Stack flexGrow={1} spacing={1.5}>
                                                            {/* Name and default badge */}
                                                            <Box display="flex" alignItems="center" gap={1.5}>
                                                                <Person
                                                                    fontSize="small"
                                                                    sx={{ color: "primary.main" }}
                                                                />
                                                                <Typography
                                                                    fontWeight={700}
                                                                    variant="h6"
                                                                    color="text.primary"
                                                                >
                                                                    {addr.recipientName}
                                                                </Typography>
                                                                {addr.isDefault && (
                                                                    <Chip
                                                                        label="Mặc định"
                                                                        color="primary"
                                                                        size="small"
                                                                        sx={{
                                                                            fontWeight: 600,
                                                                            fontSize: "0.75rem",
                                                                        }}
                                                                    />
                                                                )}
                                                            </Box>

                                                            {/* Phone */}
                                                            <Box display="flex" alignItems="center" gap={1.5}>
                                                                <Phone
                                                                    fontSize="small"
                                                                    sx={{ color: "text.secondary" }}
                                                                />
                                                                <Typography
                                                                    variant="body1"
                                                                    color="text.secondary"
                                                                    fontWeight={500}
                                                                >
                                                                    {addr.phone}
                                                                </Typography>
                                                            </Box>

                                                            {/* Address */}
                                                            <Box display="flex" alignItems="flex-start" gap={1.5}>
                                                                <LocationOn
                                                                    fontSize="small"
                                                                    sx={{
                                                                        color: "text.secondary",
                                                                        mt: 0.2,
                                                                    }}
                                                                />
                                                                <Typography
                                                                    variant="body1"
                                                                    color="text.primary"
                                                                    sx={{ lineHeight: 1.5 }}
                                                                >
                                                                    {addr.street}, {addr.ward}, {addr.province}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </Box>
                                                </Box>
                                            </Card>
                                        </Fade>
                                    ))}
                                </Stack>

                                {/* Action buttons */}
                                <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        spacing={2}
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            startIcon={<AddLocationAlt />}
                                            onClick={handleAddAddress}
                                            sx={{
                                                py: 1.5,
                                                px: 4,
                                                borderRadius: 2,
                                                textTransform: "none",
                                                fontWeight: 600,
                                                borderWidth: 2,
                                                "&:hover": {
                                                    borderWidth: 2,
                                                }
                                            }}
                                        >
                                            Thêm địa chỉ mới
                                        </Button>
                                    </Stack>
                                </Paper>
                            </>
                        )}

                        <CreateAddressDialog
                            open={openDialog}
                            onClose={() => setOpenDialog(false)}
                            onSave={handleSave}
                        />
                    </Box>
                </Grid >
                <Grid size={{ xs: 12, md: 4 }}>
                    <CartSummary
                        subtotal={subtotal}
                        itemCount={itemCount}
                        // shipping={shippingCost}
                        // onShippingChange={setShippingCost}
                        navigateTo={config.customerRoutes.paymentMethod}
                        extraState={{ addressId: selectedAddressId }}
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

export default AddressList;