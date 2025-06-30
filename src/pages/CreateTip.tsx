import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { categories } from '../data/categories';
import { useTipsStore } from '../store/tipsStore';
import { X, Plus } from 'lucide-react';

const CreateTip: React.FC = () => {
  const navigate = useNavigate();
  const { createTip, isLoading, error } = useTipsStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [benefits, setBenefits] = useState<string[]>(['']);
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  
  const handleAddBenefit = () => {
    setBenefits([...benefits, '']);
  };
  
  const handleRemoveBenefit = (index: number) => {
    const newBenefits = [...benefits];
    newBenefits.splice(index, 1);
    setBenefits(newBenefits);
  };
  
  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };
  
  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };
  
  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };
  
  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };
  
  const handleAddStep = () => {
    setSteps([...steps, '']);
  };
  
  const handleRemoveStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };
  
  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty values
    const filteredBenefits = benefits.filter(b => b.trim() !== '');
    const filteredIngredients = ingredients.filter(i => i.trim() !== '');
    const filteredSteps = steps.filter(s => s.trim() !== '');
    
    await createTip({
      title,
      description,
      category,
      benefits: filteredBenefits,
      ingredients: filteredIngredients.length > 0 ? filteredIngredients : undefined,
      steps: filteredSteps.length > 0 ? filteredSteps : undefined,
    });
    
    if (!error) {
      navigate('/profile');
    }
  };
  
  return (
    <div className="pb-16">
      <Header title="Create Tip" showBackButton />
      
      <div className="p-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter a title for your tip"
              required
            />
          </div>
          
          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe your tip in detail"
              rows={3}
              required
            />
          </div>
          
          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Benefits */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Benefits
            </label>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleBenefitChange(index, e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={`Benefit ${index + 1}`}
                  required={index === 0}
                />
                {benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveBenefit(index)}
                    className="ml-2 p-2 text-gray-400 hover:text-red-500"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddBenefit}
              className="flex items-center text-green-600 mt-2"
            >
              <Plus size={16} className="mr-1" />
              Add Benefit
            </button>
          </div>
          
          {/* Ingredients */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingredients (Optional)
            </label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={`Ingredient ${index + 1}`}
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="ml-2 p-2 text-gray-400 hover:text-red-500"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddIngredient}
              className="flex items-center text-green-600 mt-2"
            >
              <Plus size={16} className="mr-1" />
              Add Ingredient
            </button>
          </div>
          
          {/* Steps */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Steps (Optional)
            </label>
            {steps.map((step, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={`Step ${index + 1}`}
                />
                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(index)}
                    className="ml-2 p-2 text-gray-400 hover:text-red-500"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddStep}
              className="flex items-center text-green-600 mt-2"
            >
              <Plus size={16} className="mr-1" />
              Add Step
            </button>
          </div>
          
          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center font-medium hover:bg-green-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Tip'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTip;