import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import the AuthContext

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from session storage
    sessionStorage.removeItem("token");

    // Call the logout function from AuthContext
    logout();

    // Redirect to home page
    navigate("/home", { replace: true });
  };

  return (
    <nav className="bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand/Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-purple-400">
              SkillBloom
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="flex items-center space-x-4">
            <ul className="flex space-x-4">
              <li>
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive ? "bg-purple-500 text-white" : "text-gray-300 hover:bg-purple-600 hover:text-white"
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive ? "bg-purple-500 text-white" : "text-gray-300 hover:bg-purple-600 hover:text-white"
                    }`
                  }
                >
                  About
                </NavLink>
              </li>
              {/* Show these links only if authenticated */}
              {isAuthenticated && (
                <>
                  <li>
                    <NavLink
                      to="/skill-exchange"
                      className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium ${
                          isActive ? "bg-purple-500 text-white" : "text-gray-300 hover:bg-purple-600 hover:text-white"
                        }`
                      }
                    >
                      Skill Exchange
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium ${
                          isActive ? "bg-purple-500 text-white" : "text-gray-300 hover:bg-purple-600 hover:text-white"
                        }`
                      }
                    >
                      Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/sessions"
                      className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium ${
                          isActive ? "bg-purple-500 text-white" : "text-gray-300 hover:bg-purple-600 hover:text-white"
                        }`
                      }
                    >
                      Sessions
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Auth Links (Desktop) */}
          <div className="flex items-center space-x-4">
            <ul className="flex space-x-4">
              {isAuthenticated ? (
                // Show Logout button if authenticated
                <li>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-purple-600 hover:text-white"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                // Show Login link if not authenticated
                <li>
                  <NavLink
                    to="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-purple-600 hover:text-white"
                  >
                    Login
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;