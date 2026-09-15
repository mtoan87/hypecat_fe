/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Backdrop,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fade,
    Stack,
    Typography,
} from "@mui/material";
import RestoreFromTrashOutlinedIcon from "@mui/icons-material/RestoreFromTrashOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { toast } from "react-toastify";
import newsAPI from "../../../api/services/NewsApi/newsAPI";

interface DeleteNewsProps {
    news: any;
    open: boolean;
    handleClose: () => void;
    fetchData: () => void;
}
const DeleteNewsDialog: React.FC<DeleteNewsProps> = ({
    open,
    news,
    handleClose,
    fetchData,
}) => {
    const handleDelete = async () => {
        try {
            await newsAPI.DeleteOrEnable(news.id, !news?.isDeleted ? 1 : 0);
            toast.success("Đổi trạng thái thông báo thành công");
            fetchData();
        } catch (error) {
            toast.error("Đổi trạng thái thông báo thất bại");
            console.error("Lỗi khi xoá/khôi phục thông báo:", error);
        } finally {
            handleClose();
        }
    };
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            TransitionComponent={Fade}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    {news.isDeleted ? (
                        <RestoreFromTrashOutlinedIcon color="success" fontSize="large" />
                    ) : (
                        <DeleteOutlinedIcon color="error" fontSize="large" />
                    )}
                    <Box>
                        <Typography variant="h6" fontWeight={600}>
                            {news.isDeleted
                                ? "Khôi phục thông báo"
                                : "Ngừng hoạt động thông báo"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {news.isDeleted
                                ? "Thông báo sẽ được kích hoạt lại"
                                : "Thông báo sẽ được ẩn khỏi hệ thống"}
                        </Typography>
                    </Box>
                </Stack>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                <Box
                    sx={{
                        p: 2,
                        backgroundColor: "#f8fafc",
                        borderRadius: 2,
                        border: "1px solid #e2e8f0",
                    }}
                >
                    <Typography variant="body1" textAlign="center">
                        Bạn có chắc chắn muốn{" "}
                        {news.isDeleted ? "khôi phục" : "ngừng hoạt động"} thông báo{" "}
                        <Typography component="span" fontWeight={600} color="primary">
                            "{news.title}"
                        </Typography>{" "}
                        này không?
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                >
                    Hủy
                </Button>
                <Button
                    onClick={handleDelete}
                    variant="contained"
                    color={news.isDeleted ? "success" : "error"}
                    sx={{ borderRadius: 2 }}
                >
                    {news.isDeleted ? "Khôi phục" : "Xác nhận"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteNewsDialog;
