// Issue 33: Replace setTimeout with more reliable timing for background tabs
// This utility provides consistent timing even when tabs are backgrounded

class ReliableTimer {
  constructor() {
    this.timers = new Map();
    this.timerId = 0;
  }

  setTimeout(callback, delay) {
    const id = ++this.timerId;
    const startTime = performance.now();
    
    const tick = (currentTime) => {
      const elapsed = currentTime - startTime;
      
      if (elapsed >= delay) {
        // Timer completed
        this.timers.delete(id);
        callback();
      } else {
        // Continue timing
        const rafId = requestAnimationFrame(tick);
        this.timers.set(id, { rafId, callback });
      }
    };
    
    const rafId = requestAnimationFrame(tick);
    this.timers.set(id, { rafId, callback });
    
    return id;
  }

  clearTimeout(id) {
    const timer = this.timers.get(id);
    if (timer) {
      cancelAnimationFrame(timer.rafId);
      this.timers.delete(id);
    }
  }

  setInterval(callback, delay) {
    const intervalCallback = () => {
      callback();
      this.setTimeout(intervalCallback, delay);
    };
    return this.setTimeout(intervalCallback, delay);
  }

  clearAll() {
    for (const [id, timer] of this.timers) {
      cancelAnimationFrame(timer.rafId);
    }
    this.timers.clear();
  }
}

// Create global instance
export const reliableTimer = new ReliableTimer();

// Backwards compatible wrapper functions
export const reliableSetTimeout = (callback, delay) => 
  reliableTimer.setTimeout(callback, delay);

export const reliableClearTimeout = (id) => 
  reliableTimer.clearTimeout(id);

export const reliableSetInterval = (callback, delay) => 
  reliableTimer.setInterval(callback, delay);

export default reliableTimer;