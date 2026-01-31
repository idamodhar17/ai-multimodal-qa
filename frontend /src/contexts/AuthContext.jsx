import React, { createContext, useContext, useEffect, useState } from "react";
import { apiService } from "@/api/apiService";
import { registerLogout } from "@/api/authBridge";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("auth_token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        clearSession();
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    registerLogout(logout);
  }, []);

  const login = async (email, password) => {
    const res = await apiService.login({ email, password });

    localStorage.setItem("auth_token", res.access_token);
    localStorage.setItem("user", JSON.stringify(res.user));

    setUser(res.user);
    setToken(res.access_token);

    return res.user;
  };

  const signup = async (email, password) => {
    const res = await apiService.register({ email, password });

    localStorage.setItem("user", JSON.stringify(res.user));
    setUser(res.user);

    return res.user;
  };

  const logout = () => {
    clearSession();
  };

  const clearSession = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
