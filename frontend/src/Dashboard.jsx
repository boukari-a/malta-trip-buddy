import { useState, useEffect } from "react";
import "./Dashboard.css";

import OverviewCards from "./components/OverviewCards";
import { getProfile } from "./services/api";

const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const getPlaceImageUrl = (place) => {
  const placeholder = `https://via.placeholder.com/400x250?text=${encodeURIComponent(
    place.name || "Malta place"
  )}`;

  if (!place.image) return placeholder;

  if (place.image.startsWith("/static/")) {
    return `${BACKEND_BASE_URL}${place.image}`;
  }

  return place.image;
};

const getMapsEmbedUrl = (place) => {
  if (
    place.location &&
    typeof place.location === "object" &&
    typeof place.location.lat === "number" &&
    typeof place.location.lng === "number"
  ) {
    return `https://www.google.com/maps?q=${place.location.lat},${place.location.lng}&hl=en&z=14&output=embed`;
  }

  const query = encodeURIComponent(`${place.name || "Malta place"} Malta`);
  return `https://www.google.com/maps?q=${query}&hl=en&z=14&output=embed`;
};

function Dashboard() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileStatus, setProfileStatus] = useState("0%");
  const [mapPlace, setMapPlace] = useState(null);

  useEffect(() => {
    fetchPlaces();
    loadProfileStatus();
  }, []);

  const fetchPlaces = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://127.0.0.1:8000/places/", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch places");
      }

      const data = await response.json();
      setPlaces(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProfileStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setProfileStatus("0%");
        return;
      }

      const profileData = await getProfile(token); // may be null if no profile yet
      const savedPrefs = JSON.parse(localStorage.getItem("preferences")) || {};
      const hasPrefs =
        Array.isArray(savedPrefs.selected) && savedPrefs.selected.length > 0;

      // Define which pieces count toward completion
      let completed = 0;
      const total = 4; // name, age, nationality, preferences

      if (profileData?.name) completed += 1;
      if (profileData?.age) completed += 1;
      if (profileData?.nationality) completed += 1;
      if (hasPrefs) completed += 1;

      const percent = Math.round((completed / total) * 100);
      setProfileStatus(percent === 100 ? "Complete" : `${percent}%`);
    } catch (err) {
      // If anything fails, just fall back to 0%
      console.error("Failed to compute profile status", err);
      setProfileStatus("0%");
    }
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      attraction: "badge-blue",
      beach: "badge-cyan",
      church: "badge-purple",
      museum: "badge-pink",
      restaurant: "badge-orange",
    };
    return colors[category] || "badge-blue";
  };

  const getPlaceholderColor = (color) => {
    const colors = {
      blue: "#4FA9E1",
      beach: "#1E88E5",
      beige: "#D4B896",
      restaurant: "#FF8A65",
    };
    return colors[color] || "#4FA9E1";
  };

  const getPriceLevel = (level) => {
    if (level === "low") return "$";
    if (level === "medium") return "$$";
    if (level === "high") return "$$$";
    return "$";
  };

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading places...</div>
      </div>
    );
  }

  // ✅ ERROR STATE
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      {/* ✅✅✅ OVERVIEW CARDS ADDED HERE ✅✅✅ */}
      <OverviewCards
        totalPlaces={places.length}
        recommendations={Math.floor(places.length / 3)}
        profileStatus={profileStatus}
      />

      <div className="dashboard-header">
        <h1>🌴 Featured Places in Malta</h1>
        <button className="explore-btn">Explore All</button>
      </div>

      <div className="places-grid">
        {places.map((place) => (
          <div key={place._id} className="place-card">
            <div
              className="place-image"
              style={{
                backgroundColor: getPlaceholderColor(place.category),
              }}
            >
              <span
                className={`category-badge ${getCategoryBadgeColor(
                  place.category
                )}`}
              >
                {place.category}
              </span>

              <span className="price-badge">
                {getPriceLevel(place.price_level)}
              </span>

              <img
                src={getPlaceImageUrl(place)}
                alt={place.name}
                onError={(e) => {
                  e.target.src = getPlaceImageUrl(place);
                }}
              />
            </div>

            <div className="place-content">
              <h3 className="place-name">{place.name}</h3>
              <p className="place-description">{place.description}</p>

              <div className="place-meta">
                <div className="rating">
                  ⭐ <span>{place.rating ?? "4.5"} (120)</span>
                </div>
                <div className="duration">
                  ⏱ <span>{place.duration ?? "All day"}</span>
                </div>
              </div>

              <div className="place-location">
                📍{" "}
                <button
                  type="button"
                  className="map-link"
                  onClick={() => setMapPlace(place)}
                >
                  View on map
                </button>
              </div>

              {place.tags?.length > 0 && (
                <div className="tags">
                  {place.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {mapPlace && (
        <div
          className="map-modal-backdrop"
          onClick={() => setMapPlace(null)}
        >
          <div
            className="map-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="map-modal-header">
              <h3>{mapPlace.name}</h3>
              <button
                type="button"
                className="map-modal-close"
                onClick={() => setMapPlace(null)}
              >
                ×
              </button>
            </div>
            <div className="map-modal-body">
              <iframe
                src={getMapsEmbedUrl(mapPlace)}
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title={`Map of ${mapPlace.name}`}
              />
            </div>
            <div className="map-modal-footer">
              <button
                type="button"
                className="explore-btn"
                onClick={() =>
                  window.open(
                    getMapsEmbedUrl(mapPlace).replace("&output=embed", ""),
                    "_blank"
                  )
                }
              >
                Open in Google Maps
              </button>
            </div>
          </div>
        </div>
      )}

      {places.length === 0 && (
        <div className="no-places">
          <p>No places found. Please run the seed script:</p>
          <code>python seed_places.py</code>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
