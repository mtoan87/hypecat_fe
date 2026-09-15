import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import config from "../configs";
import LoadingScreen from "../components/LoadingScreen";
import { useAuthContext } from "../hooks/useAuth";

interface RequireAuthProps {
  allowedRoles: string[];
}

const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
  const { auth, isLoading } = useAuthContext();
  const location = useLocation();
  const [showLoading, setShowLoading] = React.useState(false);
  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  useEffect(() => {
    if (!auth?.Role && !isLoading) {
      setShowLoading(true);
      const timer = setTimeout(() => {
        setShowLoading(false);
        setShouldRedirect(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [auth, isLoading]);
  if (isLoading || showLoading) {
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  }

  if (shouldRedirect) {
    return (
      <Navigate
        to={config.customerRoutes.home}
        replace
        state={{ from: location }}
      />
    );
  }

  if (auth?.Role && !allowedRoles.includes(auth?.Role)) {
    return <Navigate to="/notFound" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
