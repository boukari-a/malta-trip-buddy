const BASE_URL = "http://127.0.0.1:8000"; // backend URL

export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Login failed");
  }

  return await response.json(); // returns token or user info
}

export async function getCurrentUser(token) {
  const response = await fetch(`${BASE_URL}/users/me`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get current user");
  }

  return await response.json();
}

export async function getRecommendations(token) {
  const response = await fetch(`${BASE_URL}/recommendations`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  return await response.json();
}

export async function getProfile(token) {
  const response = await fetch(`${BASE_URL}/profile/me`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // Profile not found
    }
    throw new Error("Failed to fetch profile");
  }

  return await response.json();
}

export async function saveProfile(token, profileData) {
  const response = await fetch(`${BASE_URL}/profile/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to save profile");
  }

  return await response.json();
}

// =============== ADMIN API HELPERS ===============

export async function getAdminPlaces(token) {
  const response = await fetch(`${BASE_URL}/admin/places`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin places");
  }

  return await response.json();
}

export async function createAdminPlace(token, placeData) {
  const response = await fetch(`${BASE_URL}/admin/places`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(placeData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create place");
  }

  return await response.json();
}

export async function updateAdminPlace(token, id, placeData) {
  const response = await fetch(`${BASE_URL}/admin/places/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(placeData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to update place");
  }

  return await response.json();
}

export async function deleteAdminPlace(token, id) {
  const response = await fetch(`${BASE_URL}/admin/places/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to delete place");
  }

  // 204 No Content or small JSON
  try {
    return await response.json();
  } catch {
    return { status: "deleted" };
  }
}

export async function uploadPlaceImage(token, file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/admin/places/upload-image`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to upload image");
  }

  return await response.json(); // { image: "/static/places/.." }
}

export async function getAdminUsers(token) {
  const response = await fetch(`${BASE_URL}/admin/users`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin users");
  }

  return await response.json();
}
