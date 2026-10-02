"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import { fetchUsers as getUsers, fetchSystemMetrics as getSystemMetrics, adminResetUserPassword as resetPassword } from "../../lib/api";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchAdminData();
      const interval = setInterval(fetchMetrics, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchAdminData = async () => {
    const token = localStorage.getItem("token");
    try {
      const usersData = await getUsers(token);
      setUsers(usersData);
      fetchMetrics();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMetrics = async () => {
    const token = localStorage.getItem("token");
    try {
      const data = await getSystemMetrics(token);
      setMetrics(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetPassword = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await resetPassword(token, userId);
      setMessage(res.message + " -> " + res.new_password);
      setTimeout(() => setMessage(""), 10000);
    } catch (err) {
      setMessage("Failed to reset password");
    }
  };

  if (loading || !user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-8 mt-12">
        <h1 className="text-3xl font-bold tracking-widest text-white uppercase">System Overseer</h1>
        
        {message && (
          <div className="p-4 border border-white/20 bg-white/5 text-white text-sm rounded font-mono">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div className="glass-card p-6 flex flex-col items-center justify-center">
            <span className="text-xs font-mono text-neutral-400 mb-2 uppercase">CPU Load</span>
            <span className="text-4xl font-bold text-white">{metrics?.cpu_usage_percent || 0}%</span>
          </motion.div>
          <motion.div className="glass-card p-6 flex flex-col items-center justify-center">
            <span className="text-xs font-mono text-neutral-400 mb-2 uppercase">Memory</span>
            <span className="text-4xl font-bold text-white">{metrics?.memory_usage_percent || 0}%</span>
          </motion.div>
          <motion.div className="glass-card p-6 flex flex-col items-center justify-center">
            <span className="text-xs font-mono text-neutral-400 mb-2 uppercase">Disk</span>
            <span className="text-4xl font-bold text-white">{metrics?.disk_usage_percent || 0}%</span>
          </motion.div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-6 text-white">Registered Entities</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="text-xs text-neutral-500 uppercase bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Username</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{u.id.split('-')[0]}</td>
                    <td className="px-6 py-4">{u.username}</td>
                    <td className="px-6 py-4 text-neutral-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-white/20 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleResetPassword(u.id)}
                        className="text-xs text-white/70 hover:text-white hover:underline transition-colors"
                      >
                        [ Reset Password ]
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
