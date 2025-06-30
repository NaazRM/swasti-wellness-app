import React, { useState } from 'react';
import TinderCard from 'react-tinder-card';
import { Heart, Share2, ArrowRightLeft } from 'lucide-react';
import { Tip } from '../types';

interface SwipeableTipCardProps {
  tip: Tip;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  onSwipe: (direction: string, id: string) => void;
}

const SwipeableTipCard: React.FC<SwipeableTipCardProps> = ({ 
  tip, 
  onSave, 
  onShare,
  onSwipe
}) => {
  const [showHelp, setShowHelp] = useState(false);

  const handleSwipe = (direction: string) => {
    onSwipe(direction, tip.id);
  };

  return (
    <TinderCard
      className="swipe"
      onSwipe={handleSwipe}
      preventSwipe={['up', 'down']}
    >
      <div className={`card ${tip.category === 'Immunity Boosting' ? 'bg-amber-50' : 
                            tip.category === 'Digestion & Gut Health' ? 'bg-green-50' : 
                            tip.category === "Children's Health" ? 'bg-blue-50' : 
                            tip.category === 'Skin Care & Beauty' ? 'bg-rose-50' : 
                            tip.category === "Women's Health" ? 'bg-purple-50' : 
                            tip.category === 'Mental Health' ? 'bg-indigo-50' : 'bg-yellow-50'}`}>
        <div className="cardContent">
          {showHelp && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
              <div className="bg-white/90 backdrop-blur-sm py-3 px-6 rounded-full shadow-lg">
                <span className="flex items-center text-green-800">
                  <ArrowRightLeft className="mr-2" size={16} /> 
                  Swipe to discover
                </span>
              </div>
            </div>
          )}
          
          <div className="bg-white/90 backdrop-blur-sm p-5 rounded-t-xl">
            <h3 className="text-xl font-bold mb-2 text-gray-800">{tip.title}</h3>
            <p className="text-gray-700">{tip.description}</p>
            
            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs text-gray-500">{tip.category}</span>
              <div className="flex space-x-3">
                <button 
                  onClick={() => onShare(tip.id)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Share tip"
                >
                  <Share2 size={20} className="text-gray-600" />
                </button>
                <button 
                  onClick={() => onSave(tip.id)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label={tip.saved ? "Remove from saved" : "Save tip"}
                >
                  <Heart 
                    size={20} 
                    className={tip.saved ? "text-red-500 fill-red-500" : "text-gray-600"} 
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          className="absolute top-4 right-4 bg-white/80 p-2 rounded-full shadow-md"
          onClick={() => setShowHelp(!showHelp)}
          aria-label="Show help"
        >
          <ArrowRightLeft size={16} className="text-gray-700" />
        </button>
      </div>
    </TinderCard>
  );
};

export default SwipeableTipCard;