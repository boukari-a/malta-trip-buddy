import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ marginBottom: "20px" }}>
      <Link to="/dashboard" style={{ marginRight: "10px" }}>Dashboard</Link>
      <Link to="/profile" style={{ marginRight: "10px" }}>Profile</Link>
      <Link to="/preferences" style={{ marginRight: "10px" }}>Preferences</Link>
      <Link to="/recommendations">Recommendations</Link>
    </nav>
  );
}
