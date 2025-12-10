import React from "react";
import "./OverviewCards.css"; // new CSS file

function OverviewCards({ totalPlaces, recommendations, profileStatus }) {
  return (
    <div className="overview-container">
      <h1>Welcome to Malta! 🌴</h1>
      <p>Discover the perfect places for your Malta adventure</p>

      <div className="overview-cards">
        <div className="overview-card">
          <span className="icon">📍</span>
          <h2>{totalPlaces}</h2>
          <p>Places Available</p>
        </div>

        <div className="overview-card">
          <span className="icon">❤️</span>
          <h2>{recommendations}</h2>
          <p>Recommendations</p>
        </div>

        <div className="overview-card">
          <span className="icon">📈</span>
          <h2>{profileStatus}</h2>
          <p>Profile Status</p>
        </div>
      </div>
    </div>
  );
}

export default OverviewCards;
