import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const AuthCallback: React.FC = () => {
  const { getCurrentUser, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await getCurrentUser();
        navigate('/');
      } catch (error) {
        console.error('Error during auth callback:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [getCurrentUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-green-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Completing your login...</h2>
        <p className="text-gray-500 mt-2">Please wait while we set up your account.</p>
      </div>
    </div>
  );
};

export default AuthCallback;