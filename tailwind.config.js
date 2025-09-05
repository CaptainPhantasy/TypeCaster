/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'stage-black': '#0A0A0A',
        'velvet-curtain': '#660000',
        'velvet-shadow': '#330000',
        'spotlight-white': '#FFFEF0',
        'spotlight-yellow': '#FFE5B4',
        'footlight-amber': '#FFB347',
        'marquee-gold': '#FFD700',
        'backstage-blue': '#1E3A5F',
        'dressing-room': '#2C3E50',
        'mirror-lights': '#FFE4E1',
        'standing-ovation': '#00FF88',
        'stage-fright': '#FF0055',
        'directors-note': '#4A90E2',
        'script-text': '#FFFFFF',
        'stage-direction': '#8892B0',
        'whisper-text': '#FFD700',
      },
      animation: {
        'flicker': 'flicker 2s infinite alternate',
        'keySpotlight': 'keySpotlight 0.3s ease-out',
        'openCurtainLeft': 'openCurtainLeft 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'openCurtainRight': 'openCurtainRight 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'rose-throw': 'roseThrow 2s ease-out forwards',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        keySpotlight: {
          '0%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 rgba(255,215,0,0.8)',
          },
          '50%': {
            transform: 'scale(1.1)',
            boxShadow: '0 0 30px rgba(255,215,0,0.8)',
          },
          '100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 10px rgba(255,215,0,0.4)',
          },
        },
        openCurtainLeft: {
          'to': { left: '-50%' },
        },
        openCurtainRight: {
          'to': { right: '-50%' },
        },
        roseThrow: {
          '0%': {
            transform: 'translateY(100vh) rotate(0deg)',
            opacity: '0',
          },
          '20%': {
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(-100vh) rotate(720deg)',
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [],
}