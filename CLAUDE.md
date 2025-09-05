# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Type Casting - Theatrical Typing Tutor

A React-based typing tutor application that transforms learning touch typing into a dramatic performance journey.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Architecture Overview

### Core State Management
The application uses React Context (`TheatreContext`) for global state management with a reducer pattern. The state is divided into four main domains:

1. **Production State** - Current act/scene, curtain state
2. **Performance State** - Active typing session metrics (WPM, accuracy, streak)
3. **Actor State** - User profile, achievements, saved progress
4. **Theatre Settings** - Sound, visual preferences

### Component Architecture

#### Stage Components (`/components/Stage/`)
- **MainStage.jsx**: Core typing interface, handles keyboard events and text comparison
  - Implements double-space panic mode for keyboard reveal
  - Tracks mistakes with Set for O(1) lookup
  - Calculates WPM in real-time: `(characters / 5) / minutes`
  
#### Orchestra Pit (`/components/OrchestraPit/`)
- **VirtualKeyboard.jsx**: Fading keyboard with finger mapping
  - Uses opacity based on performance metrics
  - Color-coded finger zones (L5-L2, R2-R5, THUMB)
  - Automatic fade calculation: reduces opacity by 0.1 every 20 correct keystrokes

#### Performance Tracking (`/components/Performance/`)
- **TempoMeter.jsx**: Real-time WPM and accuracy display with personal bests

#### Backstage (`/components/Backstage/`)
- **BackstagePass.jsx**: Save/load system using base64 encoding
  - Generates theatrical codes like "STAR-7X9K-SHOW-2B4M"
  - Stores up to 10 passes in localStorage

### Data Flow

1. **Typing Input Flow**:
   ```
   MainStage (keydown) → TheatreContext (RECORD_KEYSTROKE) → 
   Performance metrics update → VirtualKeyboard opacity adjustment
   ```

2. **Scene Progression**:
   ```
   Exercise complete → App.jsx (handleSceneComplete) → 
   Generate review → Update repertoire → Load next scene
   ```

### Key Technical Decisions

- **Tailwind CSS v4** with PostCSS plugin (`@tailwindcss/postcss`)
- **Vite** for fast HMR and optimized builds
- **Custom CSS variables** for theatrical colors (stage-black, velvet-curtain, marquee-gold, etc.)
- **localStorage** for persistence instead of external database
- **Set data structure** for mistake tracking (efficient membership testing)

### Lesson Content Structure

Located in `/src/data/scripts/`:
- **actOne.json**: Beginner content (home row, upper row, lower row)
- Each scene contains: warmUp, exercises[] with script, targetTempo, targetAccuracy

### Critical Files

1. **TheatreContext.jsx**: Central state management and business logic
2. **MainStage.jsx**: Core typing mechanics and error detection
3. **backstagePass.js**: Encoding/decoding save system
4. **App.jsx**: Main orchestration and scene management

### Performance Considerations

- Keyboard event handlers use `preventDefault()` to avoid browser defaults
- Component re-renders minimized through proper state structure
- Opacity transitions use CSS for GPU acceleration
- Debounced localStorage saves (1 second delay)

### Known Constraints

- No routing implemented (single-page application)
- Sound effects (Tone.js) installed but not integrated
- PWA manifest not configured
- Only Act 1 content implemented (3 scenes)
- No test coverage

## Development TODO List

### ✅ Completed
- [x] Initialize React project with Vite and install dependencies
- [x] Create project file structure and directories
- [x] Implement theatrical color scheme and base styles (Tailwind + custom CSS)
- [x] Create Theatre Context for global state management
- [x] Build CastingCall component for role selection
- [x] Create MainStage component for typing area
- [x] Implement VirtualKeyboard with fading system
- [x] Create TempoMeter for WPM tracking
- [x] Implement BackstagePass save system (encode/decode functionality)
- [x] Create lesson content structure (Act One scenes)
- [x] Create main App component with full UI structure
- [x] Build core Stage components (Curtains, Spotlight, MarqueeLights)
- [x] Implement typing mechanics with error tracking
- [x] Add performance metrics tracking

### 🎬 Current Status
**Application is now functional and running on http://localhost:5173/**

Key Features Working:
- Role selection with three character types
- Live typing with visual feedback
- Virtual keyboard with finger guides and fading
- Panic mode (double-tap space) 
- WPM and accuracy tracking
- Backstage Pass save/load system
- Scene progression through Act 1
- Performance reviews and history

### 🎭 Future Enhancements
- [ ] Add sound effects with Tone.js
- [ ] Implement full achievement system
- [ ] Set up PWA configuration for offline play
- [ ] Add more lesson content (Acts 2 & 3)
- [ ] Create adaptive difficulty system
- [ ] Build onboarding tutorial
- [ ] Add celebration animations
- [ ] Implement social features
- [ ] Create more theatrical transitions
- [ ] Add custom cursor designs

### 📝 Technical Notes
- Built with React 18 + Vite
- Styled with Tailwind CSS
- State managed via Context API
- Fully responsive design
- Keyboard event handling optimized
- Local storage for persistence