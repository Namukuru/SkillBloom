import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = ({ isAuthenticated }) => {
  return (
    <nav className="bg-gray-900 shadow-md"> {/* Dark gray background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand/Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-purple-400"> {/* Purple text */}
              SkillBloom
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="flex items-center space-x-4">
            <ul className="flex space-x-4">
              <li>
                <NavLink
                  to="/"
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
                  to="/message"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive ? "bg-purple-500 text-white" : "text-gray-300 hover:bg-purple-600 hover:text-white"
                    }`
                  }
                >
                  Messages
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
            </ul>
          </div>

          {/* Auth Links (Desktop) */}
          <div className="flex items-center space-x-4">
            <ul className="flex space-x-4">
              {isAuthenticated ? (
                <li>
                  <NavLink
                    to="/logout"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-purple-600 hover:text-white"
                  >
                    Logout
                  </NavLink>
                </li>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/login"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-purple-600 hover:text-white"
                    >
                      Login
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;