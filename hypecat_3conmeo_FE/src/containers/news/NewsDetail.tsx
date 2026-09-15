/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Box,
    Typography,
    Container,
    Chip,
    Grid,
    Card,
    CardMedia,
    Divider,
    useTheme,
    alpha,
    Paper,
    Stack,
    useMediaQuery,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import newsAPI from "../../api/services/NewsApi/newsAPI";

export default function NewsDetail() {
    const { id } = useParams();
    const [news, setNews] = useState<any>(null);
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        if (id) fetchNews(id);
    }, [id]);

    const fetchNews = async (id: string) => {
        try {
            setLoading(true);
            const res = await newsAPI.getNewsById(id);
            setNews(res);
        } catch (err) {
            console.error("Lỗi lấy tin tức:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="60vh"
                sx={{
                    background: `linear-gradient(135deg, ${alpha(
                        theme.palette.primary.light,
                        0.05
                    )} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
                    px: { xs: 2, sm: 3, md: 4 },
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, sm: 4 },
                        borderRadius: { xs: 2, sm: 3, md: 4 },
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                        maxWidth: { xs: "90%", sm: "400px" },
                        width: "100%",
                    }}
                >
                    <Stack alignItems="center" spacing={2}>
                        <Box
                            sx={{
                                width: { xs: 40, sm: 48 },
                                height: { xs: 40, sm: 48 },
                                borderRadius: "50%",
                                background: `conic-gradient(${theme.palette.primary.main}, transparent)`,
                                animation: "spin 1s linear infinite",
                                "@keyframes spin": {
                                    "0%": { transform: "rotate(0deg)" },
                                    "100%": { transform: "rotate(360deg)" },
                                },
                            }}
                        />
                        <Typography
                            variant={isSmallScreen ? "body1" : "h6"}
                            color="text.secondary"
                            fontWeight={500}
                            textAlign="center"
                        >
                            Đang tải thông tin...
                        </Typography>
                    </Stack>
                </Paper>
            </Box>
        );
    }

    if (!news) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="60vh"
                px={{ xs: 2, sm: 3, md: 4 }}
            >
                <Typography
                    variant={isSmallScreen ? "body1" : "h6"}
                    color="error"
                    textAlign="center"
                >
                    Không tìm thấy thông báo
                </Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>

            {/* Cover */}
            <Card sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}>
                <CardMedia
                    component="img"
                    image={news.cover}
                    alt="cover"
                    sx={{ height: { xs: 200, md: 400 }, objectFit: "cover" }}
                />
            </Card>

            {/* Title & info */}
            <Typography variant="h4" fontWeight={600} gutterBottom>
                {news.title}
            </Typography>

            <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography variant="subtitle1" color="text.secondary">
                    Tác giả: <strong>{news.writer}</strong>
                </Typography>
                <Chip label={news.category?.name} color="primary" />
            </Box>

            {/* Content */}
            <Box
                sx={{
                    typography: "body2",
                    lineHeight: 1.8,
                    "& a": { color: "primary.main" },
                }}
                dangerouslySetInnerHTML={{ __html: news.content }}
            />

            {/* Divider */}
            <Divider sx={{ my: 4 }} />

            {/* Image Gallery */}
            <Typography variant="h6" gutterBottom>
                Hình ảnh bài viết
            </Typography>
            <Grid container spacing={2}>
                {news.images.map((img: any) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={img.id}>
                        <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={img.urlPath}
                                alt="news"
                                sx={{ objectFit: "cover" }}
                            />
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
