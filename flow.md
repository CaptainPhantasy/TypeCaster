# TypeCasting User Flow Analysis & Error Overview

## Expected User Flow

1. **Landing Page (CastingCall)**
   - User enters their name
   - User selects a role (Understudy, Rising Star, Leading Role, Method Actor)
   - Click "Begin Your Audition"

2. **Tutorial Screen (First Time)**
   - Show tutorial for first-time users
   - Allow skip/close

3. **Main Stage**
   - Show curtains opening animation
   - Display continuation code (2 seconds after curtains open, first scene only)
   - Show theatrical header with act/scene info
   - Display typing exercise with script
   - Virtual keyboard with progressive opacity
   - Track typing performance (tempo, accuracy, streak)
   - Show celebrations on completion

4. **Scene Completion**
   - Display performance review
   - Show "Press any key to continue"
   - Transition to next exercise/scene

5. **Navigation & Settings**
   - Header with scene navigation
   - Settings panel access
   - Continuation code access
   - Back to casting call option

## Current Critical Error

### Primary Issue: ReferenceError in MainStage Component
```
ReferenceError: Cannot access 'handleSceneComplete' before initialization
    at MainStage (MainStage.jsx:103:43)
```

This error occurs immediately after role selection, preventing the app from loading.

## Code Analysis

### 1. Import/Export Issues

#### App.jsx (Line 48)
```javascript
// Current (WRONG):
import MainStage from './components/Stage/MainStage';

// Issue: The import is correct, but there may be a build/bundling issue
```

#### ContinuationCode.jsx
```javascript
// Fixed: Duplicate import was removed
import React, { useState, useEffect } from 'react';
```

### 2. Component Definition Issues

#### MainStage.jsx
- The `handleSceneComplete` function is defined as a `useCallback`
- It's placed after `calculateTempo` 
- The error suggests a temporal dead zone issue, but the code structure appears correct
- Possible issue: Hot Module Replacement (HMR) not updating properly

### 3. State Management Issues

#### TheatreContext.jsx
- Continuation code generation happens in a useEffect when role is set
- Potential race condition between role setting and code generation

### 4. User Flow Breaks

#### Issue 1: Error Boundary Triggers Immediately
- **When**: After entering name and selecting role
- **Expected**: Smooth transition to tutorial/main stage
- **Actual**: Error boundary shows "Technical Difficulties"
- **Root Cause**: ReferenceError in MainStage component

#### Issue 2: Continuation Code Timing
- **When**: Should show 2 seconds after curtains open on first scene
- **Expected**: Non-intrusive display that auto-dismisses
- **Actual**: May show at wrong time or persist
- **Status**: Logic implemented but untested due to primary error

#### Issue 3: Tutorial Flow
- **When**: First-time users after role selection
- **Expected**: Tutorial screen appears
- **Actual**: Cannot verify due to primary error
- **Status**: Code appears correct

### 5. Potential Build/Environment Issues

1. **Node Version Mismatch**
   - Warning: Using Node.js 20.11.0, Vite requires 20.19+ or 22.12+
   - Using nvm to switch to v22, but warnings persist

2. **Hot Module Replacement**
   - Changes may not be properly reflected
   - Cached modules could be causing reference errors

3. **Vite Configuration**
   - Port conflicts (had to switch from 5173 to 5177)
   - Server configuration updated for external access

## Systematic Fix Plan

### Phase 1: Resolve Primary Error
1. **Clean Build Environment**
   - Clear node_modules and package-lock.json
   - Reinstall dependencies
   - Ensure consistent Node version

2. **Fix MainStage Component**
   - Refactor to use standard function declarations instead of useCallback for critical functions
   - Ensure all dependencies are properly declared
   - Add error boundaries within component

### Phase 2: Verify User Flow
1. **Landing to Main Stage**
   - Test role selection
   - Verify state updates
   - Check tutorial trigger

2. **Continuation Code**
   - Verify timing logic
   - Test auto-dismiss
   - Check manual access via header

3. **Scene Transitions**
   - Test completion flow
   - Verify curtain animations
   - Check state persistence

### Phase 3: Polish & Optimization
1. **Performance**
   - Remove unnecessary re-renders
   - Optimize keyboard event handling
   - Clean up memory leaks

2. **Error Handling**
   - Add graceful fallbacks
   - Improve error messages
   - Add recovery mechanisms

## File Structure Issues

### Components with Confirmed Issues:
1. `/src/components/Stage/MainStage.jsx` - Primary error source
2. `/src/contexts/TheatreContext.jsx` - Timing dependencies
3. `/src/App.jsx` - Integration issues

### Components Needing Verification:
1. `/src/components/Director/CastingCall.jsx`
2. `/src/components/Tutorial/TutorialScreen.jsx`
3. `/src/components/UI/ContinuationCode.jsx`
4. `/src/components/Navigation/NavigationHeader.jsx`

## Recommended Immediate Actions

1. **Stop current dev server and ngrok tunnel**
2. **Clean build artifacts**
3. **Fix MainStage component structure**
4. **Restart with fresh build**
5. **Test systematically through each flow step**

## Error Patterns to Address

1. **Temporal Dead Zone**: Functions used before declaration
2. **useCallback Dependencies**: Missing or circular dependencies
3. **State Race Conditions**: Async state updates not properly sequenced
4. **Build Cache**: Stale modules causing reference errors

---

*This document will be used for Chain of Thought planning to systematically fix all issues without breaking existing functionality.*


## Deep Dive: MainStage Component Error

### Error Line Number Analysis
- **Browser Reports**: Line 103:43
- **Actual Line 103**: Inside `calculateTempo` function body
- **handleSceneComplete Definition**: Starts at line 117
- **Discrepancy**: 14 line difference suggests source map issue

### Probable Root Cause: Vite Build Cache Corruption

The error message and line number mismatch strongly indicate that:
1. Vite is serving an outdated/cached version of MainStage.jsx
2. The browser's source maps are pointing to wrong line numbers
3. HMR (Hot Module Replacement) has failed to update the module

### Evidence Supporting Cache Issue:
1. Code structure is correct (functions defined before use)
2. Multiple restarts haven't fixed the issue
3. Line numbers don't match actual code
4. Error persists despite correct syntax

### Comprehensive Fix Procedure

#### Step 1: Complete Shutdown
```bash
# Kill all node processes
killall node

# Kill all vite processes
ps aux | grep vite | grep -v grep | awk '{print $2}' | xargs kill -9

# Kill ngrok
killall ngrok
```

#### Step 2: Clean All Caches
```bash
# Remove Vite cache
rm -rf node_modules/.vite

# Remove build artifacts
rm -rf dist

# Clear npm cache
npm cache clean --force

# Remove node_modules (nuclear option)
rm -rf node_modules
rm package-lock.json
```

#### Step 3: Rebuild from Scratch
```bash
# Use correct Node version
nvm use 22

# Fresh install
npm install

# Start with force flag
npm run dev -- --force
```

#### Step 4: Code Simplification (If cache clear doesn't work)

Replace the problematic callbacks in MainStage.jsx:

```javascript
// TEMPORARY FIX - Remove useCallback complexity
const calculateTempo = () => {
  console.log('FIXING ISSUE 11: Tempo Calculation Breaks');
  if (!startTimeRef.current || typedText.length === 0) return 0;
  
  const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
  if (elapsedSeconds <= 0) return 0;
  
  const minutes = elapsedSeconds / 60;
  const words = typedText.length / 5;
  
  if (minutes < 0.1) return 0;
  
  const wpm = words / minutes;
  return Math.min(Math.round(wpm), 999);
};

const handleSceneComplete = () => {
  console.log('FIXING ISSUE 26: Accuracy Calc Wrong');
  const tempo = calculateTempo();
  
  let accuracy = 100;
  if (typedText.length > 0) {
    accuracy = ((typedText.length - mistakes.size) / typedText.length) * 100;
    accuracy = Math.max(0, Math.min(100, accuracy));
  }
  
  actions.updateTempo(tempo);
  actions.updateAccuracy(accuracy);
  actions.updatePersonalBest({ 
    tempo, 
    accuracy, 
    streak: state.performance.noLookStreak 
  });
  
  if (accuracy >= 95) {
    setCelebrationType('perfect');
    setShowCelebration(true);
    if (celebrationTimeoutRef.current) {
      clearTimeout(celebrationTimeoutRef.current);
    }
    celebrationTimeoutRef.current = setTimeout(() => {
      setShowCelebration(false);
      celebrationTimeoutRef.current = null;
    }, 3000);
  } else if (accuracy >= 85) {
    setCelebrationType('applause');
    setShowCelebration(true);
    if (celebrationTimeoutRef.current) {
      clearTimeout(celebrationTimeoutRef.current);
    }
    celebrationTimeoutRef.current = setTimeout(() => {
      setShowCelebration(false);
      celebrationTimeoutRef.current = null;
    }, 2500);
  }
  
  if (onSceneComplete) {
    onSceneComplete({
      tempo,
      accuracy,
      mistakes: mistakes.size,
      noLookStreak: state.performance.noLookStreak
    });
  }
};

// Update the useEffect to check if functions exist
useEffect(() => {
  if (currentIndex === currentScript.length && currentIndex > 0 && handleSceneComplete) {
    handleSceneComplete();
  }
}, [currentIndex, currentScript.length, typedText.length, mistakes.size]);
```

### Alternative Diagnosis

If the cache clear doesn't resolve the issue, the problem might be:

1. **Bundler Transform Issue**: Vite/ESBuild might be transforming the code incorrectly
2. **React Fast Refresh**: The React Fast Refresh plugin might be corrupting the component
3. **Circular Module Dependencies**: Check if MainStage is imported circularly

### Verification Steps After Fix

1. Check browser console for the specific error line
2. Verify source maps are correct (browser should show actual code)
3. Test the complete user flow from landing to typing
4. Ensure no performance degradation from removing useCallback

### Long-term Solution

Once working, gradually reintroduce optimizations:
1. Add back useCallback with careful dependency management
2. Use React.memo for child components
3. Implement proper error boundaries
4. Add performance monitoring

---

*Next Step: Execute the cache clearing procedure and test with simplified code if necessary.*


## Executive Summary

### The Core Problem
**A Vite build cache/source map issue is causing a ReferenceError in MainStage.jsx**

The browser reports an error at line 103:43, but the actual code at that line is correct. This mismatch indicates the browser is running an outdated version of the code.

### Why Previous Fixes Failed
1. We've been fixing the "correct" code while the browser runs old cached code
2. Hot Module Replacement (HMR) is not updating the MainStage component
3. Source maps are pointing to wrong line numbers

### The Solution Path

#### Option 1: Nuclear Cache Clear (Recommended First)
1. Stop all processes
2. Delete all cache directories
3. Remove node_modules
4. Fresh install with Node 22
5. Force start Vite

#### Option 2: Code Simplification (If Option 1 Fails)
1. Remove all useCallback wrappers temporarily
2. Use plain function declarations
3. Simplify the component to bypass the caching issue
4. Gradually reintroduce optimizations

#### Option 3: Alternative Development Setup
1. Try a different port (e.g., 3000)
2. Disable HMR temporarily
3. Use a different browser/incognito mode
4. Consider using npm run build && npm run preview

### Testing Checklist After Fix

- [ ] User can enter name in CastingCall
- [ ] User can select role
- [ ] App transitions to Tutorial (first time) or MainStage
- [ ] Curtains open properly
- [ ] Continuation code appears after 2 seconds (first scene only)
- [ ] User can type and see real-time feedback
- [ ] Keyboard opacity changes based on performance
- [ ] Scene completion shows celebration
- [ ] Performance review appears
- [ ] User can continue to next scene
- [ ] Settings panel opens/closes
- [ ] Navigation header functions work
- [ ] Back to casting call works

### Known Working State
Before the error, the following were confirmed working:
- CastingCall component (name entry, role selection)
- TheatreContext (state management)
- CSS animations and styling
- Component imports and exports

### What Changed
The error appeared after:
1. Adding the continuation code display logic
2. Fixing import issues
3. Multiple dev server restarts

This suggests the issue is environmental rather than code-based.

### Final Recommendation
1. Execute the complete cache clear procedure
2. If that fails, implement the simplified code version
3. Once working, carefully reintroduce optimizations
4. Document any additional issues discovered during testing

---

*This document represents a complete analysis of the TypeCasting application's current state and provides a clear path to resolution.*
