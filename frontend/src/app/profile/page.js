"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import { updateProfile, changePassword } from "../../lib/api";

export default function ProfilePage() {
  const { user, loading, setUser } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: "",
    organization: "",
    bio: "",
    interests: "",
  });
  
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: ""
  });

  const [message, setMessage] = useState("");
  const [pwMessage, setPwMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        full_name: user.profile.full_name || "",
        organization: user.profile.organization || "",
        bio: user.profile.bio || "",
        interests: user.profile.interests || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("token");
    try {
      const updatedUser = await updateProfile(formData, token);
      setUser(updatedUser);
      setMessage("Identity parameters updated successfully.");
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setMessage("Failed to update profile.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwMessage({ type: "", text: "" });
    const token = localStorage.getItem("token");
    try {
      const res = await changePassword(passwordData.old_password, passwordData.new_password, token);
      setPwMessage({ type: "success", text: res.message });
      setPasswordData({ old_password: "", new_password: "" });
      setTimeout(() => setPwMessage({ type: "", text: "" }), 5000);
    } catch (err) {
      setPwMessage({ type: "error", text: err.message });
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl space-y-6"
        >
          {/* Profile Card */}
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-bold tracking-wider uppercase text-white">
                Operative Profile
              </h2>
              <div className="text-right">
                <div className="text-sm font-bold text-white">{user.username}</div>
                <div className="text-xs font-mono text-neutral-500">{user.email}</div>
                <div className="text-xs font-mono text-neutral-600 uppercase mt-1">Role: {user.role}</div>
                {user.auth_provider === 'google' && (
                  <div className="text-xs font-mono text-blue-400 uppercase mt-1">Google Authenticated</div>
                )}
              </div>
            </div>
            
            {message && (
              <div className="mb-6 p-3 border border-white/20 bg-white/5 text-white text-sm rounded font-mono">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="glass-input w-full p-3 text-sm"
                    placeholder="e.g. Alan Turing"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">Organization</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({...formData, organization: e.target.value})}
                    className="glass-input w-full p-3 text-sm"
                    placeholder="University / Company"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="glass-input w-full p-3 text-sm h-24 resize-none"
                  placeholder="Brief operative background..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">Tech Interests (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.interests}
                  onChange={(e) => setFormData({...formData, interests: e.target.value})}
                  className="glass-input w-full p-3 text-sm font-mono"
                  placeholder="Python, React, NLP, Cybernetics..."
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  className="glow-button glow-button-solid"
                >
                  Sync Profile Data
                </button>
              </div>
            </form>
          </div>

          {/* Security Card */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold tracking-wider uppercase text-white mb-6">
              Security Credentials
            </h2>

            {pwMessage.text && (
              <div className={`mb-6 p-3 border rounded text-sm font-mono ${
                pwMessage.type === 'error' ? 'border-red-500/30 bg-red-500/10 text-red-200' : 'border-green-500/30 bg-green-500/10 text-green-200'
              }`}>
                {pwMessage.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {user.auth_provider !== 'google' && (
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.old_password}
                    onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                    className="glass-input w-full p-3 text-sm max-w-md"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                  className="glass-input w-full p-3 text-sm max-w-md"
                  minLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                className="glow-button glow-button-solid mt-4"
              >
                Change Password
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
