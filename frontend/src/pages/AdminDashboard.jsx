import { useEffect, useState } from "react";
import {
  getCurrentUser,
  getAdminPlaces,
  createAdminPlace,
  updateAdminPlace,
  deleteAdminPlace,
  uploadPlaceImage,
  getAdminUsers,
} from "../services/api";
import "./Profile.css";

const CATEGORY_OPTIONS = [
  "beach",
  "museum",
  "restaurant",
  "culture",
  "nature",
  "nightlife",
  "shopping",
  "family",
  "history",
  "park",
  "theme park",
  "religion",
];

const PRICE_LEVEL_OPTIONS = [
  { value: "low", label: "Low (€)" },
  { value: "medium", label: "Medium (€€)" },
  { value: "high", label: "High (€€€)" },
];

const emptyPlaceForm = {
  name: "",
  category: "",
  description: "",
  price_level: "",
  tags: "",
  image: "",
  lat: "",
  lng: "",
};

export default function AdminDashboard({ token }) {
  const [user, setUser] = useState(null);
  const [places, setPlaces] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [placeForm, setPlaceForm] = useState(emptyPlaceForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);
        setError("");

        const [me, adminPlaces, adminUsers] = await Promise.all([
          getCurrentUser(token),
          getAdminPlaces(token),
          getAdminUsers(token),
        ]);

        setUser(me);
        setPlaces(adminPlaces || []);
        setUsers(adminUsers || []);
      } catch (err) {
        console.error("Failed to load admin data", err);
        setError(err.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadAdminData();
    }
  }, [token]);

  const handlePlaceInputChange = (e) => {
    const { name, value } = e.target;
    setPlaceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      const res = await uploadPlaceImage(token, file);
      setPlaceForm((prev) => ({ ...prev, image: res.image }));
      setMessage("Image uploaded successfully");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error("Upload error", err);
      setError(err.message || "Failed to upload image");
    } finally {
      setSaving(false);
    }
  };

  const handleEditPlace = (place) => {
    setEditingId(place.id);
    setPlaceForm({
      name: place.name || "",
      category: place.category || "",
      description: place.description || "",
      price_level: place.price_level || "",
      tags: (place.tags || []).join(", "),
      image: place.image || "",
      lat: place.location?.lat != null ? String(place.location.lat) : "",
      lng: place.location?.lng != null ? String(place.location.lng) : "",
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setPlaceForm(emptyPlaceForm);
  };

  const handleSavePlace = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        name: placeForm.name || undefined,
        category: placeForm.category || undefined,
        description: placeForm.description || undefined,
        price_level: placeForm.price_level || undefined,
        image: placeForm.image || undefined,
        tags: placeForm.tags
          ? placeForm.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        location:
          placeForm.lat && placeForm.lng
            ? {
                lat: parseFloat(placeForm.lat),
                lng: parseFloat(placeForm.lng),
              }
            : undefined,
      };

      let saved;
      if (editingId) {
        saved = await updateAdminPlace(token, editingId, payload);
        setPlaces((prev) => prev.map((p) => (p.id === editingId ? saved : p)));
        setMessage("Place updated");
      } else {
        saved = await createAdminPlace(token, payload);
        setPlaces((prev) => [saved, ...prev]);
        setMessage("Place created");
      }

      resetForm();
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error("Save place error", err);
      setError(err.message || "Failed to save place");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlace = async (id) => {
    if (!window.confirm("Delete this place?")) return;

    try {
      await deleteAdminPlace(token, id);
      setPlaces((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete error", err);
      setError(err.message || "Failed to delete place");
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-icon">🛠️</div>
          <h1>Admin Dashboard</h1>
          <p>Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-icon">🛠️</div>
        <h1>Admin Dashboard</h1>
        <p>Manage places, images and users for Malta Trip Buddy</p>
      </div>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Admin summary */}
      <div className="profile-summary">
        <h3>Admin Account</h3>
        <p><strong>Email:</strong> {user?.email || "Loading..."}</p>
        <p><strong>Role:</strong> {user?.role || "user"}</p>
        <p><strong>Total Places:</strong> {places.length}</p>
        <p><strong>Total Users:</strong> {users.length}</p>
      </div>

      {/* Places management */}
      <div className="profile-card">
        <h3>{editingId ? "Edit Place" : "Add New Place"}</h3>

        <input
          name="name"
          placeholder="Place name"
          value={placeForm.name}
          onChange={handlePlaceInputChange}
        />

        <select
          name="category"
          value={placeForm.category}
          onChange={handlePlaceInputChange}
        >
          <option value="">Select category</option>
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Short description"
          value={placeForm.description}
          onChange={handlePlaceInputChange}
        />

        <select
          name="price_level"
          value={placeForm.price_level}
          onChange={handlePlaceInputChange}
        >
          <option value="">Select price level</option>
          {PRICE_LEVEL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <input
          name="tags"
          placeholder="Tags (comma separated, e.g. beach,family,history)"
          value={placeForm.tags}
          onChange={handlePlaceInputChange}
        />

        <input
          name="duration"
          placeholder="Duration (e.g. 2h, Half day, All day)"
          value={placeForm.duration}
          onChange={handlePlaceInputChange}
        />

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            name="lat"
            placeholder="Latitude (optional)"
            value={placeForm.lat}
            onChange={handlePlaceInputChange}
          />
          <input
            name="lng"
            placeholder="Longitude (optional)"
            value={placeForm.lng}
            onChange={handlePlaceInputChange}
          />
        </div>

        <input
          name="image"
          placeholder="Image URL (optional)"
          value={placeForm.image}
          onChange={handlePlaceInputChange}
        />

        <div style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
          <label style={{ fontSize: "0.85rem" }}>
            Or upload image file:
            <input type="file" accept="image/*" onChange={handleUploadImage} />
          </label>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          <button onClick={handleSavePlace} disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Place" : "Create Place"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Places list */}
      <div className="profile-card" style={{ marginTop: "2rem" }}>
        <h3>Places</h3>
        {places.length === 0 && <p>No places found.</p>}
        {places.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr>
                <th align="left">Name</th>
                <th align="left">Category</th>
                <th align="left">Price</th>
                <th align="left">Image</th>
                <th align="left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {places.map((place) => (
                <tr key={place.id}>
                  <td>{place.name}</td>
                  <td>{place.category}</td>
                  <td>{place.price_level}</td>
                  <td>
                    {place.image ? (
                      <a href={place.image} target="_blank" rel="noreferrer">
                        View
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEditPlace(place)}
                      style={{ marginRight: "0.5rem" }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePlace(place.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
