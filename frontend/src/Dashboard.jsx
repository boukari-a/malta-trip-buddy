import { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await fetch('http://localhost:8000/places/');
      if (!response.ok) {
        throw new Error('Failed to fetch places');
      }
      const data = await response.json();
      setPlaces(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      'attraction': 'badge-blue',
      'beach': 'badge-cyan',
      'church': 'badge-purple',
      'museum': 'badge-pink',
      'restaurant': 'badge-orange'
    };
    return colors[category] || 'badge-blue';
  };

  const getPlaceholderColor = (color) => {
    const colors = {
      'blue': '#4FA9E1',
      'beach': '#1E88E5',
      'beige': '#D4B896',
      'restaurant': '#FF8A65'
    };
    return colors[color] || '#4FA9E1';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading places...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Featured Places in Malta</h1>
        <button className="explore-btn">Explore All</button>
      </div>

      <div className="places-grid">
        {places.map((place) => (
          <div key={place.id} className="place-card">
            <div 
              className="place-image"
              style={{ backgroundColor: getPlaceholderColor(place.image_placeholder) }}
            >
              <span className={`category-badge ${getCategoryBadgeColor(place.category)}`}>
                {place.category}
              </span>
              <span className="price-badge">{place.price}</span>
            </div>
            
            <div className="place-content">
              <h3 className="place-name">{place.name}</h3>
              <p className="place-description">{place.description}</p>
              
              <div className="place-meta">
                <div className="rating">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  <span>{place.rating} ({place.reviews})</span>
                </div>
                <div className="duration">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                  <span>{place.duration}</span>
                </div>
              </div>
              
              <div className="place-location">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>{place.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {places.length === 0 && (
        <div className="no-places">
          <p>No places found. Please run the seed script to populate the database:</p>
          <code>python malta-trip-buddy/seed_places.py</code>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
