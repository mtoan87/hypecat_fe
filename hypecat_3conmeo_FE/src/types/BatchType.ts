/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ProductImage {
  id: number;
  urlPath: string;
}

export interface ProductCategory {
  id: number;
  name: string;
}

export interface ProductBatch {
  id: number;
  name: string;
  sellingPrice: number;
  importCosts: number;
  unit: string;
  isDeleted: boolean;
  categoryId: number;
  status: string;
  createDate: string;
  category: ProductCategory;
  images: ProductImage[];
  logs: any[];
  cover: string;
}
export interface Product {
  id: number;
  name: string;
  category: Category;
}

export interface Category {
  id: number;
  name: string;
}
export interface SourceOfProduct {
  id: number;
  name: string;
}

export interface BatchDetailChild {
  id: number;
  batchId: number;
  productId: number;
  daysUntilExpiration: number;
  createDate: string;
  quantity: number;
  productDTO: Product;
  sellingPrice: number;
  remainingQuantity: number;
}

export interface Batch {
  id: number;
  createDate: string;
  batchDetailDTOs: BatchDetail[];
}

export interface BatchDetail {
  batchdetailParent: {
    id: number;
    batchId: number;
    quantity: number;
    remainingQuantity: number;
    sellingPrice: number;
    productId: number;
    productDTO: {
      id: number;
      name: string;
      categoryDTO: { name: string };
    };
  };

  batchdetailChild: BatchDetailChild[];
}

export interface ProductInBatch {
  id: number;
  isChild: boolean;
  productName: string;
  categoryName: string;
  productId: number;
  batchId: number;
  quantity: number;
  remainingQuantity: number;
  sellingPrice: number;
}
