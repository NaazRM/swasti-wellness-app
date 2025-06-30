import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Grid, Heart, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-green-700' : 'text-gray-500'}`
          }
          end
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </NavLink>
        
        <NavLink 
          to="/discover" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-green-700' : 'text-gray-500'}`
          }
        >
          <Search size={20} />
          <span className="text-xs mt-1">Discover</span>
        </NavLink>
        
        <NavLink 
          to="/categories" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-green-700' : 'text-gray-500'}`
          }
        >
          <Grid size={20} />
          <span className="text-xs mt-1">Categories</span>
        </NavLink>
        
        <NavLink 
          to="/saved" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-green-700' : 'text-gray-500'}`
          }
        >
          <Heart size={20} />
          <span className="text-xs mt-1">Saved</span>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-green-700' : 'text-gray-500'}`
          }
        >
          <User size={20} />
          <span className="text-xs mt-1">Profile</span>
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNavigation;