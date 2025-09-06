/**
 * Test script to clear TypeCasting tutorial localStorage
 * and verify the new tutorial design is working
 */

console.log("🎭 TypeCasting Tutorial Test");
console.log("==============================");

// Clear the tutorial flag
localStorage.removeItem('typeCastingTutorialSeen');
console.log("✅ Tutorial localStorage cleared");

// Check current page
console.log(`📍 Current URL: ${window.location.href}`);
console.log(`🌐 Is Ngrok: ${window.location.hostname.includes('ngrok-free.app')}`);

// Check if new tutorial component exists
setTimeout(() => {
  const tutorialExists = document.querySelector('[class*="bg-gradient-to-br"]');
  console.log(`🎨 New tutorial styling detected: ${!!tutorialExists}`);
  
  // Force reload to show tutorial
  console.log("🔄 Reloading to trigger updated tutorial...");
  window.location.reload();
}, 1000);
