const BASE_URL = "http://127.0.0.1:8000";

/* ✅ REGISTER WITH NAME */
export async function register(name, email, password) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Registration failed");
  }

  return data;
}

/* ✅ LOGIN (UNCHANGED) */
export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data;
}

/* ✅ GET CURRENT USER */
export async function getCurrentUser(token) {
  const response = await fetch(`${BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to get current user");

  return await response.json();
}

/* ✅ GET RECOMMENDATIONS */
export async function getRecommendations(token) {
  const response = await fetch(`${BASE_URL}/recommendations`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to fetch recommendations");

  return await response.json();
}
