import { useState } from "react";
import "./Preferences.css";

export default function Preferences() {
  const savedPrefs = JSON.parse(localStorage.getItem("preferences")) || {};

  const [prefs, setPrefs] = useState({
    selected: savedPrefs.selected || [],
    budget: savedPrefs.budget || "Moderate (€€)",
    travelGroup: savedPrefs.travelGroup || "Couple",
    preferredTime: savedPrefs.preferredTime || "Afternoon",
    tripDuration: savedPrefs.tripDuration || 3,
  });

  const handleSave = () => {
    localStorage.setItem("preferences", JSON.stringify(prefs));
    alert("Preferences saved!");
  };

  const interests = [
    "History & Heritage",
    "Culture & Arts",
    "Nature & Landscapes",
    "Adventure Sports",
    "Food & Cuisine",
    "Nightlife & Entertainment",
    "Shopping",
    "Beaches & Water",
    "Architecture",
    "Museums & Galleries",
    "Festivals & Events",
    "Diving & Underwater",
  ];

  const budgetOptions = ["Budget (€)", "Moderate (€€)", "Comfort (€€€)", "Luxury (€€€€)"];
  const travelGroups = ["Solo", "Couple", "Family", "Friends", "Business"];
  const times = ["Morning", "Afternoon", "Evening", "Anytime"];

  return (
    <div className="prefs-container">
      <div className="prefs-header">
        <div className="prefs-icon">⚙️</div>
        <h1>Your Travel Preferences</h1>
        <p>Tell us what you love, and we'll recommend the perfect places in Malta</p>
      </div>

      <div className="prefs-card">
        <h3>❤️ What Interests You?</h3>
        <div className="prefs-grid">
          {interests.map((item) => (
            <div
              key={item}
              className={`prefs-box ${prefs.selected.includes(item) ? "active" : ""}`}
              onClick={() =>
                setPrefs((prev) => ({
                  ...prev,
                  selected: prev.selected.includes(item)
                    ? prev.selected.filter((i) => i !== item)
                    : [...prev.selected, item],
                }))
              }
            >
              {item}
            </div>
          ))}
        </div>

        <div className="prefs-selected">
          {prefs.selected.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      <div className="prefs-layout">
        {/* Budget */}
        <div className="prefs-small-card">
          <h3>💰 Budget Level</h3>
          <div className="prefs-options">
            {budgetOptions.map((option) => (
              <button
                key={option}
                className={`prefs-option ${prefs.budget === option ? "prefs-active" : ""}`}
                onClick={() => setPrefs((prev) => ({ ...prev, budget: option }))}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Trip Duration */}
        <div className="prefs-small-card">
          <h3>⏱ Trip Duration (Days)</h3>
          <input
            type="number"
            min="1"
            max="30"
            value={prefs.tripDuration}
            onChange={(e) => setPrefs((prev) => ({ ...prev, tripDuration: e.target.value }))}
            className="prefs-input"
          />
          <small>How long you’ll stay</small>
        </div>

        {/* Travel Group */}
        <div className="prefs-small-card">
          <h3>👥 Travel Group</h3>
          <div className="prefs-options">
            {travelGroups.map((option) => (
              <button
                key={option}
                className={`prefs-option ${prefs.travelGroup === option ? "prefs-active" : ""}`}
                onClick={() => setPrefs((prev) => ({ ...prev, travelGroup: option }))}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Time */}
        <div className="prefs-small-card">
          <h3>🕒 Preferred Time</h3>
          <div className="prefs-options">
            {times.map((option) => (
              <button
                key={option}
                className={`prefs-option ${prefs.preferredTime === option ? "prefs-active" : ""}`}
                onClick={() => setPrefs((prev) => ({ ...prev, preferredTime: option }))}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="prefs-save" onClick={handleSave}>
        Save My Preferences
      </button>
    </div>
  );
}
