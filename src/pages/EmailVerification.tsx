import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Flower, Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, getCurrentUser } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Check if this is a verification callback
  const token = searchParams.get('token');
  const type = searchParams.get('type');

  useEffect(() => {
    if (token && type === 'signup') {
      handleEmailVerification();
    }
  }, [token, type]);

  useEffect(() => {
    // Cooldown timer for resend button
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleEmailVerification = async () => {
    if (!token) return;

    setIsVerifying(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      });

      if (error) throw error;

      if (data.user) {
        setVerificationStatus('success');
        await getCurrentUser();
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Email verification error:', error);
      setVerificationStatus('error');
      setErrorMessage(error.message || 'Failed to verify email');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) throw error;

      setResendCooldown(60); // 60 second cooldown
    } catch (error: any) {
      console.error('Resend verification error:', error);
      setErrorMessage(error.message || 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  // If this is a verification callback
  if (token && type === 'signup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-8">
            <Flower className="text-yellow-500 mr-2" size={32} />
            <span className="font-bold text-2xl text-green-700">Swasti</span>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8 text-center">
            {isVerifying && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Verifying your email...</h2>
                <p className="text-gray-600">Please wait while we confirm your email address.</p>
              </>
            )}

            {verificationStatus === 'success' && (
              <>
                <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Email Verified!</h2>
                <p className="text-gray-600 mb-4">Your email has been successfully verified. Redirecting you to the app...</p>
              </>
            )}

            {verificationStatus === 'error' && (
              <>
                <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Verification Failed</h2>
                <p className="text-red-600 mb-4">{errorMessage}</p>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Go to Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Regular verification prompt page
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Flower className="text-yellow-500 mr-2" size={32} />
          <span className="font-bold text-2xl text-green-700">Swasti</span>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8 text-center">
          <Mail className="text-blue-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification link to <strong>{user?.email}</strong>. 
            Please check your email and click the link to verify your account.
          </p>

          {errorMessage && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {errorMessage}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleResendVerification}
              disabled={isResending || resendCooldown > 0}
              className="w-full bg-green-600 text-white py-3 rounded-xl flex items-center justify-center font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <>
                  <RefreshCw className="animate-spin mr-2" size={18} />
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                'Resend Verification Email'
              )}
            </button>

            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Login
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Didn't receive the email?</h3>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>• Check your spam/junk folder</li>
              <li>• Make sure you entered the correct email address</li>
              <li>• Wait a few minutes for the email to arrive</li>
              <li>• Try resending the verification email</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;