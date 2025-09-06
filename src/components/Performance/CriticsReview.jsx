import React from 'react';
import { X } from 'lucide-react';

const CriticsReview = ({ performance, onClose, onNext, onRetry }) => {
  const getStarRating = (accuracy, tempo) => {
    if (accuracy >= 95 && tempo >= 50) return 5;
    if (accuracy >= 90 && tempo >= 40) return 4;
    if (accuracy >= 80 && tempo >= 30) return 3;
    if (accuracy >= 70 && tempo >= 20) return 2;
    return 1;
  };

  const getReviewHeadline = (stars) => {
    const headlines = {
      5: ["A Tour de Force Performance!", "Breathtaking Keyboard Mastery!", "Standing Ovation Worthy!"],
      4: ["A Compelling Performance", "Shows Great Promise", "Nearly Steals the Show"],
      3: ["Room to Grow", "Finding Their Voice", "Work in Progress"],
      2: ["Rough Around the Edges", "Needs More Rehearsal", "Early Days Yet"],
      1: ["Keep Practicing", "The Journey Begins", "Every Star Starts Somewhere"]
    };
    const options = headlines[stars] || headlines[1];
    return options[Math.floor(Math.random() * options.length)];
  };

  const getReviewText = (accuracy, tempo, streak) => {
    if (accuracy >= 95) {
      return `An absolutely captivating ${tempo} BPM performance with ${Math.round(accuracy)}% precision. The audience was mesmerized by the flawless execution and commanding stage presence. ${streak > 50 ? `A remarkable ${streak}-keystroke streak shows true mastery!` : ''}`;
    }
    if (accuracy >= 85) {
      return `With ${tempo} BPM and ${Math.round(accuracy)}% accuracy, this performance shows solid technique and growing confidence. ${streak > 30 ? `The ${streak}-keystroke streak demonstrates improving muscle memory.` : 'Keep building that confidence!'}`;
    }
    if (accuracy >= 70) {
      return `At ${tempo} BPM with ${Math.round(accuracy)}% accuracy, there's clear potential waiting to be unlocked. ${streak > 20 ? `Moments of brilliance in that ${streak}-keystroke run!` : 'Trust those stage directions and the spotlight will find you.'}`;
    }
    return `Every great performer starts somewhere. At ${tempo} BPM, the dedication is evident. Focus on accuracy over speed, and remember - the stage directions are your friend!`;
  };

  if (!performance) return null;

  const stars = getStarRating(performance.accuracy, performance.tempo);
  const headline = getReviewHeadline(stars);
  const reviewText = getReviewText(performance.accuracy, performance.tempo, performance.noLookStreak || 0);

  return (
    <div className="critics-corner">
      <div className="review-card relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-stage-black/50 hover:bg-stage-black/70 
                   rounded-full transition-colors"
          title="Close Review"
        >
          <X className="w-5 h-5 text-marquee-gold" />
        </button>
        
        <div className="stars">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < stars ? 'star-filled' : 'star-empty'}>
              ⭐
            </span>
          ))}
        </div>
        
        <h3 className="review-headline">{headline}</h3>
        
        <p className="review-text">
          "{reviewText}"
        </p>
        
        <div className="reviewer">
          — The Daily Typist
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-velvet-curtain text-marquee-gold rounded-lg 
                     hover:bg-velvet-curtain/80 transition-colors font-semibold"
          >
            Try Again
          </button>
          <button
            onClick={onNext}
            className="px-6 py-2 bg-marquee-gold text-stage-black rounded-lg 
                     hover:bg-spotlight-yellow transition-colors font-semibold"
          >
            Next Scene
          </button>
        </div>
      </div>
    </div>
  );
};

export default CriticsReview;