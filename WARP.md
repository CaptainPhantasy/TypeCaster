# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

TypeCasting is a React-based theatrical typing tutor that transforms learning touch typing into a dramatic performance journey. Users select character roles and progress through "acts" and "scenes" while learning proper typing technique with theatrical flair.

## Development Commands

### Core Development
```bash
# Install dependencies
npm install

# Start development server (runs on port 5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

### Testing
```bash
# Run Playwright tests (requires dev server running)
npx playwright test

# Run tests with UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/theatrical-ui.spec.js

# Run tests and generate report
npx playwright test --reporter=html
```

## Architecture Overview

### State Management Pattern
The application uses **React Context with useReducer** for centralized state management through `TheatreContext`. State is organized into four domains:

1. **Production State** - Current act/scene, curtain open/closed status
2. **Performance State** - Active typing metrics (WPM, accuracy, streak, mistakes)
3. **Actor State** - User profile, achievements, performance history, personal bests
4. **Theatre Settings** - Sound, visual preferences, accessibility options

### Component Architecture

#### Stage Components (`/src/components/Stage/`)
- **MainStage.jsx**: Core typing interface with keyboard event handling
  - Uses Set data structure for O(1) mistake tracking
  - Implements double-space panic mode (reveals keyboard)
  - Real-time WPM calculation: `(characters / 5) / minutes`
  - Auto-focus management and input recovery

#### Orchestra Pit (`/src/components/OrchestraPit/`)
- **VirtualKeyboard.jsx**: Progressive keyboard fading system
  - Opacity reduces by 0.1 every 20 correct keystrokes
  - Color-coded finger zones (L5-L2, R2-R5, THUMB)
  - Home row emphasis and finger mapping

#### Performance Systems (`/src/components/Performance/`)
- **TempoMeter.jsx**: Real-time WPM and accuracy display
- **CriticsReview.jsx**: Performance feedback with star ratings

#### Backstage (`/src/components/Backstage/`)
- **BackstagePass.jsx**: Save/load system using base64 encoding
  - Generates theatrical codes like "STAR-7X9K-SHOW-2B4M"
  - Stores up to 10 saves in localStorage

### Key Data Flows

#### Typing Input Processing
```
MainStage keydown → TheatreContext RECORD_KEYSTROKE → 
Performance metrics update → VirtualKeyboard opacity adjustment
```

#### Scene Progression
```
Exercise completion → App.jsx handleSceneComplete → 
Generate review → Update actor repertoire → Load next scene/exercise
```

### Technology Stack

- **React 19** with hooks and Context API
- **Vite** for fast development and optimized builds
- **Tailwind CSS v4** with PostCSS plugin (`@tailwindcss/postcss`)
- **Playwright** for end-to-end UI testing
- **Tone.js** (installed but not yet integrated for sound effects)
- **Lucide React** for icons
- **Recharts** for performance visualizations

### Critical Files for Development

1. **`src/contexts/TheatreContext.jsx`** - Central state management with all business logic
2. **`src/App.jsx`** - Main app orchestration, scene management, and error handling
3. **`src/components/Stage/MainStage.jsx`** - Core typing mechanics and input handling
4. **`src/data/scripts/actOne.json`** - Lesson content structure and progression
5. **`src/utils/backstagePass.js`** - Save/load encoding system

### Lesson Content Structure

Located in `/src/data/scripts/actOne.json`:
- Contains 3 scenes focusing on home row, upper row, and lower row
- Each scene has: warmUp text, exercises array, targetTempo, targetAccuracy
- Exercise structure: `{ id, title, script, tips, targetTempo, targetAccuracy }`

### Performance Optimizations

- **Memory Management**: Proper cleanup of event listeners and timeouts
- **Input Handling**: preventDefault() to avoid browser defaults
- **State Updates**: Debounced localStorage saves (1 second delay)
- **Animations**: CSS transitions for GPU acceleration
- **Focus Management**: Auto-recovery for lost input focus

### Known System Constraints

- Single-page application (no routing implemented)
- Only Act 1 content available (3 scenes total)
- Sound effects system installed but not integrated
- PWA manifest present but not fully configured
- localStorage-based persistence (no external database)

### Testing Strategy

The project uses Playwright for comprehensive UI testing covering:
- Theatrical visual elements and styling
- Role selection and character progression
- Main stage typing mechanics
- Virtual keyboard functionality
- Responsive design across device sizes
- Color scheme and typography verification

### Development Patterns

#### Error Handling
The codebase implements comprehensive error handling patterns:
- localStorage operations wrapped in try-catch blocks
- Context state validation and recovery
- Input focus management with fallbacks
- Performance calculation bounds checking

#### Theatrical Theming
Custom CSS variables define the theatrical color palette:
- `--stage-black`: Deep background color
- `--marquee-gold`: Accent color for highlights
- `--velvet-curtain`: Rich red for curtain elements
- `--spotlight-white`: Bright white for active elements

#### Accessibility Features
- Auto-focus management for keyboard input
- Screen reader compatible component structure
- Keyboard shortcuts for navigation (Ctrl+arrows, ESC menu)
- Mobile-responsive text sizing

## Rules from CLAUDE.md Integration

When working with this codebase, follow these architectural principles:

- Maintain the theatrical metaphor consistently across all components
- Use the existing Context/reducer pattern for state management
- Preserve the four-domain state structure (Production, Performance, Actor, Theatre)
- Keep mistake tracking efficient using Set data structures
- Implement proper cleanup for any new event listeners or timers
- Follow the established component naming convention (Stage, Orchestra Pit, Backstage, etc.)
- Ensure all new keyboard interactions use preventDefault() appropriately
- Maintain the base64 encoding pattern for any new save/load features

