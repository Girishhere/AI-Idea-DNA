"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuth, signupUser, verifyOTP } from "../../lib/api";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signupUser(username, email, password);
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to signup");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await verifyOTP(email, otp);
      setToken(data.access_token);
    } catch (err) {
      setError(err.message || "OTP Verification failed");
    } finally {
      setLoading(false);
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
            {step === 1 ? "Initialize Access" : "Verify Identity"}
          </h2>
          
          {error && (
            <div className="mb-4 p-3 border border-red-500/30 bg-red-500/10 text-red-200 text-sm rounded">
              {error}
            </div>
          )}

          {step === 1 ? (
            <>
              <form onSubmit={handleSignup} className="space-y-4">
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
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input w-full p-3 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Password</label>
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
                  disabled={loading}
                  className="glow-button glow-button-solid w-full mt-4 justify-center disabled:opacity-50"
                >
                  {loading ? "Initializing..." : "Establish Identity"}
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
                  text="signup_with"
                />
              </div>
            </>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <p className="text-sm text-neutral-400 text-center mb-4">
                An authorization code has been dispatched to {email}.
              </p>
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1 text-center">Auth Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="glass-input w-full p-3 text-lg text-center tracking-[0.5em]"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="glow-button glow-button-solid w-full mt-4 justify-center disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>
          )}
          
          {step === 1 && (
            <div className="mt-6 text-center text-sm text-neutral-500">
              Already registered? <a href="/login" className="text-white hover:underline">Return to Login</a>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
