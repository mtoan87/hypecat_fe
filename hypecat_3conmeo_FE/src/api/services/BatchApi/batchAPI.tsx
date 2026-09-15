/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../../axiosInstance";
import { BATCH_LIST, BREAK_BOX, CREATE_BATCH } from "../../PathnameApi";

const BatchAPI = {
  //GET api
  getBatchList: (params?: any) => {
    const url = BATCH_LIST;
    return axiosClient.get(url, {
      params,
    });
  },

  getBatchById: (id: string, params?: any) => {
    const url = `/Batch/GetBatchById/${id}`;
    return axiosClient.get(url, {
      params,
    });
  },

  //POST api
  CreateBatch: (params?: any) => {
    const url = CREATE_BATCH;
    return axiosClient.post(url, params);
  },

  //break box
  BreakBox: (params?: any) => {
    const url = BREAK_BOX;
    return axiosClient.post(url, params);
  },
};

export default BatchAPI;
