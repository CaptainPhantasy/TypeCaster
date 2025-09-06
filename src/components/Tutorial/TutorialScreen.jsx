import React, { useState, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

const TutorialScreen = ({ isFirstTime = false, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: "Welcome to Type Casting!",
      content: "Learn touch typing through theatrical performance.",
      visual: "🎭"
    },
    {
      title: "Follow the Golden Text",
      content: "Type the text shown in gold above. Green means correct, red means mistake.",
      visual: "✨"
    },
    {
      title: "Stage Directions (Virtual Keyboard)",
      content: "The keyboard below shows which fingers to use. It fades as you improve!",
      visual: "⌨️"
    },
    {
      title: "Panic Mode",
      content: "Double-tap SPACE anytime to reveal the full keyboard guide.",
      visual: "🆘"
    },
    {
      title: "Keyboard Shortcuts",
      content: "ESC: Menu | Ctrl+R: Reset | Ctrl+S: Settings | Ctrl+H: Help",
      visual: "⚡"
    }
  ];

  useEffect(() => {
    if (isFirstTime && !localStorage.getItem('tutorialCompleted')) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFirstTime]);

  const handleComplete = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    onClose();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[200]">
      <div className="bg-gradient-to-b from-backstage-blue to-dressing-room 
                    border-2 border-yellow-400 rounded-lg p-8 max-w-lg w-full mx-4">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-yellow-400 font-bold">
            {steps[currentStep].title}
          </h2>
          <button 
            onClick={handleSkip}
            className="text-gray-400 hover:text-white transition"
            aria-label="Close tutorial"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-6xl text-center mb-6 animate-pulse">
          {steps[currentStep].visual}
        </div>

        <p className="text-white text-lg mb-8 text-center">
          {steps[currentStep].content}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div 
                key={idx}
                className={`h-2 w-8 rounded-full transition ${
                  idx === currentStep ? 'bg-yellow-400' : 
                  idx < currentStep ? 'bg-yellow-400/50' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {isFirstTime && (
              <button 
                onClick={handleSkip}
                className="px-4 py-2 text-gray-400 hover:text-white transition"
              >
                Skip
              </button>
            )}
            <button 
              onClick={handleNext}
              className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 
                       text-black font-bold rounded transition"
            >
              {currentStep === steps.length - 1 ? "Let's Begin!" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialScreen;