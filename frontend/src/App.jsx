import { useState } from "react";
import Login from "./Login";

function App() {
  const [token, setToken] = useState(null);

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div>
      <h1>Welcome! You are logged in.</h1>
      <p>Your token: {token}</p>
    </div>
  );
}

export default App;
