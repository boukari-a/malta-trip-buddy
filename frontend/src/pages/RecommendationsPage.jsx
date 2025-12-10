import { useEffect, useState } from "react";
import { getRecommendations } from "../services/api";
import "./Recommendations.css";

export default function RecommendationsPage({ token }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
                  <div className="rec-match-pill">
                    <span>{matchPercent}% match</span>
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
                        <span className="rec-meta-item">
                          Location: {place.location.lat.toFixed(3)}, {" "}
                          {place.location.lng.toFixed(3)}
                        </span>
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

        <section className="recs-footer-cta">
          <h3>Want Different Recommendations?</h3>
          <p>Update your preferences to discover new places that match your interests.</p>
          <div className="recs-footer-buttons">
            <button className="recs-footer-btn secondary" type="button">
              Browse All Places
            </button>
            <button className="recs-footer-btn primary" type="button">
              Update Preferences
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
