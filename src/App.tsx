import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import Saved from './pages/Saved';
import Profile from './pages/Profile';
import TipDetail from './pages/TipDetail';
import Onboarding from './pages/Onboarding';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import EditProfile from './pages/EditProfile';
import CreateTip from './pages/CreateTip';
import EmailVerification from './pages/EmailVerification';
import { useAuthStore } from './store/authStore';
import AuthCallback from './pages/AuthCallback';

// Auth callback handler component
const AuthCallbackHandler: React.FC = () => {
  const { getCurrentUser } = useAuthStore();
  const location = useLocation();
  
  useEffect(() => {
    // Handle the auth callback
    const handleAuthCallback = async () => {
      await getCurrentUser();
    };
    
    handleAuthCallback();
  }, [getCurrentUser, location]);
  
  return <div className="flex items-center justify-center h-screen">Completing login...</div>;
};

function App() {
  const { getCurrentUser, user, isLoading } = useAuthStore();
  
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);
  
  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    
    if (isLoading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/auth/callback" element={<AuthCallbackHandler />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="discover" element={<Discover />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/:id" element={<CategoryDetail />} />
          <Route path="saved" element={
            <ProtectedRoute>
              <Saved />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="edit-profile" element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } />
          <Route path="create-tip" element={
            <ProtectedRoute>
              <CreateTip />
            </ProtectedRoute>
          } />
          <Route path="tip/:id" element={<TipDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;