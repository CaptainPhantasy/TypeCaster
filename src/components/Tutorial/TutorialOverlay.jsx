import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TutorialOverlay = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if tutorial has been seen before
    const tutorialSeen = localStorage.getItem('typeCastingTutorialSeen');
    if (!tutorialSeen) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('typeCastingTutorialSeen', 'true');
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[9998] animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-900/98 to-slate-800/98 
                    backdrop-blur-lg rounded-2xl border-2 border-yellow-400/40 
                    p-8 max-w-2xl mx-4 relative shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 
                   rounded-full transition-all duration-200 group"
          aria-label="Close tutorial"
        >
          <X className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎭</div>
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">Welcome to TypeCasting!</h2>
          <div className="w-32 h-1 bg-yellow-400/50 mx-auto rounded-full"></div>
          <p className="text-slate-300 mt-4 text-lg">Master the art of theatrical typing</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Instruction 1 */}
          <div className="bg-black/20 rounded-xl p-5 border border-yellow-400/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center">
                <span className="text-yellow-400 font-bold">1</span>
              </div>
              <h3 className="font-bold text-yellow-300 text-lg">Type the Script</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Follow the golden text exactly as it appears. Watch your characters light up as you type correctly.
            </p>
          </div>

          {/* Instruction 2 */}
          <div className="bg-black/20 rounded-xl p-5 border border-yellow-400/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center">
                <span className="text-yellow-400 font-bold">2</span>
              </div>
              <h3 className="font-bold text-yellow-300 text-lg">Watch Performance</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              <span className="text-green-400 font-semibold">Green</span> = Perfect! • 
              <span className="text-red-400 font-semibold ml-2">Red</span> = Needs work
            </p>
          </div>

          {/* Instruction 3 */}
          <div className="bg-black/20 rounded-xl p-5 border border-yellow-400/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center">
                <span className="text-yellow-400 font-bold">3</span>
              </div>
              <h3 className="font-bold text-yellow-300 text-lg">Need the Prompt?</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Double-tap <kbd className="px-2 py-1 bg-black/40 border border-yellow-400/30 rounded text-xs mx-1 text-yellow-300">SPACE</kbd> 
              to reveal stage directions
            </p>
          </div>

          {/* Instruction 4 */}
          <div className="bg-black/20 rounded-xl p-5 border border-yellow-400/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center">
                <span className="text-yellow-400 font-bold">4</span>
              </div>
              <h3 className="font-bold text-yellow-300 text-lg">Navigation</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Press <kbd className="px-2 py-1 bg-black/40 border border-yellow-400/30 rounded text-xs mx-1 text-yellow-300">ESC</kbd> 
              for menu • Use header to switch scenes
            </p>
          </div>
        </div>

        {/* Pro Tips section */}
        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-5 border border-purple-400/20 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">✨</span>
            <h4 className="font-bold text-purple-300 text-lg">Pro Director's Notes</h4>
          </div>
          <ul className="text-slate-300 text-sm space-y-2 leading-relaxed">
            <li>• <span className="text-yellow-400 font-semibold">Accuracy over speed</span> - Perfect performances get standing ovations!</li>
            <li>• <span className="text-green-400 font-semibold">Keyboard will fade</span> - Build muscle memory as you master each key</li>
            <li>• <span className="text-blue-400 font-semibold">Progress auto-saves</span> - Your theatrical journey is preserved</li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleDismiss}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-400 
                     text-black font-bold rounded-xl hover:from-yellow-400 hover:to-yellow-300 
                     transition-all duration-200 text-lg shadow-lg"
          >
            🎭 Start My Performance!
          </button>
          <button
            onClick={handleDismiss}
            className="px-6 py-4 bg-black/40 border border-yellow-400/30 
                     text-yellow-300 font-semibold rounded-xl hover:bg-black/60 
                     transition-all duration-200"
          >
            Skip Tutorial
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;