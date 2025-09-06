import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Save } from 'lucide-react';

const ContinuationCode = ({ code, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    // Auto-show explanation after a short delay
    const timer = setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = code;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
    }
  };

  return (
    <div className="fixed inset-0 bg-stage-black/90 flex items-center justify-center z-[10000] p-4">
      <div className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 
                    backdrop-blur-md rounded-xl border-2 border-marquee-gold/50 
                    p-8 max-w-lg w-full shadow-2xl transform transition-all
                    animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-marquee-gold flex items-center gap-3">
              <Save className="w-8 h-8" />
              Your Continuation Code
            </h2>
            <p className="text-spotlight-yellow/80 mt-2">
              Your progress has been automatically saved!
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-marquee-gold/60 hover:text-marquee-gold" />
          </button>
        </div>

        {/* Code Display */}
        <div className="bg-stage-black/60 rounded-lg p-6 mb-6 border border-marquee-gold/20">
          <div className="flex items-center justify-between gap-4">
            <code className="font-mono text-2xl text-spotlight-yellow tracking-wider">
              {code}
            </code>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-marquee-gold/20 
                       hover:bg-marquee-gold/30 rounded-lg transition-all
                       border border-marquee-gold/40 group"
              aria-label="Copy code"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-marquee-gold group-hover:scale-110 transition-transform" />
                  <span className="text-marquee-gold text-sm font-medium">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="space-y-4 text-spotlight-yellow/90 animate-in fade-in duration-500">
            <div className="flex items-start gap-3">
              <span className="text-marquee-gold font-bold text-lg">→</span>
              <p className="text-sm">
                This code saves your current character, progress, and achievements
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-marquee-gold font-bold text-lg">→</span>
              <p className="text-sm">
                Enter it on the Casting Call screen to continue where you left off
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-marquee-gold font-bold text-lg">→</span>
              <p className="text-sm">
                Your code expires after 7 days, so save it somewhere safe!
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-marquee-gold text-stage-black font-bold 
                     rounded-lg hover:bg-spotlight-yellow transition-all
                     hover:scale-105 transform duration-200"
          >
            Continue Playing
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-marquee-gold/20 
                      rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-purple-600/20 
                      rounded-full blur-xl animate-pulse delay-300"></div>
      </div>
    </div>
  );
};

export default ContinuationCode;
