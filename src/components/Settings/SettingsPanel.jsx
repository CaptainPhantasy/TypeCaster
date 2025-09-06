import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Eye, Monitor, Palette, Save, RotateCcw, Settings } from 'lucide-react';
import { useTheatre } from '../../contexts/TheatreContext';

const SettingsPanel = ({ isOpen, onClose }) => {
  const { state, actions } = useTheatre();
  const [localSettings, setLocalSettings] = useState({
    soundEnabled: state.theatre.soundEnabled,
    reducedMotion: state.theatre.reducedMotion,
    spotlightIntensity: state.theatre.spotlightIntensity,
    curtainSpeed: state.theatre.curtainSpeed,
    prompterEnabled: state.theatre.prompterEnabled,
    theme: state.theatre.theme
  });
  
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('typecastingSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setLocalSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  // Track changes
  useEffect(() => {
    const isDifferent = JSON.stringify(localSettings) !== JSON.stringify(state.theatre);
    setHasChanges(isDifferent);
  }, [localSettings, state.theatre]);

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    console.log('FIXING ISSUE 28: Settings Don\'t Save - saving to localStorage and context');
    
    // Save to localStorage
    try {
      localStorage.setItem('typecastingSettings', JSON.stringify(localSettings));
      
      // Update context
      actions.updateTheatreSettings(localSettings);
      
      setHasChanges(false);
      
      // Show save confirmation
      const saveMessage = document.createElement('div');
      saveMessage.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[10001] animate-in slide-in-from-bottom';
      saveMessage.textContent = 'Settings saved successfully!';
      document.body.appendChild(saveMessage);
      
      setTimeout(() => {
        saveMessage.remove();
      }, 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  const resetSettings = () => {
    if (confirm('Reset all settings to defaults?')) {
      const defaultSettings = {
        soundEnabled: true,
        reducedMotion: false,
        spotlightIntensity: 'medium',
        curtainSpeed: 'normal',
        prompterEnabled: true,
        theme: 'classic'
      };
      
      setLocalSettings(defaultSettings);
      localStorage.removeItem('typecastingSettings');
      actions.updateTheatreSettings(defaultSettings);
      setHasChanges(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stage-black/90 flex items-center justify-center z-[100] p-4">
      <div className="bg-gradient-to-br from-backstage-blue/95 to-dressing-room/95 
                    backdrop-blur-sm rounded-xl border-2 border-marquee-gold/30 
                    p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-marquee-gold flex items-center gap-3">
            <Settings className="w-6 h-6" />
            Theatre Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5 text-marquee-gold" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Sound Settings */}
          <div className="bg-stage-black/30 rounded-lg p-4 border border-marquee-gold/20">
            <h3 className="text-lg font-semibold text-spotlight-yellow mb-4 flex items-center gap-2">
              {localSettings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              Sound & Music
            </h3>
            
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300">Enable Sound Effects</span>
              <input
                type="checkbox"
                checked={localSettings.soundEnabled}
                onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                className="w-5 h-5 rounded border-marquee-gold/30 bg-stage-black/50 
                         text-marquee-gold focus:ring-marquee-gold focus:ring-offset-0"
              />
            </label>
          </div>

          {/* Visual Settings */}
          <div className="bg-stage-black/30 rounded-lg p-4 border border-marquee-gold/20">
            <h3 className="text-lg font-semibold text-spotlight-yellow mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Visual Effects
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-300">Reduce Motion</span>
                <input
                  type="checkbox"
                  checked={localSettings.reducedMotion}
                  onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                  className="w-5 h-5 rounded border-marquee-gold/30 bg-stage-black/50 
                           text-marquee-gold focus:ring-marquee-gold focus:ring-offset-0"
                />
              </label>

              <div>
                <label className="text-gray-300 block mb-2">Spotlight Intensity</label>
                <select
                  value={localSettings.spotlightIntensity}
                  onChange={(e) => handleSettingChange('spotlightIntensity', e.target.value)}
                  className="w-full px-3 py-2 bg-stage-black/50 border border-marquee-gold/30 
                           rounded-lg text-white focus:outline-none focus:border-marquee-gold"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 block mb-2">Curtain Animation Speed</label>
                <select
                  value={localSettings.curtainSpeed}
                  onChange={(e) => handleSettingChange('curtainSpeed', e.target.value)}
                  className="w-full px-3 py-2 bg-stage-black/50 border border-marquee-gold/30 
                           rounded-lg text-white focus:outline-none focus:border-marquee-gold"
                >
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                </select>
              </div>
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="bg-stage-black/30 rounded-lg p-4 border border-marquee-gold/20">
            <h3 className="text-lg font-semibold text-spotlight-yellow mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Accessibility
            </h3>
            
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300">Enable Virtual Keyboard Prompter</span>
              <input
                type="checkbox"
                checked={localSettings.prompterEnabled}
                onChange={(e) => handleSettingChange('prompterEnabled', e.target.checked)}
                className="w-5 h-5 rounded border-marquee-gold/30 bg-stage-black/50 
                         text-marquee-gold focus:ring-marquee-gold focus:ring-offset-0"
              />
            </label>
          </div>

          {/* Theme Settings */}
          <div className="bg-stage-black/30 rounded-lg p-4 border border-marquee-gold/20">
            <h3 className="text-lg font-semibold text-spotlight-yellow mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Theme
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {['classic', 'modern', 'noir', 'broadway'].map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => handleSettingChange('theme', themeName)}
                  className={`px-4 py-2 rounded-lg border transition-all capitalize
                            ${localSettings.theme === themeName 
                              ? 'bg-marquee-gold/30 border-marquee-gold text-spotlight-yellow' 
                              : 'bg-stage-black/30 border-marquee-gold/20 text-gray-300 hover:bg-marquee-gold/10'
                            }`}
                >
                  {themeName}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-marquee-gold/20">
            <button
              onClick={resetSettings}
              className="px-4 py-2 bg-stage-black/50 hover:bg-stage-black/70 
                       text-gray-300 rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </button>
            
            <div className="flex-1"></div>
            
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 
                       text-gray-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={saveSettings}
              disabled={!hasChanges}
              className="px-6 py-2 bg-marquee-gold hover:bg-spotlight-yellow 
                       disabled:bg-gray-600 disabled:cursor-not-allowed
                       text-stage-black font-semibold rounded-lg transition-all
                       flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
