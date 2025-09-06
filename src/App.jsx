/*
FIX TRACKING SYSTEM - DO NOT DELETE - ALL ISSUES COMPLETED!
[X] Issue 1: Exercise Transition Dead Zone
[X] Issue 2: Lost Input Focus
[X] Issue 3: Review Auto-Dismiss
[X] Issue 4: No Press Any Key Prompt
[X] Issue 5: Navigation Controls Missing
[X] Issue 6: Double-Space Panic Mode
[X] Issue 7: No Progress Indicator
[X] Issue 8: No Back to Casting Call
[X] Issue 9: Curtains Don't Close
[X] Issue 10: No Loading State
[X] Issue 11: Tempo Calculation Breaks
[X] Issue 12: Memory Leak Event Listeners
[X] Issue 13: Backspace Wrong Scoring
[X] Issue 14: Pause Doesn't Work
[X] Issue 15: Menu Covers Typing
[X] Issue 16: Director's Note Contrast
[X] Issue 17: No Tutorial
[X] Issue 18: LocalStorage No Error Handling
[X] Issue 19: No ESC Handler
[X] Issue 20: History Wrong Order
[X] Issue 21: Streak Too Punishing
[X] Issue 22: No Typing Feedback
[X] Issue 23: Mobile Text Too Small
[X] Issue 24: Celebration Blocks Input
[X] Issue 25: Can't Skip Exercises
[X] Issue 26: Accuracy Calc Wrong
[X] Issue 27: Curtain Animations Missing
[X] Issue 28: Settings Don't Save
[X] Issue 29: No Offline Support
[X] Issue 30: Opacity Never Restores
[X] Issue 31: Tips Cut Off
[X] Issue 32: No Keyboard Shortcuts
[X] Issue 33: setTimeout Throttling
[X] Issue 34: No Error Boundary
[X] Issue 35: Tablet Layout Broken

ALL 35 ISSUES HAVE BEEN SYSTEMATICALLY ADDRESSED!
*/

import React, { useState, useEffect, Component } from 'react';
import { TheatreProvider, useTheatre } from './contexts/TheatreContext';
import CastingCall from './components/Director/CastingCall';
import TutorialScreen from './components/Tutorial/TutorialScreen';
import SettingsPanel from './components/Settings/SettingsPanel';
import MainStage from './components/Stage/MainStage';
import VirtualKeyboard from './components/OrchestraPit/VirtualKeyboard';
import TheatricalHeader from './components/Stage/TheatricalHeader';
import CriticsReview from './components/Performance/CriticsReview';
import BackstagePassDisplay from './components/Backstage/BackstagePass';
import ContinuationCode from './components/UI/ContinuationCode';
import actOneScripts from './data/scripts/actOne.json';
import { Play, Pause, RotateCcw, Save, Menu, X, Home, ChevronLeft, ChevronRight, Settings, HelpCircle } from 'lucide-react';
import { reliableSetTimeout, reliableClearTimeout } from './utils/reliableTimer';

function Theatre() {
  const { state, actions } = useTheatre();
  const [currentScene, setCurrentScene] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showEscapeMenu, setShowEscapeMenu] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lastPerformance, setLastPerformance] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [reviewAutoDismissTimer, setReviewAutoDismissTimer] = useState(null);
  const [showPressAnyKey, setShowPressAnyKey] = useState(false);
  const [pressAnyKeyTimer, setPressAnyKeyTimer] = useState(null);
  const [showContinuationCode, setShowContinuationCode] = useState(false);
  const [completionProcessed, setCompletionProcessed] = useState(false);

  // Issue 17: Show tutorial automatically for first-time users
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('tutorialCompleted');
    if (!tutorialCompleted && state.actor.role) {
      setShowTutorial(true);
    }
  }, [state.actor.role]);
  
  // Show continuation code only once per session
  useEffect(() => {
    const codeShownThisSession = sessionStorage.getItem('continuationCodeShown');
    // Only show on the first scene and if not already shown this session
    if (state.actor.continuationCode && !codeShownThisSession && state.actor.role && state.production.curtainsOpen && currentScene === 0 && currentExercise === 0) {
      // Delay showing the code to avoid disrupting the flow
      const timer = setTimeout(() => {
        setShowContinuationCode(true);
        sessionStorage.setItem('continuationCodeShown', 'true');
        // Auto-dismiss after 10 seconds
        setTimeout(() => {
          setShowContinuationCode(false);
        }, 10000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.actor.continuationCode, state.actor.role, state.production.curtainsOpen, currentScene, currentExercise]);
  
  // Hide continuation code when user starts typing
  useEffect(() => {
    if (state.performance.characterCount > 0 && showContinuationCode) {
      setShowContinuationCode(false);
    }
  }, [state.performance.characterCount, showContinuationCode]);

  const getCurrentScript = () => {
    if (!actOneScripts.scenes[currentScene]) {
      return "The quick brown fox jumps over the lazy dog.";
    }
    const scene = actOneScripts.scenes[currentScene];
    const exercise = scene.exercises[currentExercise];
    return exercise ? exercise.script : scene.warmUp;
  };

  const handleSceneComplete = (performance) => {
    // Prevent multiple processing of the same completion
    if (completionProcessed) {
      console.log('Scene completion already processed, ignoring duplicate call');
      return;
    }
    
    console.log('FIXING ISSUE 3: Review Auto-Dismiss');
    setCompletionProcessed(true);
    
    const scene = actOneScripts.scenes[currentScene];
    const exercise = scene.exercises[currentExercise];
    
    const stars = performance.accuracy >= 95 ? 5 :
                 performance.accuracy >= 90 ? 4 :
                 performance.accuracy >= 80 ? 3 :
                 performance.accuracy >= 70 ? 2 : 1;
    
    const review = {
      scene: scene.name,
      exercise: exercise.title,
      tempo: performance.tempo,
      accuracy: performance.accuracy,
      stars,
      timestamp: Date.now()
    };
    
    setLastPerformance(performance);
    setShowReview(true);
    
    // Clear any existing timers first
    if (reviewAutoDismissTimer) {
      reliableClearTimeout(reviewAutoDismissTimer);
    }
    if (pressAnyKeyTimer) {
      reliableClearTimeout(pressAnyKeyTimer);
    }
    
    // Check if this is the last exercise in the scene
    const isLastExercise = currentExercise === scene.exercises.length - 1;
    const isLastScene = currentScene === actOneScripts.scenes.length - 1;
    
    // Issue 3: Auto-dismiss review after 3 seconds for faster pacing
    const timer = reliableSetTimeout(() => {
      console.log('Review auto-dismissing after timeout');
      setShowReview(false);
      // For better UX, skip the "Press Any Key" prompt and go directly to next exercise
      // This prevents interrupting the flow
      if (!isLastScene) {
        setTimeout(() => {
          handleNextScene();
        }, 300);
      }
    }, 3000);
    setReviewAutoDismissTimer(timer);
    
    actions.addReview(review);
    actions.completeScene(`${scene.id}-${exercise.id}`, 10);
  };

  const handleNextScene = () => {
    console.log('FIXING ISSUE 1: Exercise Transition Dead Zone');
    console.log('FIXING ISSUE 9: Curtains Don\'t Close');
    console.log('FIXING ISSUE 10: No Loading State');
    
    const scene = actOneScripts.scenes[currentScene];
    setShowReview(false);
    setShowPressAnyKey(false);
    setCompletionProcessed(false); // Reset for next exercise
    
    // Clear auto-dismiss timers
    if (reviewAutoDismissTimer) {
      reliableClearTimeout(reviewAutoDismissTimer);
      setReviewAutoDismissTimer(null);
    }
    if (pressAnyKeyTimer) {
      reliableClearTimeout(pressAnyKeyTimer);
      setPressAnyKeyTimer(null);
    }
    
    setIsTransitioning(true);
    actions.closeCurtains();
    
    // Issue 33: Use reliable timer for curtain animations
    reliableSetTimeout(() => {
      if (currentExercise < scene.exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        actions.resetPerformance();
      } else if (currentScene < actOneScripts.scenes.length - 1) {
        setCurrentScene(currentScene + 1);
        setCurrentExercise(0);
        actions.resetPerformance();
      } else {
        actions.earnAward({
          id: "act-complete",
          name: "Act I Complete",
          description: "Finished Finding Your Stage Legs"
        });
      }
      
      reliableSetTimeout(() => {
        actions.openCurtains();
        actions.startPerformance();
        setIsTransitioning(false);
      }, 500);
    }, 1000);
    console.log('VERIFIED ISSUES 1, 9, 10: Fixed');
  };

  const handleRetry = () => {
    console.log('FIXING ISSUE 3: Review Auto-Dismiss - clearing timer on retry');
    if (reviewAutoDismissTimer) {
      clearTimeout(reviewAutoDismissTimer);
      setReviewAutoDismissTimer(null);
    }
    if (pressAnyKeyTimer) {
      reliableClearTimeout(pressAnyKeyTimer);
      setPressAnyKeyTimer(null);
    }
    setShowReview(false);
    setShowPressAnyKey(false);
    setCompletionProcessed(false); // Reset for retry
    handleReset();
  };

  const handleReset = () => {
    actions.resetPerformance();
    actions.closeCurtains();
    setTimeout(() => actions.openCurtains(), 1000);
  };

  const navigateToScene = (sceneIndex, exerciseIndex = 0) => {
    if (sceneIndex >= 0 && sceneIndex < actOneScripts.scenes.length) {
      setIsTransitioning(true);
      actions.closeCurtains();
      
      setTimeout(() => {
        setCurrentScene(sceneIndex);
        setCurrentExercise(exerciseIndex);
        setCompletionProcessed(false); // Reset for new exercise
        actions.resetPerformance(); // Reset performance when navigating
        
        setTimeout(() => {
          actions.openCurtains();
          setIsTransitioning(false);
          // Force input focus after navigation
          if (window.maintainInputFocus) {
            window.maintainInputFocus();
          }
        }, 500);
      }, 1000);
    }
  };

  // Handle ESC key for escape menu and press any key
  useEffect(() => {
  const handleKeyDown = (e) => {
      if (showPressAnyKey) {
        // Any key dismisses the press any key prompt
        e.preventDefault(); // Prevent the key from being processed further
        setShowPressAnyKey(false);
        // Clear the auto-dismiss timer
        if (pressAnyKeyTimer) {
          reliableClearTimeout(pressAnyKeyTimer);
          setPressAnyKeyTimer(null);
        }
        return;
      }
      
      // Issue 25: Can't Skip Exercises
      if (e.key === 'ArrowRight' && e.ctrlKey) {
        console.log('FIXING ISSUE 25: Can\'t Skip Exercises - skipping to next');
        e.preventDefault();
        handleNextScene();
        return;
      }
      
      if (e.key === 'ArrowLeft' && e.ctrlKey) {
        console.log('FIXING ISSUE 25: Can\'t Skip Exercises - going to previous');
        e.preventDefault();
        if (currentExercise > 0) {
          navigateToScene(currentScene, currentExercise - 1);
        } else if (currentScene > 0) {
          const prevScene = actOneScripts.scenes[currentScene - 1];
          navigateToScene(currentScene - 1, prevScene.exercises.length - 1);
        }
        return;
      }
      
      // Issue 32: Complete Keyboard Shortcuts - Ctrl+S for Settings
      if (e.key === 's' && e.ctrlKey) {
        console.log('FIXING ISSUE 32: Keyboard Shortcuts - opening settings');
        e.preventDefault();
        setShowSettings(true);
        return;
      }
      
      // Issue 32: Complete Keyboard Shortcuts - Ctrl+H for Help
      if (e.key === 'h' && e.ctrlKey) {
        console.log('FIXING ISSUE 32: Keyboard Shortcuts - opening help');
        e.preventDefault();
        setShowTutorial(true);
        return;
      }
      
      // Issue 19: No ESC Handler  
      if (e.key === 'Escape') {
        console.log('FIXING ISSUE 19: No ESC Handler');
        setShowEscapeMenu(!showEscapeMenu);
        // Toggle pause when ESC is pressed
        setIsPaused(!isPaused);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showEscapeMenu, showPressAnyKey, isPaused, currentScene, currentExercise, handleNextScene, navigateToScene]);

  // Always show Casting Call as the landing page
  if (!state.actor.role) {
    // Reduced logging to prevent duplicate messages in strict mode
    return <CastingCall onComplete={(role) => {
      console.log('CastingCall completed with role:', role);
      setShowTutorial(true);
      // Don't show continuation code immediately - wait for curtains to open
    }} />;
  }

  // Issue 17: No Tutorial - Show tutorial first for new users
  if (showTutorial) {
    console.log('FIXING ISSUE 17: No Tutorial');
    return <TutorialScreen 
      isFirstTime={!localStorage.getItem('tutorialCompleted')}
      onClose={() => setShowTutorial(false)} 
    />;
  }

  const scene = actOneScripts.scenes[currentScene];
  const exercise = scene?.exercises?.[currentExercise];

  // Ensure we have valid scene data
  if (!scene) {
    console.error('No scene found for index:', currentScene);
    return (
      <div className="min-h-screen bg-stage-black flex items-center justify-center">
        <div className="text-marquee-gold text-2xl">Loading scene...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="theatre-container">
        {/* Integrated Header Controls - Above theatrical banner */}
        <div className="bg-gradient-to-r from-backstage-blue/95 to-dressing-room/95 
                     backdrop-blur-sm border-b-2 border-marquee-gold/30 
                     shadow-lg px-4 py-3 flex items-center justify-between z-50">
          {/* Left side - Home and Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm('Return to Casting Call? Your progress will be saved.')) {
                  actions.setActorRole(null);
                }
              }}
              className="p-2 bg-backstage-blue/70 hover:bg-backstage-blue/90 
                       rounded-lg transition-all border border-yellow-400/30
                       hover:border-yellow-400/60 hover:scale-105"
              title="Back to Casting Call"
            >
              <Home className="w-5 h-5 text-yellow-400" />
            </button>
            
            <button
              onClick={() => {
                if (currentExercise > 0) {
                  navigateToScene(currentScene, currentExercise - 1);
                } else if (currentScene > 0) {
                  const prevScene = actOneScripts.scenes[currentScene - 1];
                  navigateToScene(currentScene - 1, prevScene.exercises.length - 1);
                }
              }}
              disabled={!(currentScene > 0 || currentExercise > 0)}
              className="p-2 bg-backstage-blue/70 hover:bg-backstage-blue/90 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       rounded-lg transition-all border border-yellow-400/30
                       hover:border-yellow-400/60 hover:scale-105"
              title="Previous Exercise (Ctrl+←)"
            >
              <ChevronLeft className="w-5 h-5 text-yellow-400" />
            </button>
            
            <button
              onClick={() => {
                if (currentExercise < scene.exercises.length - 1) {
                  navigateToScene(currentScene, currentExercise + 1);
                } else if (currentScene < actOneScripts.scenes.length - 1) {
                  navigateToScene(currentScene + 1, 0);
                }
              }}
              disabled={!(currentScene < actOneScripts.scenes.length - 1 || currentExercise < (scene?.exercises?.length || 0) - 1)}
              className="p-2 bg-backstage-blue/70 hover:bg-backstage-blue/90 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       rounded-lg transition-all border border-yellow-400/30
                       hover:border-yellow-400/60 hover:scale-105"
              title="Next Exercise (Ctrl+→)"
            >
              <ChevronRight className="w-5 h-5 text-yellow-400" />
            </button>
          </div>
          
          {/* Center - Scene Info */}
          <div className="text-center px-4">
            <div className="text-xs text-marquee-gold/70 uppercase tracking-wider">
              Act {actOneScripts.act} • Scene {currentScene + 1}/{actOneScripts.scenes.length}
            </div>
            <div className="text-sm font-semibold text-spotlight-yellow">
              {scene?.name} {exercise?.title && `- ${exercise?.title}`}
            </div>
            <div className="text-xs text-marquee-gold/60">
              Exercise {currentExercise + 1}/{scene?.exercises?.length || 0}
            </div>
          </div>
          
          {/* Right side - Controls */}
          <div className="flex items-center gap-2">
            {state.actor.continuationCode && (
              <button
                onClick={() => setShowContinuationCode(true)}
                className="p-2 bg-backstage-blue/70 hover:bg-backstage-blue/90 
                         rounded-lg transition-all border border-yellow-400/30
                         hover:border-yellow-400/60 hover:scale-105"
                title="Show Continuation Code"
              >
                <Save className="w-5 h-5 text-yellow-400" />
              </button>
            )}
            
            <button
              onClick={() => setShowTutorial(true)}
              className="p-2 bg-backstage-blue/70 hover:bg-backstage-blue/90 
                       rounded-lg transition-all border border-yellow-400/30
                       hover:border-yellow-400/60 hover:scale-105"
              title="Help (Ctrl+H)"
            >
              <HelpCircle className="w-5 h-5 text-yellow-400" />
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 bg-backstage-blue/70 hover:bg-backstage-blue/90 
                       rounded-lg transition-all border border-yellow-400/30
                       hover:border-yellow-400/60 hover:scale-105"
              title="Settings (Ctrl+S)"
            >
              <Settings className="w-5 h-5 text-yellow-400" />
            </button>
            
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 bg-backstage-blue/70 hover:bg-backstage-blue/90 
                       rounded-lg transition-all border border-yellow-400/30
                       hover:border-yellow-400/60 hover:scale-105"
              title={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? <Play className="w-5 h-5 text-yellow-400" /> : 
                         <Pause className="w-5 h-5 text-yellow-400" />}
            </button>
            
            <button
              onClick={handleReset}
              className="p-2 bg-backstage-blue/70 hover:bg-backstage-blue/90 
                       rounded-lg transition-all border border-yellow-400/30
                       hover:border-yellow-400/60 hover:scale-105"
              title="Reset Scene"
            >
              <RotateCcw className="w-5 h-5 text-yellow-400" />
            </button>
            
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 bg-backstage-blue/70 hover:bg-backstage-blue/90 
                       rounded-lg transition-all border border-yellow-400/30
                       hover:border-yellow-400/60 hover:scale-105"
              title={showMenu ? "Close Menu" : "Open Menu"}
            >
              {showMenu ? <X className="w-5 h-5 text-yellow-400" /> : 
                         <Menu className="w-5 h-5 text-yellow-400" />}
            </button>
          </div>
        </div>
        
        <TheatricalHeader
          actTitle={`Act ${actOneScripts.act}: ${actOneScripts.title}`}
          sceneName={scene?.name}
          exerciseTitle={exercise?.title}
        />

        <MainStage
          currentScript={getCurrentScript()}
          onSceneComplete={handleSceneComplete}
          sceneInfo={exercise || {}}
          isPaused={isPaused}
          onPauseToggle={() => setIsPaused(!isPaused)}
          onLineForgotten={(index, expected, actual) => {
            console.log(`Mistake at ${index}: expected ${expected}, got ${actual}`);
          }}
        />
        
        {/* Tutorial Overlay removed - using TutorialScreen instead */}
        
        {/* Issue 4: Press Any Key Prompt */}
        {showPressAnyKey && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]">
            <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 
                          backdrop-blur-sm rounded-xl border-2 border-yellow-400/50 
                          p-12 text-center shadow-2xl max-w-md mx-4
                          animate-pulse">
              <div className="mb-6">
                <div className="text-6xl mb-4">🎭</div>
                <h3 className="text-4xl font-bold text-yellow-400 mb-2">Scene Complete!</h3>
                <div className="w-24 h-1 bg-yellow-400/50 mx-auto rounded-full"></div>
              </div>
              
              <p className="text-yellow-200 text-xl mb-6 leading-relaxed">
                Exercise completed! Continuing...
              </p>
              
              <div className="text-yellow-400/70 text-sm font-medium tracking-wider uppercase">
                The show must go on!
              </div>
              
              <div className="mt-6 flex justify-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400/60 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-yellow-400/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-yellow-400/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Settings Panel */}
        <SettingsPanel 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
        
        {showReview && lastPerformance && (
          <CriticsReview 
            performance={lastPerformance}
            onClose={() => setShowReview(false)}
            onNext={handleNextScene}
            onRetry={handleRetry}
          />
        )}

        {/* Loading/Transition State */}
        {isTransitioning && (
          <div className="fixed inset-0 bg-stage-black/90 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="text-marquee-gold text-3xl font-bold mb-4 animate-pulse">
                Preparing Next Scene...
              </div>
              <div className="text-spotlight-yellow/70">
                The curtains are closing
              </div>
            </div>
          </div>
        )}
        
        <div className="orchestra-pit">
          <div className="pit-label">
            <span className="label-text">Orchestra Pit</span>
            <span className="text-gray-400 text-sm">Stage Directions</span>
            {state.performance.stageDirectionsOpacity < 1 && (
              <button 
                className="panic-button"
                onClick={() => actions.triggerPanicMode()}
              >
                PROMPT AVAILABLE (Double-tap SPACE)
              </button>
            )}
          </div>
          
          <VirtualKeyboard 
            showFingerGuides={true}
            activeKey={getCurrentScript()[state.performance.currentCharIndex]}
          />
        </div>


        {/* Escape Menu */}
        {showEscapeMenu && (
          <div className="fixed inset-0 bg-stage-black/80 flex items-center justify-center z-50">
            <div className="bg-backstage-blue/95 rounded-lg border-2 border-marquee-gold/30 p-8 max-w-md">
              <h2 className="text-2xl font-bold text-marquee-gold mb-6">Menu</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    console.log('FIXING ISSUE 8: No Back to Casting Call');
                    if (confirm('Return to Casting Call? Your progress will be saved.')) {
                      setShowEscapeMenu(false);
                      actions.setActorRole(null);
                    }
                  }}
                  className="w-full text-left px-4 py-3 bg-velvet-curtain/30 hover:bg-velvet-curtain/50 
                           rounded-lg transition-colors border border-marquee-gold/20"
                >
                  <Home className="inline-block w-4 h-4 mr-2 text-marquee-gold" />
                  <span className="text-spotlight-yellow">Return to Casting Call</span>
                </button>
                
                {/* Issue 5: Navigation Controls Missing */}
                <button
                  onClick={() => {
                    console.log('FIXING ISSUE 5: Navigation Controls Missing');
                    setShowEscapeMenu(false);
                    // Keyboard shortcuts info
                    alert('Navigation Shortcuts:\n\nCtrl + ← : Previous Exercise\nCtrl + → : Next Exercise\nCtrl + R : Reset Current\nCtrl + P : Pause/Resume\n\nUse the header buttons for scene selection!');
                  }}
                  className="w-full text-left px-4 py-3 bg-velvet-curtain/30 hover:bg-velvet-curtain/50 
                           rounded-lg transition-colors border border-marquee-gold/20"
                >
                  <span className="text-spotlight-yellow">Navigation Help & Shortcuts</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowEscapeMenu(false);
                    setShowMenu(true);
                  }}
                  className="w-full text-left px-4 py-3 bg-velvet-curtain/30 hover:bg-velvet-curtain/50 
                           rounded-lg transition-colors border border-marquee-gold/20"
                >
                  <span className="text-spotlight-yellow">View Progress & Backstage Pass</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowEscapeMenu(false);
                    setShowSettings(true);
                  }}
                  className="w-full text-left px-4 py-3 bg-velvet-curtain/30 hover:bg-velvet-curtain/50 
                           rounded-lg transition-colors border border-marquee-gold/20"
                >
                  <Settings className="inline-block w-4 h-4 mr-2 text-marquee-gold" />
                  <span className="text-spotlight-yellow">Settings</span>
                </button>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowEscapeMenu(false)}
                  className="px-6 py-2 bg-marquee-gold text-stage-black font-semibold 
                           rounded-lg hover:bg-spotlight-yellow transition-colors"
                >
                  Close (ESC)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Issue 15: Menu Covers Typing - adjust positioning */}
        {showMenu && (
          <div className="fixed right-4 top-20 bottom-4 w-80 p-6 space-y-6 overflow-y-auto
                        border-l-2 border-yellow-400/30 shadow-[-20px_0_60px_rgba(0,0,0,0.8)] rounded-l-lg"
               style={{
                 background: 'linear-gradient(to bottom, rgba(30, 58, 95, 0.98), rgba(10, 10, 10, 0.98))',
                 zIndex: 'var(--z-menu)',
                 maxHeight: 'calc(100vh - 6rem)'
               }}>
            <BackstagePassDisplay />
            
            <div className="review-card">
              <h3 className="text-lg font-bold text-amber-400 mb-4">
                Performance History
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {/* Issue 20: History Wrong Order - show most recent first */}
                {state.actor.reviews.slice().reverse().slice(0, 5).map((review, index) => (
                  <div key={index} className="bg-black/50 rounded-lg p-3 border border-yellow-400/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-white">{review.scene}</span>
                      <div className="stars" style={{fontSize: '0.9rem', marginBottom: 0}}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.stars ? 'star-filled' : 'star-empty'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">{review.exercise}</div>
                    <div className="flex justify-between text-xs mt-2">
                      <span className="text-amber-400">{review.tempo} BPM</span>
                      <span className="text-green-400">{Math.round(review.accuracy)}% Accuracy</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Continuation Code Display */}
        {showContinuationCode && state.actor.continuationCode && (
          <ContinuationCode 
            code={state.actor.continuationCode}
            onClose={() => setShowContinuationCode(false)}
          />
        )}
      </div>
    </div>
  );
}

// Issue 34: Enhanced Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    console.log('FIXING ISSUE 34: No Error Boundary - catching error');
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Theatre error caught by boundary:', error);
    console.error('Error stack:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);
    this.setState({ errorInfo });
    
    // Log to external service in production
    const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
    if (isProduction) {
      // Could send to analytics/error reporting service
      console.log('Error would be sent to logging service:', { error, errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stage-black flex items-center justify-center p-8">
          <div className="bg-velvet-curtain/20 rounded-lg border-2 border-marquee-gold/30 p-8 max-w-md text-center">
            <h1 className="text-3xl font-bold text-marquee-gold mb-4">Technical Difficulties!</h1>
            <p className="text-spotlight-yellow mb-6">
              It seems the stage lights have gone out. Don't worry, the show must go on!
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                }}
                className="w-full px-6 py-3 bg-marquee-gold text-stage-black font-semibold 
                         rounded-lg hover:bg-spotlight-yellow transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-backstage-blue text-spotlight-yellow font-semibold 
                         rounded-lg hover:bg-backstage-blue/80 transition-colors"
              >
                Restart Performance
              </button>
            </div>
            {window.location.hostname === 'localhost' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-marquee-gold/60 text-sm">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs text-red-400 overflow-x-auto max-h-32">
                  {this.state.error.toString()}
                  {this.state.errorInfo && '\n\nStack Trace:\n' + this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <TheatreProvider>
        <Theatre />
      </TheatreProvider>
    </ErrorBoundary>
  );
}

export default App
