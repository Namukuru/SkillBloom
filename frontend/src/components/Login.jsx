import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/axiosConfig"; // Import configured Axios instance
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const response = await api.post("/login/", { username: email, password });
  
      // Extract tokens
      const { access, refresh } = response.data.token;
  
      // Store tokens in session storage
      sessionStorage.setItem("access_token", response.data.token.access);
      sessionStorage.setItem("refresh_token", response.data.token.refresh);
  
      // Set Authorization header globally
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
  
      // Update authentication state
      login();
  
      alert("✅ Login successful!");
      navigate("/home", { replace: true });
  
      // Debugging: Confirm token storage
      console.log("Stored Access Token After Login:", sessionStorage.getItem("access_token"));
  
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.response?.data?.detail || "❌ Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="bg-gray-300 p-6 rounded-lg w-96 shadow-md">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-700">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full p-2 rounded border border-gray-400"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-2 rounded border border-gray-400"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`w-full p-2 rounded flex items-center justify-center transition duration-300 ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"
            }`}
            disabled={loading}
          >
            {loading ? "🔄 Logging in..." : <><span className="mr-2">🔒</span> Login</>}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Don't have an account?</p>
          <Link to="/signup" className="text-purple-500 hover:underline font-medium">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
