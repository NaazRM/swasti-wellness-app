import React, { useState } from 'react';
import Header from '../components/Header';
import TipCard from '../components/TipCard';
import { tips } from '../data/tips';
import { Heart } from 'lucide-react';

const Saved: React.FC = () => {
  const [savedTipIds, setSavedTipIds] = useState<string[]>(['tip1', 'tip3', 'tip7']);
  
  const savedTips = tips.filter(tip => savedTipIds.includes(tip.id));
  
  const handleSaveTip = (id: string) => {
    if (savedTipIds.includes(id)) {
      setSavedTipIds(savedTipIds.filter(tipId => tipId !== id));
    } else {
      setSavedTipIds([...savedTipIds, id]);
    }
  };
  
  const handleShareTip = (id: string) => {
    alert(`Sharing tip ${id} via WhatsApp`);
  };
  
  return (
    <div className="pb-6">
      <Header title="Saved Tips" />
      
      <div className="p-4">
        {savedTips.length > 0 ? (
          <div className="space-y-4">
            {savedTips.map(tip => (
              <TipCard 
                key={tip.id}
                tip={{...tip, saved: true}}
                onSave={handleSaveTip}
                onShare={handleShareTip}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Heart size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">No saved tips yet</h3>
            <p className="text-gray-500 text-center max-w-xs">
              Swipe right or tap the heart icon on tips you want to save for later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;