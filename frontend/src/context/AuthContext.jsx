"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { loginUser as apiLogin, fetchMe as getMe } from "../lib/api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await getMe(token);
          setUser(userData);
        } catch (err) {
          console.error("Auth init error:", err);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    const data = await apiLogin(username, password);
    localStorage.setItem("token", data.access_token);
    const userData = await getMe(data.access_token);
    setUser(userData);
    router.push("/dashboard");
  };

  // setToken is called after OTP verification completes (signup is now a 2-step flow)
  const setToken = async (token) => {
    localStorage.setItem("token", token);
    const userData = await getMe(token);
    setUser(userData);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  // Protect routes
  useEffect(() => {
    if (!loading) {
      if (!user && (pathname === "/dashboard" || pathname === "/profile" || pathname === "/admin")) {
        router.push("/login");
      }
      if (user && user.role !== "admin" && pathname === "/admin") {
        router.push("/dashboard");
      }
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
