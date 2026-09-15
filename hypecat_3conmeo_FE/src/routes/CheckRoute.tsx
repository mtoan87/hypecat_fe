import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import config from "../configs";
import { Role } from "./Roles";
import LoadingScreen from "../components/LoadingScreen";
import { useAuthContext } from "../hooks/useAuth";

const CheckRoute: React.FC = () => {
  const { auth, isLoading } = useAuthContext();
  const location = useLocation();
  let redirectTo: string | null = config.customerRoutes.home;

  console.log("Auth in CheckRoute:", auth);

  if (isLoading) {
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  }

  if (auth?.Role) {
    switch (auth?.Role) {
      case Role.Customer:
        redirectTo = config.customerRoutes.home;
        break;
      case Role.Admin:
        redirectTo = config.adminRoutes.dashboard;
        break;
      default:
        break;
    }
  }

  if (location.pathname === redirectTo) {
    return <Outlet />;
  } else {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
};

export default CheckRoute;
