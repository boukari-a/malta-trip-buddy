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
