import axios from "axios";

// Check if token is expired
const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        return Date.now() >= payload.exp * 1000; // Compare expiry time
    } catch (error) {
        return true; // Treat invalid tokens as expired
    }
};

// Refresh the access token
const refreshAccessToken = async () => {
    const refreshToken = sessionStorage.getItem("refresh_token");
    if (!refreshToken) return null;

    try {
        const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh: refreshToken });
        const newAccessToken = response.data.access;

        sessionStorage.setItem("access_token", newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.error("Token refresh failed:", error);
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        return null;
    }
};

// Get a valid token (either existing or refreshed)
const getValidToken = async () => {
    let token = sessionStorage.getItem("access_token");

    if (!token || isTokenExpired(token)) {
        console.log("Token expired. Attempting refresh...");
        token = await refreshAccessToken();
    }

    return token;
};

export { getValidToken };
