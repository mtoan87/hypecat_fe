import { useFormContext, Controller } from "react-hook-form";
import { Box, FormHelperText, Typography } from "@mui/material";
import Editor from "../editor/Editor";

interface Props {
    name: string;
    label: string;
    simple?: boolean;
    error?: boolean;
    helperText?: React.ReactNode;
}

export default function RHFEditor({ label, name, simple }: Props) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Box>
                    {label && (
                        <Typography
                            variant="body1"
                            component="label"
                            sx={{ display: "flex", alignItems: "center" }}
                        >
                            {label}
                            <Typography component="span" color="red" sx={{ ml: 0.5 }}>
                                *
                            </Typography>
                        </Typography>
                    )}
                    <Editor
                        id={name}
                        value={field.value}
                        onChange={field.onChange}
                        simple={simple}
                        error={!!error}
                        helperText={
                            <FormHelperText error sx={{ px: 2 }}>
                                {error?.message}
                            </FormHelperText>
                        }
                    />
                </Box>
            )}
        />
    );
}
