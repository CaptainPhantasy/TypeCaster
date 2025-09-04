import React from 'react';
import { useTheatre } from '../../contexts/TheatreContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TempoMeter = () => {
  const { state } = useTheatre();
  const { tempo, accuracy } = state.performance;
  const { personalBest } = state.actor;
  
  const getTrendIcon = () => {
    if (!personalBest.tempo) return <Minus className="w-4 h-4" />;
    
    if (tempo > personalBest.tempo) {
      return <TrendingUp className="w-4 h-4 text-green-400" />;
    } else if (tempo < personalBest.tempo * 0.9) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-400" />;
  };
  
  const getTempoColor = () => {
    if (tempo >= 60) return 'text-green-400';
    if (tempo >= 40) return 'text-yellow-400';
    if (tempo >= 20) return 'text-amber-400';
    return 'text-gray-400';
  };
  
  const getAccuracyColor = () => {
    if (accuracy >= 95) return 'text-green-400';
    if (accuracy >= 85) return 'text-yellow-400';
    if (accuracy >= 70) return 'text-amber-400';
    return 'text-red-500';
  };
  
  return (
    <div className="tempo-meter">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
          Performance Metrics
        </h3>
        {getTrendIcon()}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/50 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Tempo (BPM)</div>
          <div className={`text-3xl font-bold ${getTempoColor()}`}>
            {tempo}
          </div>
          {personalBest.tempo > 0 && (
            <div className="text-xs text-gray-400 mt-1">
              Best: {personalBest.tempo}
            </div>
          )}
        </div>
        
        <div className="bg-black/50 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Accuracy</div>
          <div className={`text-3xl font-bold ${getAccuracyColor()}`}>
            {Math.round(accuracy)}%
          </div>
          {personalBest.accuracy > 0 && (
            <div className="text-xs text-gray-400 mt-1">
              Best: {Math.round(personalBest.accuracy)}%
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-yellow-400/20">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">No-Look Streak</span>
          <span className="text-sm font-bold text-yellow-400">
            {state.performance.noLookStreak}
          </span>
        </div>
        {personalBest.streak > 0 && (
          <div className="text-xs text-gray-400 mt-1">
            Personal Record: {personalBest.streak}
          </div>
        )}
      </div>
      
      {state.performance.noLookStreak > 0 && state.performance.noLookStreak % 50 === 0 && (
        <div className="mt-4 p-2 bg-green-400/20 border border-green-400/40 rounded-lg">
          <p className="text-xs text-green-400 text-center animate-pulse">
            Milestone: {state.performance.noLookStreak} keystrokes!
          </p>
        </div>
      )}
    </div>
  );
};

export default TempoMeter;