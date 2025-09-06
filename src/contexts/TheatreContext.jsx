import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';

const TheatreContext = createContext();

const initialState = {
  production: {
    title: "Type Casting",
    currentAct: 1,
    currentScene: 0,
    intermission: false,
    curtainsOpen: false
  },
  
  performance: {
    started: null,
    tempo: 0,
    accuracy: 100,
    stageDirectionsVisible: true,
    stageDirectionsOpacity: 1.0,
    inPanicMode: false,
    panicModeTriggered: false,
    currentLine: "",
    rehearsalNotes: [],
    characterCount: 0,
    errorCount: 0,
    consecutiveErrors: 0,
    noLookStreak: 0,
    currentCharIndex: 0
  },
  
  actor: {
    name: "Guest Performer",
    role: null,
    experience: 0,
    awards: [],
    repertoire: [],
    reviews: [],
    backstagePass: null,
    continuationCode: null,
    personalBest: {
      tempo: 0,
      accuracy: 0,
      streak: 0
    }
  },
  
  theatre: {
    soundEnabled: true,
    reducedMotion: false,
    spotlightIntensity: 'medium',
    curtainSpeed: 'normal',
    prompterEnabled: true,
    theme: 'classic'
  }
};

const theatreReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACTOR_ROLE':
      return {
        ...state,
        actor: {
          ...state.actor,
          role: action.payload.role,
          name: action.payload.name || state.actor.name
        }
      };
    
    case 'OPEN_CURTAINS':
      return {
        ...state,
        production: {
          ...state.production,
          curtainsOpen: true
        }
      };
    
    case 'CLOSE_CURTAINS':
      return {
        ...state,
        production: {
          ...state.production,
          curtainsOpen: false
        }
      };
    
    case 'START_PERFORMANCE':
      return {
        ...state,
        performance: {
          ...state.performance,
          started: Date.now(),
          characterCount: 0,
          errorCount: 0,
          noLookStreak: 0,
          currentCharIndex: 0
        }
      };
    
    case 'END_PERFORMANCE': {
      const finalAccuracy = state.performance.characterCount > 0 
        ? ((state.performance.characterCount - state.performance.errorCount) / state.performance.characterCount * 100)
        : 0;
      
      return {
        ...state,
        performance: {
          ...state.performance,
          started: null,
          accuracy: finalAccuracy
        }
      };
    }
    
    case 'UPDATE_TEMPO':
      return {
        ...state,
        performance: {
          ...state.performance,
          tempo: action.payload
        }
      };
    
    case 'UPDATE_ACCURACY':
      return {
        ...state,
        performance: {
          ...state.performance,
          accuracy: action.payload
        }
      };
    
    case 'SET_STAGE_DIRECTIONS_OPACITY':
      return {
        ...state,
        performance: {
          ...state.performance,
          stageDirectionsOpacity: action.payload,
          stageDirectionsVisible: action.payload > 0
        }
      };
    
    case 'GENERATE_CODE':
      return {
        ...state,
        actor: {
          ...state.actor,
          continuationCode: action.payload
        }
      };
      
    case 'LOAD_FROM_CODE':
      return {
        ...action.payload,
        production: {
          ...action.payload.production,
          curtainsOpen: false // Start with curtains closed
        }
      };
    
    case 'TRIGGER_PANIC_MODE':
      return {
        ...state,
        performance: {
          ...state.performance,
          inPanicMode: true,
          stageDirectionsOpacity: 1.0,
          stageDirectionsVisible: true,
          panicModeTriggered: true // Track that panic mode was used
        }
      };
    
    case 'END_PANIC_MODE':
      console.log('FIXING ISSUE 30: Opacity Never Restores');
      return {
        ...state,
        performance: {
          ...state.performance,
          inPanicMode: false,
          // Issue 30: Restore opacity to previous level before panic mode
          stageDirectionsOpacity: state.performance.panicModeTriggered ? 
            Math.max(0.1, state.performance.noLookStreak * 0.05) : // Calculate based on streak
            state.performance.stageDirectionsOpacity
        }
      };
    
    case 'RECORD_KEYSTROKE': {
      console.log('FIXING ISSUE 21: Streak Too Punishing - implementing forgiveness');
      const isCorrect = action.payload.correct;
      const newCharCount = state.performance.characterCount + 1;
      const newErrorCount = isCorrect ? state.performance.errorCount : state.performance.errorCount + 1;
      
      // Issue 21: Streak forgiveness - only reset streak after 3 consecutive errors
      let newStreak;
      if (isCorrect) {
        newStreak = state.performance.noLookStreak + 1;
      } else {
        // Check if this is part of a consecutive error pattern
        const consecutiveErrors = (state.performance.consecutiveErrors || 0) + 1;
        if (consecutiveErrors >= 3) {
          newStreak = 0; // Reset streak after 3 consecutive errors
        } else {
          newStreak = state.performance.noLookStreak; // Keep streak
        }
      }
      
      return {
        ...state,
        performance: {
          ...state.performance,
          characterCount: newCharCount,
          errorCount: newErrorCount,
          noLookStreak: newStreak,
          consecutiveErrors: isCorrect ? 0 : (state.performance.consecutiveErrors || 0) + 1,
          currentCharIndex: action.payload.charIndex || state.performance.currentCharIndex + 1,
          accuracy: ((newCharCount - newErrorCount) / newCharCount * 100)
        }
      };
    }
    
    case 'COMPLETE_SCENE':
      return {
        ...state,
        actor: {
          ...state.actor,
          repertoire: [...state.actor.repertoire, action.payload.sceneId],
          experience: state.actor.experience + action.payload.experienceGained
        },
        production: {
          ...state.production,
          currentScene: state.production.currentScene + 1
        }
      };
    
    case 'EARN_AWARD':
      return {
        ...state,
        actor: {
          ...state.actor,
          awards: [...state.actor.awards, action.payload]
        }
      };
    
    case 'ADD_REVIEW':
      return {
        ...state,
        actor: {
          ...state.actor,
          reviews: [...state.actor.reviews, action.payload]
        }
      };
    
    case 'SAVE_BACKSTAGE_PASS':
      return {
        ...state,
        actor: {
          ...state.actor,
          backstagePass: action.payload
        }
      };
    
    case 'LOAD_BACKSTAGE_PASS':
      return {
        ...state,
        ...action.payload
      };
    
    case 'UPDATE_PERSONAL_BEST':
      return {
        ...state,
        actor: {
          ...state.actor,
          personalBest: {
            tempo: Math.max(state.actor.personalBest.tempo, action.payload.tempo || 0),
            accuracy: Math.max(state.actor.personalBest.accuracy, action.payload.accuracy || 0),
            streak: Math.max(state.actor.personalBest.streak, action.payload.streak || 0)
          }
        }
      };
    
    case 'TOGGLE_SOUND':
      return {
        ...state,
        theatre: {
          ...state.theatre,
          soundEnabled: !state.theatre.soundEnabled
        }
      };
    
    case 'UPDATE_THEATRE_SETTINGS':
      return {
        ...state,
        theatre: {
          ...state.theatre,
          ...action.payload
        }
      };
    
    case 'NAVIGATE_TO_SCENE':
      return {
        ...state,
        production: {
          ...state.production,
          currentAct: action.payload.act,
          currentScene: action.payload.scene
        }
      };
    
    case 'RESET_PERFORMANCE':
      return {
        ...state,
        performance: {
          ...initialState.performance
        }
      };
    
    default:
      return state;
  }
};

export const TheatreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(theatreReducer, initialState);
  const saveTimeoutRef = useRef(null);

  // Generate a unique continuation code with role parameter
  const generateContinuationCode = (roleOverride = null) => {
    const role = roleOverride || state.actor.role;
    const rolePrefix = role ? role.substring(0, 4).toUpperCase() : 'GUES';
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const timePart = Date.now().toString().slice(-4);
    return `${rolePrefix}-${timePart}-${randomPart}`;
  };

  // Generate continuation code when role is set
  useEffect(() => {
    if (state.actor.role && !state.actor.continuationCode) {
      const code = generateContinuationCode(state.actor.role);
      dispatch({ type: 'GENERATE_CODE', payload: code });
      console.log('🎭 Auto-generated continuation code:', code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.actor.role, state.actor.continuationCode]);

  // Save state with continuation code (throttled to prevent quota exceeded)
  useEffect(() => {
    if (state.actor.continuationCode) {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Throttle saves to once per 2 seconds
      saveTimeoutRef.current = setTimeout(() => {
        try {
          // Only save essential data to prevent quota issues
          const dataToSave = {
            code: state.actor.continuationCode,
            savedAt: Date.now(),
            state: {
              actor: {
                role: state.actor.role,
                name: state.actor.name,
                level: state.actor.level,
                experience: state.actor.experience,
                personalBest: state.actor.personalBest,
                // Limit reviews to last 10 to save space
                reviews: state.actor.reviews.slice(-10),
                awards: state.actor.awards,
                repertoire: state.actor.repertoire,
                continuationCode: state.actor.continuationCode
              },
              production: {
                currentAct: state.production.currentAct,
                currentScene: state.production.currentScene
              },
              theatre: state.theatre
              // Don't save performance data as it's temporary
            }
          };
          
          const dataString = JSON.stringify(dataToSave);
          
          // Check size before saving (localStorage has ~5MB limit)
          if (dataString.length > 50000) { // 50KB limit per save
            console.warn('Save data too large, skipping save');
            return;
          }
          
          localStorage.setItem(`typecast-${state.actor.continuationCode}`, dataString);
          // Reduced logging frequency
          if (Math.random() < 0.1) { // Only log 10% of saves
            console.log('🎭 Progress saved with code:', state.actor.continuationCode);
          }
        } catch (e) {
          if (e.name === 'QuotaExceededError') {
            console.warn('LocalStorage quota exceeded, clearing old saves');
            // Clear old saves when quota exceeded
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
              if (key.startsWith('typecast-') && key !== `typecast-${state.actor.continuationCode}`) {
                localStorage.removeItem(key);
              }
            });
          } else {
            console.error('Failed to save progress:', e);
          }
        }
      }, 2000); // 2 second throttle
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state.actor.role, state.actor.level, state.actor.experience, state.actor.personalBest, state.actor.continuationCode]);

  // Clean up old continuation codes (older than 7 days)
  useEffect(() => {
    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      
      keys.forEach(key => {
        if (key.startsWith('typecast-')) {
          const saved = JSON.parse(localStorage.getItem(key));
          if (saved.savedAt && (now - saved.savedAt) > sevenDays) {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (e) {
      console.error('Failed to clean up old codes:', e);
    }
  }, []);

  useEffect(() => {
    if (state.performance.inPanicMode) {
      const timer = setTimeout(() => {
        dispatch({ type: 'END_PANIC_MODE' });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.performance.inPanicMode]);

  const value = {
    state,
    dispatch,
    actions: {
      setActorRole: (role, name) => dispatch({ type: 'SET_ACTOR_ROLE', payload: { role, name } }),
      openCurtains: () => dispatch({ type: 'OPEN_CURTAINS' }),
      closeCurtains: () => dispatch({ type: 'CLOSE_CURTAINS' }),
      startPerformance: () => dispatch({ type: 'START_PERFORMANCE' }),
      endPerformance: () => dispatch({ type: 'END_PERFORMANCE' }),
      updateTempo: (tempo) => dispatch({ type: 'UPDATE_TEMPO', payload: tempo }),
      updateAccuracy: (accuracy) => dispatch({ type: 'UPDATE_ACCURACY', payload: accuracy }),
      setStageDirectionsOpacity: (opacity) => dispatch({ type: 'SET_STAGE_DIRECTIONS_OPACITY', payload: opacity }),
      triggerPanicMode: () => dispatch({ type: 'TRIGGER_PANIC_MODE' }),
      recordKeystroke: (correct, charIndex) => dispatch({ type: 'RECORD_KEYSTROKE', payload: { correct, charIndex } }),
      completeScene: (sceneId, experienceGained) => dispatch({ type: 'COMPLETE_SCENE', payload: { sceneId, experienceGained } }),
      earnAward: (award) => dispatch({ type: 'EARN_AWARD', payload: award }),
      addReview: (review) => dispatch({ type: 'ADD_REVIEW', payload: review }),
      saveBackstagePass: (pass) => dispatch({ type: 'SAVE_BACKSTAGE_PASS', payload: pass }),
      loadBackstagePass: (data) => dispatch({ type: 'LOAD_BACKSTAGE_PASS', payload: data }),
      updatePersonalBest: (metrics) => dispatch({ type: 'UPDATE_PERSONAL_BEST', payload: metrics }),
      toggleSound: () => dispatch({ type: 'TOGGLE_SOUND' }),
      updateTheatreSettings: (settings) => dispatch({ type: 'UPDATE_THEATRE_SETTINGS', payload: settings }),
      navigateToScene: (act, scene) => dispatch({ type: 'NAVIGATE_TO_SCENE', payload: { act, scene } }),
      resetPerformance: () => dispatch({ type: 'RESET_PERFORMANCE' }),
      // Issue 30: Add action to restore opacity
      restoreOpacity: () => {
        console.log('FIXING ISSUE 30: Opacity Never Restores - manual restore');
        dispatch({ 
          type: 'SET_STAGE_DIRECTIONS_OPACITY', 
          payload: Math.max(0.1, state.performance.noLookStreak * 0.05) 
        });
      },
      // Continuation code functionality
      generateContinuationCode: () => {
        const code = generateContinuationCode(state.actor.role);
        dispatch({ type: 'GENERATE_CODE', payload: code });
        console.log('🎭 Generated continuation code:', code);
        // Store in window for testing
        if (typeof window !== 'undefined') {
          window.lastContinuationCode = code;
        }
        return code;
      },
      loadFromCode: (code) => {
        try {
          const saved = localStorage.getItem(`typecast-${code}`);
          if (!saved) {
            return { success: false, error: 'Invalid code or expired session.' };
          }
          
          const parsed = JSON.parse(saved);
          if (!parsed.state || !parsed.state.actor) {
            return { success: false, error: 'Corrupted save data.' };
          }
          
          // Restore the state
          dispatch({ type: 'LOAD_FROM_CODE', payload: parsed.state });
          return { success: true, data: parsed.state };
        } catch (e) {
          console.error('Failed to load from code:', e);
          return { success: false, error: 'Failed to load progress.' };
        }
      }
    }
  };

  return (
    <TheatreContext.Provider value={value}>
      {children}
    </TheatreContext.Provider>
  );
};

export const useTheatre = () => {
  const context = useContext(TheatreContext);
  if (!context) {
    throw new Error('useTheatre must be used within a TheatreProvider');
  }
  return context;
};