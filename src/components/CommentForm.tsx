import React, { useState } from 'react';
import { useTipsStore } from '../store/tipsStore';

interface CommentFormProps {
  tipId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ tipId }) => {
  const [comment, setComment] = useState('');
  const { addComment, isLoading } = useTipsStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    await addComment(tipId, comment);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
      <div className="flex items-start">
        <div className="flex-1">
          <textarea
            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Add a comment..."
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isLoading}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              disabled={!comment.trim() || isLoading}
            >
              {isLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;