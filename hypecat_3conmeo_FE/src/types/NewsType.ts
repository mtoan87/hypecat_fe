import type { Category } from "./CategoryType";

interface NewsImage {
    id?: number;
    urlPath: string;
}

export interface NewsFormInput {
    title: string;
    content: string;
    writer: string;
    cover: string;
    categoryId: string;
    newsImages: string[];
}

export interface News {
    id: string;
    title: string;
    content: string;
    writer: string;
    cover: string;
    categoryId: string;
    category: Category;
    images: NewsImage[];
    newsImages: NewsImage[];
}