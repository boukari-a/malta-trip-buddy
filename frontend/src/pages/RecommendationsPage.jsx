import { useEffect, useState } from "react";
import { getRecommendations } from "../services/api";
import "./Recommendations.css";

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
  if (place.location?.lat && place.location?.lng) {
    return `https://www.google.com/maps?q=${place.location.lat},${place.location.lng}&hl=en&z=14&output=embed`;
  }
  const query = encodeURIComponent(`${place.name || "Malta place"} Malta`);
  return `https://www.google.com/maps?q=${query}&hl=en&z=14&output=embed`;
};

export default function RecommendationsPage({ token, onNavigate }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mapPlace, setMapPlace] = useState(null);

  const loadRecommendations = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await getRecommendations(token);
      const recs = data?.recommendations || [];
      setRecommendations(recs);
    } catch (err) {
      console.error("Failed to load recommendations", err);
      setError("Failed to load recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const getMatchLabel = (index) => {
    if (index === 0) return "Perfect Match";
    if (index <= 2) return "Great Match";
    return "Good Match";
  };

  const getMatchPercent = (score, index) => {
    const base = 60 + (score || 0) * 5;
    const bonus = Math.max(0, 10 - index * 2);
    return Math.min(99, base + bonus);
  };

  return (
    <div className="recs-page">
      <div className="recs-container">
        <header className="recs-header">
          <div className="recs-icon">❤</div>
          <h1>Your Personalized Recommendations</h1>
          <p>Curated places in Malta that match your interests and travel preferences.</p>

          <div className="recs-header-actions">
            <button
              className="recs-refresh-btn"
              type="button"
              onClick={loadRecommendations}
              disabled={loading}
            >
              <span className="recs-refresh-icon">↻</span>
              {loading ? "Refreshing..." : "Refresh Recommendations"}
            </button>
          </div>
        </header>

        <section className="recs-summary-card">
          <div>
            <p className="recs-summary-label">Found {recommendations.length} Great Matches</p>
            <p className="recs-summary-sub">Based on your profile, preferences and travel style.</p>
          </div>
          <div className="recs-summary-tag">Auto-generated travel plan</div>
        </section>

        {loading && (
          <div className="recs-loading">Loading recommendations...</div>
        )}

        {error && !loading && (
          <div className="recs-error">{error}</div>
        )}

        {!loading && !error && recommendations.length === 0 && (
          <div className="recs-empty">
            <h3>No recommendations yet</h3>
            <p>
              Try updating your preferences and profile so we can better understand what you
              like.
            </p>
          </div>
        )}

        <div className="recs-list">
          {recommendations.map((place, index) => {
            const matchPercent = getMatchPercent(place.score, index);
            const matchLabel = getMatchLabel(index);

            return (
              <article key={place.id || index} className="rec-card">
                <div className="rec-image">
                  <img
                    src={getPlaceImageUrl(place)}
                    alt={place.name}
                    className="rec-image-photo"
                    onError={(e) => {
                      e.target.src = getPlaceImageUrl(place);
                    }}
                  />
                  <div className="rec-match-pill">
                    <span>{matchPercent.toFixed(2)}% match</span>
                  </div>
                </div>

                <div className="rec-content">
                  <header className="rec-header-row">
                    <div>
                      <p className="rec-match-label">{matchLabel}</p>
                      <h2 className="rec-title">{place.name}</h2>
                    </div>
                    <span className="rec-category-pill">{place.category}</span>
                  </header>

                  <p className="rec-short-desc">{place.description}</p>

                  <div className="rec-why-card">
                    <div className="rec-why-icon">💡</div>
                    <div>
                      <p className="rec-why-title">Why we recommend this</p>
                      <p className="rec-why-text">
                        This place closely matches your interests in {place.tags?.join(", ") ||
                          "Malta experiences"}
                        . It&#39;s a great fit for your typical budget and travel style, so you&#39;ll
                        likely enjoy spending time here during your trip.
                      </p>
                    </div>
                  </div>

                  <footer className="rec-footer">
                    <div className="rec-meta">
                      <span className="rec-meta-item">Budget: {place.price_level || "medium"}</span>
                      {place.location && (
                        <button
                          type="button"
                          className="rec-meta-item rec-location-link"
                          onClick={() => setMapPlace(place)}
                        >
                          View on map
                        </button>
                      )}
                    </div>

                    <div className="rec-tags">
                      {(place.tags || []).slice(0, 5).map((tag) => (
                        <span className="rec-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </footer>
                </div>
              </article>
            );
          })}
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
                  className="recs-footer-btn primary"
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

        <section className="recs-footer-cta">
          <h3>Want Different Recommendations?</h3>
          <p>Update your preferences to discover new places that match your interests.</p>
          <div className="recs-footer-buttons">
            <button
              className="recs-footer-btn secondary"
              type="button"
              onClick={() => onNavigate && onNavigate("places")}
            >
              Browse All Places
            </button>
            <button
              className="recs-footer-btn primary"
              type="button"
              onClick={() => onNavigate && onNavigate("preferences")}
            >
              Update Preferences
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
