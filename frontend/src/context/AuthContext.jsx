import { createContext, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load saved login info from localStorage so the user stays logged in
  // even after refreshing the page.
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem("userInfo");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("userInfo", JSON.stringify(data));
    setUserInfo(data);
    return data;
  };

  const register = async (name, email, password, role) => {
    const { data } = await api.post("/auth/register", { name, email, password, role });
    localStorage.setItem("userInfo", JSON.stringify(data));
    setUserInfo(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
