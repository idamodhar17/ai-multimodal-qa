import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "@/api/apiService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("auth_token");

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await apiService.login({ email, password });

    localStorage.setItem("auth_token", res.access_token);
    localStorage.setItem("user", JSON.stringify(res.user));

    setUser(res.user);
    return res.user;
  };

  const signup = async (email, password) => {
    const res = await apiService.register({ email, password });

    localStorage.setItem("user", JSON.stringify(res.user));
    setUser(res.user);

    return res.user;
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
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
