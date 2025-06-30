import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { User, Settings, Bell, Share2, HelpCircle, LogOut, Edit, MapPin, Calendar, Plus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTipsStore } from '../store/tipsStore';
import SocialTipCard from '../components/SocialTipCard';
import { supabase } from '../lib/supabase';
import { User as UserType } from '../types';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuthStore();
  const { tips, fetchTips } = useTipsStore();
  const [profileUser, setProfileUser] = useState<UserType | null>(null);
  const [userTips, setUserTips] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'tips' | 'saved' | 'about'>('tips');
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = !id || (user && id === user.id);
  const displayUser = isOwnProfile ? user : profileUser;

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      
      // Fetch tips if not already loaded
      if (tips.length === 0) {
        await fetchTips();
      }
      
      if (!isOwnProfile && id) {
        // Fetch user profile
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (!error && data) {
          setProfileUser({
            id: data.id,
            email: data.email,
            name: data.name,
            avatar: data.avatar_url,
            bio: data.bio,
            location: data.location,
            followersCount: data.followers_count,
            followingCount: data.following_count,
            tipsCount: data.tips_count,
            savedTipsCount: data.saved_tips_count,
          });
          
          // Check if current user is following this profile
          if (user) {
            const { data: followData } = await supabase
              .from('follows')
              .select('*')
              .eq('follower_id', user.id)
              .eq('following_id', id)
              .single();
            
            setIsFollowing(!!followData);
          }
        }
      }
      
      // Fetch user's tips
      const profileId = isOwnProfile ? user?.id : id;
      if (profileId) {
        const { data: tipsData } = await supabase
          .from('tips')
          .select('*, profiles(name, avatar_url)')
          .eq('user_id', profileId)
          .order('created_at', { ascending: false });
        
        if (tipsData) {
          setUserTips(tipsData);
        }
      }
      
      setIsLoading(false);
    };
    
    fetchProfileData();
  }, [id, user, isOwnProfile, fetchTips, tips.length]);

  const handleFollow = async () => {
    if (!user || !id) return;
    
    try {
      if (isFollowing) {
        // Unfollow
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', id);
        
        // Update follower count
        await supabase.rpc('decrement_followers_count', { profile_id: id });
        await supabase.rpc('decrement_following_count', { profile_id: user.id });
        
        if (profileUser) {
          setProfileUser({
            ...profileUser,
            followersCount: (profileUser.followersCount || 0) - 1
          });
        }
      } else {
        // Follow
        await supabase
          .from('follows')
          .insert([{ follower_id: user.id, following_id: id }]);
        
        // Update follower count
        await supabase.rpc('increment_followers_count', { profile_id: id });
        await supabase.rpc('increment_following_count', { profile_id: user.id });
        
        if (profileUser) {
          setProfileUser({
            ...profileUser,
            followersCount: (profileUser.followersCount || 0) + 1
          });
        }
      }
      
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    }
  };

  const handleShare = (id: string) => {
    alert(`Sharing tip ${id} via WhatsApp`);
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="pb-6">
        <Header title="Profile" />
        <div className="p-4 flex justify-center">
          <div className="animate-pulse flex flex-col items-center w-full">
            <div className="rounded-full bg-gray-200 h-20 w-20 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded w-full mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <Header title={isOwnProfile ? "Profile" : displayUser?.name || "Profile"} showBackButton={!isOwnProfile} />
      
      <div className="p-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="h-24 bg-gradient-to-r from-green-100 to-yellow-100"></div>
          <div className="px-4 pb-4 relative">
            <div className="flex justify-between">
              <div className="flex-1">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center -mt-10 border-4 border-white overflow-hidden">
                  {displayUser?.avatar ? (
                    <img src={displayUser.avatar} alt={displayUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="text-green-700" />
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mt-2">{displayUser?.name}</h2>
                {displayUser?.location && (
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin size={14} className="mr-1" />
                    {displayUser.location}
                  </p>
                )}
                {displayUser?.bio && (
                  <p className="text-sm text-gray-700 mt-2">{displayUser.bio}</p>
                )}
              </div>
              
              <div className="mt-2">
                {isOwnProfile ? (
                  <Link to="/edit-profile" className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Edit size={16} className="mr-1" />
                    Edit Profile
                  </Link>
                ) : (
                  <button 
                    onClick={handleFollow}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                      isFollowing 
                        ? 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex justify-around mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="font-bold text-gray-800">{displayUser?.tipsCount || 0}</p>
                <p className="text-xs text-gray-500">Tips</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-800">{displayUser?.followersCount || 0}</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-800">{displayUser?.followingCount || 0}</p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-800">{displayUser?.savedTipsCount || 0}</p>
                <p className="text-xs text-gray-500">Saved</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="flex border-b border-gray-100">
            <button 
              className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'tips' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('tips')}
            >
              Tips
            </button>
            <button 
              className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'saved' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('saved')}
            >
              Saved
            </button>
            <button 
              className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'about' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
          </div>
          
          {/* Tab content */}
          <div className="p-4">
            {activeTab === 'tips' && (
              <div>
                {isOwnProfile && (
                  <Link 
                    to="/create-tip" 
                    className="flex items-center justify-center p-4 mb-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-green-600 hover:border-green-500"
                  >
                    <Plus size={20} className="mr-2" />
                    <span>Create a new tip</span>
                  </Link>
                )}
                
                {userTips.length > 0 ? (
                  userTips.map((tip) => (
                    <SocialTipCard 
                      key={tip.id} 
                      tip={{
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
                        createdAt: new Date(tip.created_at).toLocaleDateString(),
                        likes: tip.likes_count || 0,
                        comments: tip.comments_count || 0,
                      }}
                      onShare={handleShare}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No tips yet</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'saved' && (
              <div>
                {isOwnProfile ? (
                  <>
                    {tips.filter(tip => tip.saved).length > 0 ? (
                      tips.filter(tip => tip.saved).map((tip) => (
                        <SocialTipCard 
                          key={tip.id} 
                          tip={tip}
                          onShare={handleShare}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No saved tips yet</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">This content is private</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'about' && (
              <div className="space-y-4">
                {displayUser?.bio && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Bio</h3>
                    <p className="text-gray-600">{displayUser.bio}</p>
                  </div>
                )}
                
                {displayUser?.location && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Location</h3>
                    <p className="text-gray-600 flex items-center">
                      <MapPin size={16} className="mr-1 text-gray-400" />
                      {displayUser.location}
                    </p>
                  </div>
                )}
                
                {user?.email && isOwnProfile && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Email</h3>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Member Since</h3>
                  <p className="text-gray-600 flex items-center">
                    <Calendar size={16} className="mr-1 text-gray-400" />
                    January 2023
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Settings and Logout (only for own profile) */}
        {isOwnProfile && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-800">Account</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              <Link to="/settings" className="w-full flex items-center p-4 hover:bg-gray-50">
                <Settings size={20} className="text-gray-500 mr-3" />
                <span className="text-gray-700">Settings</span>
              </Link>
              
              <Link to="/notifications" className="w-full flex items-center p-4 hover:bg-gray-50">
                <Bell size={20} className="text-gray-500 mr-3" />
                <span className="text-gray-700">Notifications</span>
              </Link>
              
              <button className="w-full flex items-center p-4 hover:bg-gray-50">
                <Share2 size={20} className="text-gray-500 mr-3" />
                <span className="text-gray-700">Share App</span>
              </button>
              
              <Link to="/help" className="w-full flex items-center p-4 hover:bg-gray-50">
                <HelpCircle size={20} className="text-gray-500 mr-3" />
                <span className="text-gray-700">Help & Support</span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center p-4 hover:bg-gray-50 text-red-500"
              >
                <LogOut size={20} className="mr-3" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
        
        <p className="text-center text-xs text-gray-500 mt-8">
          Swasti v1.0.0
        </p>
      </div>
    </div>
  );
};

export default Profile;