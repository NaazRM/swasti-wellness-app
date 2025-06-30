import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Heart, Share2, Clock, Calendar, MessageCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTipsStore } from '../store/tipsStore';
import CommentItem from '../components/CommentItem';
import CommentForm from '../components/CommentForm';
import { useAuthStore } from '../store/authStore';

const TipDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    currentTip, 
    fetchTipById, 
    comments, 
    fetchComments, 
    isLoading, 
    error,
    likeTip,
    unlikeTip,
    saveTip,
    unsaveTip
  } = useTipsStore();
  
  useEffect(() => {
    if (id) {
      fetchTipById(id);
      fetchComments(id);
    }
  }, [id, fetchTipById, fetchComments]);

  const handleLike = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (currentTip) {
      if (currentTip.isLiked) {
        unlikeTip(currentTip.id);
      } else {
        likeTip(currentTip.id);
      }
    }
  };

  const handleSave = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (currentTip) {
      if (currentTip.saved) {
        unsaveTip(currentTip.id);
      } else {
        saveTip(currentTip.id);
      }
    }
  };
  
  const handleShare = () => {
    alert(`Sharing tip ${id} via WhatsApp`);
  };
  
  if (isLoading) {
    return (
      <div>
        <Header showBackButton title="Loading..." />
        <div className="p-4 flex justify-center">
          <div className="animate-pulse flex flex-col w-full">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-32 bg-gray-200 rounded w-full mb-4"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !currentTip) {
    return (
      <div>
        <Header showBackButton title="Tip Not Found" />
        <div className="p-4">
          <p className="text-red-500">{error || "The tip you're looking for doesn't exist."}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 text-green-600 flex items-center"
          >
            <ArrowLeft size={16} className="mr-1" />
            Go back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pb-16">
      <Header showBackButton title="Tip Details" />
      
      <div className={`p-6 ${
        currentTip.category === 'Immunity Boosting' ? 'bg-amber-50' : 
        currentTip.category === 'Digestion & Gut Health' ? 'bg-green-50' : 
        currentTip.category === "Children's Health" ? 'bg-blue-50' : 
        currentTip.category === 'Skin Care & Beauty' ? 'bg-rose-50' : 
        currentTip.category === "Women's Health" ? 'bg-purple-50' : 
        currentTip.category === 'Mental Health' ? 'bg-indigo-50' : 'bg-yellow-50'
      }`}>
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
            {currentTip.authorAvatar ? (
              <img src={currentTip.authorAvatar} alt={currentTip.authorName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-xs">{currentTip.authorName?.charAt(0)}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{currentTip.authorName}</p>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{currentTip.title}</h1>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="flex items-center mr-4">
            <Calendar size={14} className="mr-1" />
            {currentTip.createdAt}
          </span>
          <span className="flex items-center">
            <Clock size={14} className="mr-1" />
            2 min read
          </span>
        </div>
        
        <div className="flex items-center mb-4">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {currentTip.category}
          </span>
          <div className="flex items-center ml-auto">
            <button 
              onClick={handleLike}
              className="flex items-center mr-3"
            >
              <Heart 
                size={18} 
                className={currentTip.isLiked ? "text-red-500 fill-red-500" : "text-gray-400"} 
              />
              <span className="ml-1 text-sm text-gray-500">{currentTip.likes}</span>
            </button>
            <button className="flex items-center">
              <MessageCircle size={18} className="text-gray-400" />
              <span className="ml-1 text-sm text-gray-500">{currentTip.comments}</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-gray-700 mb-6">{currentTip.description}</p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-gray-800 mb-2">Benefits</h3>
          <ul className="list-disc pl-5 space-y-1">
            {currentTip.benefits.map((benefit, index) => (
              <li key={index} className="text-gray-700">{benefit}</li>
            ))}
          </ul>
        </div>
        
        {currentTip.ingredients && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-bold text-gray-800 mb-2">Ingredients</h3>
            <ul className="list-disc pl-5 space-y-1">
              {currentTip.ingredients.map((ingredient, index) => (
                <li key={index} className="text-gray-700">{ingredient}</li>
              ))}
            </ul>
          </div>
        )}
        
        {currentTip.steps && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-bold text-gray-800 mb-2">How to Use</h3>
            <ol className="list-decimal pl-5 space-y-2">
              {currentTip.steps.map((step, index) => (
                <li key={index} className="text-gray-700">{step}</li>
              ))}
            </ol>
          </div>
        )}
        
        <div className="flex justify-between mt-8">
          <button 
            onClick={handleSave}
            className={`flex items-center justify-center px-4 py-2 rounded-lg ${
              currentTip.saved 
                ? 'bg-green-50 text-green-600 border border-green-200' 
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            <Heart size={18} className={`mr-2 ${currentTip.saved ? 'fill-green-500 text-green-500' : ''}`} />
            {currentTip.saved ? 'Saved' : 'Save'}
          </button>
          
          <button 
            onClick={handleShare}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            <Share2 size={18} className="mr-2" />
            Share via WhatsApp
          </button>
        </div>
      </div>
      
      {/* Comments section */}
      <div className="border-t border-gray-200 mt-6">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Comments ({comments.length})</h3>
        </div>
        
        {user ? (
          <CommentForm tipId={id || ''} />
        ) : (
          <div className="p-4 text-center">
            <p className="text-gray-500 mb-2">Log in to add a comment</p>
            <button 
              onClick={() => navigate('/login')}
              className="text-green-600 font-medium"
            >
              Log In
            </button>
          </div>
        )}
        
        {comments.length > 0 ? (
          <div>
            {comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
      
      {/* Navigation between tips */}
      <div className="p-4 flex justify-between border-t border-gray-200">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back
        </button>
        
        <button 
          onClick={() => navigate('/discover')}
          className="flex items-center text-green-600"
        >
          Discover more
          <ArrowRight size={18} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default TipDetail;