"use client";

import { useState } from "react";
import { forgotPassword, resetPassword } from "../../lib/api";
import { sendOTPEmail } from "../../lib/emailjs";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // sendOTPEmail is imported from ../../lib/emailjs

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      // Send OTP from browser via EmailJS
      if (res.otp && res.email) {
        await sendOTPEmail(res.email, res.otp);
      }
      setStatus({ type: "success", message: "A 6-digit reset code has been sent to your email!" });
      setStep(2);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await resetPassword(otp, newPassword);
      setStatus({ type: "success", message: "Password updated! Redirecting to login..." });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8"
      >
        <h1 className="text-2xl font-bold mb-6 tracking-widest uppercase text-center">Recover Access</h1>
        
        {status && (
          <div className={`p-4 rounded-lg mb-6 text-sm border ${
            status.type === "error" ? "bg-red-900/20 border-red-900/50 text-red-200" : "bg-green-900/20 border-green-900/50 text-green-200"
          }`}>
            {status.message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOTP} className="space-y-6">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">Account Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neutral-500 transition-colors"
                placeholder="operator@system.com"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading ? "Transmitting..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <p className="text-sm text-neutral-400 text-center mb-4">
              Enter the 6-digit authorization code sent to {email}.
            </p>
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase text-center">Auth Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neutral-500 transition-colors text-center tracking-[0.5em] text-lg"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neutral-500 transition-colors"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Confirm New Password"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
