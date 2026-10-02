"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import { updateProfile } from "../../lib/api";

export default function ProfilePage() {
  const { user, loading, setUser } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: "",
    organization: "",
    bio: "",
    interests: "",
  });
  
  const [message, setMessage] = useState("");

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
      const updatedUser = await updateProfile(token, formData);
      setUser(updatedUser);
      setMessage("Identity parameters updated successfully.");
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setMessage("Failed to update profile.");
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
          className="glass-card w-full max-w-2xl p-8"
        >
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold tracking-wider uppercase text-white">
              Operative Profile
            </h2>
            <div className="text-right">
              <div className="text-sm font-bold text-white">{user.username}</div>
              <div className="text-xs font-mono text-neutral-500">{user.email}</div>
              <div className="text-xs font-mono text-neutral-600 uppercase mt-1">Role: {user.role}</div>
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
        </motion.div>
      </div>
    </div>
  );
}
