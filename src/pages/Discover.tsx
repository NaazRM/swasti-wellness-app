import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import SwipeableTipCard from '../components/SwipeableTipCard';
import { useTipsStore } from '../store/tipsStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Discover: React.FC = () => {
  const { user } = useAuthStore();
  const { tips, fetchTips, saveTip, likeTip } = useTipsStore();
  const [currentTips, setCurrentTips] = useState<any[]>([]);
  const [lastDirection, setLastDirection] = useState<string>('');
  const navigate = useNavigate();
  
  const childRefs = useRef<any[]>([]);
  
  useEffect(() => {
    fetchTips();
  }, [fetchTips]);
  
  useEffect(() => {
    setCurrentTips(tips);
    childRefs.current = Array(tips.length).fill(0).map((_, i) => childRefs.current[i] || React.createRef());
  }, [tips]);
  
  const handleSaveTip = (id: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    saveTip(id);
    // Swipe right if saved
    childRefs.current[currentTips.findIndex(tip => tip.id === id)]?.swipe('right');
  };
  
  const handleShareTip = (id: string) => {
    alert(`Sharing tip ${id} via WhatsApp`);
  };
  
  const handleSwipe = (direction: string, id: string) => {
    setLastDirection(direction);
    
    // If swiped right, save the tip
    if (direction === 'right' && user) {
      saveTip(id);
      likeTip(id);
    }
    
    // Remove the swiped card from the stack
    // In a real app, you'd fetch more cards when running low
    setTimeout(() => {
      setCurrentTips(currentTips.filter(tip => tip.id !== id));
    }, 300);
  };
  
  return (
    <div className="pb-16">
      <Header title="Discover" />
      
      <div className="p-4">
        <div className="cardContainer">
          {currentTips.map((tip, index) => (
            <SwipeableTipCard
              key={tip.id}
              tip={tip}
              onSave={handleSaveTip}
              onShare={handleShareTip}
              onSwipe={handleSwipe}
              ref={childRefs.current[index]}
            />
          ))}
          
          {currentTips.length === 0 && (
            <div className="mt-10 text-center">
              <h3 className="text-xl font-bold text-gray-700 mb-2">You've seen all tips for today!</h3>
              <p className="text-gray-600">Check back tomorrow for new wellness wisdom.</p>
            </div>
          )}
          
          {lastDirection && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Last swipe: {lastDirection}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;