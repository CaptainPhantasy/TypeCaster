import React from 'react';
import { Star } from 'lucide-react';

const TheatricalHeader = ({ actTitle, sceneName, exerciseTitle }) => {
  return (
    <div className="marquee-header">
      <div className="marquee-lights-top">
        {[...Array(25)].map((_, i) => (
          <div 
            key={i} 
            className="marquee-bulb" 
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }} 
          />
        ))}
      </div>
      
      <div className="production-title">
        <span className="title-glow">TYPE</span>
        <span className="title-star">⭐</span>
        <span className="title-glow">CASTING</span>
      </div>
      
      <div className="now-showing">
        NOW SHOWING: {actTitle}
      </div>
      
      {sceneName && (
        <div className="text-center mt-2">
          <span className="text-amber-400 text-sm">
            Scene: {sceneName}
          </span>
          {exerciseTitle && (
            <span className="text-gray-400 text-xs ml-3">
              • {exerciseTitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TheatricalHeader;