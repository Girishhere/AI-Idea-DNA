"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import { GoogleLogin } from "@react-oauth/google";
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const data = await googleAuth(credentialResponse.credential);
      setToken(data.access_token);
    } catch (err) {
      setError(err.message || "Google login failed");
    }
  };

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
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed")}
              theme="filled_black"
              text="continue_with"
            />
          </div>
          
          <div className="mt-6 text-center text-sm text-neutral-500">
            Don't have an account? <a href="/signup" className="text-white hover:underline">Request Access</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
