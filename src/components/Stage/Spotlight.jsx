import React, { useEffect, useState } from 'react';

const Spotlight = ({ position, totalLength, stageRef }) => {
  const [spotlightStyle, setSpotlightStyle] = useState({});

  useEffect(() => {
    if (stageRef?.current) {
      const stageWidth = stageRef.current.offsetWidth;
      const progress = position / totalLength;
      const xPosition = progress * stageWidth;
      
      setSpotlightStyle({
        left: `${xPosition}px`,
        top: '50%',
        transform: 'translate(-50%, -50%)'
      });
    }
  }, [position, totalLength, stageRef]);

  return (
    <div 
      className="spotlight-follow"
      style={spotlightStyle}
    />
  );
};

export default Spotlight;