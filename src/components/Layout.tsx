import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <BottomNavigation />
      <footer>
        <p className="text-center py-4 text-gray-500 text-sm">
          Built with <a href="https://bolt.new" className="text-primary-600 hover:text-primary-700 underline">Bolt.new</a>
        </p>
      </footer>
    </div>
  );
};

export default Layout;