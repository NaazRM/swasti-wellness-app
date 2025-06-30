import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Tip, Comment } from '../types';
import { format } from 'date-fns';

interface TipsState {
  tips: Tip[];
  savedTips: Tip[];
  feedTips: Tip[];
  popularTips: Tip[];
  currentTip: Tip | null;
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  
  fetchTips: () => Promise<void>;
  fetchFeedTips: () => Promise<void>;
  fetchPopularTips: () => Promise<void>;
  fetchTipById: (id: string) => Promise<void>;
  fetchSavedTips: () => Promise<void>;
  saveTip: (tipId: string) => Promise<void>;
  unsaveTip: (tipId: string) => Promise<void>;
  likeTip: (tipId: string) => Promise<void>;
  unlikeTip: (tipId: string) => Promise<void>;
  fetchComments: (tipId: string) => Promise<void>;
  addComment: (tipId: string, content: string) => Promise<void>;
  createTip: (tip: Partial<Tip>) => Promise<void>;
}

export const useTipsStore = create<TipsState>((set, get) => ({
  tips: [],
  savedTips: [],
  feedTips: [],
  popularTips: [],
  currentTip: null,
  comments: [],
  isLoading: false,
  error: null,

  fetchTips: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('tips')
        .select('*, profiles(name, avatar_url)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get current user's saved tips to mark which ones are saved
      const { data: userData } = await supabase.auth.getUser();
      let savedTipIds: string[] = [];
      
      if (userData.user) {
        const { data: savedData } = await supabase
          .from('saved_tips')
          .select('tip_id')
          .eq('user_id', userData.user.id);
        
        savedTipIds = savedData?.map(item => item.tip_id) || [];
      }

      // Get likes for each tip
      const { data: likesData } = await supabase
        .from('likes')
        .select('tip_id, user_id');
      
      const likesByTip = likesData?.reduce((acc: Record<string, string[]>, like) => {
        if (!acc[like.tip_id]) acc[like.tip_id] = [];
        acc[like.tip_id].push(like.user_id);
        return acc;
      }, {}) || {};

      const formattedTips = data?.map(tip => ({
        id: tip.id,
        title: tip.title,
        description: tip.description,
        category: tip.category,
        benefits: tip.benefits,
        ingredients: tip.ingredients,
        steps: tip.steps,
        authorId: tip.user_id,
        authorName: tip.profiles?.name || 'Anonymous',
        authorAvatar: tip.profiles?.avatar_url,
        createdAt: format(new Date(tip.created_at), 'MMM d, yyyy'),
        saved: savedTipIds.includes(tip.id),
        likes: likesByTip[tip.id]?.length || 0,
        isLiked: userData.user ? likesByTip[tip.id]?.includes(userData.user.id) || false : false,
        comments: tip.comments_count || 0,
      })) || [];

      set({ tips: formattedTips, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchFeedTips: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        // If not logged in, just show recent tips
        const { data, error } = await supabase
          .from('tips')
          .select('*, profiles(name, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        
        const formattedTips = data?.map(tip => ({
          id: tip.id,
          title: tip.title,
          description: tip.description,
          category: tip.category,
          benefits: tip.benefits,
          ingredients: tip.ingredients,
          steps: tip.steps,
          authorId: tip.user_id,
          authorName: tip.profiles?.name || 'Anonymous',
          authorAvatar: tip.profiles?.avatar_url,
          createdAt: format(new Date(tip.created_at), 'MMM d, yyyy'),
          likes: tip.likes_count || 0,
          comments: tip.comments_count || 0,
        })) || [];

        set({ feedTips: formattedTips, isLoading: false });
        return;
      }

      // Get tips from users the current user follows
      const { data: followingData } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', userData.user.id);
      
      const followingIds = followingData?.map(item => item.following_id) || [];
      
      // Include the user's own ID to see their own posts
      followingIds.push(userData.user.id);
      
      // Get tips from followed users
      const { data, error } = await supabase
        .from('tips')
        .select('*, profiles(name, avatar_url)')
        .in('user_id', followingIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user's saved tips
      const { data: savedData } = await supabase
        .from('saved_tips')
        .select('tip_id')
        .eq('user_id', userData.user.id);
      
      const savedTipIds = savedData?.map(item => item.tip_id) || [];

      // Get likes for each tip
      const { data: likesData } = await supabase
        .from('likes')
        .select('tip_id, user_id');
      
      const likesByTip = likesData?.reduce((acc: Record<string, string[]>, like) => {
        if (!acc[like.tip_id]) acc[like.tip_id] = [];
        acc[like.tip_id].push(like.user_id);
        return acc;
      }, {}) || {};

      const formattedTips = data?.map(tip => ({
        id: tip.id,
        title: tip.title,
        description: tip.description,
        category: tip.category,
        benefits: tip.benefits,
        ingredients: tip.ingredients,
        steps: tip.steps,
        authorId: tip.user_id,
        authorName: tip.profiles?.name || 'Anonymous',
        authorAvatar: tip.profiles?.avatar_url,
        createdAt: format(new Date(tip.created_at), 'MMM d, yyyy'),
        saved: savedTipIds.includes(tip.id),
        likes: likesByTip[tip.id]?.length || 0,
        isLiked: likesByTip[tip.id]?.includes(userData.user.id) || false,
        comments: tip.comments_count || 0,
      })) || [];

      set({ feedTips: formattedTips, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchPopularTips: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('tips')
        .select('*, profiles(name, avatar_url)')
        .order('likes_count', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Get current user's saved tips
      const { data: userData } = await supabase.auth.getUser();
      let savedTipIds: string[] = [];
      
      if (userData.user) {
        const { data: savedData } = await supabase
          .from('saved_tips')
          .select('tip_id')
          .eq('user_id', userData.user.id);
        
        savedTipIds = savedData?.map(item => item.tip_id) || [];
      }

      // Get likes for each tip
      const { data: likesData } = await supabase
        .from('likes')
        .select('tip_id, user_id');
      
      const likesByTip = likesData?.reduce((acc: Record<string, string[]>, like) => {
        if (!acc[like.tip_id]) acc[like.tip_id] = [];
        acc[like.tip_id].push(like.user_id);
        return acc;
      }, {}) || {};

      const formattedTips = data?.map(tip => ({
        id: tip.id,
        title: tip.title,
        description: tip.description,
        category: tip.category,
        benefits: tip.benefits,
        ingredients: tip.ingredients,
        steps: tip.steps,
        authorId: tip.user_id,
        authorName: tip.profiles?.name || 'Anonymous',
        authorAvatar: tip.profiles?.avatar_url,
        createdAt: format(new Date(tip.created_at), 'MMM d, yyyy'),
        saved: savedTipIds.includes(tip.id),
        likes: likesByTip[tip.id]?.length || 0,
        isLiked: userData.user ? likesByTip[tip.id]?.includes(userData.user.id) || false : false,
        comments: tip.comments_count || 0,
      })) || [];

      set({ popularTips: formattedTips, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchTipById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('tips')
        .select('*, profiles(name, avatar_url)')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Get current user's saved tips
      const { data: userData } = await supabase.auth.getUser();
      let isSaved = false;
      let isLiked = false;
      
      if (userData.user) {
        const { data: savedData } = await supabase
          .from('saved_tips')
          .select('*')
          .eq('user_id', userData.user.id)
          .eq('tip_id', id)
          .single();
        
        isSaved = !!savedData;

        const { data: likedData } = await supabase
          .from('likes')
          .select('*')
          .eq('user_id', userData.user.id)
          .eq('tip_id', id)
          .single();
        
        isLiked = !!likedData;
      }

      // Get likes count
      const { count: likesCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('tip_id', id);

      // Get comments count
      const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('tip_id', id);

      const formattedTip = {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        benefits: data.benefits,
        ingredients: data.ingredients,
        steps: data.steps,
        authorId: data.user_id,
        authorName: data.profiles?.name || 'Anonymous',
        authorAvatar: data.profiles?.avatar_url,
        createdAt: format(new Date(data.created_at), 'MMM d, yyyy'),
        saved: isSaved,
        likes: likesCount || 0,
        isLiked,
        comments: commentsCount || 0,
      };

      set({ currentTip: formattedTip, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchSavedTips: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        set({ savedTips: [], isLoading: false });
        return;
      }

      const { data, error } = await supabase
        .from('saved_tips')
        .select('tip_id, tips(*, profiles(name, avatar_url))')
        .eq('user_id', userData.user.id);

      if (error) throw error;

      // Get likes for each tip
      const { data: likesData } = await supabase
        .from('likes')
        .select('tip_id, user_id');
      
      const likesByTip = likesData?.reduce((acc: Record<string, string[]>, like) => {
        if (!acc[like.tip_id]) acc[like.tip_id] = [];
        acc[like.tip_id].push(like.user_id);
        return acc;
      }, {}) || {};

      const formattedTips = data?.map(item => {
        const tip = item.tips;
        return {
          id: tip.id,
          title: tip.title,
          description: tip.description,
          category: tip.category,
          benefits: tip.benefits,
          ingredients: tip.ingredients,
          steps: tip.steps,
          authorId: tip.user_id,
          authorName: tip.profiles?.name || 'Anonymous',
          authorAvatar: tip.profiles?.avatar_url,
          createdAt: format(new Date(tip.created_at), 'MMM d, yyyy'),
          saved: true,
          likes: likesByTip[tip.id]?.length || 0,
          isLiked: likesByTip[tip.id]?.includes(userData.user.id) || false,
          comments: tip.comments_count || 0,
        };
      }) || [];

      set({ savedTips: formattedTips, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  saveTip: async (tipId) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('saved_tips')
        .insert([
          { user_id: userData.user.id, tip_id: tipId }
        ]);

      if (error) throw error;

      // Update local state
      const { tips, savedTips, feedTips, popularTips, currentTip } = get();
      
      set({
        tips: tips.map(tip => 
          tip.id === tipId ? { ...tip, saved: true } : tip
        ),
        savedTips: [...savedTips, tips.find(tip => tip.id === tipId) || {}] as Tip[],
        feedTips: feedTips.map(tip => 
          tip.id === tipId ? { ...tip, saved: true } : tip
        ),
        popularTips: popularTips.map(tip => 
          tip.id === tipId ? { ...tip, saved: true } : tip
        ),
        currentTip: currentTip?.id === tipId ? { ...currentTip, saved: true } : currentTip,
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  unsaveTip: async (tipId) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('saved_tips')
        .delete()
        .eq('user_id', userData.user.id)
        .eq('tip_id', tipId);

      if (error) throw error;

      // Update local state
      const { tips, savedTips, feedTips, popularTips, currentTip } = get();
      
      set({
        tips: tips.map(tip => 
          tip.id === tipId ? { ...tip, saved: false } : tip
        ),
        savedTips: savedTips.filter(tip => tip.id !== tipId),
        feedTips: feedTips.map(tip => 
          tip.id === tipId ? { ...tip, saved: false } : tip
        ),
        popularTips: popularTips.map(tip => 
          tip.id === tipId ? { ...tip, saved: false } : tip
        ),
        currentTip: currentTip?.id === tipId ? { ...currentTip, saved: false } : currentTip,
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  likeTip: async (tipId) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('likes')
        .insert([
          { user_id: userData.user.id, tip_id: tipId }
        ]);

      if (error) throw error;

      // Update likes_count in tips table
      await supabase.rpc('increment_likes', { tip_id: tipId });

      // Update local state
      const { tips, savedTips, feedTips, popularTips, currentTip } = get();
      
      set({
        tips: tips.map(tip => 
          tip.id === tipId ? { ...tip, likes: (tip.likes || 0) + 1, isLiked: true } : tip
        ),
        savedTips: savedTips.map(tip => 
          tip.id === tipId ? { ...tip, likes: (tip.likes || 0) + 1, isLiked: true } : tip
        ),
        feedTips: feedTips.map(tip => 
          tip.id === tipId ? { ...tip, likes: (tip.likes || 0) + 1, isLiked: true } : tip
        ),
        popularTips: popularTips.map(tip => 
          tip.id === tipId ? { ...tip, likes: (tip.likes || 0) + 1, isLiked: true } : tip
        ),
        currentTip: currentTip?.id === tipId 
          ? { ...currentTip, likes: (currentTip.likes || 0) + 1, isLiked: true } 
          : currentTip,
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  unlikeTip: async (tipId) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', userData.user.id)
        .eq('tip_id', tipId);

      if (error) throw error;

      // Update likes_count in tips table
      await supabase.rpc('decrement_likes', { tip_id: tipId });

      // Update local state
      const { tips, savedTips, feedTips, popularTips, currentTip } = get();
      
      set({
        tips: tips.map(tip => 
          tip.id === tipId ? { ...tip, likes: Math.max(0, (tip.likes || 0) - 1), isLiked: false } : tip
        ),
        savedTips: savedTips.map(tip => 
          tip.id === tipId ? { ...tip, likes: Math.max(0, (tip.likes || 0) - 1), isLiked: false } : tip
        ),
        feedTips: feedTips.map(tip => 
          tip.id === tipId ? { ...tip, likes: Math.max(0, (tip.likes || 0) - 1), isLiked: false } : tip
        ),
        popularTips: popularTips.map(tip => 
          tip.id === tipId ? { ...tip, likes: Math.max(0, (tip.likes || 0) - 1), isLiked: false } : tip
        ),
        currentTip: currentTip?.id === tipId 
          ? { ...currentTip, likes: Math.max(0, (currentTip.likes || 0) - 1), isLiked: false } 
          : currentTip,
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  fetchComments: async (tipId) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('comments')
        .select('*, profiles(name, avatar_url)')
        .eq('tip_id', tipId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedComments = data?.map(comment => ({
        id: comment.id,
        tipId: comment.tip_id,
        userId: comment.user_id,
        userName: comment.profiles?.name || 'Anonymous',
        userAvatar: comment.profiles?.avatar_url,
        content: comment.content,
        createdAt: format(new Date(comment.created_at), 'MMM d, yyyy h:mm a'),
      })) || [];

      set({ comments: formattedComments, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addComment: async (tipId, content) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('comments')
        .insert([
          { 
            tip_id: tipId, 
            user_id: userData.user.id, 
            content 
          }
        ])
        .select('*, profiles(name, avatar_url)')
        .single();

      if (error) throw error;

      // Update comments_count in tips table
      await supabase.rpc('increment_comments', { tip_id: tipId });

      // Get the new comment with user data
      const newComment = {
        id: data.id,
        tipId: data.tip_id,
        userId: data.user_id,
        userName: data.profiles?.name || 'Anonymous',
        userAvatar: data.profiles?.avatar_url,
        content: data.content,
        createdAt: format(new Date(data.created_at), 'MMM d, yyyy h:mm a'),
      };

      // Update local state
      const { comments, currentTip, tips, savedTips, feedTips, popularTips } = get();
      
      set({
        comments: [newComment, ...comments],
        currentTip: currentTip?.id === tipId 
          ? { ...currentTip, comments: (currentTip.comments || 0) + 1 } 
          : currentTip,
        tips: tips.map(tip => 
          tip.id === tipId ? { ...tip, comments: (tip.comments || 0) + 1 } : tip
        ),
        savedTips: savedTips.map(tip => 
          tip.id === tipId ? { ...tip, comments: (tip.comments || 0) + 1 } : tip
        ),
        feedTips: feedTips.map(tip => 
          tip.id === tipId ? { ...tip, comments: (tip.comments || 0) + 1 } : tip
        ),
        popularTips: popularTips.map(tip => 
          tip.id === tipId ? { ...tip, comments: (tip.comments || 0) + 1 } : tip
        ),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createTip: async (tip) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('tips')
        .insert([
          { 
            title: tip.title,
            description: tip.description,
            category: tip.category,
            benefits: tip.benefits,
            ingredients: tip.ingredients,
            steps: tip.steps,
            user_id: userData.user.id,
            likes_count: 0,
            comments_count: 0,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Update tips_count in profiles table
      await supabase.rpc('increment_tips_count', { user_id: userData.user.id });

      // Update local state
      const { tips, feedTips } = get();
      
      const newTip = {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        benefits: data.benefits,
        ingredients: data.ingredients,
        steps: data.steps,
        authorId: userData.user.id,
        authorName: userData.user.name || 'Anonymous',
        authorAvatar: userData.user.avatar,
        createdAt: format(new Date(data.created_at), 'MMM d, yyyy'),
        saved: false,
        likes: 0,
        isLiked: false,
        comments: 0,
      };

      set({
        tips: [newTip, ...tips],
        feedTips: [newTip, ...feedTips],
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));