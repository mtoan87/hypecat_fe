import {
    Box,
    IconButton,
    Typography,
    TextField,
    useTheme,
    alpha
} from '@mui/material';
import {
    Remove,
    Add,
    DeleteOutline,
} from '@mui/icons-material';
import { useState } from 'react';

interface CartItemProps {
    image: string;
    name: string;
    subtitle?: string;
    quantity: number;
    originalPrice: number;
    remainingQuantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    onQuantityChange: (value: number) => void;
    onRemove: () => void;
    onAddToWishlist?: () => void;
}

export const CartItem = ({
    image,
    name,
    subtitle,
    quantity,
    originalPrice,
    remainingQuantity,
    onIncrease,
    onDecrease,
    onQuantityChange,
    onRemove,
}: CartItemProps) => {
    const theme = useTheme();
    const [isHovered, setIsHovered] = useState(false);
    const subtotal = originalPrice * quantity;

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                alignItems: 'center',
                gap: 2,
                py: 2,
                px: 1,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.04),
                },
                minHeight: 80,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Item Column */}
            <Box display="flex" alignItems="center" gap={2}>
                <Box
                    sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 1,
                        overflow: 'hidden',
                        bgcolor: '#f8f9fa',
                        flexShrink: 0,
                    }}
                >
                    <img
                        src={image}
                        alt={name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </Box>
                <Box>
                    <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{ mb: 0.5 }}
                    >
                        {name}
                    </Typography>
                    {subtitle && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block' }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Price Column */}
            <Box textAlign="center">
                <Typography
                    variant="body2"
                    fontWeight={500}
                >
                    {originalPrice.toLocaleString('vi-VN')}₫
                </Typography>
            </Box>

            {/* Quantity Column */}
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                        border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                    }}
                >
                    <IconButton
                        onClick={onDecrease}
                        disabled={quantity <= 1}
                        size="small"
                        sx={{
                            width: 28,
                            height: 28,
                            '&:disabled': {
                                opacity: 0.5
                            }
                        }}
                    >
                        <Remove fontSize="small" />
                    </IconButton>
                    <TextField
                        value={quantity}
                        onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            if (value >= 1 && value <= remainingQuantity) {
                                onQuantityChange(value);
                            }
                        }}
                        onBlur={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            if (value < 1) {
                                onQuantityChange(1);
                            }
                        }}
                        type="number"
                        inputProps={{
                            min: 1,
                            max: 999,
                            style: {
                                textAlign: 'center',
                                padding: '4px 0',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                            }
                        }}
                        sx={{
                            width: 50,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    border: 'none',
                                },
                                '&:hover fieldset': {
                                    border: 'none',
                                },
                                '&.Mui-focused fieldset': {
                                    border: 'none',
                                },
                            },
                            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                display: 'none',
                            },
                            '& input[type=number]': {
                                MozAppearance: 'textfield',
                            },
                        }}
                    />
                    <IconButton
                        onClick={onIncrease}
                        size="small"
                        disabled={quantity == remainingQuantity}
                        sx={{ width: 28, height: 28 }}
                    >
                        <Add fontSize="small" />
                    </IconButton>
                </Box>
                <Typography variant="subtitle2" color="text.secondary" fontSize="0.75rem">
                    Còn lại {remainingQuantity} sản phẩm
                </Typography>
            </Box>

            {/* Total Column */}
            <Box textAlign="center">
                <Typography
                    variant="body2"
                    fontWeight={600}
                >
                    {subtotal.toLocaleString('vi-VN')}₫
                </Typography>
            </Box>

            {/* Delete Button */}
            <Box>
                <IconButton
                    onClick={onRemove}
                    size="small"
                    sx={{
                        opacity: isHovered ? 1 : 0.6,
                        transition: 'opacity 0.2s ease',
                        color: 'text.secondary',
                        '&:hover': {
                            color: 'error.main',
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                        },
                    }}
                >
                    <DeleteOutline fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
};

// Table Header Component
export const CartTableHeader = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                alignItems: 'center',
                gap: 2,
                py: 1.5,
                px: 1,
                borderBottom: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                backgroundColor: alpha(theme.palette.action.hover, 0.02),
            }}
        >
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                Sản phẩm
            </Typography>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" textAlign="center">
                Giá tiền
            </Typography>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" textAlign="center">
                Số lượng
            </Typography>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" textAlign="center">
                Tổng tiền
            </Typography>
            <Box width={40} /> {/* Spacer for delete button */}
        </Box>
    );
};