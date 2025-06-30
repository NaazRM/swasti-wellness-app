import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreVertical } from 'lucide-react';
import { Tip } from '../types';
import { useTipsStore } from '../store/tipsStore';

interface SocialTipCardProps {
  tip: Tip;
  onShare?: (id: string) => void;
}

const SocialTipCard: React.FC<SocialTipCardProps> = ({ tip, onShare }) => {
  const { likeTip, unlikeTip, saveTip, unsaveTip } = useTipsStore();

  const handleLike = () => {
    if (tip.isLiked) {
      unlikeTip(tip.id);
    } else {
      likeTip(tip.id);
    }
  };

  const handleSave = () => {
    if (tip.saved) {
      unsaveTip(tip.id);
    } else {
      saveTip(tip.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(tip.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
      {/* Author info */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <Link to={`/profile/${tip.authorId}`} className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {tip.authorAvatar ? (
              <img src={tip.authorAvatar} alt={tip.authorName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">{tip.authorName?.charAt(0)}</span>
            )}
          </div>
          <div className="ml-3">
            <p className="font-medium text-gray-800">{tip.authorName}</p>
            <p className="text-xs text-gray-500">{tip.createdAt}</p>
          </div>
        </Link>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Tip content */}
      <Link to={`/tip/${tip.id}`}>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2 text-gray-800">{tip.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{tip.description}</p>
          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full inline-block">
            {tip.category}
          </div>
        </div>
      </Link>

      {/* Engagement stats */}
      <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100 flex">
        <span className="mr-4">{tip.likes || 0} likes</span>
        <span>{tip.comments || 0} comments</span>
      </div>

      {/* Action buttons */}
      <div className="px-4 py-2 flex justify-between border-t border-gray-100">
        <button 
          onClick={handleLike}
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <Heart 
            size={18} 
            className={tip.isLiked ? "text-red-500 fill-red-500" : ""} 
          />
          <span className="ml-1 text-sm">Like</span>
        </button>
        <Link 
          to={`/tip/${tip.id}`}
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <MessageCircle size={18} />
          <span className="ml-1 text-sm">Comment</span>
        </Link>
        <button 
          onClick={handleShare}
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <Share2 size={18} />
          <span className="ml-1 text-sm">Share</span>
        </button>
        <button 
          onClick={handleSave}
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <Heart 
            size={18} 
            className={tip.saved ? "text-green-500 fill-green-500" : ""} 
          />
          <span className="ml-1 text-sm">Save</span>
        </button>
      </div>
    </div>
  );
};

export default SocialTipCard;