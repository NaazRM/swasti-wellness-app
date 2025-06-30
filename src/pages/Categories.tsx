import React from 'react';
import Header from '../components/Header';
import CategoryCard from '../components/CategoryCard';
import { categories } from '../data/categories';

const Categories: React.FC = () => {
  return (
    <div className="pb-6">
      <Header title="Categories" />
      
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Browse by Category</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;