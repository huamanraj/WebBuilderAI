import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaPlus, FaFolder, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-gray-50/40">
      {/* Sidebar */}
      <div className={`bg-white/60 backdrop-blur-sm border-r fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-6 py-6">
            <Link to="/dashboard" className="flex items-center space-x-2" onClick={closeSidebar}>
              <span className="font-semibold text-xl tracking-tight">WebBuilder</span>
            </Link>
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-900 transition-colors"
              onClick={closeSidebar}
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4">
            <div className="space-y-1">
              {/* Update each nav link with modern styling */}
              <Link 
                to="/dashboard" 
                className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive('/dashboard') 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={closeSidebar}
              >
                <FaHome className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              <Link 
                to="/create" 
                className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive('/create') 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={closeSidebar}
              >
                <FaPlus className="mr-2 h-4 w-4" />
                New Website
              </Link>
              <Link 
                to="/my-websites" 
                className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive('/my-websites') 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={closeSidebar}
              >
                <FaFolder className="mr-2 h-4 w-4" />
                My Websites
              </Link>
              <Link 
                to="/profile" 
                className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive('/profile') 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={closeSidebar}
              >
                <FaUser className="mr-2 h-4 w-4" />
                My Profile
              </Link>
            </div>
          </nav>

          {/* User section */}
          <div className="border-t p-4">
            <button 
              onClick={handleLogout}
              className="flex w-full items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FaSignOutAlt className="mr-2 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        <header className="sticky top-0 z-20 bg-white/60 backdrop-blur-sm border-b px-6 py-4">
          <div className="flex items-center justify-end">
            <button 
              className="lg:hidden absolute left-6 h-10 w-10 inline-flex items-center justify-center rounded-md hover:bg-gray-100"
              onClick={toggleSidebar}
            >
              <FaBars className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user?.name}</span>
              <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
