/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../../axiosInstance";

const dashboardApi = {
  dashboard: (params?: any) => {
    const url = "Dashboards/GetDashboardData";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
};

export default dashboardApi;
