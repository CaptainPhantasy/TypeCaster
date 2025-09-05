import React, { useState } from 'react';
import { useTheatre } from '../../contexts/TheatreContext';
import { Star, Briefcase, Code, ArrowRight, Sparkles } from 'lucide-react';

const AVAILABLE_ROLES = {
  CONFIDENT_EXECUTIVE: {
    id: 'CONFIDENT_EXECUTIVE',
    title: "The Confident Executive",
    icon: Briefcase,
    tagline: "Professional presence required",
    description: "Perfect for video calls and meetings",
    startingScene: "business-basics",
    focusArea: "confidence",
    stageDirectionsOpacity: 0.4,
    color: "from-blue-600 to-indigo-700"
  },
  RISING_STAR: {
    id: 'RISING_STAR',
    title: "The Rising Star",
    icon: Star,
    tagline: "From understudy to lead", 
    description: "Complete beginner's journey",
    startingScene: "home-row-debut",
    focusArea: "fundamentals",
    stageDirectionsOpacity: 1.0,
    color: "from-yellow-500 to-orange-600"
  },
  METHOD_ACTOR: {
    id: 'METHOD_ACTOR',
    title: "The Method Actor",
    icon: Code,
    tagline: "Master of complex dialogue",
    description: "Coding and special characters",
    startingScene: "symbol-soliloquy",
    focusArea: "technical",
    stageDirectionsOpacity: 0.2,
    color: "from-purple-600 to-pink-600"
  }
};

const CastingCall = ({ onComplete }) => {
  const { state, actions } = useTheatre();
  const [selectedRole, setSelectedRole] = useState(null);
  const [actorName, setActorName] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleBeginAudition = () => {
    if (selectedRole && actorName.trim()) {
      setIsTransitioning(true);
      actions.setActorRole(selectedRole, actorName);
      actions.setStageDirectionsOpacity(AVAILABLE_ROLES[selectedRole].stageDirectionsOpacity);
      
      setTimeout(() => {
        actions.openCurtains();
        if (onComplete) {
          onComplete(selectedRole);
        }
      }, 500);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-8 ${isTransitioning ? 'stage-fade-out' : 'stage-fade-in'}`}>
      <div className="theatre-container max-w-5xl">
        <div className="marquee-header mb-8">
          <div className="marquee-lights-top">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="marquee-bulb" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          
          <h1 className="production-title">
            <span className="title-glow">CASTING</span>
            <span className="title-star">⭐</span>
            <span className="title-glow">CALL</span>
          </h1>
          
          <p className="now-showing">
            AUDITIONS NOW OPEN
          </p>
        </div>

        <div className="p-8">

        {!selectedRole ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Object.entries(AVAILABLE_ROLES).map(([key, role]) => {
              const Icon = role.icon;
              return (
                <button
                  key={key}
                  onClick={() => handleRoleSelect(key)}
                  className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 
                           border-2 border-yellow-400/20 hover:border-yellow-400/60
                           transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                           overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 
                                  group-hover:opacity-20 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    <div className="flex justify-center mb-4">
                      <Icon className="w-16 h-16 text-yellow-400 group-hover:animate-pulse" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {role.title}
                    </h3>
                    
                    <p className="text-sm text-amber-400 mb-3 italic">
                      "{role.tagline}"
                    </p>
                    
                    <p className="text-gray-400 text-sm">
                      {role.description}
                    </p>
                    
                    <div className="mt-4 flex items-center justify-center text-xs text-gray-400">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {role.focusArea.toUpperCase()} FOCUS
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-8 
                        border-2 border-yellow-400/40 shadow-2xl stage-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-yellow-400 mb-2">
                {AVAILABLE_ROLES[selectedRole].title}
              </h2>
              <p className="text-gray-400 italic">
                "{AVAILABLE_ROLES[selectedRole].tagline}"
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="actorName" className="block text-sm font-medium text-amber-400 mb-2">
                  Your Stage Name
                </label>
                <input
                  id="actorName"
                  type="text"
                  value={actorName}
                  onChange={(e) => setActorName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-3 bg-black/50 border border-yellow-400/30 
                           rounded-lg text-white placeholder-gray-400
                           focus:outline-none focus:border-yellow-400 focus:ring-2 
                           focus:ring-yellow-400/20 transition-all"
                  autoFocus
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setSelectedRole(null);
                    setActorName('');
                  }}
                  className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 
                           text-gray-400 rounded-lg transition-colors"
                >
                  Back to Roles
                </button>
                
                <button
                  onClick={handleBeginAudition}
                  disabled={!actorName.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-400
                           hover:from-amber-400 hover:to-yellow-400
                           disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                           text-black font-bold rounded-lg transition-all
                           transform hover:scale-105 disabled:hover:scale-100
                           flex items-center justify-center gap-2 group"
                >
                  Begin Audition
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-900/10 border border-blue-400/30 rounded-lg">
              <p className="text-sm text-blue-400">
                <strong>Director's Note:</strong> {AVAILABLE_ROLES[selectedRole].description}. 
                Stage directions will be set to {Math.round(AVAILABLE_ROLES[selectedRole].stageDirectionsOpacity * 100)}% visibility.
              </p>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">
            Not sure which role to choose? The Rising Star is perfect for beginners!
          </p>
        </div>
        </div>
      </div>

      <div className="marquee-lights mt-8">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="marquee-bulb" style={{ animationDelay: `${(15 - i) * 0.1}s` }} />
        ))}
      </div>
    </div>
  );
};

export default CastingCall;