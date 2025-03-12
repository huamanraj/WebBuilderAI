import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const MainLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <svg width="40" height="40" viewBox="0 0 100 100" className="mr-2">
                  <rect width="100" height="100" rx="20" fill="#2563eb" />
                  <path d="M25 30L45 50L25 70" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M55 30L75 50L55 70" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-2xl font-bold text-gray-900">WebBuilder AI</span>
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link 
                to="/" 
                className={`text-base font-medium ${location.pathname === '/' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
              >
                Home
              </Link>
              <Link 
                to="/features" 
                className={`text-base font-medium ${location.pathname === '/features' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
              >
                Features
              </Link>
              <Link 
                to="/pricing" 
                className={`text-base font-medium ${location.pathname === '/pricing' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
              >
                Pricing
              </Link>
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-base font-medium text-white bg-primary hover:bg-secondary rounded-md px-4 py-2 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={logout}
                    className="text-base font-medium text-gray-700 hover:text-primary"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-base font-medium text-gray-700 hover:text-primary"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-base font-medium text-white bg-primary hover:bg-secondary rounded-md px-4 py-2 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                className="text-gray-700 hover:text-primary focus:outline-none"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <motion.div 
              className="md:hidden pt-4 pb-3 border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className={`text-base font-medium ${location.pathname === '/' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <Link 
                  to="/features" 
                  className={`text-base font-medium ${location.pathname === '/features' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
                  onClick={closeMenu}
                >
                  Features
                </Link>
                <Link 
                  to="/pricing" 
                  className={`text-base font-medium ${location.pathname === '/pricing' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
                  onClick={closeMenu}
                >
                  Pricing
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="text-base font-medium text-primary hover:text-secondary"
                      onClick={closeMenu}
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="text-base font-medium text-gray-700 hover:text-primary text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="text-base font-medium text-gray-700 hover:text-primary"
                      onClick={closeMenu}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="text-base font-medium text-white bg-primary hover:bg-secondary rounded-md px-4 py-2 transition-colors w-full text-center"
                      onClick={closeMenu}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <svg width="40" height="40" viewBox="0 0 100 100" className="mr-2">
                  <rect width="100" height="100" rx="20" fill="#2563eb" />
                  <path d="M25 30L45 50L25 70" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M55 30L75 50L55 70" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xl font-bold">WebBuilder AI</span>
              </div>
              <p className="text-gray-400">
                Create beautiful websites in seconds using AI technology.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link to="/templates" className="text-gray-400 hover:text-white">Templates</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link to="/documentation" className="text-gray-400 hover:text-white">Documentation</Link></li>
                <li><Link to="/help" className="text-gray-400 hover:text-white">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} WebBuilder AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
