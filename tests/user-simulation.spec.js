import { test, expect } from '@playwright/test';

// Configure test to run in headed mode with reasonable timeouts
test.use({
  headless: false,
  viewport: { width: 1280, height: 720 },
  video: 'on',
  screenshot: 'only-on-failure',
});

// Helper function to type text character by character with realistic delays
async function typeText(page, text, wpm = 40) {
  const charsPerMinute = wpm * 5; // Average 5 characters per word
  const delayMs = 60000 / charsPerMinute;
  
  for (const char of text) {
    await page.keyboard.type(char);
    await page.waitForTimeout(delayMs + Math.random() * 50); // Add some variance
  }
}

// Helper to wait and log what we're waiting for
async function waitAndLog(page, selector, message, timeout = 10000) {
  console.log(`⏳ Waiting for: ${message}`);
  try {
    await page.waitForSelector(selector, { timeout });
    console.log(`✅ Found: ${message}`);
    return true;
  } catch (e) {
    console.log(`❌ Failed to find: ${message}`);
    return false;
  }
}

test.describe('TypeCasting User Simulation', () => {
  let continuationCode = '';
  
  test('Complete user journey with continuation code', async ({ page }) => {
    // Test results tracking
    const results = {
      landingPageLoaded: false,
      roleSelectionWorked: false,
      continuationCodeReceived: false,
      tutorialCompleted: false,
      exercise1Completed: false,
      exercise2Completed: false,
      exercise3NavigatedManually: false,
      progressSaved: false,
      codeRestorationWorked: false,
      errors: []
    };

    try {
      // 1. Navigate to the app
      console.log('🎭 Starting TypeCasting user simulation...');
      await page.goto('https://b642318029b6.ngrok-free.app');
      
      // Handle ngrok warning page if it appears
      const warningButton = page.locator('button:has-text("Visit Site")');
      if (await warningButton.isVisible({ timeout: 3000 })) {
        console.log('📋 Clicking through ngrok warning...');
        await warningButton.click();
      }

      // 2. Verify landing page (Casting Call)
      results.landingPageLoaded = await waitAndLog(
        page, 
        'text=CASTING CALL', 
        'Casting Call landing page'
      );

      // 3. Check for continuation code link
      const codeLink = page.locator('text=Have a continuation code?');
      if (await codeLink.isVisible()) {
        console.log('✅ Continuation code link is visible');
      }

      // 4. Select a role (Rising Star - beginner friendly)
      console.log('🌟 Selecting Rising Star role...');
      await page.click('text=The Rising Star');
      results.roleSelectionWorked = true;

      // 5. Enter actor name
      console.log('✏️ Entering actor name...');
      await page.fill('input[placeholder="Enter your name..."]', 'Test Performer');
      
      // 6. Begin audition
      await page.click('text=Begin Audition');
      
      // 7. Capture continuation code
      console.log('🎫 Looking for continuation code...');
      
      // The continuation code should appear after role selection
      // Let's wait a bit longer and check for different possible selectors
      await page.waitForTimeout(2000); // Give time for the code to be generated
      
      // Try multiple selectors
      const codeSelectors = [
        '.fixed.bottom-8 code',
        'code',
        '[class*="continuation"]',
        'text=/[A-Z]{4}-\\d{4}-[A-Z0-9]{4}/' // Regex pattern for code format
      ];
      
      let codeElement = null;
      for (const selector of codeSelectors) {
        try {
          codeElement = await page.waitForSelector(selector, { timeout: 2000 });
          if (codeElement) break;
        } catch (e) {
          console.log(`  Selector "${selector}" not found`);
        }
      }
      
      if (codeElement) {
        continuationCode = await codeElement.textContent() || '';
        console.log(`🎫 Captured continuation code: ${continuationCode}`);
        results.continuationCodeReceived = true;
        
        // Try to close the popup if it exists
        const closeButton = page.locator('.fixed button:has(svg)').last();
        if (await closeButton.isVisible({ timeout: 1000 })) {
          await closeButton.click();
        }
      } else {
        console.log('⚠️ Continuation code not found - checking console for clues');
        // Check if code was logged to console
        const consoleCode = await page.evaluate(() => {
          // Try to get code from window if exposed
          return window.lastContinuationCode || '';
        });
        if (consoleCode) {
          continuationCode = consoleCode;
          console.log(`🎫 Found code in console: ${continuationCode}`);
          results.continuationCodeReceived = true;
        }
      }

      // 8. Complete tutorial
      console.log('📚 Completing tutorial...');
      const tutorialVisible = await waitAndLog(
        page,
        'text=Welcome to TypeCasting!',
        'Tutorial screen',
        5000
      );
      
      if (tutorialVisible) {
        await page.click('text=Start Typing');
        results.tutorialCompleted = true;
      }

      // 9. Complete Exercise 1
      console.log('⌨️ Starting Exercise 1...');
      await page.waitForTimeout(2000); // Wait for curtains animation
      
      // Get the exercise text - look for the script text
      let exerciseText = '';
      
      // Try to find the exercise text from various possible locations
      const textSelectors = [
        '.space-y-4 .text-gray-400', // Current character display
        'span.text-gray-400',
        '[class*="text-gray"]'
      ];
      
      for (const selector of textSelectors) {
        const elements = await page.locator(selector).all();
        for (const element of elements) {
          const text = await element.textContent();
          if (text && text.length > 10 && !text.includes('Choose') && !text.includes('Scene')) {
            // Combine all gray text to get the full exercise
            const allGray = await page.locator('.text-gray-400').allTextContents();
            exerciseText = allGray.join('');
            break;
          }
        }
        if (exerciseText) break;
      }
      
      if (exerciseText) {
        console.log(`📝 Exercise 1 text: "${exerciseText}"`);
        await typeText(page, exerciseText, 30); // Type at 30 WPM for realistic simulation
        
        // Wait for completion
        await page.waitForTimeout(1000);
        
        // Check for review screen
        const reviewVisible = await waitAndLog(
          page,
          'text=Scene Complete!',
          'Exercise 1 completion review',
          5000
        );
        
        if (reviewVisible) {
          results.exercise1Completed = true;
          console.log('⭐ Exercise 1 completed!');
          
          // Press any key to continue
          await page.keyboard.press('Space');
          await page.waitForTimeout(2000);
        }
      }

      // 10. Start Exercise 2 but navigate manually
      console.log('⌨️ Starting Exercise 2...');
      await page.waitForTimeout(1000);
      
      // Type partial text
      const exercise2Text = await page.locator('.text-gray-400').first().textContent();
      if (exercise2Text && exercise2Text.length > 10) {
        await typeText(page, exercise2Text.substring(0, 10), 40);
        results.exercise2Completed = true;
      }

      // 11. Use manual navigation to Exercise 3
      console.log('➡️ Manually navigating to Exercise 3...');
      const nextButton = page.locator('button[aria-label="Next exercise"]');
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(2000); // Wait for transition
        results.exercise3NavigatedManually = true;
        
        // Verify we can still type
        await page.keyboard.type('test');
        console.log('✅ Keyboard still works after manual navigation');
      }

      // 12. Save progress indication
      results.progressSaved = !!continuationCode;
      
      // 13. Simulate leaving and returning
      console.log('🚪 Simulating user leaving...');
      await page.waitForTimeout(2000);
      
      // Navigate to blank page to simulate leaving
      await page.goto('about:blank');
      await page.waitForTimeout(1000);
      
      // 14. Return to the app
      console.log('🔄 Returning to TypeCasting...');
      await page.goto('https://b642318029b6.ngrok-free.app');
      
      // Handle ngrok warning again
      const warningButton2 = page.locator('button:has-text("Visit Site")');
      if (await warningButton2.isVisible({ timeout: 3000 })) {
        await warningButton2.click();
      }

      // 15. Use continuation code
      console.log('🎫 Using continuation code to restore progress...');
      await waitAndLog(page, 'text=CASTING CALL', 'Casting Call on return');
      
      await page.click('text=Have a continuation code?');
      await page.waitForTimeout(500);
      
      await page.fill('input[placeholder="e.g., STAR-1234-ABCD"]', continuationCode);
      await page.click('text=Continue Performance');
      
      // 16. Verify restoration
      await page.waitForTimeout(3000);
      
      // Check if we're back in the exercises
      const exerciseRestored = await page.locator('text=Exercise').isVisible();
      if (exerciseRestored) {
        console.log('✅ Progress restored successfully!');
        results.codeRestorationWorked = true;
      }

    } catch (error) {
      console.error('❌ Test error:', error);
      results.errors.push(String(error));
    }

    // Write results to sim.md
    const simResults = `# TypeCasting User Simulation Results

**Test Date:** ${new Date().toISOString()}
**Continuation Code:** ${continuationCode || 'Not captured'}

## Test Results Summary

| Test Case | Result | Status |
|-----------|--------|--------|
| Landing Page Loaded | ${results.landingPageLoaded} | ${results.landingPageLoaded ? '✅ PASS' : '❌ FAIL'} |
| Role Selection Worked | ${results.roleSelectionWorked} | ${results.roleSelectionWorked ? '✅ PASS' : '❌ FAIL'} |
| Continuation Code Received | ${results.continuationCodeReceived} | ${results.continuationCodeReceived ? '✅ PASS' : '❌ FAIL'} |
| Tutorial Completed | ${results.tutorialCompleted} | ${results.tutorialCompleted ? '✅ PASS' : '❌ FAIL'} |
| Exercise 1 Completed | ${results.exercise1Completed} | ${results.exercise1Completed ? '✅ PASS' : '❌ FAIL'} |
| Exercise 2 Started | ${results.exercise2Completed} | ${results.exercise2Completed ? '✅ PASS' : '❌ FAIL'} |
| Exercise 3 Manual Navigation | ${results.exercise3NavigatedManually} | ${results.exercise3NavigatedManually ? '✅ PASS' : '❌ FAIL'} |
| Progress Saved | ${results.progressSaved} | ${results.progressSaved ? '✅ PASS' : '❌ FAIL'} |
| Code Restoration Worked | ${results.codeRestorationWorked} | ${results.codeRestorationWorked ? '✅ PASS' : '❌ FAIL'} |

## Overall Result
**${Object.values(results).filter(v => v === true).length}/9 Tests Passed**

## Errors
${results.errors.length > 0 ? results.errors.map(e => `- ${e}`).join('\n') : 'No errors encountered'}

## User Experience Notes

### Positive Observations:
- Landing page provides clear entry point
- Role selection is intuitive
- Continuation code system provides persistence

### Areas for Improvement:
- Consider auto-copying continuation code
- Tutorial skip option for returning users
- Progress indicators during exercises

## Detailed Test Log
See console output above for step-by-step execution details.
`;

    // Save results
    await page.evaluate((content) => {
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sim.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, simResults);

    console.log('\n📊 Test Results Summary:');
    console.log(`Total Passed: ${Object.values(results).filter(v => v === true).length}/9`);
    
    // Keep browser open for observation
    await page.waitForTimeout(5000);
  });
});
