/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CartType } from "../../../types/CartType";
import axiosClient from "../../axiosInstance"
import { CART, CREATE_CART_ITEM, DELETE_CART_ITEM, UPDATE_CART_ITEM_QUANTITY } from "../../PathnameApi"

const cartApi = {
    // get cart by user ID
    getUserCartDisplay: (params?: string): Promise<CartType[]> => {
        return axiosClient.get(CART, {
            params,
            paramsSerializer: {
                indexes: null,
            },
        })
    },

    // Update cart item quantity
    updateCartItemQuantity: (body: any): Promise<any> => {
        return axiosClient.put(`${UPDATE_CART_ITEM_QUANTITY}`, body);
    },

    //Delete cart item by ID
    deleteCartItem: (id: string): Promise<{ message: string }> => {
        return axiosClient.delete(`${DELETE_CART_ITEM}?productId=${id}`);
    },

    //Add to cart 
    CreateCartItem: (body: any) => {
        return axiosClient.post(CREATE_CART_ITEM, body);
    } 
}
export default cartApi;