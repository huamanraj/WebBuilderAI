import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CreateWebsitePage from './pages/dashboard/CreateWebsitePage';
import MyWebsitesPage from './pages/dashboard/MyWebsitesPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import WebsiteEditorPage from './pages/dashboard/WebsiteEditorPage';
import SharedWebsitePage from './pages/dashboard/SharedWebsitePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const location = useLocation();
  const { loading } = useAuth();

  // Wait for authentication to be checked before rendering
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/share/:shareableLink" element={<SharedWebsitePage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create" element={<CreateWebsitePage />} />
            <Route path="/my-websites" element={<MyWebsitesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/website/:id" element={<WebsiteEditorPage />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;