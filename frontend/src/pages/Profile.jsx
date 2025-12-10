import { useState, useEffect } from "react";
import { getProfile, saveProfile, getCurrentUser } from "../services/api";
import "./Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    nationality: "",
    travel_style: "Foodie",
    accessibility_needs: "",
  });
  const [preferences, setPreferences] = useState({ selected: [] });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Please login to view your profile");
        setLoading(false);
        return;
      }

      // Fetch user data
      try {
        const userData = await getCurrentUser(token);
        setUser(userData);
      } catch (userErr) {
        console.error("Error fetching user:", userErr);
        setError("Authentication failed. Please login again.");
        setLoading(false);
        return;
      }

      // Load preferences from localStorage for travel style
      const savedPrefs = JSON.parse(localStorage.getItem("preferences")) || {};
      setPreferences(savedPrefs);
      let defaultTravelStyle = "Foodie";
      
      // Map preferences interests to travel style
      if (savedPrefs.selected && savedPrefs.selected.length > 0) {
        const interests = savedPrefs.selected;
        if (interests.includes("Food & Cuisine")) defaultTravelStyle = "Foodie";
        else if (interests.includes("Adventure Sports")) defaultTravelStyle = "Adventure";
        else if (interests.includes("History & Heritage") || interests.includes("Culture & Arts")) defaultTravelStyle = "Culture";
        else if (interests.includes("Beaches & Water") || interests.includes("Nature & Landscapes")) defaultTravelStyle = "Relaxation";
        else defaultTravelStyle = "Explorer";
      }

      // Fetch profile data
      try {
        const profileData = await getProfile(token);
        
        if (profileData) {
          setProfile({
            name: profileData.name || "",
            age: profileData.age || "",
            nationality: profileData.nationality || "",
            // Always derive travel style from Preferences, not from stored profile
            travel_style: defaultTravelStyle,
            accessibility_needs: profileData.accessibility_needs || "",
          });
          setError(""); // Clear error if profile loads successfully
        } else {
          // No profile exists, use default with preferences
          setProfile((prev) => ({ ...prev, travel_style: defaultTravelStyle }));
        }
      } catch (profileErr) {
        console.error("Error fetching profile:", profileErr);
        // If profile doesn't exist (404), that's okay - use preferences data
        if (profileErr.message.includes("404") || profileErr.message.includes("not found")) {
          console.log("No profile found, using preferences data");
          setProfile((prev) => ({ ...prev, travel_style: defaultTravelStyle }));
        } else {
          setError("Could not load profile. You can still create a new one.");
        }
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile data. Please try logging in again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");
      
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Please login to save your profile");
        return;
      }

      const profileData = {
        name: profile.name || null,
        age: profile.age ? parseInt(profile.age) : null,
        nationality: profile.nationality || null,
        travel_style: profile.travel_style || null,
        accessibility_needs: profile.accessibility_needs || null,
      };

      await saveProfile(token, profileData);
      setMessage("Profile saved successfully!");
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-icon">👤</div>
          <h1>Your Profile</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-icon">👤</div>
        <h1>Your Profile</h1>
        <p>Manage your personal information and travel preferences</p>
      </div>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="profile-card">
        <h3>Personal Information</h3>

        <input 
          name="name"
          placeholder="Full Name" 
          value={profile.name}
          onChange={handleInputChange}
        />
        <input 
          name="age"
          type="number"
          placeholder="Age" 
          value={profile.age}
          onChange={handleInputChange}
        />
        <select 
          name="nationality"
          value={profile.nationality}
          onChange={handleInputChange}
        >
          <option value="">Select Nationality</option>
          <option value="🇲🇹 Malta">🇲🇹 Malta</option>
          <option value="🇬🇧 United Kingdom">🇬🇧 United Kingdom</option>
          <option value="🇺🇸 United States">🇺🇸 United States</option>
          <option value="🇮🇹 Italy">🇮🇹 Italy</option>
          <option value="🇫🇷 France">🇫🇷 France</option>
          <option value="🇩🇪 Germany">🇩🇪 Germany</option>
          <option value="🇪🇸 Spain">🇪🇸 Spain</option>
          <option value="🇵🇹 Portugal">🇵🇹 Portugal</option>
          <option value="🇳🇱 Netherlands">🇳🇱 Netherlands</option>
          <option value="🇧🇪 Belgium">🇧🇪 Belgium</option>
          <option value="🇨🇭 Switzerland">🇨🇭 Switzerland</option>
          <option value="🇦🇹 Austria">🇦🇹 Austria</option>
          <option value="🇸🇪 Sweden">🇸🇪 Sweden</option>
          <option value="🇳🇴 Norway">🇳🇴 Norway</option>
          <option value="🇩🇰 Denmark">🇩🇰 Denmark</option>
          <option value="🇫🇮 Finland">🇫🇮 Finland</option>
          <option value="🇮🇪 Ireland">🇮🇪 Ireland</option>
          <option value="🇵🇱 Poland">🇵🇱 Poland</option>
          <option value="🇨🇿 Czech Republic">🇨🇿 Czech Republic</option>
          <option value="🇬🇷 Greece">🇬🇷 Greece</option>
          <option value="🇭🇷 Croatia">🇭🇷 Croatia</option>
          <option value="🇷🇺 Russia">🇷🇺 Russia</option>
          <option value="🇨🇦 Canada">🇨🇦 Canada</option>
          <option value="🇦🇺 Australia">🇦🇺 Australia</option>
          <option value="🇳🇿 New Zealand">🇳🇿 New Zealand</option>
          <option value="🇯🇵 Japan">🇯🇵 Japan</option>
          <option value="🇨🇳 China">🇨🇳 China</option>
          <option value="🇰🇷 South Korea">🇰🇷 South Korea</option>
          <option value="🇮🇳 India">🇮🇳 India</option>
          <option value="🇧🇷 Brazil">🇧🇷 Brazil</option>
          <option value="🇦🇷 Argentina">🇦🇷 Argentina</option>
          <option value="🇲🇽 Mexico">🇲🇽 Mexico</option>
          <option value="🇿🇦 South Africa">🇿🇦 South Africa</option>
          <option value="🇦🇪 United Arab Emirates">🇦🇪 United Arab Emirates</option>
          <option value="🇸🇦 Saudi Arabia">🇸🇦 Saudi Arabia</option>
          <option value="🇹🇷 Turkey">🇹🇷 Turkey</option>
          <option value="🇮🇱 Israel">🇮🇱 Israel</option>
          <option value="🇪🇬 Egypt">🇪🇬 Egypt</option>
          <option value="🇸🇬 Singapore">🇸🇬 Singapore</option>
          <option value="🇹🇭 Thailand">🇹🇭 Thailand</option>
          <option value="🇻🇳 Vietnam">🇻🇳 Vietnam</option>
          <option value="🇮🇩 Indonesia">🇮🇩 Indonesia</option>
          <option value="🇵🇭 Philippines">🇵🇭 Philippines</option>
          <option value="🇲🇾 Malaysia">🇲🇾 Malaysia</option>
        </select>

        <textarea 
          name="accessibility_needs"
          placeholder="Accessibility Needs"
          value={profile.accessibility_needs}
          onChange={handleInputChange}
        ></textarea>

        <button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>

      <div className="profile-summary">
        <h3>Profile Summary</h3>
        <p><strong>Name:</strong> {profile.name || "Not set"}</p>
        <p><strong>Nationality:</strong> {profile.nationality || "Not set"}</p>
        <p><strong>Age:</strong> {profile.age || "Not set"}</p>
        <p><strong>Interests:</strong> {preferences.selected?.length ? preferences.selected.join(", ") : "Not set"}</p>
      </div>

      <div className="profile-account">
        <h3>Account Information</h3>
        <p>Email: {user?.email || "N/A"}</p>
        <p>Member Since: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</p>
      </div>
    </div>
  );
}
