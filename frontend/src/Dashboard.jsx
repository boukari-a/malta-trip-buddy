import { useState, useEffect } from "react";
import "./Dashboard.css";

import OverviewCards from "./components/OverviewCards";

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

function Dashboard() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaces();
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
        profileStatus="Complete"
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
                <a
                  href={`https://www.google.com/maps?q=${place.location?.lat},${place.location?.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  View on map
                </a>
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
