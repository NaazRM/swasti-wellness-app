import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import TipCard from '../components/TipCard';
import { tips } from '../data/tips';
import { categories } from '../data/categories';

const CategoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [savedTips, setSavedTips] = useState<string[]>([]);
  
  const category = categories.find(cat => cat.id === id);
  const categoryTips = tips.filter(tip => tip.category === category?.name);
  
  const handleSaveTip = (id: string) => {
    if (savedTips.includes(id)) {
      setSavedTips(savedTips.filter(tipId => tipId !== id));
    } else {
      setSavedTips([...savedTips, id]);
    }
  };
  
  const handleShareTip = (id: string) => {
    alert(`Sharing tip ${id} via WhatsApp`);
  };
  
  if (!category) {
    return (
      <div>
        <Header showBackButton title="Category Not Found" />
        <div className="p-4">
          <p>The category you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pb-6">
      <Header showBackButton title={category.name} />
      
      <div className="p-4">
        <div className={`p-4 rounded-xl mb-4 ${
          category.id === 'digestion' ? 'bg-amber-50' : 
          category.id === 'immunity' ? 'bg-green-50' : 
          category.id === 'children' ? 'bg-blue-50' : 
          category.id === 'skin' ? 'bg-rose-50' : 
          category.id === 'women' ? 'bg-purple-50' : 
          category.id === 'mental' ? 'bg-indigo-50' : 'bg-yellow-50'
        }`}>
          <div className="flex items-center">
            <div className={`${
              category.id === 'digestion' ? 'bg-amber-100' : 
              category.id === 'immunity' ? 'bg-green-100' : 
              category.id === 'children' ? 'bg-blue-100' : 
              category.id === 'skin' ? 'bg-rose-100' : 
              category.id === 'women' ? 'bg-purple-100' : 
              category.id === 'mental' ? 'bg-indigo-100' : 'bg-yellow-100'
            } w-12 h-12 rounded-full flex items-center justify-center mr-4`}>
              {category.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{category.name}</h2>
              <p className="text-sm text-gray-600">{categoryTips.length} tips</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {categoryTips.map(tip => (
            <TipCard 
              key={tip.id}
              tip={{...tip, saved: savedTips.includes(tip.id)}}
              onSave={handleSaveTip}
              onShare={handleShareTip}
            />
          ))}
        </div>
        
        {categoryTips.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No tips found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;