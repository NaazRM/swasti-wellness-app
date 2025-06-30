import React from 'react';
import { Zap, ShieldPlus, Baby, Flower, User, Brain } from 'lucide-react';
import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'digestion',
    name: 'Digestion & Gut Health',
    icon: <Zap size={24} className="text-amber-600" />
  },
  {
    id: 'immunity',
    name: 'Immunity Boosting',
    icon: <ShieldPlus size={24} className="text-green-600" />
  },
  {
    id: 'children',
    name: 'Children\'s Health',
    icon: <Baby size={24} className="text-blue-600" />
  },
  {
    id: 'skin',
    name: 'Skin Care & Beauty',
    icon: <Flower size={24} className="text-rose-600" />
  },
  {
    id: 'women',
    name: 'Women\'s Health',
    icon: <User size={24} className="text-purple-600" />
  },
  {
    id: 'mental',
    name: 'Mental Health',
    icon: <Brain size={24} className="text-indigo-600" />
  }
];