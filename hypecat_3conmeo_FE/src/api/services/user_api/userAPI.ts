/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UserData } from "../../../types/Usertype";
import axiosClient from "../../axiosInstance";
import { PROFILE, PROFILE_UPDATE, UPDATE_USER } from "../../PathnameApi";

const userApi = {
  //GET api
  getListUsers: (params?: {
    pageIndex?: number;
    pageSize?: number;
    RoleId?: number;
  }) => {
    const url = "/Users/GetUserPagination";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  getUserByPhone: (params?: { phone: string }) => {
    const url = "/Users/GetCustomerInfoByPhone";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  //Get profile
  getProfile: (params?: string): Promise<UserData> => {
    return axiosClient.get(PROFILE, {
      params,
      paramsSerializer: {
        indexes: null,
      },
    });
  },

  //POST api (multipart/form-data)
  createNewUser: (body: string) => {
    const url = "/Users/CreateUser";
    return axiosClient.post(url, body);
  },

  //update account
  UpdateActive: (id?: number, isDelete?: string) => {
    const url = `Users/DeleteOrEnable/${id}/${isDelete}`;
    return axiosClient.put(url);
  },

  //POST api
  postSomeThingNor: (body: string) => {
    const url = "/api/v1/someThing";
    return axiosClient.post(url, body);
  },

  //PUT api
  updateProfile: (id: any, body: any): Promise<UserData> => {
    return axiosClient.put(`${PROFILE_UPDATE}/${id}`, body);
  },

  //get user by id
  getAccountById: (id: string): Promise<UserData> => {
    const url = `Users/GetAccountById/${id}`;
    return axiosClient.get(url);
  },

  updateAccount: (id: any, body: any): any => {
    return axiosClient.put(UPDATE_USER.replace(":id", id), body);
  },
};

export default userApi;
