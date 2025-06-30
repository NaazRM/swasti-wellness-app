import React, { useEffect } from 'react';
import Header from '../components/Header';
import { Flower, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import SocialTipCard from '../components/SocialTipCard';
import { useTipsStore } from '../store/tipsStore';
import { useAuthStore } from '../store/authStore';

const Home: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    feedTips, 
    popularTips, 
    fetchFeedTips, 
    fetchPopularTips, 
    isLoading 
  } = useTipsStore();
  
  useEffect(() => {
    fetchFeedTips();
    fetchPopularTips();
  }, [fetchFeedTips, fetchPopularTips]);
  
  const handleShare = (id: string) => {
    alert(`Sharing tip ${id} via WhatsApp`);
  };
  
  return (
    <div className="pb-16">
      <Header />
      
      <div className="p-4">
        <div className="flex items-center mb-4">
          <Flower className="text-yellow-500 mr-2" size={20} />
          <h2 className="text-xl font-bold text-green-800">
            {user ? `Namaste, ${user.name.split(' ')[0]}` : 'Namaste'}
          </h2>
        </div>
        
        {!user && (
          <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-100">
            <h3 className="text-yellow-800 font-medium mb-2">Welcome to Swasti</h3>
            <p className="text-yellow-700 text-sm mb-3">
              Join our community to share and discover traditional wellness tips.
            </p>
            <div className="flex space-x-2">
              <Link 
                to="/login" 
                className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium"
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
        
        <div className="bg-green-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-green-800 font-medium">Today's Wellness Feed</h3>
            <Link to="/discover" className="text-green-700 text-sm">See all</Link>
          </div>
          
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ) : feedTips.length > 0 ? (
            <div className="space-y-4">
              {feedTips.slice(0, 3).map(tip => (
                <SocialTipCard 
                  key={tip.id} 
                  tip={tip}
                  onShare={handleShare}
                />
              ))}
              <Link 
                to="/discover" 
                className="block text-center mt-4 text-green-700 font-medium"
              >
                Discover more tips →
              </Link>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-3">No tips in your feed yet</p>
              <Link 
                to="/discover" 
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium"
              >
                Discover Tips
              </Link>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <TrendingUp className="text-green-600 mr-2" size={18} />
            <h3 className="text-lg font-bold text-gray-800">Popular Tips</h3>
          </div>
          
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ) : popularTips.length > 0 ? (
            <div className="space-y-4">
              {popularTips.slice(0, 2).map(tip => (
                <SocialTipCard 
                  key={tip.id} 
                  tip={tip}
                  onShare={handleShare}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No popular tips yet</p>
            </div>
          )}
        </div>
        
        <Link 
          to="/categories" 
          className="block text-center mt-6 text-green-700 font-medium"
        >
          Browse all categories →
        </Link>
      </div>
    </div>
  );
};

export default Home;