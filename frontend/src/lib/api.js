// Authentication API

export const loginUser = async (username, password) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Login failed");
  }
  return response.json();
};

export const signupUser = async (username, email, password) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Signup failed");
  }
  return response.json();
};

export const verifyOTP = async (email, otp) => {
  const response = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Verification failed");
  }
  return response.json();
};

export const googleAuth = async (token) => {
  const response = await fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Google login failed");
  }
  return response.json();
};

export const forgotPassword = async (email) => {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Request failed");
  }
  return response.json();
};

export const resetPassword = async (token, new_password) => {
  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Reset failed");
  }
  return response.json();
};

export const changePassword = async (old_password, new_password, token) => {
  const response = await fetch("/api/auth/change-password", {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ old_password, new_password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Change password failed");
  }
  return response.json();
};

export const fetchMe = async (token) => {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
};

export const updateProfile = async (profileData, token) => {
  const response = await fetch("/api/auth/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  });
  if (!response.ok) {
    throw new Error("Failed to update profile");
  }
  return response.json();
};

// Admin API
export const fetchSystemMetrics = async (token) => {
  const response = await fetch("/api/admin/metrics", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Failed to fetch metrics");
  return response.json();
};

export const fetchUsers = async (token) => {
  const response = await fetch("/api/admin/users", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

export const adminResetUserPassword = async (userId, token) => {
  const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Failed to reset user password");
  return response.json();
};

export const adminDeleteUser = async (userId, token) => {
  const response = await fetch(`/api/admin/users/${userId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to delete user");
  }
  return response.json();
};

export const adminAddUser = async (userData, token) => {
  const response = await fetch("/api/admin/users", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to add user");
  }
  return response.json();
};


// Project API
export const submitIdea = async (idea) => {
  const response = await fetch("/api/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea }),
  });
  return response.json();
};

export const evolveIdea = async (idea, temperature, focus) => {
  const response = await fetch("/api/evolve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea, temperature, focus }),
  });
  return response.json();
};
