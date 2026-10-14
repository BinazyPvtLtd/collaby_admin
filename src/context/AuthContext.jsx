import { createContext, useContext, useEffect, useState } from "react";
import adminApi from "../api/adminApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_access_token");
    const savedAdmin = localStorage.getItem("admin_data");
    if (token) {
      setAdmin(savedAdmin ? JSON.parse(savedAdmin) : { name: "Admin" });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await adminApi.login(email, password);
    localStorage.setItem("admin_access_token", res.data.accessToken);
    localStorage.setItem("admin_refresh_token", res.data.refreshToken);
    localStorage.setItem("admin_data", JSON.stringify(res.data.admin));
    setAdmin(res.data.admin);
    return res.data;
  };

  const logout = async () => {
    try {
      await adminApi.logout();
    } catch (err) {
      // ignore network errors on logout
    }
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_refresh_token");
    localStorage.removeItem("admin_data");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
