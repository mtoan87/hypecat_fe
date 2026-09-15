import type { BatchDetail } from "./BatchType";
import type { Category } from "./CategoryType";

export interface ProductImage {
  id?: string;
  urlPath: string;
}

export interface ProductLog {
  id: string;
  productId: string;
  quantity: number;
  type: string;
  name: string;
  phone: string;
  address: string;
  createDate: string;
}

export interface CreateProductFormInput {
  name: string;
  categoryId: number;
  packsPerUnit: number;
  language: string;
  description: string;
  status: string;
  productImages: (File | string | undefined)[];
  cover: string;
}

export interface EditProductFormInput {
  name: string;
  categoryId: number;
  packsPerUnit: number;
  status: string;
  productImages: (File | string | undefined)[];
  language: string;
  cover: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: number;
  category: Category;
  isDeleted: boolean;
  stockQuantity: number;
  status: string;
  unit: string;
  images: ProductImage[];
  logs: ProductLog[];
  createDate: string;
  batchDetails: BatchDetail[];
  language: string;
  packsPerUnit: number;
  cover: string;
}

export interface ProductListResponse {
  items: Product[];
  totalItemsCount: number;
  pageSize: number;
  totalPagesCount: number;
  pageIndex: number;
  next: boolean;
  previous: boolean;
}

export const productStatusOptions = [
  { value: "", label: "Chọn trạng thái" },
  { value: "Available", label: "Còn hàng" },
  { value: "OutOfStock", label: "Hết hàng" },
  { value: "Incoming", label: "Hàng về" },
  { value: "Discontinued", label: "Ngừng" },
  { value: "PendingApproval", label: "Phê duyệt" },
  { value: "Damaged", label: "Hư hỏng" },
  { value: "Expired", label: "Hết hạn" },
];
