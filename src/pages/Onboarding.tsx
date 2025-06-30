import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flower, ArrowRight } from 'lucide-react';

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  
  const steps = [
    {
      title: "Welcome to Swasti",
      description: "Your daily companion for traditional wellness wisdom, tailored for Indian mothers.",
      image: "https://images.pexels.com/photos/7282818/pexels-photo-7282818.jpeg"
    },
    {
      title: "Discover Daily Wellness",
      description: "Get a new health tip every day based on traditional Ayurvedic wisdom.",
      image: "https://images.pexels.com/photos/8364026/pexels-photo-8364026.jpeg"
    },
    {
      title: "Save Your Favorites",
      description: "Swipe right to save tips you love, or left to skip. All tips are saved to your history.",
      image: "https://images.pexels.com/photos/4473870/pexels-photo-4473870.jpeg"
    },
    {
      title: "Share with Family",
      description: "Easily share tips with your loved ones via WhatsApp with just one tap.",
      image: "https://images.pexels.com/photos/7439145/pexels-photo-7439145.jpeg"
    }
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/');
    }
  };
  
  const handleSkip = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="flex items-center mb-8">
          <Flower className="text-yellow-500 mr-2" size={32} />
          <span className="font-bold text-2xl text-green-700">Swasti</span>
        </div>
        
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
            <img 
              src={steps[currentStep].image} 
              alt={steps[currentStep].title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600">
                {steps[currentStep].description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            {currentStep < steps.length - 1 && (
              <button 
                onClick={handleSkip}
                className="text-gray-500 text-sm"
              >
                Skip
              </button>
            )}
          </div>
          
          <button 
            onClick={handleNext}
            className="w-full bg-green-600 text-white py-3 rounded-xl flex items-center justify-center"
          >
            {currentStep < steps.length - 1 ? (
              <>
                Next
                <ArrowRight size={18} className="ml-2" />
              </>
            ) : (
              'Get Started'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;