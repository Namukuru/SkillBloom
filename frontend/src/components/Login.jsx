import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true); // Show loading state

        try {
            const response = await axios.post("http://localhost:8000/api/login/", {
                username,
                password,
            });

            // Store the token
            sessionStorage.setItem("token", response.data.token.access);
            console.log("✅ Logged in successfully:", response.data);


            // ✅ Show success alert instantly
            Promise.resolve().then(() => {
                alert("✅ Login successful!");
            });

            // ✅ Navigate smoothly after 100ms to prevent lag
            setTimeout(() => {
                navigate("/profile", { replace: true });
            }, 100);
        } catch (error) {
            setError("❌ Invalid credentials. Try again.");
        } finally {
            setLoading(false); // Stop loading
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
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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

                {/* Signup Section */}
                <div className="mt-4 text-center">
                    <p className="text-gray-600">Don't have an account?</p>
                    <Link 
                        to="/signup" 
                        className="text-purple-500 hover:underline font-medium"
                    >
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
