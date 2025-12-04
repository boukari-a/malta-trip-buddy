// src/Recommendations.jsx
import { useEffect, useState } from "react";
import { getRecommendations } from "./services/api"; // adjust path if needed

export default function Recommendations() {
  const [recs, setRecs] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const data = await getRecommendations();
        setRecs(data); // assumes data is an array of { id, name, description }
      } catch (err) {
        console.error(err);
        setMessage("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecs();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading recommendations...</p>;

  if (message) return <p style={{ textAlign: "center", color: "red" }}>{message}</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2 style={{ textAlign: "center" }}>Recommendations</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {recs.map((rec) => (
          <li
            key={rec.id}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            <strong>{rec.name}</strong>
            <p>{rec.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
