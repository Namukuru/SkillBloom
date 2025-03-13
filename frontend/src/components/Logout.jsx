import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from session storage
    sessionStorage.removeItem("token");

    // Optionally, inform the backend (Django) to blacklist the token
    fetch("http://127.0.0.1:8000/api/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }).catch((error) => console.error("Logout request failed:", error));

    // Redirect to login page
    navigate("/", { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md"
    >
      🚪 Logout
    </button>
  );
};

export default LogoutButton;
