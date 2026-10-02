"use client";

import { AuthProvider } from "./AuthContext";

export default function ClientProviders({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
