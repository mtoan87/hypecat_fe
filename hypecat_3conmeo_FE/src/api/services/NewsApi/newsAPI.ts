import type { News } from "../../../types/NewsType";
import axiosClient from "../../axiosInstance";

/* eslint-disable @typescript-eslint/no-explicit-any */
const newsAPI = {
    //GET news list
    getNewsList: (params?: any): Promise<News> => {
        const url = "/New/GetNewsPagination?IsDescending=true";
        return axiosClient.get(url, {
            params,
            paramsSerializer: {
                indexes: null, // by default: false
            },
        });
    },

    //GET news by id
    getNewsById: (id: string, params?: any): Promise<News> => {
        const url = `/New/GetNewById/${id}`;
        return axiosClient.get(url, {
            params,
            paramsSerializer: {
                indexes: null, // by default: false
            },
        });
    },

    //GET news in user 
    getNewsByUser: (params?: any): Promise<News[]> => {
        const url = `/New/GetAllNews`;
        return axiosClient.get(url, {
            params,
            paramsSerializer: {
                indexes: null, // by default: false
            },
        });
    },

    //Add news
    createNews: (body: any) => {
        const url = "/New/addNew";
        return axiosClient.post(url, body);
    },

    //Update news
    updateNews: (id: string, body: any) => {
        const url = `/New/UpdateNew/${id}`;
        return axiosClient.put(url, body);
    },

    //Delete or enable news
    DeleteOrEnable: (
        newId: string,
        isDeleted: number,
        params?: any
    ): Promise<{ message: string }> => {
        const url = `/New/DeleteOrEnable/${newId}/${isDeleted}`;
        return axiosClient.put(url, null, {
            params,
            paramsSerializer: {
                indexes: null, // by default: false
            },
        });
    },
}
export default newsAPI;