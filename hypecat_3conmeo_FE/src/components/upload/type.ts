import { type ReactNode } from "react";
import { type DropzoneOptions } from "react-dropzone";
// @mui
import { type SxProps } from "@mui/material";
import { type Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export interface CustomFile extends File {
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
}

export interface UploadProps extends DropzoneOptions {
  error?: boolean;
  file: CustomFile | string | null;
  helperText?: ReactNode;
  sx?: SxProps<Theme>;
}

export interface UploadMultiFileProps extends DropzoneOptions {
  files: (File | string)[];
  error?: boolean;
  showPreview?: boolean;
  sx?: SxProps<Theme>;
  helperText?: ReactNode;
  onUpload?: VoidFunction;
  onRemove?: (file: File | string) => void;
  onRemoveAll?: VoidFunction;
}
