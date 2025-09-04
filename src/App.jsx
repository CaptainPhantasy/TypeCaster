import React, { useState } from 'react';
import { TheatreProvider, useTheatre } from './contexts/TheatreContext';
import CastingCall from './components/Director/CastingCall';
import MainStage from './components/Stage/MainStage';
import VirtualKeyboard from './components/OrchestraPit/VirtualKeyboard';
import TheatricalHeader from './components/Stage/TheatricalHeader';
import CriticsReview from './components/Performance/CriticsReview';
import BackstagePassDisplay from './components/Backstage/BackstagePass';
import actOneScripts from './data/scripts/actOne.json';
import { Play, Pause, RotateCcw, Save, Menu, X } from 'lucide-react';

function Theatre() {
  const { state, actions } = useTheatre();
  const [currentScene, setCurrentScene] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lastPerformance, setLastPerformance] = useState(null);
  const [showReview, setShowReview] = useState(false);

  const getCurrentScript = () => {
    if (!actOneScripts.scenes[currentScene]) {
      return "The quick brown fox jumps over the lazy dog.";
    }
    const scene = actOneScripts.scenes[currentScene];
    const exercise = scene.exercises[currentExercise];
    return exercise ? exercise.script : scene.warmUp;
  };

  const handleSceneComplete = (performance) => {
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
    
    actions.addReview(review);
    actions.completeScene(`${scene.id}-${exercise.id}`, 10);
    
    setTimeout(() => {
      setShowReview(false);
      if (currentExercise < scene.exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
      } else if (currentScene < actOneScripts.scenes.length - 1) {
        setCurrentScene(currentScene + 1);
        setCurrentExercise(0);
        actions.closeCurtains();
        setTimeout(() => actions.openCurtains(), 1500);
      } else {
        actions.earnAward({
          id: "act-complete",
          name: "Act I Complete",
          description: "Finished Finding Your Stage Legs"
        });
      }
    }, 5000);
  };

  const handleReset = () => {
    actions.resetPerformance();
    actions.closeCurtains();
    setTimeout(() => actions.openCurtains(), 1000);
  };

  if (!state.actor.role) {
    return <CastingCall onComplete={() => {}} />;
  }

  const scene = actOneScripts.scenes[currentScene];
  const exercise = scene?.exercises[currentExercise];

  return (
    <div className="min-h-screen">
      <div className="theatre-container">
        <TheatricalHeader
          actTitle={`Act ${actOneScripts.act}: ${actOneScripts.title}`}
          sceneName={scene?.name}
          exerciseTitle={exercise?.title}
        />
        
        <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
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

        <MainStage
          currentScript={getCurrentScript()}
          onSceneComplete={handleSceneComplete}
          sceneInfo={exercise || {}}
          onLineForgotten={(index, expected, actual) => {
            console.log(`Mistake at ${index}: expected ${expected}, got ${actual}`);
          }}
        />
        
        {showReview && lastPerformance && (
          <CriticsReview performance={lastPerformance} />
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

        {showMenu && (
          <div className="fixed right-0 top-0 bottom-0 w-96 bg-gradient-to-b from-backstage-blue/95 to-dressing-room/95 
                        backdrop-blur-md border-l-2 border-yellow-400/30 p-6 space-y-6 z-40 overflow-y-auto
                        shadow-[-20px_0_60px_rgba(0,0,0,0.8)]">
            <BackstagePassDisplay />
            
            <div className="review-card">
              <h3 className="text-lg font-bold text-amber-400 mb-4">
                Performance History
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {state.actor.reviews.slice(-5).reverse().map((review, index) => (
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
      </div>
    </div>
  );
}

function App() {
  return (
    <TheatreProvider>
      <Theatre />
    </TheatreProvider>
  );
}

export default App
