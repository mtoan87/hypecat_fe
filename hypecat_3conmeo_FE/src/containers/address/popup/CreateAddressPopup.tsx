import React, { useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Stack, IconButton, Typography, Button
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useForm, FormProvider } from "react-hook-form";
import RHFTextField from "../../../components/hook-form/RHFTextField";
import type { AddressFormInput } from "../../../types/AddressType";

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (address: AddressFormInput) => void;
}

const CreateAddressDialog: React.FC<Props> = ({ open, onClose, onSave }) => {
    const methods = useForm<AddressFormInput>({
        defaultValues:
        {
            name: "",
            phone: "",
            province: "",
            ward: "",
            street: "",
            isDefault: false,
        },
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
        if (open) {
            reset(
                {
                    name: "",
                    phone: "",
                    province: "",
                    ward: "",
                    street: "",
                    isDefault: false,
                }
            );
        }
    }, [open, reset]);

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
                                Thêm địa chỉ
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

export default CreateAddressDialog;
