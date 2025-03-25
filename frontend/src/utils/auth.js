import axios from "axios";

// Check if token is expired
const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return Date.now() >= payload.exp * 1000;
    } catch {
        return true; // Treat invalid tokens as expired
    }
};

// Refresh the access token
const refreshAccessToken = async () => {
    const refreshToken = sessionStorage.getItem("refresh_token");
    if (!refreshToken) {
        console.error("No refresh token found");
        sessionStorage.removeItem("access_token"); // Clean up
        window.location.href = "/login"; // Force re-login
        return null;
    }

    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/api/token/refresh/",
            { refresh: refreshToken }
        );
        const newAccessToken = response.data.access;
        sessionStorage.setItem("access_token", newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.error("Refresh failed:", error);
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        window.location.href = "/login"; // Redirect on failure
        return null;
    }
};

// Get a valid token (checks expiry + refreshes if needed)
export const getValidToken = async () => {
    let token = sessionStorage.getItem("access_token");

    if (!token || isTokenExpired(token)) {
        console.log("Token expired. Refreshing...");
        token = await refreshAccessToken();
    }

    return token; // Returns null if refresh fails
};