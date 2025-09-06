import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTheatre } from '../../contexts/TheatreContext';
import Curtains from './Curtains';
import CelebrationEffects from './CelebrationEffects';

const MainStage = ({ 
  currentScript = "The quick brown fox jumps over the lazy dog",
  onSceneComplete,
  onLineForgotten,
  sceneInfo = {},
  isPaused = false,
  onPauseToggle
}) => {
  const { state, actions } = useTheatre();
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistakes, setMistakes] = useState(new Set());
  const [lastSpaceTime, setLastSpaceTime] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState('applause');
  const [spotlightPosition, setSpotlightPosition] = useState(0);
  const [showInstructions, setShowInstructions] = useState(() => {
    return localStorage.getItem('typecasting-instructions-seen') !== 'true';
  });
  // isPaused now comes from props
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef(null);
  const scriptRef = useRef(null);
  const startTimeRef = useRef(null);
  const focusTimeoutRef = useRef(null);
  const celebrationTimeoutRef = useRef(null);

  // Issue 2: Lost Input Focus
  const maintainInputFocus = useCallback(() => {
    console.log('FIXING ISSUE 2: Lost Input Focus');
    if (inputRef.current && !isPaused) {
      inputRef.current.focus();
      setInputFocused(true);
    }
  }, [isPaused]);

  // Expose maintainInputFocus globally for navigation
  useEffect(() => {
    window.maintainInputFocus = maintainInputFocus;
    return () => {
      delete window.maintainInputFocus;
    };
  }, [maintainInputFocus]);

  // Cleanup celebration and focus timeouts
  useEffect(() => {
    return () => {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current);
      }
    };
  }, []);

  // Reset celebration when script changes (new scene)
  useEffect(() => {
    setShowCelebration(false);
    if (celebrationTimeoutRef.current) {
      clearTimeout(celebrationTimeoutRef.current);
    }
  }, [currentScript]);

  useEffect(() => {
    if (state.production.curtainsOpen && inputRef.current) {
      maintainInputFocus();
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
        actions.startPerformance();
      }
    }
  }, [state.production.curtainsOpen, actions, maintainInputFocus]);

  // Maintain focus when user clicks away
  useEffect(() => {
    const handleWindowFocus = () => maintainInputFocus();
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        focusTimeoutRef.current = setTimeout(maintainInputFocus, 100);
      }
    };
    
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (focusTimeoutRef.current) clearTimeout(focusTimeoutRef.current);
    };
  }, [maintainInputFocus]);

  // Issue 11: Tempo Calculation Breaks
  const calculateTempo = useCallback(() => {
    console.log('FIXING ISSUE 11: Tempo Calculation Breaks');
    if (!startTimeRef.current || typedText.length === 0) return 0;
    
    const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
    
    // Prevent division by zero and invalid calculations
    if (elapsedSeconds <= 0) return 0;
    
    const minutes = elapsedSeconds / 60;
    const words = typedText.length / 5;
    
    // Ensure we have a reasonable minimum time to prevent artificially high WPM
    if (minutes < 0.1) return 0; // Less than 6 seconds
    
    const wpm = words / minutes;
    
    // Cap at reasonable maximum to prevent display issues
    return Math.min(Math.round(wpm), 999);
  }, [typedText]);

  const handleSceneComplete = useCallback(() => {
    console.log('FIXING ISSUE 26: Accuracy Calc Wrong');
    const tempo = calculateTempo();
    
    // Issue 26: Fix accuracy calculation to handle edge cases
    let accuracy = 100;
    if (typedText.length > 0) {
      accuracy = ((typedText.length - mistakes.size) / typedText.length) * 100;
      accuracy = Math.max(0, Math.min(100, accuracy)); // Clamp between 0-100
    }
    
    actions.updateTempo(tempo);
    actions.updateAccuracy(accuracy);
    actions.updatePersonalBest({ 
      tempo, 
      accuracy, 
      streak: state.performance.noLookStreak 
    });
    
    // Issue 24: Trigger celebration but set timer to dismiss it
    if (accuracy >= 95) {
      setCelebrationType('perfect');
      setShowCelebration(true);
      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current);
      }
      celebrationTimeoutRef.current = setTimeout(() => {
        setShowCelebration(false);
        celebrationTimeoutRef.current = null;
      }, 3000);
    } else if (accuracy >= 85) {
      setCelebrationType('applause');
      setShowCelebration(true);
      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current);
      }
      celebrationTimeoutRef.current = setTimeout(() => {
        setShowCelebration(false);
        celebrationTimeoutRef.current = null;
      }, 2500);
    }
    
    if (onSceneComplete) {
      onSceneComplete({
        tempo,
        accuracy,
        mistakes: mistakes.size,
        noLookStreak: state.performance.noLookStreak
      });
    }
  }, [calculateTempo, typedText.length, mistakes.size, state.performance.noLookStreak, actions, onSceneComplete]);

  useEffect(() => {
    if (currentIndex === currentScript.length && currentIndex > 0) {
      handleSceneComplete();
    }
  }, [currentIndex, currentScript.length, handleSceneComplete]);
  
  // Issue 12: Memory Leak Event Listeners
  useEffect(() => {
    console.log('FIXING ISSUE 12: Memory Leak Event Listeners');
    return () => {
      // Clean up any active timeouts
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (currentIndex > 0 && scriptRef.current) {
      const charElement = scriptRef.current.querySelector('.current-char');
      if (charElement) {
        const rect = charElement.getBoundingClientRect();
        const containerRect = scriptRef.current.getBoundingClientRect();
        setSpotlightPosition(rect.left - containerRect.left + rect.width / 2);
      }
    }
  }, [currentIndex]);

  const handleKeyDown = (e) => {
    // Issue 24: Celebration Blocks Input
    if (showCelebration) {
      console.log('FIXING ISSUE 24: Celebration Blocks Input - ignoring input during celebration');
      e.preventDefault();
      return;
    }
    
    // Issue 14: Pause Support
    if (isPaused) {
      console.log('FIXING ISSUE 14: Pause Support - blocking input while paused');
      e.preventDefault();
      return;
    }
    
    // Issue 32: No Keyboard Shortcuts
    if (e.ctrlKey || e.metaKey) {
      console.log('FIXING ISSUE 32: No Keyboard Shortcuts');
      if (e.key === 'r') {
        e.preventDefault();
        // Reset current exercise
        setTypedText('');
        setCurrentIndex(0);
        setMistakes(new Set());
        startTimeRef.current = Date.now();
        actions.resetPerformance();
        return;
      }
      if (e.key === 'p') {
        e.preventDefault();
        // Toggle pause (would need to communicate with parent)
        if (onPauseToggle) onPauseToggle();
        return;
      }
    }
    
    // Issue 6: Double-Space Panic Mode
    if (e.key === ' ') {
      console.log('FIXING ISSUE 6: Double-Space Panic Mode');
      const currentTime = Date.now();
      if (lastSpaceTime && currentTime - lastSpaceTime < 300) {
        e.preventDefault();
        actions.triggerPanicMode();
        setLastSpaceTime(0); // Reset after trigger to prevent retriggering
        return; // Don't process as regular space
      }
      setLastSpaceTime(currentTime);
      // Let space character process normally below
    }

    // Issue 13: Backspace Wrong Scoring
    if (e.key === 'Backspace' && currentIndex > 0) {
      console.log('FIXING ISSUE 13: Backspace Wrong Scoring');
      e.preventDefault();
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setTypedText(typedText.slice(0, -1));
      
      const newMistakes = new Set(mistakes);
      newMistakes.delete(newIndex);
      setMistakes(newMistakes);
      
      // Don't count backspace as a keystroke for scoring
      // Just update the visual state without affecting performance metrics
      
      return;
    }

    if (e.key.length === 1 && currentIndex < currentScript.length) {
      e.preventDefault();
      const expectedChar = currentScript[currentIndex];
      const isCorrect = e.key === expectedChar;
      
      setTypedText(typedText + e.key);
      setCurrentIndex(currentIndex + 1);
      
      // Check if we've completed the script
      if (currentIndex + 1 >= currentScript.length) {
        console.log('Exercise complete! Triggering completion...');
        handleSceneComplete();
      }
      
      if (!isCorrect) {
        setMistakes(new Set([...mistakes, currentIndex]));
        
        // Enhanced error feedback
        console.log(`Typing Error at position ${currentIndex}:`);
        console.log(`Expected: "${expectedChar}" (${expectedChar.charCodeAt(0)})`);
        console.log(`Typed: "${e.key}" (${e.key.charCodeAt(0)})`);
        
        if (onLineForgotten) {
          onLineForgotten(currentIndex, expectedChar, e.key);
        }
      }
      
      actions.recordKeystroke(isCorrect, currentIndex);
      
      // Issue 22: Add typing feedback
      const scriptContainer = scriptRef.current;
      if (scriptContainer) {
        if (isCorrect) {
          scriptContainer.classList.add('typing-success');
          setTimeout(() => scriptContainer.classList.remove('typing-success'), 200);
        } else {
          scriptContainer.classList.add('typing-error');
          setTimeout(() => scriptContainer.classList.remove('typing-error'), 300);
        }
      }
      
      // Issue 33: setTimeout Throttling - use requestAnimationFrame for smoother updates
      requestAnimationFrame(() => {
        const currentTempo = calculateTempo();
        if (currentTempo > 0) {
          actions.updateTempo(currentTempo);
        }
      });
      
      if (state.performance.noLookStreak > 0 && state.performance.noLookStreak % 20 === 0) {
        const currentOpacity = state.performance.stageDirectionsOpacity;
        const newOpacity = Math.max(0, currentOpacity - 0.1);
        actions.setStageDirectionsOpacity(newOpacity);
      }
    }
  };

  const getCharacterClass = (index) => {
    if (index < currentIndex) {
      return mistakes.has(index) 
        ? 'text-red-500 line-through bg-red-500/20' 
        : 'text-green-400 bg-green-400/10';
    } else if (index === currentIndex) {
      return 'text-yellow-400 bg-yellow-400/30 px-2 py-1 rounded-lg animate-pulse border-2 border-yellow-400/50 font-bold scale-110';
    } else {
      return 'text-gray-400';
    }
  };

  const dismissInstructions = () => {
    setShowInstructions(false);
    localStorage.setItem('typecasting-instructions-seen', 'true');
  };

  // Helper function to get current word being typed
  const getCurrentWord = () => {
    const words = currentScript.split(' ');
    let charCount = 0;
    
    for (let i = 0; i < words.length; i++) {
      const wordEnd = charCount + words[i].length + (i > 0 ? 1 : 0); // +1 for space
      if (currentIndex <= wordEnd) {
        return {
          word: words[i],
          wordIndex: i,
          charInWord: currentIndex - charCount - (i > 0 ? 1 : 0)
        };
      }
      charCount = wordEnd;
    }
    return { word: '', wordIndex: -1, charInWord: 0 };
  };

  return (
    <div className="stage-area">
      <Curtains isOpen={state.production.curtainsOpen} />
      
      {state.production.curtainsOpen && (
        <>
          {/* First-time Instructions Overlay */}
          {showInstructions && (
            <div className="fixed inset-0 bg-stage-black/80 flex items-center justify-center z-50">
              <div className="bg-backstage-blue/95 rounded-lg border-2 border-marquee-gold/30 p-8 max-w-md">
                <h3 className="text-2xl font-bold text-marquee-gold mb-4">How to Play</h3>
                
                <div className="space-y-4 text-spotlight-yellow">
                  <div className="flex items-start gap-3">
                    <span className="text-marquee-gold font-bold">1.</span>
                    <p>Type the golden text shown above exactly as it appears</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-marquee-gold font-bold">2.</span>
                    <p><span className="text-green-400">Green</span> means correct, <span className="text-red-500">Red</span> means a mistake</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-marquee-gold font-bold">3.</span>
                    <p>Double-tap <span className="font-mono bg-stage-black/50 px-2 py-1 rounded">SPACE</span> if you need to see the keyboard</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-marquee-gold font-bold">4.</span>
                    <p>Press <span className="font-mono bg-stage-black/50 px-2 py-1 rounded">ESC</span> to open the menu</p>
                  </div>
                </div>
                
                <button
                  onClick={dismissInstructions}
                  className="w-full mt-6 px-6 py-3 bg-marquee-gold text-stage-black font-semibold 
                           rounded-lg hover:bg-spotlight-yellow transition-colors"
                >
                  Got it!
                </button>
              </div>
            </div>
          )}
          
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-stage-black/50">
            <div 
              className="h-full bg-marquee-gold transition-all duration-300"
              style={{ width: `${(currentIndex / currentScript.length) * 100}%` }}
            />
          </div>
          
          <div className="spotlight-container">
            <div 
              className="spotlight-beam" 
              style={{ left: `${spotlightPosition}px` }}
            />
          </div>
          
          <div className="script-display">
            <div className="stage-direction">
              {sceneInfo.tips || "(The actor approaches the keyboard with confidence)"}
            </div>
            
            <div className="script-line" ref={scriptRef}>
              {currentScript.split('').map((char, index) => (
                <span
                  key={index}
                  className={`script-char ${getCharacterClass(index)} ${
                    index === currentIndex ? 'current-char' : ''
                  }`}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
            
            {/* Enhanced feedback system */}
            <div className="text-center mt-4 space-y-2">
              <div className="text-sm text-marquee-gold/60">
                {currentIndex} / {currentScript.length} characters
              </div>
              
              {currentIndex < currentScript.length && (
                <div className="bg-stage-black/50 rounded-lg p-3 border border-marquee-gold/20">
                  <div className="text-sm text-spotlight-yellow mb-1">Next Character:</div>
                  <div className="text-3xl font-bold text-yellow-400">
                    {currentScript[currentIndex] === ' ' ? 'SPACE' : `"${currentScript[currentIndex]}"`}
                  </div>
                  {currentIndex > 0 && (
                    <div className="text-xs text-gray-400 mt-1">
                      Last typed: "{typedText[typedText.length - 1] || ''}"
                    </div>
                  )}
                  
                  {/* Current word preview */}
                  {(() => {
                    const currentWord = getCurrentWord();
                    return currentWord.word && (
                      <div className="mt-2 pt-2 border-t border-marquee-gold/20">
                        <div className="text-xs text-spotlight-yellow/80 mb-1">Current word:</div>
                        <div className="text-lg font-semibold text-marquee-gold">
                          "{currentWord.word}"
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
              
              {mistakes.size > 0 && (
                <div className="bg-red-900/30 rounded-lg p-2 border border-red-500/30">
                  <div className="text-xs text-red-400">
                    {mistakes.size} mistake{mistakes.size !== 1 ? 's' : ''} • Press Backspace to correct
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="performance-indicator">
            <div className="tempo-meter">
              <span className="meter-label">TEMPO</span>
              <span className="meter-value">{state.performance.tempo}</span>
              <span className="meter-unit">BPM</span>
            </div>
            <div className="accuracy-spotlight">
              <span className="meter-label">PRECISION</span>
              <span className="meter-value">{Math.round(state.performance.accuracy)}%</span>
              <div className="spotlight-glow" style={{opacity: state.performance.accuracy/100}} />
            </div>
          </div>
          
          <input
            ref={inputRef}
            type="text"
            className="opacity-0 absolute pointer-events-auto"
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocused(true)}
            onBlur={() => {
              setInputFocused(false);
              // Auto-refocus after a short delay unless paused
              if (!isPaused) {
                focusTimeoutRef.current = setTimeout(maintainInputFocus, 100);
              }
            }}
            value=""
            onChange={() => {}}
            aria-label="Type the text shown above"
            disabled={isPaused}
          />
          
          {/* Pause indicator */}
          {isPaused && (
            <div className="fixed inset-0 bg-stage-black/50 flex items-center justify-center z-40">
              <div className="bg-backstage-blue/95 rounded-lg border-2 border-marquee-gold/30 p-8">
                <h3 className="text-2xl font-bold text-marquee-gold mb-4 text-center">Performance Paused</h3>
                <p className="text-spotlight-yellow text-center">Press ESC or click outside to resume</p>
              </div>
            </div>
          )}
          
          {/* Focus indicator */}
          {!inputFocused && !isPaused && (
            <div className="absolute top-4 left-4 bg-yellow-900/90 text-yellow-400 
                          px-4 py-2 rounded-lg animate-pulse z-50 cursor-pointer"
                 onClick={maintainInputFocus}>
              Click here to focus and continue typing
            </div>
          )}
          
          {/* Issue 32: Keyboard Shortcuts Help */}
          <div className="absolute bottom-4 right-4 text-xs text-marquee-gold/50 z-30">
            <div>Ctrl+R: Reset | Ctrl+P: Pause</div>
          </div>
          
          {state.performance.inPanicMode && (
            <div className="absolute top-4 right-4 bg-blue-900/90 text-blue-400 
                          px-4 py-2 rounded-lg animate-pulse z-50">
              Stage Directions Revealed!
            </div>
          )}
          
          {state.performance.noLookStreak > 0 && state.performance.noLookStreak % 50 === 0 && (
            <div className="absolute top-4 left-4 bg-green-400/20 border border-green-400/40 
                          rounded-lg px-4 py-2 animate-pulse z-50">
              <p className="text-sm text-green-400">
                {state.performance.noLookStreak} Keystroke Streak! 🎭
              </p>
            </div>
          )}
        </>
      )}
      
      <CelebrationEffects 
        show={showCelebration} 
        type={celebrationType} 
      />
    </div>
  );
};

export default MainStage;