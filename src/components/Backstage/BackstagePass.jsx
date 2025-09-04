import React, { useState, useEffect } from 'react';
import { useTheatre } from '../../contexts/TheatreContext';
import backstagePass from '../../utils/backstagePass';
import { Copy, Download, Upload, Check, X } from 'lucide-react';

const BackstagePassDisplay = () => {
  const { state, actions } = useTheatre();
  const [passCode, setPassCode] = useState('');
  const [loadCode, setLoadCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    generateCurrentPass();
  }, [state.actor, state.production]);

  const generateCurrentPass = () => {
    const userData = {
      role: state.actor.role,
      currentAct: state.production.currentAct,
      currentScene: state.production.currentScene,
      averageTempo: state.performance.tempo,
      averageAccuracy: state.performance.accuracy,
      achievements: state.actor.awards,
      totalSessions: state.actor.repertoire.length,
      longestStreak: state.actor.personalBest.streak,
      completedScenes: state.actor.repertoire,
      keyboardIndependence: 1 - state.performance.stageDirectionsOpacity,
      level: state.actor.experience
    };

    const code = backstagePass.generatePass(userData);
    setPassCode(code);
    
    backstagePass.savePassToStorage(userData);
    actions.saveBackstagePass(code);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(passCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy pass code');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLoadPass = () => {
    try {
      setError('');
      setSuccess('');
      
      const data = backstagePass.parsePass(loadCode);
      
      actions.loadBackstagePass({
        actor: {
          ...state.actor,
          role: data.role,
          awards: data.awards || [],
          repertoire: data.repertoire || [],
          personalBest: {
            tempo: data.tempo || 0,
            accuracy: data.accuracy || 0,
            streak: data.bestRun || 0
          }
        },
        production: {
          ...state.production,
          currentAct: data.act || 1,
          currentScene: data.scene || 0
        }
      });
      
      setSuccess('Performance restored! Break a leg!');
      setLoadCode('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="backstage-pass">
        <div className="text-xs text-amber-100 uppercase tracking-wider mb-2">
          Your Backstage Pass
        </div>
        
        <div className="flex items-center gap-2">
          <code className="flex-1 font-mono text-lg text-white bg-black/30 px-3 py-2 rounded">
            {passCode}
          </code>
          
          <button
            onClick={copyToClipboard}
            className="p-2 hover:bg-white/10 rounded transition-all"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <Copy className="w-5 h-5 text-amber-100" />
            )}
          </button>
        </div>
        
        <div className="text-xs text-amber-200 mt-2">
          Save this code to resume your performance anytime
        </div>
      </div>

      <div className="bg-backstage-blue/20 border border-backstage-blue/40 rounded-lg p-4">
        <div className="text-xs text-amber-400 uppercase tracking-wider mb-3">
          Load Previous Performance
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={loadCode}
            onChange={(e) => setLoadCode(e.target.value)}
            placeholder="Enter backstage pass code..."
            className="flex-1 px-3 py-2 bg-black/50 border border-yellow-400/30 
                     rounded text-white placeholder-gray-400 text-sm
                     focus:outline-none focus:border-yellow-400 transition-all"
          />
          
          <button
            onClick={handleLoadPass}
            disabled={!loadCode.trim()}
            className="px-4 py-2 bg-yellow-400 hover:bg-amber-400 
                     disabled:bg-gray-700 disabled:cursor-not-allowed
                     text-black font-bold rounded transition-all
                     flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Load
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message flex items-center gap-2">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message flex items-center gap-2">
          <Check className="w-4 h-4" />
          {success}
        </div>
      )}

      <div className="text-xs text-gray-400 space-y-1">
        <p>• Your progress is automatically saved every scene</p>
        <p>• Pass codes work across devices and browsers</p>
        <p>• Keep multiple passes to track different roles</p>
      </div>
    </div>
  );
};

export default BackstagePassDisplay;