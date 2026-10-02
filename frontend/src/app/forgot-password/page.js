"use client";

import { useState } from "react";
import { forgotPassword } from "../../lib/api";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setStatus({ type: "success", message: res.message });
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

        <form onSubmit={handleSubmit} className="space-y-6">
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
            {loading ? "Transmitting..." : "Send Reset Link"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
