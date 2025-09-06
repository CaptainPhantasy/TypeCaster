import React, { useState, useEffect } from 'react';
import { useTheatre } from '../../contexts/TheatreContext';

const KEYBOARD_LAYOUT = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
];

const FINGER_MAPPING = {
  // Left hand - pinky
  '`': 'L5', '1': 'L5', 'Tab': 'L5', 'Caps': 'L5', 'Shift': 'L5', 'Ctrl': 'L5',
  // Left hand - ring
  '2': 'L4', 'q': 'L4', 'a': 'L4', 'z': 'L4', 'Alt': 'L4',
  // Left hand - middle
  '3': 'L3', 'w': 'L3', 's': 'L3', 'x': 'L3',
  // Left hand - index
  '4': 'L2', '5': 'L2', 'r': 'L2', 't': 'L2', 'f': 'L2', 'g': 'L2', 'v': 'L2', 'b': 'L2',
  // Right hand - index
  '6': 'R2', '7': 'R2', 'y': 'R2', 'u': 'R2', 'h': 'R2', 'j': 'R2', 'n': 'R2', 'm': 'R2',
  // Right hand - middle
  '8': 'R3', 'i': 'R3', 'k': 'R3', ',': 'R3',
  // Right hand - ring
  '9': 'R4', 'o': 'R4', 'l': 'R4', '.': 'R4',
  // Right hand - pinky
  '0': 'R5', '-': 'R5', '=': 'R5', 'p': 'R5', '[': 'R5', ']': 'R5', '\\': 'R5',
  ';': 'R5', "'": 'R5', '/': 'R5', 'Backspace': 'R5', 'Enter': 'R5',
  // Thumbs
  'Space': 'THUMB'
};

const FINGER_COLORS = {
  'L5': 'from-red-600 to-red-700',
  'L4': 'from-orange-600 to-orange-700',
  'L3': 'from-yellow-600 to-yellow-700',
  'L2': 'from-green-600 to-green-700',
  'R2': 'from-green-600 to-green-700',
  'R3': 'from-blue-600 to-blue-700',
  'R4': 'from-indigo-600 to-indigo-700',
  'R5': 'from-purple-600 to-purple-700',
  'THUMB': 'from-gray-600 to-gray-700'
};

const VirtualKeyboard = ({ activeKey = null, showFingerGuides = true }) => {
  const { state } = useTheatre();
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const opacity = state.performance.stageDirectionsOpacity;

  useEffect(() => {
    const handleKeyDown = (e) => {
      setPressedKeys(prev => new Set([...prev, e.key.toLowerCase()]));
    };

    const handleKeyUp = (e) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.key.toLowerCase());
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const getKeyClasses = (key) => {
    const keyLower = key.toLowerCase();
    const finger = FINGER_MAPPING[keyLower] || FINGER_MAPPING[key];
    const isPressed = pressedKeys.has(keyLower);
    const isActive = activeKey && activeKey.toLowerCase() === keyLower;
    
    let classes = 'keyboard-key relative transition-all duration-150 ';
    
    if (isPressed) {
      classes += 'active scale-95 ';
    }
    
    if (isActive) {
      classes += 'ring-2 ring-yellow-400 ';
    }
    
    if (showFingerGuides && finger && opacity > 0.3) {
      classes += `bg-gradient-to-br ${FINGER_COLORS[finger]} bg-opacity-20 `;
    }
    
    const specialKeys = ['Backspace', 'Tab', 'Caps', 'Enter', 'Shift', 'Ctrl', 'Alt', 'Space'];
    if (specialKeys.includes(key)) {
      classes += 'text-xs ';
    }
    
    return classes;
  };

  const getKeyWidth = (key) => {
    switch (key) {
      case 'Backspace': return 'w-24';
      case 'Tab': return 'w-20';
      case 'Caps': return 'w-24';
      case 'Enter': return 'w-28';
      case 'Shift': return 'w-32';
      case 'Space': return 'w-96';
      case 'Ctrl': return 'w-20';
      case 'Alt': return 'w-16';
      default: return 'w-12';
    }
  };

  const renderKey = (key, uniqueKey) => {
    const displayText = key === 'Space' ? ' ' : key;
    const finger = FINGER_MAPPING[key.toLowerCase()] || FINGER_MAPPING[key];
    
    return (
      <div
        key={uniqueKey || key}
        className={`${getKeyClasses(key)} ${getKeyWidth(key)} h-12 
                   flex items-center justify-center font-mono`}
      >
        {displayText}
        {showFingerGuides && finger && opacity > 0.5 && (
          <span className="absolute -top-1 -right-1 text-xs text-yellow-400 opacity-60">
            {finger.replace('L', '◐').replace('R', '◑').replace(/[0-9]/g, '')}
          </span>
        )}
      </div>
    );
  };

  return (
    <div 
      className="orchestra-pit transition-opacity duration-500"
      style={{ opacity }}
    >
      {opacity > 0 && (
        <>
          <div className="text-center mb-4">
            <h3 className="text-amber-400 text-sm font-semibold tracking-wider uppercase">
              Stage Directions
            </h3>
            {state.performance.inPanicMode && (
              <p className="text-xs text-blue-400 animate-pulse mt-1">
                (Emergency Reveal Active)
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            {KEYBOARD_LAYOUT.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-1">
                {row.map((key, keyIndex) => renderKey(key, `${rowIndex}-${keyIndex}`))}
              </div>
            ))}
          </div>
          
          {showFingerGuides && opacity > 0.3 && (
            <div className="mt-6 flex justify-center gap-8">
              <div className="text-xs text-gray-400">
                <span className="text-amber-400">◐</span> Left Hand
              </div>
              <div className="text-xs text-gray-400">
                <span className="text-amber-400">◑</span> Right Hand
              </div>
            </div>
          )}
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              Visibility: {Math.round(opacity * 100)}%
              {opacity < 1 && ' • Double-tap SPACE for panic mode'}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default VirtualKeyboard;