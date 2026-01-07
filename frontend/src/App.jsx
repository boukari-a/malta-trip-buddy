import { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import "./App.css";
import Preferences from "./pages/Preferences";
import Profile from "./pages/Profile";
import Places from "./pages/Places";
import RecommendationsPage from "./pages/RecommendationsPage";
import AdminDashboard from "./pages/AdminDashboard";
import { getCurrentUser } from "./services/api";

function App() {
  // Load token from localStorage on app start using lazy initializer
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [userRole, setUserRole] = useState("user");

  // Load current user info (including role) when token changes
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!token) return;
        const me = await getCurrentUser(token);
        setUserRole(me.role || "user");
      } catch (err) {
        console.error("Failed to load current user", err);
        setUserRole("user");
      }
    };

    loadUser();
  }, [token]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserRole("user");
    setCurrentPage("dashboard");
  };

  if (!token) {
    if (showRegister) {
      return <Register onSwitchToLogin={() => setShowRegister(false)} />;
    }
    return (
      <Login
        setToken={setToken}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  // Decide which page to render based on currentPage
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;

      case "places":
        return <Places />;

      case "recommendations":
        return <RecommendationsPage token={token} onNavigate={setCurrentPage} />;

      case "preferences":
        return <Preferences token={token} />;

      case "profile":
        return <Profile token={token} />;

      case "admin":
        return <AdminDashboard token={token} />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <div className="dashboard">
        {/* NAVIGATION BAR */}
        <nav className="navbar">
          <div className="navbar-content">
            <div className="navbar-brand">
              <div className="navbar-logo">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                </svg>
              </div>
              <h2 className="navbar-title">Malta Trip Buddy</h2>
            </div>

            <div className="navbar-links">
              <button
                className={`nav-link ${
                  currentPage === "dashboard" ? "active" : ""
                }`}
                onClick={() => setCurrentPage("dashboard")}
              >
                Dashboard
              </button>

              <button
                className={`nav-link ${
                  currentPage === "places" ? "active" : ""
                }`}
                onClick={() => setCurrentPage("places")}
              >
                Places
              </button>

              <button
                className={`nav-link ${
                  currentPage === "recommendations" ? "active" : ""
                }`}
                onClick={() => setCurrentPage("recommendations")}
              >
                Recommendations
              </button>

              <button
                className={`nav-link ${
                  currentPage === "preferences" ? "active" : ""
                }`}
                onClick={() => setCurrentPage("preferences")}
              >
                Preferences
              </button>

              <button
                className={`nav-link ${
                  currentPage === "profile" ? "active" : ""
                }`}
                onClick={() => setCurrentPage("profile")}
              >
                Profile
              </button>

              {userRole === "admin" && (
                <button
                  className={`nav-link ${
                    currentPage === "admin" ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage("admin")}
                >
                  Admin
                </button>
              )}
            </div>

            <div className="navbar-user">
              <span className="nav-role-label">{userRole}</span>
              <div
                className="user-avatar"
                onClick={() => setCurrentPage("profile")}
                style={{ cursor: "pointer" }}
                title="Go to Profile"
              >
                👤
              </div>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className="main-content">{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;
