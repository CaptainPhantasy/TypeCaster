# Warpflow.md

## TypeCasting Error Analysis & Systematic Fix Plan

### Executive Summary

This document provides a comprehensive analysis of all errors, issues, and flow problems in the TypeCasting React application. After systematic investigation, I've identified 24 distinct issues categorized into four severity levels. This document outlines a Chain-of-Thought (COT) approach to fix all issues while preserving functionality.

---

## Expected User Flow

The TypeCasting app should follow this core user journey:

1. **Landing Page (Casting Call)**: User selects a theatrical role or enters continuation code
2. **Tutorial Screen**: First-time users see interactive tutorial (5 steps)
3. **Main Stage**: Core typing interface with real-time feedback
4. **Scene Progression**: Complete exercises → Review screen → Next scene
5. **Progress Tracking**: Automatic saves, continuation codes, performance history

---

## Issue Classification

### 🔴 CRITICAL ERRORS (Runtime Breaking)
*Issues that cause app crashes or prevent core functionality*

#### C1: Tutorial Screen Rendering Error
- **Location**: `TutorialScreen.jsx:63-64`
- **Issue**: CSS class references `from-backstage-blue to-dressing-room` don't exist
- **Impact**: Tutorial may not render properly, breaking first-time user flow
- **Root Cause**: Missing CSS variable definitions

#### C2: CSS Variable Dependencies Missing
- **Location**: Multiple components using theatrical theme variables
- **Issue**: Variables like `--backstage-blue`, `--dressing-room`, `--stage-black` undefined
- **Impact**: Styling breaks, components may be invisible
- **Root Cause**: CSS custom properties not properly defined

#### C3: TheatreContext Export Violation
- **Location**: `TheatreContext.jsx:475`
- **Issue**: ESLint error preventing hot reload: "Fast refresh only works when file exports components"
- **Impact**: Development experience degraded, potential runtime issues
- **Root Cause**: Mixing component export with utility functions

### 🟡 FUNCTIONAL ISSUES (Feature Breaking)
*Issues that break specific features but don't crash the app*

#### F1: Unused State Variables in CastingCall
- **Location**: `CastingCall.jsx:45`
- **Issue**: `isSubmitting` and `setIsSubmitting` declared but never used
- **Impact**: Dead code, potential confusion about submission states
- **Root Cause**: Incomplete implementation of loading states

#### F2: Missing Tutorial Integration
- **Location**: `App.jsx:148` (tutorial button in test reports error)
- **Issue**: Tutorial screen text doesn't match expected button text in tests
- **Impact**: Tutorial button may not work correctly
- **Root Cause**: Mismatch between tutorial steps and expected interactions

#### F3: BackstagePass Effect Dependency Warning
- **Location**: `BackstagePass.jsx:39`
- **Issue**: React Hook useEffect missing dependency `generateCurrentPass`
- **Impact**: Effect may not run when expected, causing stale closures
- **Root Cause**: Function dependency not included in dependency array

#### F4: useCallback Missing for Navigation Functions
- **Location**: `App.jsx:152, 213`
- **Issue**: `handleNextScene` and `navigateToScene` cause useEffect dependencies to change on every render
- **Impact**: Performance degradation, unnecessary re-renders
- **Root Cause**: Functions recreated on every render instead of memoized

#### F5: MainStage HandleSceneComplete Dependency Warning
- **Location**: `MainStage.jsx:149`
- **Issue**: `handleSceneComplete` function causes useEffect dependency changes
- **Impact**: Performance issues, potential infinite re-renders
- **Root Cause**: Non-memoized function in useEffect dependencies

### 🟠 CODE QUALITY ISSUES (Development & Maintenance)
*Issues that don't break functionality but impact maintainability*

#### Q1-Q10: Unused Variable Errors (10 instances)
- **Locations**: Various files with unused variables
- **Impact**: Code bloat, potential confusion
- **Examples**:
  - `scripts/tunnel.js:40` - `error` variable
  - `utils/backstagePass.js:68` - `prefix` variable
  - `tests/user-simulation.spec.js:1` - `expect` import
  - Multiple `e` parameters in catch blocks

#### Q11: Process.env Access in Non-Node Environment
- **Location**: `playwright.config.js:10`
- **Issue**: `process` undefined in browser context
- **Impact**: Configuration may fail in certain environments
- **Root Cause**: Node.js APIs used in browser-compatible files

### 🔵 ENHANCEMENT OPPORTUNITIES (UX Improvements)
*Areas for improvement that don't represent errors*

#### E1: Tutorial Button Text Mismatch
- **Location**: Tests expect "Start Typing", app shows "Let's Begin!"
- **Issue**: Inconsistent UI text between implementation and tests
- **Impact**: Test failures, user confusion
- **Root Cause**: Implementation and test expectations out of sync

---

## Chain-of-Thought Fix Strategy

### Phase 1: Critical Error Resolution (MUST FIX FIRST)
*These fixes are interdependent and must be done carefully to avoid breaking the app*

#### Step 1.1: Define Missing CSS Variables
```css
/* Add to src/styles/theatrical-theme.css or appropriate CSS file */
:root {
  --backstage-blue: #1e3a5f;
  --dressing-room: #2a1810;
  --stage-black: #0a0a0a;
  --marquee-gold: #fbbf24;
  --velvet-curtain: #8b1538;
  --spotlight-white: #ffffff;
}
```

#### Step 1.2: Fix TheatreContext Export Issue
- Move utility functions to separate file: `src/utils/theatreHelpers.js`
- Keep only the context component and hook in `TheatreContext.jsx`
- Update imports across the codebase

#### Step 1.3: Verify Tutorial Screen Rendering
- Test tutorial screen with proper CSS variables
- Ensure all theatrical theme classes work correctly

### Phase 2: Functional Issue Resolution (SAFE TO FIX)
*These can be fixed independently without affecting other systems*

#### Step 2.1: Fix React Hook Dependencies
- Wrap `handleNextScene` and `navigateToScene` in `useCallback`
- Fix `BackstagePass.jsx` effect dependency
- Wrap `handleSceneComplete` in `useCallback`

#### Step 2.2: Clean Up Unused State Variables
- Remove unused `isSubmitting` state in `CastingCall.jsx`
- Implement proper loading states if needed

#### Step 2.3: Fix Tutorial Integration
- Update tutorial button text to match expected interactions
- Ensure tutorial flow works end-to-end

### Phase 3: Code Quality Improvements (CLEANUP)
*Safe cleanup operations that improve maintainability*

#### Step 3.1: Remove Unused Variables
- Systematically remove all unused variable declarations
- Use ESLint auto-fix where safe
- For catch blocks, use `_` prefix for intentionally unused error parameters

#### Step 3.2: Fix Environment-Specific Code
- Add proper environment detection for `process.env` usage
- Ensure browser compatibility for all client-side code

### Phase 4: Enhancement Implementation (OPTIONAL)
*Improvements that enhance user experience*

#### Step 4.1: Standardize UI Text
- Create consistent terminology across app and tests
- Update either implementation or test expectations to match

---

## Implementation Risk Assessment

### HIGH RISK Changes
- **CSS Variable Definitions**: Could break styling across entire app
- **TheatreContext Refactor**: Could break state management throughout app
- **Navigation Function Changes**: Could break scene navigation

### MEDIUM RISK Changes
- **React Hook Fixes**: Could change component behavior
- **Tutorial Integration**: Could break first-time user experience

### LOW RISK Changes
- **Unused Variable Removal**: Safe cleanup operations
- **Text Standardization**: Cosmetic changes only

---

## Testing Strategy

### Before Each Phase
1. **Smoke Test**: Verify app loads without console errors
2. **User Flow Test**: Complete casting call → tutorial → first exercise
3. **Build Test**: Ensure `npm run build` succeeds
4. **Lint Test**: Check for new ESLint errors

### After Each Phase
1. **Regression Test**: Verify all previous functionality still works
2. **Feature Test**: Verify fixed issues are resolved
3. **Performance Test**: Check for any performance regressions

---

## Success Criteria

### Phase 1 Success (Critical)
- [ ] App loads without error boundary activation
- [ ] Tutorial screen renders with proper styling
- [ ] No console errors related to missing CSS variables
- [ ] Hot reload works in development

### Phase 2 Success (Functional)
- [ ] All React Hook warnings resolved
- [ ] Tutorial flow works end-to-end
- [ ] Scene navigation works smoothly
- [ ] No unnecessary re-renders occur

### Phase 3 Success (Quality)
- [ ] ESLint passes with no unused variable errors
- [ ] Code is clean and maintainable
- [ ] All environment-specific code works correctly

### Phase 4 Success (Enhancement)
- [ ] UI text is consistent throughout app
- [ ] Tests pass with updated expectations
- [ ] User experience is polished

---

## Rollback Plan

### If Critical Fixes Break the App
1. Immediately revert CSS variable changes
2. Restore original TheatreContext.jsx
3. Run smoke tests to verify app functionality
4. Re-approach fixes with smaller, incremental changes

### If Functional Fixes Cause Issues
1. Revert React Hook dependency changes
2. Restore original function definitions
3. Test specific features that were working before
4. Fix issues one at a time with individual testing

---

## Current Status Summary

- **Total Issues Identified**: 24
- **Critical Issues**: 3 (must fix for app stability)
- **Functional Issues**: 5 (should fix for feature completeness)
- **Quality Issues**: 11 (good to fix for maintainability)
- **Enhancement Opportunities**: 5 (nice to fix for polish)

The app is currently in a **partially functional** state where basic features work but there are underlying stability and quality issues that should be addressed systematically using the phased approach outlined above.
