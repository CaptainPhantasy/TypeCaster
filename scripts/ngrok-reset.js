/**
 * TypeCasting Ngrok Reset Script
 * 
 * This script provides instructions to reset the ngrok deployment
 * back to the Casting Call landing page
 */

console.log(`
🎭 NGROK DEPLOYMENT RESET INSTRUCTIONS
====================================

The ngrok deployment is showing typing exercises instead of Casting Call 
because localStorage has saved an actor role. Here's how to fix it:

📱 BROWSER CONSOLE METHOD (Recommended):
------------------------------------------
1. Open the ngrok URL: https://b642318029b6.ngrok-free.app
2. Open browser console (F12 or right-click → Inspect → Console)
3. Paste this code:

localStorage.removeItem('typeCastingState');
localStorage.removeItem('typeCastingTutorialSeen');
console.log('✅ Reset complete!');
window.location.reload();

4. Press Enter and the page will reload to Casting Call


🖱️ UI METHOD (Alternative):
---------------------------
1. Click the "Back to Casting Call" button (Home icon) in the header
2. Confirm when prompted
3. This will reset the actor role and return to Casting Call


🔧 DEVELOPER METHOD:
-------------------
If you want to force ALL users to start on Casting Call, we can modify 
the app code to ignore localStorage temporarily.


🎯 VERIFICATION:
---------------
After reset, you should see:
- Character/Role selection screen
- "Choose your theatrical typing persona" message
- No typing exercises until a role is selected

The app correctly starts on Casting Call for new users, but localStorage 
persistence is keeping returning users in their previous role.
`);
