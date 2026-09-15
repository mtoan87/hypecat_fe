/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import RHFEditor from "../../components/hook-form/RHFEditor";
import { FormProvider, RHFSelect, RHFTextField, RHFUploadMultiFile, RHFUploadSingleFile } from "../../components/hook-form";
import type { NewsFormInput } from "../../types/NewsType";
import { useCallback, useEffect, useState } from "react";
import type { Category } from "../../types/CategoryType";
import { toast } from "react-toastify";
import categoryApi from "../../api/services/CategoryApi/categoryAPI";
import { uploadImageToFirebase } from "../../firebase/uploadImageToFirebase";
import newsAPI from "../../api/services/NewsApi/newsAPI";
import { useNavigate, useParams } from "react-router-dom";
import config from "../../configs";
import CircularProgress from '@mui/material/CircularProgress';

interface NewsFormProps {
    isEdit?: boolean;
    newsId?: string;
}

const NewsSchema = yup.object().shape({
    title: yup.string().required("Vui lòng nhập tiêu đề"),
    content: yup.string().required("Vui lòng nhập nội dung"),
    writer: yup.string().required("Vui lòng nhập tên tác giả"),
    cover: yup.string().required("Vui lòng chọn ảnh bìa"),
    categoryId: yup
        .string()
        .typeError("Vui lòng chọn danh mục")
        .required("Vui lòng chọn danh mục"),
    newsImages: yup
        .array()
        .of(yup.string().required())
        .min(1, "Vui lòng thêm ít nhất một hình ảnh")
        .required("Vui lòng thêm ít nhất một hình ảnh"),
});

export default function NewForm({ isEdit = false }: NewsFormProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);
    const methods = useForm<NewsFormInput>({
        defaultValues: {
            title: "",
            content: "",
            writer: "",
            cover: "",
            categoryId: "0",
            newsImages: [],
        },
        resolver: yupResolver(NewsSchema),
    });

    const {
        handleSubmit,
        setValue,
        watch,
        register,
        reset,
        formState: { errors },
    } = methods;

    const values = watch();

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (isEdit && id) {
            fetchNewsById(id);
        }
    }, [isEdit, id]);

    // Get categories
    const fetchCategories = async () => {
        try {
            const res: any = await categoryApi.getCategoryNewsActive();
            setCategories(res.items);
        } catch {
            toast.error("Không thể tải danh sách danh mục");
        }
    };

    const fetchNewsById = async (id: string) => {
        try {
            const res = await newsAPI.getNewsById(id);
            reset({
                title: res.title,
                writer: res.writer,
                content: res.content,
                cover: res.cover,
                categoryId: res.category?.id,
                newsImages: res.images.map((img) => img.urlPath),
            });
        } catch (error) {
            console.error("Lỗi fetch news:", error);
            toast.error("Không thể tải tin tức");
        }
    };

    // Upload 1 image
    const handleDropCover = useCallback(
        async (acceptedFiles: File[]) => {
            if (!acceptedFiles.length) return;
            setIsUploading(true);
            try {
                const file = acceptedFiles[0];
                const downloadURL = await uploadImageToFirebase(file);
                setValue("cover", downloadURL);
            } catch (err) {
                console.error("Lỗi khi upload ảnh bìa:", err);
                toast.error("Lỗi khi upload ảnh bìa");
            } finally {
                setIsUploading(false);
            }
        },
        [setValue]
    );

    // Upload multiple images
    const handleDropImages = useCallback(
        async (acceptedFiles: File[]) => {
            if (!acceptedFiles.length) return;
            setIsUploading(true);
            try {
                const uploaded = await Promise.all(
                    acceptedFiles.map((file) => uploadImageToFirebase(file))
                );
                setValue("newsImages", [...(values.newsImages || []), ...uploaded]);
            } catch (err) {
                console.error("Lỗi khi upload ảnh bài viết:", err);
                toast.error("Lỗi khi upload ảnh bài viết");
            } finally {
                setIsUploading(false);
            }
        },
        [setValue, values.newsImages]
    );

    const handleRemoveImage = (file: string | File) => {
        if (typeof file === "string") {
            const filtered = values.newsImages?.filter((img) => img !== file);
            setValue("newsImages", filtered);
        }
    };

    const handleRemoveAllImages = () => {
        setValue("newsImages", []);
    };

    const onSubmit = async (data: NewsFormInput) => {
        try {
            if (isEdit && id) {
                await newsAPI.updateNews(id, data);
                toast.success("Cập nhật thành công");
                navigate(config.adminRoutes.manageCategory);
            } else {
                await newsAPI.createNews(data);
                toast.success("Tạo tin tức thành công");
                methods.reset();
                navigate(config.adminRoutes.manageCategory);
            }
        } catch {
            toast.error("Lỗi khi lưu tin tức");
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box maxWidth="md" mx="auto" mt={4}>
                <Typography variant="h4" gutterBottom>
                    Tạo tin tức mới
                </Typography>

                <Stack spacing={3}>
                    <RHFTextField
                        label="Tiêu đề"
                        {...register("title")}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                    />

                    <RHFTextField
                        label="Tác giả"
                        {...register("writer")}
                        error={!!errors.writer}
                        helperText={errors.writer?.message}
                    />

                    <RHFSelect
                        name="categoryId"
                        label="Danh mục"
                        error={!!errors.categoryId}
                        helperText={errors.categoryId?.message}
                    >
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </RHFSelect>

                    <RHFEditor name="content" label="Nội dung" />

                    <RHFUploadSingleFile
                        name="cover"
                        label="Ảnh bìa"
                        onDrop={handleDropCover}
                    />

                    <RHFUploadMultiFile
                        name="newsImages"
                        label="Hình ảnh bài viết"
                        showPreview
                        onDrop={handleDropImages}
                        onRemove={handleRemoveImage}
                        onRemoveAll={handleRemoveAllImages}
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        disabled={isUploading}
                        startIcon={isUploading ? <CircularProgress size={20} /> : undefined}
                    >
                        {isUploading ? "Đang tải ảnh..." : "Đăng tin"}
                    </Button>
                </Stack>
            </Box>
        </FormProvider>
    );
}
