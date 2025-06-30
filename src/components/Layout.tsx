import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 pb-32">
        <Outlet />
      </main>
      
      {/* Built with Bolt.new attribution - positioned above bottom nav with higher z-index */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-100 py-2 px-4 z-40">
        <p className="text-center text-xs text-gray-500">
          Built with{' '}
          <a 
            href="https://bolt.new" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            Bolt.new
          </a>
        </p>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Layout;