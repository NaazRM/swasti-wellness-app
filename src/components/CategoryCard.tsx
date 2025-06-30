import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link 
      to={`/categories/${category.id}`}
      className={`p-4 rounded-xl text-center hover:shadow-md transition-shadow ${
        category.id === 'digestion' ? 'bg-amber-50' : 
        category.id === 'immunity' ? 'bg-green-50' : 
        category.id === 'children' ? 'bg-blue-50' : 
        category.id === 'skin' ? 'bg-rose-50' : 
        category.id === 'women' ? 'bg-purple-50' : 
        category.id === 'mental' ? 'bg-indigo-50' : 'bg-yellow-50'
      }`}
    >
      <div className={`${
        category.id === 'digestion' ? 'bg-amber-100' : 
        category.id === 'immunity' ? 'bg-green-100' : 
        category.id === 'children' ? 'bg-blue-100' : 
        category.id === 'skin' ? 'bg-rose-100' : 
        category.id === 'women' ? 'bg-purple-100' : 
        category.id === 'mental' ? 'bg-indigo-100' : 'bg-yellow-100'
      } w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}>
        {category.icon}
      </div>
      <p className={`text-sm font-medium ${
        category.id === 'digestion' ? 'text-amber-700' : 
        category.id === 'immunity' ? 'text-green-700' : 
        category.id === 'children' ? 'text-blue-700' : 
        category.id === 'skin' ? 'text-rose-700' : 
        category.id === 'women' ? 'text-purple-700' : 
        category.id === 'mental' ? 'text-indigo-700' : 'text-yellow-700'
      }`}>{category.name}</p>
    </Link>
  );
};

export default CategoryCard;