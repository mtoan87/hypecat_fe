/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthContext } from "../../../hooks/useAuth";
import axiosClient from "../../axiosInstance";
import { LOGIN, REGISTER } from "../../PathnameApi";

export const AuthApi = () => {
  const { setAuth } = useAuthContext();

  const login = async (body: any) => {
    const response = await axiosClient.post(LOGIN, body);
    // assuming response.data contains your user object
    localStorage.setItem("loginInfo", JSON.stringify(response.data));
    setAuth(response.data); // store whole user object
    return response;
  };

  const register = async (body: any) => {
    const response = await axiosClient.post(REGISTER, body);
    return response;
  };

  const logout = () => {
    localStorage.removeItem("loginInfo");
    setAuth(null);
  };

  return { login, logout, register };
};
