/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Address } from "../../../types/AddressType";
import axiosClient from "../../axiosInstance";
import { ADDRESS, ADDRESS_CREATE, ADDRESS_DEFAULT, ADDRESS_UPDATE } from "../../PathnameApi";

const addressApi = {
    //Get profile
    getAddressByUserId: (params?: string): Promise<Address[]> => {
        return axiosClient.get(ADDRESS, {
            params,
            paramsSerializer: {
                indexes: null,
            },
        })
    },

    //Create address
    createAddress: (body: any): Promise<any> => {
        return axiosClient.post(ADDRESS_CREATE, body);
    },

    //Update address
    updateAddress: (id: number, body: any): Promise<any> => {
        return axiosClient.put(`${ADDRESS_UPDATE}/${id}`, body);
    },

    //Set default address
    setDefaultAddress: (params?: Record<string, any>): Promise<Address> => {
        return axiosClient.put(ADDRESS_DEFAULT, null, {
            params,
            paramsSerializer: {
                indexes: null,
            },
        })
    },
    DeleteOrEnable: (
        addressId: string,
        isDeleted: number
    ): Promise<{ message: string }> => {
        const url = `/Address/DeleteOrEnable/${addressId}/${isDeleted}`;
        return axiosClient.put(url, null, {
            params: {
                addressId,
                isDeleted,
            },
        });
    },
}

export default addressApi;
