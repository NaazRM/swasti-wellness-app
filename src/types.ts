import { ReactNode } from 'react';

export interface Tip {
  id: string;
  title: string;
  description: string;
  category: string;
  saved?: boolean;
  benefits: string[];
  ingredients?: string[];
  steps?: string[];
  authorId?: string;
  authorName?: string;
  authorAvatar?: string;
  createdAt?: string;
  likes?: number;
  comments?: number;
  isLiked?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: ReactNode;
}

export interface Comment {
  id: string;
  tipId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
  followersCount?: number;
  followingCount?: number;
  tipsCount?: number;
  savedTipsCount?: number;
  isFollowing?: boolean;
}