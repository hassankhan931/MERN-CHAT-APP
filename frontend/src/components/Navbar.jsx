import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext.jsx";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="text-white shadow-lg bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="text-2xl font-bold tracking-tight transition-colors hover:text-blue-200">
              ChatApp
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-4 md:flex">
            {user ? (
              <>
                <span className="px-3 py-2 text-sm font-medium bg-blue-700 bg-opacity-50 rounded-md">
                  Welcome, {user.username}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-blue-600 transition-colors bg-white rounded-md hover:bg-blue-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-blue-700 hover:bg-opacity-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 text-white rounded-md hover:text-white hover:bg-blue-700 focus:outline-none"
              aria-expanded="false"
            >
              {isMenuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="bg-blue-700 md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <div className="block px-3 py-2 text-base font-medium bg-blue-800 rounded-md">
                  Welcome, {user.username}
                </div>
                <button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="block w-full px-3 py-2 text-base font-medium text-left text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="block px-3 py-2 text-base font-medium rounded-md hover:bg-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={toggleMenu}
                  className="block px-3 py-2 text-base font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;