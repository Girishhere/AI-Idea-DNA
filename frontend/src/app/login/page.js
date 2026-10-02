"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../../lib/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, setToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || "Failed to login");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const data = await googleAuth(tokenResponse.access_token);
        setToken(data.access_token);
      } catch (err) {
        setError(err.message || "Google login failed");
      }
    },
    onError: () => setError("Google login failed"),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card w-full max-w-md p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center tracking-wider uppercase text-white">
            Access System
          </h2>
          
          {error && (
            <div className="mb-4 p-3 border border-red-500/30 bg-red-500/10 text-red-200 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="glass-input w-full p-3 text-sm"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-mono text-neutral-400">Password</label>
                <a href="/forgot-password" className="text-xs text-neutral-500 hover:text-white transition-colors">Forgot?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full p-3 text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="glow-button glow-button-solid w-full mt-4 justify-center"
            >
              Authenticate
            </button>
          </form>

          <div className="my-6 flex items-center justify-center">
            <div className="border-t border-white/10 w-full"></div>
            <span className="px-4 text-xs font-mono text-neutral-500 uppercase">OR</span>
            <div className="border-t border-white/10 w-full"></div>
          </div>

          <div className="flex justify-center w-full">
            <button
              type="button"
              onClick={() => googleLogin()}
              className="flex items-center justify-center gap-3 w-full p-3 rounded-lg bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] transition-all text-sm font-semibold text-white/80"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>
          
          <div className="mt-6 text-center text-sm text-neutral-500">
            Don't have an account? <a href="/signup" className="text-white hover:underline">Request Access</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
