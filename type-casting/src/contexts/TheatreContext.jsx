import React, { createContext, useContext, useReducer, useEffect } from 'react';

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
    currentLine: "",
    rehearsalNotes: [],
    characterCount: 0,
    errorCount: 0,
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
    
    case 'END_PERFORMANCE':
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
    
    case 'TRIGGER_PANIC_MODE':
      return {
        ...state,
        performance: {
          ...state.performance,
          inPanicMode: true,
          stageDirectionsOpacity: 1.0,
          stageDirectionsVisible: true
        }
      };
    
    case 'END_PANIC_MODE':
      return {
        ...state,
        performance: {
          ...state.performance,
          inPanicMode: false,
          stageDirectionsOpacity: state.performance.stageDirectionsOpacity
        }
      };
    
    case 'RECORD_KEYSTROKE':
      const isCorrect = action.payload.correct;
      const newCharCount = state.performance.characterCount + 1;
      const newErrorCount = isCorrect ? state.performance.errorCount : state.performance.errorCount + 1;
      const newStreak = isCorrect ? state.performance.noLookStreak + 1 : 0;
      
      return {
        ...state,
        performance: {
          ...state.performance,
          characterCount: newCharCount,
          errorCount: newErrorCount,
          noLookStreak: newStreak,
          currentCharIndex: action.payload.charIndex || state.performance.currentCharIndex + 1,
          accuracy: ((newCharCount - newErrorCount) / newCharCount * 100)
        }
      };
    
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

  useEffect(() => {
    const savedState = localStorage.getItem('typeCastingState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'LOAD_BACKSTAGE_PASS', payload: parsed });
      } catch (e) {
        console.error('Failed to load saved state:', e);
      }
    }
  }, []);

  useEffect(() => {
    const saveState = () => {
      try {
        localStorage.setItem('typeCastingState', JSON.stringify({
          actor: state.actor,
          production: {
            currentAct: state.production.currentAct,
            currentScene: state.production.currentScene
          },
          theatre: state.theatre
        }));
      } catch (e) {
        console.error('Failed to save state:', e);
      }
    };

    const debounced = setTimeout(saveState, 1000);
    return () => clearTimeout(debounced);
  }, [state]);

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
      resetPerformance: () => dispatch({ type: 'RESET_PERFORMANCE' })
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