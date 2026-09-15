import React from "react";
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Chip,
    Avatar,
    Skeleton,
    Container,
    Button,
    Fade,
    useTheme,
    alpha
} from "@mui/material";
import {
    ArrowForward,
    Refresh,
} from "@mui/icons-material";
import type { News } from "../../types/NewsType";
import newsAPI from "../../api/services/NewsApi/newsAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import config from "../../configs";

const NewsList = () => {
    const [news, setNews] = React.useState<News[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const navigate = useNavigate();
    const theme = useTheme();

    const getNews = async () => {
        try {
            setIsLoading(true);
            const res = await newsAPI.getNewsByUser();
            setNews(res.reverse());
        } catch (error) {
            toast.error("Lấy tin tức thất bại");
            console.error("Lỗi khi lấy danh sách tin tức:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewsClick = (newsId: string) => {
        navigate(config.customerRoutes.newsDetail.replace(":id", newsId));
    };

    React.useEffect(() => {
        getNews();
    }, []);

    // Enhanced Loading Skeleton
    const LoadingSkeleton = () => (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Skeleton variant="text" width={300} height={48} sx={{ mb: 1 }} />
                <Skeleton variant="text" width={450} height={24} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {[...Array(4)].map((_, index) => (
                    <Card
                        key={index}
                        sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: { xs: "column", md: "row" }, height: { xs: 'auto', md: 240 } }}>
                            <Skeleton
                                variant="rectangular"
                                sx={{
                                    width: { xs: '100%', md: 320 },
                                    height: { xs: 200, md: '100%' },
                                    flexShrink: 0
                                }}
                            />
                            <CardContent sx={{ flex: 1, p: 3 }}>
                                <Box sx={{ mb: 2 }}>
                                    <Skeleton variant="rounded" width={80} height={24} sx={{ mb: 2 }} />
                                </Box>
                                <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
                                <Skeleton variant="text" height={32} width="80%" sx={{ mb: 2 }} />
                                <Skeleton variant="text" height={20} width="60%" sx={{ mb: 3 }} />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Skeleton variant="circular" width={32} height={32} />
                                    <Skeleton variant="text" width={120} height={20} />
                                </Box>
                            </CardContent>
                        </Box>
                    </Card>
                ))}
            </Box>
        </Container>
    );

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
            pb: 4
        }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Enhanced Header */}
                <Box sx={{
                    mb: 5,
                    textAlign: 'center',
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 60,
                        height: 3,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        borderRadius: 2
                    }
                }}>
                    <Typography
                        variant="h3"
                        fontWeight="800"
                        sx={{
                            mb: 2,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.02em'
                        }}
                    >
                        Tin Tức Mới Nhất
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
                        Cập nhật những thông tin quan trọng và thú vị nhất từ thế giới xung quanh
                    </Typography>
                </Box>

                {/* Action Bar */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                    p: 2,
                    bgcolor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}>
                    <Typography variant="h6" color="text.secondary" fontWeight="600">
                        {news.length} bài viết
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={getNews}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                    >
                        Làm mới
                    </Button>
                </Box>

                {/* News List */}
                <Fade in={!isLoading} timeout={600}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {news.map((newsItem, index) => (
                            <Fade in timeout={800} style={{ transitionDelay: `${index * 100}ms` }} key={newsItem.id}>
                                <Card
                                    onClick={() => handleNewsClick(newsItem.id)}
                                    sx={{
                                        borderRadius: 4,
                                        cursor: 'pointer',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                                        backdropFilter: 'blur(20px)',
                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                        '&:hover': {
                                            transform: 'translateY(-8px) scale(1.01)',
                                            boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                                            '& .news-image': {
                                                transform: 'scale(1.05)',
                                            },
                                            '& .news-category': {
                                                transform: 'scale(1.05)',
                                            },
                                            '& .news-arrow': {
                                                transform: 'translateX(4px)',
                                                opacity: 1,
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: { xs: "column", md: "row" },
                                        height: { xs: 'auto', md: 240 }
                                    }}>
                                        {/* Enhanced Image Section */}
                                        <Box sx={{
                                            width: { xs: '100%', md: 320 },
                                            height: { xs: 200, md: '100%' },
                                            position: 'relative',
                                            overflow: 'hidden',
                                            flexShrink: 0
                                        }}>
                                            <CardMedia
                                                component="img"
                                                className="news-image"
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: "cover",
                                                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                }}
                                                image={newsItem.cover}
                                                alt={newsItem.title}
                                            />
                                            {/* Image Overlay */}
                                            <Box sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: `linear-gradient(45deg, ${alpha('#000', 0.1)} 0%, transparent 50%)`,
                                            }} />
                                        </Box>

                                        {/* Enhanced Content Section */}
                                        <CardContent
                                            sx={{
                                                flex: 1,
                                                p: 3,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                position: 'relative'
                                            }}
                                        >
                                            {/* Top Section */}
                                            <Box>
                                                {/* Enhanced Category Chip */}
                                                <Chip
                                                    className="news-category"
                                                    label={newsItem.category?.name || 'Tin tức'}
                                                    size="small"
                                                    sx={{
                                                        mb: 2,
                                                        fontWeight: 700,
                                                        fontSize: '0.75rem',
                                                        borderRadius: 2,
                                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                        color: 'white',
                                                        transition: 'transform 0.3s ease',
                                                        '& .MuiChip-label': {
                                                            px: 2
                                                        }
                                                    }}
                                                />

                                                {/* Enhanced Title */}
                                                <Typography
                                                    variant="h5"
                                                    fontWeight="700"
                                                    sx={{
                                                        mb: 2,
                                                        lineHeight: 1.3,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        color: 'text.primary',
                                                        letterSpacing: '-0.01em'
                                                    }}
                                                >
                                                    {newsItem.title}
                                                </Typography>
                                            </Box>

                                            {/* Bottom Section */}
                                            <Box>
                                                {/* Enhanced Author & Meta Info */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    mb: 2
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar
                                                            sx={{
                                                                width: 36,
                                                                height: 36,
                                                                fontSize: '0.9rem',
                                                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                                                            }}
                                                        >
                                                            {newsItem.writer?.charAt(0)?.toUpperCase() || 'A'}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="600" color="text.primary">
                                                                {newsItem.writer || 'Ẩn danh'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                {/* Read More Button */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', justifySelf: 'flex-end' }}>
                                                    <Button
                                                        variant="text"
                                                        endIcon={
                                                            <ArrowForward
                                                                className="news-arrow"
                                                                sx={{
                                                                    fontSize: 16,
                                                                    transition: 'all 0.3s ease',
                                                                    opacity: 0.7
                                                                }}
                                                            />
                                                        }
                                                        sx={{
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            color: 'primary.main',
                                                            p: 0,
                                                            minWidth: 'auto',
                                                            '&:hover': {
                                                                backgroundColor: 'transparent'
                                                            }
                                                        }}
                                                    >
                                                        Đọc thêm
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Box>
                                </Card>
                            </Fade>
                        ))}
                    </Box>
                </Fade>

                {/* Enhanced Empty State */}
                {news.length === 0 && !isLoading && (
                    <Fade in timeout={600}>
                        <Card
                            sx={{
                                textAlign: 'center',
                                py: 8,
                                px: 4,
                                borderRadius: 4,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                                border: `2px dashed ${alpha(theme.palette.divider, 0.3)}`,
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <Box sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3
                            }}>
                                <Typography variant="h3" color="primary.main">📰</Typography>
                            </Box>
                            <Typography variant="h5" fontWeight="600" color="text.primary" sx={{ mb: 2 }}>
                                Chưa có tin tức nào
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                                Hãy quay lại sau để khám phá những tin tức mới nhất và thú vị nhất
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<Refresh />}
                                onClick={getNews}
                                sx={{
                                    borderRadius: 3,
                                    px: 4,
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                }}
                            >
                                Thử lại
                            </Button>
                        </Card>
                    </Fade>
                )}
            </Container>
        </Box>
    );
};

export default NewsList;