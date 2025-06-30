import React from 'react';
import { Heart, Share2 } from 'lucide-react';
import { Tip } from '../types';

interface TipCardProps {
  tip: Tip;
  onSave?: (id: string) => void;
  onShare?: (id: string) => void;
  className?: string;
}

const TipCard: React.FC<TipCardProps> = ({ tip, onSave, onShare, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 text-gray-800">{tip.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{tip.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{tip.category}</span>
          <div className="flex space-x-2">
            <button 
              onClick={() => onShare && onShare(tip.id)}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Share tip"
            >
              <Share2 size={18} className="text-gray-500" />
            </button>
            <button 
              onClick={() => onSave && onSave(tip.id)}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label={tip.saved ? "Remove from saved" : "Save tip"}
            >
              <Heart 
                size={18} 
                className={tip.saved ? "text-red-500 fill-red-500" : "text-gray-500"} 
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipCard;