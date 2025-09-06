#!/usr/bin/env node

/**
 * TypeCasting Landing Page Reset Utility
 * 
 * Ensures the app starts on the Casting Call for testing and new users
 * Usage: node scripts/reset-to-casting.js
 */

console.log("🎭 TypeCasting Landing Page Reset");
console.log("================================");

// Instructions for browser console
const browserInstructions = `
// Paste this in your browser console to reset to Casting Call:

// Method 1: Clear all app data (recommended for testing)
localStorage.removeItem('typeCastingState');
localStorage.removeItem('typeCastingTutorialSeen');
console.log('✅ Cleared all app data - reload page to start fresh');

// Method 2: Just reset the actor role (keeps other progress)
const state = JSON.parse(localStorage.getItem('typeCastingState') || '{}');
if (state.actor) {
  state.actor.role = null;
  localStorage.setItem('typeCastingState', JSON.stringify(state));
  console.log('✅ Reset to Casting Call - reload page');
}

// Method 3: Force reload to Casting Call
window.location.reload();
`;

console.log("📝 Browser Console Instructions:");
console.log(browserInstructions);

console.log("\n🌐 For your ngrok deployment (https://b642318029b6.ngrok-free.app):");
console.log("1. Open browser console");
console.log("2. Paste the Method 1 code above");
console.log("3. Reload the page");
console.log("4. You'll see the Casting Call landing page");

console.log("\n🎮 For Remote Teammates:");
console.log("- New users automatically start on Casting Call");
console.log("- Returning users can click 'Back to Casting Call' button (Home icon)");
console.log("- Or press ESC and select 'Back to Casting Call'");

console.log("\n✨ Landing Page is Already Working!");
console.log("The app correctly starts on Casting Call for role selection.");
