import { useState, useEffect } from "react";
import "./Places.css";

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

export default function Places() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Places");
  const [budgetFilter, setBudgetFilter] = useState("All Budgets");
  const [mapPlace, setMapPlace] = useState(null);
  const [reviewsPlace, setReviewsPlace] = useState(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/places");
      const data = await response.json();
      setPlaces(data);
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      attraction: "#60a5fa",
      beach: "#38bdf8",
      church: "#93c5fd",
      museum: "#7dd3fc",
      restaurant: "#fbbf24",
      activity: "#fb923c",
      nightlife: "#c084fc",
    };
    return colors[category?.toLowerCase()] || "#60a5fa";
  };

  const getBudgetIcon = (budget) => {
    if (budget === "Budget") return "€";
    if (budget === "Moderate") return "€€";
    if (budget === "Expensive") return "€€€";
    return "";
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

  const getTripAdvisorUrl = (place) => {
    const query = encodeURIComponent(`${place.name || "Malta"} Malta Tripadvisor`);
    return `https://www.tripadvisor.com/Search?q=${query}`;
  };

  const filteredPlaces = places.filter((place) => {
    const matchesSearch =
      place.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "All Places" ||
      place.category?.toLowerCase() === categoryFilter.toLowerCase();

    const matchesBudget =
      budgetFilter === "All Budgets" || place.budget === budgetFilter;

    return matchesSearch && matchesCategory && matchesBudget;
  });

  if (loading) {
    return (
      <div className="places-container">
        <div className="places-header">
          <h1>Explore Malta 🌴</h1>
          <p>Loading amazing places...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="places-container">
      <div className="places-header">
        <h1>Explore Malta 🌴</h1>
        <p>Discover amazing places and experiences across the Maltese Islands</p>
      </div>

      <div className="places-filters">
        <div className="search-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="search-icon"
          >
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            placeholder="Search places, activities, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="filter-select"
        >
          <option>All Places</option>
          <option>Attraction</option>
          <option>Beach</option>
          <option>Church</option>
          <option>Museum</option>
          <option>Restaurant</option>
          <option>Activity</option>
          <option>Nightlife</option>
        </select>

        <select
          value={budgetFilter}
          onChange={(e) => setBudgetFilter(e.target.value)}
          className="filter-select"
        >
          <option>All Budgets</option>
          <option>Budget</option>
          <option>Moderate</option>
          <option>Expensive</option>
        </select>
      </div>

      <div className="places-count">Found {filteredPlaces.length} places</div>

      <div className="places-grid">
        {filteredPlaces.map((place) => (
          <div key={place.id || place._id} className="place-card">
            <div className="place-image">
              <span
                className="place-category-tag"
                style={{ backgroundColor: getCategoryColor(place.category) }}
              >
                {place.category || "attraction"}
              </span>
              {place.budget && (
                <span className="place-budget-badge">
                  {getBudgetIcon(place.budget)}
                </span>
              )}
              <img
                src={getPlaceImageUrl(place)}
                alt={place.name}
                onError={(e) => {
                  e.target.src = getPlaceImageUrl(place);
                }}
              />
            </div>

            <div className="place-content">
              <h3>{place.name}</h3>
              <p className="place-description">
                {place.description?.substring(0, 100)}
                {place.description?.length > 100 ? "..." : ""}
              </p>

              <div className="place-meta">
                <div className="place-rating">
                  <span className="star">⭐</span>
                  <span className="rating-value">
                    {place.rating || "4.5"} ({place.reviews || "0"})
                  </span>
                </div>
                <div className="place-duration">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                  </svg>
                  <span>{place.duration || "2h"}</span>
                </div>
              </div>

              <div className="place-location">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>
                  {typeof place.location === "string"
                    ? place.location
                    : place.location?.name || "Malta"}
                </span>
              </div>

              <div className="place-tags">
                {place.tags?.slice(0, 3).map((tag, index) => (
                  <span key={index} className="place-tag">
                    {tag}
                  </span>
                )) || (
                  <>
                    <span className="place-tag">scenic</span>
                    <span className="place-tag">popular</span>
                  </>
                )}
                {place.tags?.length > 3 && (
                  <span className="place-tag-more">
                    +{place.tags.length - 3} more
                  </span>
                )}
              </div>

              <div className="place-actions">
                <button
                  className="place-action-btn"
                  onClick={() => setReviewsPlace(place)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z" />
                  </svg>
                  Reviews
                </button>
                <button
                  className="place-action-btn"
                  onClick={() => setMapPlace(place)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  </svg>
                  Map
                </button>
              </div>
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
                className="place-action-btn"
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

      {reviewsPlace && (
        <div
          className="map-modal-backdrop"
          onClick={() => setReviewsPlace(null)}
        >
          <div
            className="map-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="map-modal-header">
              <h3>Tripadvisor reviews for {reviewsPlace.name}</h3>
              <button
                type="button"
                className="map-modal-close"
                onClick={() => setReviewsPlace(null)}
              >
                ×
              </button>
            </div>
            <div className="map-modal-body">
              <iframe
                src={getTripAdvisorUrl(reviewsPlace)}
                width="100%"
                height="350"
                style={{ border: 0 }}
                loading="lazy"
                title={`Tripadvisor reviews for ${reviewsPlace.name}`}
              />
              <p className="reviews-modal-note">
                If the Tripadvisor page doesn't load here, click the button
                below to open it in a new tab.
              </p>
            </div>
            <div className="map-modal-footer">
              <button
                type="button"
                className="place-action-btn"
                onClick={() => window.open(getTripAdvisorUrl(reviewsPlace), "_blank")}
              >
                Open on Tripadvisor
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredPlaces.length === 0 && (
        <div className="no-results">
          <h3>No places found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
