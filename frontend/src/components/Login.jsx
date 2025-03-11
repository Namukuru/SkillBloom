import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Hook for navigation

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:8000/api/login/", {
                username,
                password
            });

            // Store the token in local storage
            localStorage.setItem("token", response.data.token.access);
            alert("Login successful!");
            navigate("/dashboard"); // Navigate to the dashboard
        } catch (error) {
            setError("Invalid credentials. Try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <div className="bg-gray-300 p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold text-center mb-4">Login</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        className="w-full p-2 rounded"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        className="w-full p-2 rounded"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="w-full p-2 bg-purple-500 text-white rounded flex items-center justify-center">
                        <span className="mr-2">🔒</span> Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
