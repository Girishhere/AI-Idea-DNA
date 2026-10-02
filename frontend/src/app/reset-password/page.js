"use client";

import { useState, Suspense } from "react";
import { resetPassword } from "../../lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Missing reset token");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8"
    >
      <h1 className="text-2xl font-bold mb-6 tracking-widest uppercase text-center">New Credentials</h1>
      
      {error && <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-200 rounded-lg mb-6 text-sm">{error}</div>}
      
      {success ? (
        <div className="p-4 bg-green-900/20 border border-green-900/50 text-green-200 rounded-lg text-center">
          Password reset successful. Redirecting to login...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">New Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neutral-500 transition-colors"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {loading ? "Updating..." : "Commit Credentials"}
          </button>
        </form>
      )}
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-8">
      <Suspense fallback={<div>Loading Secure Core...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
