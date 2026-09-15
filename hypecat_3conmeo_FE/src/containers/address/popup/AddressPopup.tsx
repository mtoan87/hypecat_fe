import React, { useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Stack, FormControlLabel, Checkbox,
    IconButton, Typography, Button
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useForm, FormProvider } from "react-hook-form";
import RHFTextField from "../../../components/hook-form/RHFTextField";
import type { AddressFormInput } from "../../../types/AddressType";

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (address: AddressFormInput) => void;
    editingAddress?: AddressFormInput | null;
}

const AddressDialog: React.FC<Props> = ({ open, onClose, onSave, editingAddress }) => {
    const methods = useForm<AddressFormInput>({
        defaultValues: editingAddress || {
            name: "",
            phone: "",
            province: "",
            ward: "",
            street: "",
            isDefault: false,
        },
    });

    const { handleSubmit, reset } = methods;

    // Reset lại form khi mở dialog
    useEffect(() => {
        if (open) {
            reset(
                editingAddress || {
                    name: "",
                    phone: "",
                    province: "",
                    ward: "",
                    street: "",
                    isDefault: false,
                }
            );
        }
    }, [open, editingAddress, reset]);

    const onSubmit = (data: AddressFormInput) => {
        onSave(data);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="h6">
                                {editingAddress ? "Chỉnh sửa" : "Thêm"} địa chỉ
                            </Typography>
                            <IconButton onClick={onClose}>
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                    </DialogTitle>

                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <RHFTextField name="name" label="Tên người nhận" />
                            <RHFTextField name="phone" label="Số điện thoại" />
                            <RHFTextField name="province" label="Tỉnh/Thành phố" />
                            <RHFTextField name="ward" label="Quận/Huyện" />
                            <RHFTextField name="street" label="Đường/Số nhà" />

                            {!editingAddress?.isDefault && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            {...methods.register("isDefault")}
                                        />
                                    }
                                    label="Đặt làm địa chỉ mặc định"
                                />
                            )}
                        </Stack>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={onClose}>Hủy</Button>
                        <Button type="submit" variant="contained">Lưu</Button>
                    </DialogActions>
                </form>
            </FormProvider>
        </Dialog>
    );
};

export default AddressDialog;
