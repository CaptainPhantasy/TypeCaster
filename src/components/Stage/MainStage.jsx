import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTheatre } from '../../contexts/TheatreContext';
import Curtains from './Curtains';
import CelebrationEffects from './CelebrationEffects';

const MainStage = ({ 
  currentScript = "The quick brown fox jumps over the lazy dog",
  onSceneComplete,
  onLineForgotten,
  sceneInfo = {}
}) => {
  const { state, actions } = useTheatre();
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistakes, setMistakes] = useState(new Set());
  const [lastSpaceTime, setLastSpaceTime] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState('applause');
  const [spotlightPosition, setSpotlightPosition] = useState(0);
  const inputRef = useRef(null);
  const stageRef = useRef(null);
  const scriptRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (state.production.curtainsOpen && inputRef.current) {
      inputRef.current.focus();
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
        actions.startPerformance();
      }
    }
  }, [state.production.curtainsOpen, actions]);

  useEffect(() => {
    if (currentIndex === currentScript.length && currentIndex > 0) {
      handleSceneComplete();
    }
  }, [currentIndex, currentScript.length]);

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

  const calculateTempo = useCallback(() => {
    if (!startTimeRef.current || typedText.length === 0) return 0;
    
    const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
    const minutes = elapsedSeconds / 60;
    const words = typedText.length / 5;
    
    return Math.round(words / minutes);
  }, [typedText]);

  const handleSceneComplete = () => {
    const tempo = calculateTempo();
    const accuracy = ((typedText.length - mistakes.size) / typedText.length) * 100;
    
    actions.updateTempo(tempo);
    actions.updateAccuracy(accuracy);
    actions.updatePersonalBest({ 
      tempo, 
      accuracy, 
      streak: state.performance.noLookStreak 
    });
    
    // Trigger celebration based on performance
    if (accuracy >= 95) {
      setCelebrationType('perfect');
      setShowCelebration(true);
    } else if (accuracy >= 85) {
      setCelebrationType('applause');
      setShowCelebration(true);
    }
    
    if (onSceneComplete) {
      onSceneComplete({
        tempo,
        accuracy,
        mistakes: mistakes.size,
        noLookStreak: state.performance.noLookStreak
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      const currentTime = Date.now();
      if (currentTime - lastSpaceTime < 300) {
        e.preventDefault();
        actions.triggerPanicMode();
      }
      setLastSpaceTime(currentTime);
    }

    if (e.key === 'Backspace' && currentIndex > 0) {
      e.preventDefault();
      setCurrentIndex(currentIndex - 1);
      setTypedText(typedText.slice(0, -1));
      
      const newMistakes = new Set(mistakes);
      newMistakes.delete(currentIndex - 1);
      setMistakes(newMistakes);
      
      return;
    }

    if (e.key.length === 1 && currentIndex < currentScript.length) {
      e.preventDefault();
      const expectedChar = currentScript[currentIndex];
      const isCorrect = e.key === expectedChar;
      
      setTypedText(typedText + e.key);
      setCurrentIndex(currentIndex + 1);
      
      if (!isCorrect) {
        setMistakes(new Set([...mistakes, currentIndex]));
        if (onLineForgotten) {
          onLineForgotten(currentIndex, expectedChar, e.key);
        }
      }
      
      actions.recordKeystroke(isCorrect, currentIndex);
      
      const currentTempo = calculateTempo();
      if (currentTempo > 0) {
        actions.updateTempo(currentTempo);
      }
      
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
        ? 'text-red-500 line-through' 
        : 'text-green-400';
    } else if (index === currentIndex) {
      return 'text-yellow-400 bg-yellow-400/20 px-1 rounded animate-pulse';
    } else {
      return 'text-gray-400';
    }
  };

  return (
    <div className="stage-area">
      <Curtains isOpen={state.production.curtainsOpen} />
      
      {state.production.curtainsOpen && (
        <>
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
                  className={`script-char ${getCharacterClass(index)}`}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
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
            value=""
            onChange={() => {}}
            aria-label="Type the text shown above"
          />
          
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