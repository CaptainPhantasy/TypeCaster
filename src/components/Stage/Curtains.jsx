import React from 'react';

const Curtains = ({ isOpen = false }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none ${isOpen ? 'curtains-open' : ''}`}>
      <div className="curtain-left" />
      <div className="curtain-right" />
    </div>
  );
};

export default Curtains;