import React, { useState } from 'react';
import { Home, ChevronLeft, ChevronRight, Settings, HelpCircle, Menu, X, Save } from 'lucide-react';

const NavigationHeader = ({
  onBackToCasting,
  currentAct,
  currentScene,
  totalScenes,
  currentExercise,
  totalExercises,
  sceneName,
  exerciseName,
  onSceneSelect,
  onPreviousExercise,
  onNextExercise,
  canGoPrevious,
  canGoNext,
  unlockedScenes = [],
  onSettingsClick,
  onHelpClick,
  onShowCode,
  hasCode = false
}) => {
  const [showSceneMenu, setShowSceneMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSceneClick = (index) => {
    onSceneSelect(index);
    setShowSceneMenu(false);
  };

  return (
    <header className="bg-gradient-to-r from-backstage-blue/95 to-dressing-room/95 
                     backdrop-blur-sm border-b-2 border-marquee-gold/30 
                     shadow-lg fixed top-0 left-0 right-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Home and navigation */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Home button */}
            <button
              onClick={onBackToCasting}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
              title="Back to Casting Call"
              aria-label="Back to Casting Call"
            >
              <Home className="w-5 h-5 text-marquee-gold group-hover:scale-110 transition-transform" />
            </button>

            {/* Navigation arrows - Desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={onPreviousExercise}
                disabled={!canGoPrevious}
                className="p-2 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed 
                         rounded-lg transition-colors group"
                title="Previous Exercise (Ctrl+←)"
                aria-label="Previous Exercise"
              >
                <ChevronLeft className="w-5 h-5 text-marquee-gold group-hover:scale-110 
                                     transition-transform disabled:scale-100" />
              </button>

              <button
                onClick={onNextExercise}
                disabled={!canGoNext}
                className="p-2 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed 
                         rounded-lg transition-colors group"
                title="Next Exercise (Ctrl+→)"
                aria-label="Next Exercise"
              >
                <ChevronRight className="w-5 h-5 text-marquee-gold group-hover:scale-110 
                                      transition-transform disabled:scale-100" />
              </button>
            </div>
          </div>

          {/* Center - Scene info */}
          <div className="flex-1 text-center px-4">
            <div className="relative inline-block">
              <button
                onClick={() => setShowSceneMenu(!showSceneMenu)}
                className="text-spotlight-yellow hover:text-marquee-gold transition-colors"
              >
                <div className="text-xs text-marquee-gold/70 uppercase tracking-wider">
                  Act {currentAct} • Scene {currentScene}/{totalScenes}
                </div>
                <div className="text-sm font-semibold">
                  {sceneName} {exerciseName && `- ${exerciseName}`}
                </div>
                <div className="text-xs text-marquee-gold/60">
                  Exercise {currentExercise}/{totalExercises}
                </div>
              </button>

              {/* Scene dropdown */}
              {showSceneMenu && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 
                             bg-backstage-blue/95 backdrop-blur-sm rounded-lg 
                             border border-marquee-gold/30 shadow-xl py-2 
                             min-w-[200px] max-h-60 overflow-y-auto z-50">
                  {unlockedScenes.map((scene, index) => (
                    <button
                      key={index}
                      onClick={() => handleSceneClick(index)}
                      disabled={!scene.unlocked}
                      className="w-full text-left px-4 py-2 hover:bg-marquee-gold/20 
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-colors text-sm"
                    >
                      <span className="text-spotlight-yellow">
                        Scene {index + 1}: {scene.name}
                      </span>
                      {!scene.unlocked && (
                        <span className="text-xs text-gray-400 ml-2">🔒</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Settings and help */}
          <div className="flex items-center gap-2">
            {/* Desktop buttons */}
            <div className="hidden sm:flex gap-2">
              {hasCode && (
                <button
                  onClick={onShowCode}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                  title="Show Continuation Code"
                  aria-label="Show Continuation Code"
                >
                  <Save className="w-5 h-5 text-marquee-gold group-hover:scale-110 transition-transform" />
                </button>
              )}
              
              <button
                onClick={onHelpClick}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                title="Help (Ctrl+H)"
                aria-label="Help"
              >
                <HelpCircle className="w-5 h-5 text-marquee-gold group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={onSettingsClick}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                title="Settings (Ctrl+S)"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 text-marquee-gold group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? 
                <X className="w-5 h-5 text-marquee-gold" /> : 
                <Menu className="w-5 h-5 text-marquee-gold" />
              }
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-marquee-gold/30">
            <div className="flex flex-col gap-2">
              {/* Navigation arrows */}
              <div className="flex gap-2">
                <button
                  onClick={onPreviousExercise}
                  disabled={!canGoPrevious}
                  className="flex-1 px-4 py-2 bg-marquee-gold/20 hover:bg-marquee-gold/30 
                           disabled:opacity-50 disabled:cursor-not-allowed 
                           rounded-lg transition-colors text-spotlight-yellow"
                >
                  <ChevronLeft className="w-4 h-4 inline mr-2" />
                  Previous
                </button>

                <button
                  onClick={onNextExercise}
                  disabled={!canGoNext}
                  className="flex-1 px-4 py-2 bg-marquee-gold/20 hover:bg-marquee-gold/30 
                           disabled:opacity-50 disabled:cursor-not-allowed 
                           rounded-lg transition-colors text-spotlight-yellow"
                >
                  Next
                  <ChevronRight className="w-4 h-4 inline ml-2" />
                </button>
              </div>

              {/* Help and Settings */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onHelpClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 px-4 py-2 bg-marquee-gold/20 hover:bg-marquee-gold/30 
                           rounded-lg transition-colors text-spotlight-yellow"
                >
                  <HelpCircle className="w-4 h-4 inline mr-2" />
                  Help
                </button>

                <button
                  onClick={() => {
                    onSettingsClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 px-4 py-2 bg-marquee-gold/20 hover:bg-marquee-gold/30 
                           rounded-lg transition-colors text-spotlight-yellow"
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavigationHeader;
