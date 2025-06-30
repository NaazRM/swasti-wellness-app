import React from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
import { Comment } from '../types';

interface CommentItemProps {
  comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-start">
        <Link to={`/profile/${comment.userId}`} className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {comment.userAvatar ? (
              <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-xs">{comment.userName.charAt(0)}</span>
            )}
          </div>
        </Link>
        <div className="ml-3 flex-1">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-start">
              <Link to={`/profile/${comment.userId}`} className="font-medium text-gray-800 text-sm">
                {comment.userName}
              </Link>
              <button className="text-gray-400 hover:text-gray-600 -mt-1">
                <MoreVertical size={16} />
              </button>
            </div>
            <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
          </div>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <span>{comment.createdAt}</span>
            <button className="ml-4 hover:text-gray-700">Reply</button>
            <button className="ml-4 hover:text-gray-700">Like</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;