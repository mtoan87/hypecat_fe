import React from "react";
import Login from "../../containers/authenticate/Login";
// import { Helmet } from "react-helmet";

const AuthenticatePage: React.FC = () => {
  return (
    <>
      <title>HypeCat | Đăng Nhập</title>
      <Login />
    </>
  );
};

export default AuthenticatePage;
