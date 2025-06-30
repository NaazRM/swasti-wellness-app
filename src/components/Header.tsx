import React from 'react';
import { Flower, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const goBack = () => {
    navigate(-1);
  };
  
  // Don't show header on onboarding screen
  if (location.pathname === '/onboarding') {
    return null;
  }
  
  return (
    <header className="bg-white shadow-sm py-4 px-4 flex items-center justify-between">
      <div className="flex items-center">
        {showBackButton ? (
          <button 
            onClick={goBack}
            className="mr-3 p-1"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
        ) : (
          <Flower className="text-yellow-500 mr-2" size={24} />
        )}
        
        <h1 className="font-bold text-xl text-green-700">
          {title || 'Swasti'}
        </h1>
      </div>
    </header>
  );
};

export default Header;