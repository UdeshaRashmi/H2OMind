import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, theme } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    const activeClass = theme === 'dark' ? 'bg-primary-900 text-white' : 'bg-primary-100 text-primary-700';
    const inactiveClass = theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-primary-50';
    return location.pathname === path ? activeClass : inactiveClass;
  };

  return (
    <nav className={theme === 'dark' ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-md'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600">💧 H2OMind</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {!isAuthenticated ? (
                <>
                  <Link to="/" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/')} ${theme === 'dark' ? 'border-gray-600' : 'border-transparent'}`}>
                    Home
                  </Link>
                  <Link to="/login" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/login')} ${theme === 'dark' ? 'border-gray-600' : 'border-transparent'}`}>
                    Login
                  </Link>
                  <Link to="/register" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/register')} ${theme === 'dark' ? 'border-gray-600' : 'border-transparent'}`}>
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/dashboard')} ${theme === 'dark' ? 'border-gray-600' : 'border-transparent'}`}>
                    Dashboard
                  </Link>
                  <Link to="/add-usage" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/add-usage')} ${theme === 'dark' ? 'border-gray-600' : 'border-transparent'}`}>
                    Add Usage
                  </Link>
                  <Link to="/insights" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/insights')} ${theme === 'dark' ? 'border-gray-600' : 'border-transparent'}`}>
                    Insights
                  </Link>
                  <Link to="/alerts" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/alerts')} ${theme === 'dark' ? 'border-gray-600' : 'border-transparent'}`}>
                    Alerts
                  </Link>
                  <Link to="/profile" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/profile')} ${theme === 'dark' ? 'border-gray-600' : 'border-transparent'}`}>
                    Profile
                  </Link>
                  <Link to="/settings" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/settings')} ${theme === 'dark' ? 'border-gray-600' : 'border-transparent'}`}>
                    Settings
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;