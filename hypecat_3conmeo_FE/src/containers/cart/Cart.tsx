import React, { useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Container,
    Chip,
    Alert,
    Fade,
    Skeleton,
    useTheme,
    alpha,
    Stack
} from '@mui/material';
import {
    ShoppingCart,
} from '@mui/icons-material';
import { CartItem, CartTableHeader } from './CartItem';
import { CartSummary } from './CartSummary';
import cartApi from '../../api/services/CartApi/cartAPI';
import type { CartType } from '../../types/CartType';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';
import useDebounce from '../../hooks/useDebounce';
import config from '../../configs';

export const Cart: React.FC = () => {
    const theme = useTheme();
    const [carts, setCarts] = useState<CartType[]>([]);
    //const [shippingCost, setShippingCost] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pendingUpdate, setPendingUpdate] = useState<{ id: number, quantity: number } | null>(null);
    const debouncedUpdate = useDebounce(pendingUpdate, 500);

    const getCart = async () => {
        try {
            setIsLoading(true);
            const res = await cartApi.getUserCartDisplay();
            setCarts(res);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        getCart();
    }, []);
    React.useEffect(() => {
        if (!debouncedUpdate) return;

        const updateQuantity = async () => {
            try {
                await cartApi.updateCartItemQuantity({
                    cartId: debouncedUpdate.id,
                    quantity: debouncedUpdate.quantity
                });
            } catch (error) {
                toast.error("Không thể cập nhật số lượng");
                console.error(error);
            }
        };
        updateQuantity();
    }, [debouncedUpdate]);

    const handleQuantity = (id: number, delta: number) => {
        setCarts(prev =>
            prev.map(item =>
                item.cartId === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );

        const newQuantity = (carts.find(item => item.cartId === id)?.quantity || 1) + delta;
        setPendingUpdate({ id, quantity: Math.max(1, newQuantity) });
    };

    const handleQuantityChange = (id: number, newQuantity: number) => {
        setCarts(prev =>
            prev.map(item =>
                item.cartId === id
                    ? { ...item, quantity: Math.max(1, newQuantity) }
                    : item
            )
        );

        setPendingUpdate({ id, quantity: Math.max(1, newQuantity) });
    };

    const handleRemove = async (id: string) => {
        try {
            await cartApi.deleteCartItem(id);
            toast.success("Đã xoá sản phẩm khỏi giỏ hàng");
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const errMsg = error.response?.data?.message || "Xoá sản phẩm thất bại";
            toast.error(errMsg);
        } finally {
            getCart(); // Refresh cart after deletion
        }
    };

    const subtotal = carts.reduce((sum, p) => sum + p.sellingPrice * p.quantity, 0);

    const EmptyCart = () => (
        <Box
            textAlign="center"
            py={8}
            sx={{
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                borderRadius: 3,
                border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
            }}
        >
            <ShoppingCart sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
                Giỏ hàng của bạn đang trống
            </Typography>
            <Typography variant="body1" color="text.disabled">
                Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
            </Typography>
        </Box>
    );

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box mb={4}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="h3" fontWeight="700" color="text.primary">
                            Giỏ hàng của bạn
                        </Typography>
                        {carts.length > 0 && (
                            <Chip
                                label={`${carts.length} sản phẩm`}
                                color="primary"
                                variant="outlined"
                            />
                        )}
                    </Box>
                </Box>
            </Box>

            {carts.length === 0 ? (
                <EmptyCart />
            ) : (
                <>
                    {/* Low Stock Alert */}
                    {carts.some(p => !p.remainingQuantity) && (
                        <Alert severity="warning" sx={{ mb: 3 }}>
                            Một số sản phẩm trong giỏ hàng đang sắp hết hàng.
                            Vui lòng thanh toán sớm để đảm bảo nhận được sản phẩm!
                        </Alert>
                    )}

                    <Grid container spacing={4} justifyContent="space-between">
                        {/* Cart Items */}
                        <Grid size={{ xs: 12, lg: 8 }}>
                            <Box
                                sx={{
                                    bgcolor: 'background.paper',
                                    borderRadius: 3,
                                    p: 3,
                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                }}
                            >
                                <Typography variant="h6" fontWeight="600" mb={3}>
                                    Sản phẩm trong giỏ hàng
                                </Typography>

                                {isLoading ? (
                                    // Loading Skeleton
                                    <>
                                        {[1, 2].map((item) => (
                                            <Box key={item} mb={2}>
                                                <Skeleton variant="rectangular" height={120} />
                                            </Box>
                                        ))}
                                    </>
                                ) : (
                                    <Fade in={true}>
                                        <Stack direction="column" spacing={0}>
                                            <CartTableHeader />
                                            {carts.map((cart) => (
                                                <CartItem
                                                    key={cart.cartId}
                                                    image={cart.imageUrl}
                                                    name={cart.productName}
                                                    originalPrice={cart.sellingPrice}
                                                    quantity={cart.quantity}
                                                    remainingQuantity={cart.remainingQuantity}
                                                    onIncrease={() => handleQuantity(cart.cartId, 1)}
                                                    onDecrease={() => handleQuantity(cart.cartId, -1)}
                                                    onQuantityChange={(newQuantity) => handleQuantityChange(cart.cartId, newQuantity)}
                                                    onRemove={() => handleRemove(cart.productId)}
                                                />
                                            ))}
                                        </Stack>
                                    </Fade>
                                )}
                            </Box>
                        </Grid>

                        {/* Cart Summary */}
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Box
                                position="sticky"
                                top={20}
                                display="flex"
                                justifyContent="flex-end"
                            >
                                <Box width="100%">
                                    <CartSummary
                                        subtotal={subtotal}
                                        //shipping={shippingCost}
                                        //onShippingChange={setShippingCost}
                                        itemCount={carts.reduce((sum, p) => sum + p.quantity, 0)}
                                        navigateTo={config.customerRoutes.addressList}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </>
            )}
        </Container>
    );
};