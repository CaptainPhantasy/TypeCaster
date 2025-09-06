import React, { useEffect, useState } from 'react';

const CelebrationEffects = ({ show, type = 'applause' }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      // Immediately hide when show becomes false
      setVisible(false);
    }
  }, [show]);

  if (!visible) return null;

  if (type === 'applause') {
    return (
      <div className="applause-overlay">
        <div className="roses-container">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="rose" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                fontSize: `${1.5 + Math.random() * 1.5}rem`
              }}
            >
              🌹
            </div>
          ))}
        </div>
        <div className="ovation-text">STANDING OVATION!</div>
      </div>
    );
  }

  if (type === 'milestone') {
    return (
      <div className="applause-overlay">
        <div className="roses-container">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="rose" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                fontSize: `${1 + Math.random()}rem`
              }}
            >
              ✨
            </div>
          ))}
        </div>
        <div className="ovation-text" style={{ fontSize: '3rem' }}>
          MILESTONE ACHIEVED!
        </div>
      </div>
    );
  }

  if (type === 'perfect') {
    return (
      <div className="applause-overlay">
        <div className="roses-container">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className="rose" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                fontSize: `${2 + Math.random() * 2}rem`
              }}
            >
              {['🌟', '⭐', '✨', '💫'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
        <div className="ovation-text">PERFECT PERFORMANCE!</div>
      </div>
    );
  }

  return null;
};

export default CelebrationEffects;