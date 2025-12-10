import { useEffect, useState } from "react";
import { getRecommendations } from "./api";

export default function Recommendations({ token }) {
  const [recs, setRecs] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const data = await getRecommendations(token);
        setRecs(data);
      } catch (error) {
        setMessage("Failed to load recommendations");
      }
    };
    fetchRecs();
  }, [token]);

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>Recommendations</h2>
      {message && <p>{message}</p>}
      {recs.length === 0 && !message && <p>Loading...</p>}
      <ul>
        {recs.map((rec, i) => (
          <li key={i}>
            <strong>{rec.name}</strong>: {rec.description}
          </li>
        ))}
      </ul>
    </div>
  );
}