import * as React from "react";

import { AuthContextType, userData } from "./auth";

export const AuthContext = React.createContext<AuthContextType | null>(null);
import { useRouter } from "next/router";

type AuthContextProviderProps = {
  children: React.ReactNode;
};

const AuthProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [data, setData] = React.useState<userData>({ token: "", userId: "" });
  const router = useRouter();
  const login = (token: String, userId: String, tokenExpiration: String) => {
    const updateData: userData = {
      token,
      userId,
    };
    setData(updateData);
    router.push("/events");
  };
  const logout = () => {
    const updateData: userData = {
      token: "",
      userId: "",
    };
    setData(updateData);
    router.push("/auth");
  };
  return (
    <AuthContext.Provider value={{ data, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
