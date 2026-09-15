/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface AuthContextProps {
  auth: any;
  setAuth: React.Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean; // New loading state
}

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [auth, setAuth] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loginInfoString = localStorage.getItem("userInfor");

    if (loginInfoString) {
      try {
        // If userInfor is a JWT, decode directly
        const decoded: any = jwtDecode(loginInfoString);
        setAuth(decoded);
      } catch (err) {
        console.error("Invalid token in userInfor", err);
        setAuth(null);
      }
    } else {
      setAuth(null);
    }

    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
