import React from 'react';

const MarqueeLights = ({ count = 20 }) => {
  return (
    <div className="marquee-lights">
      {[...Array(count)].map((_, index) => (
        <div 
          key={index} 
          className="marquee-bulb"
          style={{ 
            animationDelay: `${index * 0.1}s`,
            opacity: 0.7 + Math.random() * 0.3
          }}
        />
      ))}
    </div>
  );
};

export default MarqueeLights;