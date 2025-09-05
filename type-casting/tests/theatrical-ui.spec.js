import { test, expect } from '@playwright/test';

test.describe('Type Casting - Theatrical UI Verification', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to load
    await page.waitForTimeout(2000);
  });

  test('01 - Landing Page: Casting Call theatrical elements', async ({ page }) => {
    // Take full page screenshot
    await page.screenshot({ 
      path: 'test-results/01-casting-call-full.png', 
      fullPage: true 
    });

    // Check for marquee header
    const marqueeHeader = await page.locator('.marquee-header');
    await expect(marqueeHeader).toBeVisible();
    
    // Check for production title
    const productionTitle = await page.locator('.production-title');
    await expect(productionTitle).toBeVisible();
    
    // Check for "CASTING CALL" text
    await expect(page.locator('text=CASTING')).toBeVisible();
    
    // Check for marquee lights
    const marqueeLights = await page.locator('.marquee-bulb');
    const lightCount = await marqueeLights.count();
    expect(lightCount).toBeGreaterThan(0);
    
    // Check for theatrical background
    const body = await page.locator('body');
    const bgColor = await body.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Screenshot of header area
    await marqueeHeader.screenshot({ 
      path: 'test-results/02-marquee-header.png' 
    });
  });

  test('02 - Role Selection Cards with hover effects', async ({ page }) => {
    // Check for role cards
    const roleCards = await page.locator('button:has-text("The Confident Executive")');
    await expect(roleCards).toBeVisible();
    
    // Screenshot before hover
    await roleCards.screenshot({ 
      path: 'test-results/03-role-card-normal.png' 
    });
    
    // Hover and capture
    await roleCards.hover();
    await page.waitForTimeout(500);
    await roleCards.screenshot({ 
      path: 'test-results/04-role-card-hover.png' 
    });
    
    // Check for all three roles
    await expect(page.locator('text="The Confident Executive"')).toBeVisible();
    await expect(page.locator('text="The Rising Star"')).toBeVisible();
    await expect(page.locator('text="The Method Actor"')).toBeVisible();
  });

  test('03 - Select role and enter main stage', async ({ page }) => {
    // Click on Rising Star role
    await page.locator('text="The Rising Star"').click();
    await page.waitForTimeout(500);
    
    // Enter actor name
    await page.fill('input[placeholder="Enter your name..."]', 'Test Actor');
    
    // Screenshot of name entry
    await page.screenshot({ 
      path: 'test-results/05-name-entry.png' 
    });
    
    // Begin audition
    await page.locator('text="Begin Audition"').click();
    await page.waitForTimeout(2000);
    
    // Check if we're on the main stage
    const stageArea = await page.locator('.stage-area');
    await expect(stageArea).toBeVisible();
    
    // Full stage screenshot
    await page.screenshot({ 
      path: 'test-results/06-main-stage-full.png', 
      fullPage: true 
    });
  });

  test('04 - Main Stage theatrical elements', async ({ page }) => {
    // Quick setup to get to main stage
    await page.locator('text="The Rising Star"').click();
    await page.fill('input[placeholder="Enter your name..."]', 'Test Actor');
    await page.locator('text="Begin Audition"').click();
    await page.waitForTimeout(2000);
    
    // Check for curtains
    const curtains = await page.locator('.curtain-left, .curtain-right');
    const curtainCount = await curtains.count();
    console.log(`Found ${curtainCount} curtain elements`);
    
    // Check for script display
    const scriptDisplay = await page.locator('.script-display');
    if (await scriptDisplay.isVisible()) {
      await scriptDisplay.screenshot({ 
        path: 'test-results/07-script-display.png' 
      });
    }
    
    // Check for performance indicators
    const tempoMeter = await page.locator('.tempo-meter');
    if (await tempoMeter.isVisible()) {
      await tempoMeter.screenshot({ 
        path: 'test-results/08-tempo-meter.png' 
      });
    }
  });

  test('05 - Orchestra Pit (Virtual Keyboard)', async ({ page }) => {
    // Quick setup to get to main stage
    await page.locator('text="The Rising Star"').click();
    await page.fill('input[placeholder="Enter your name..."]', 'Test Actor');
    await page.locator('text="Begin Audition"').click();
    await page.waitForTimeout(2000);
    
    // Check for orchestra pit
    const orchestraPit = await page.locator('.orchestra-pit');
    await expect(orchestraPit).toBeVisible();
    
    // Screenshot of keyboard
    await orchestraPit.screenshot({ 
      path: 'test-results/09-orchestra-pit.png' 
    });
    
    // Check for keyboard keys
    const keys = await page.locator('.keyboard-key');
    const keyCount = await keys.count();
    expect(keyCount).toBeGreaterThan(20);
    
    // Check for stage directions label
    const pitLabel = await page.locator('.pit-label');
    if (await pitLabel.isVisible()) {
      await expect(page.locator('text="Orchestra Pit"')).toBeVisible();
    }
  });

  test('06 - Color scheme verification', async ({ page }) => {
    // Get computed styles
    const body = await page.locator('body');
    
    // Check background
    const styles = await body.evaluate(() => {
      const computed = window.getComputedStyle(document.body);
      const rootStyles = window.getComputedStyle(document.documentElement);
      
      return {
        bodyBg: computed.background,
        bodyColor: computed.color,
        stageBlack: rootStyles.getPropertyValue('--stage-black'),
        marqueeGold: rootStyles.getPropertyValue('--marquee-gold'),
        velvetCurtain: rootStyles.getPropertyValue('--velvet-curtain'),
        spotlightWhite: rootStyles.getPropertyValue('--spotlight-white')
      };
    });
    
    console.log('Color scheme:', styles);
    
    // Verify CSS variables are set
    expect(styles.stageBlack).toBeTruthy();
    expect(styles.marqueeGold).toBeTruthy();
    
    // Take screenshot with focus on colors
    await page.screenshot({ 
      path: 'test-results/10-color-verification.png',
      fullPage: true
    });
  });

  test('07 - Theatrical fonts verification', async ({ page }) => {
    // Check if theatrical fonts are loaded
    const fonts = await page.evaluate(() => {
      return {
        bodyFont: window.getComputedStyle(document.body).fontFamily,
        h1Font: document.querySelector('h1') ? 
          window.getComputedStyle(document.querySelector('h1')).fontFamily : null
      };
    });
    
    console.log('Fonts loaded:', fonts);
    
    // Check for Playfair Display or Bebas Neue
    const hasTheatricalFont = 
      fonts.bodyFont?.includes('Playfair') || 
      fonts.h1Font?.includes('Bebas');
    
    expect(hasTheatricalFont).toBeTruthy();
  });

  test('08 - Responsive theatrical design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'test-results/11-mobile-view.png',
      fullPage: true
    });
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'test-results/12-tablet-view.png',
      fullPage: true
    });
  });
});

// Helper to check if theatrical styles are applied
async function verifyTheatricalStyling(page) {
  const hasTheatricalClasses = await page.evaluate(() => {
    const marqueeHeader = document.querySelector('.marquee-header');
    const theatreContainer = document.querySelector('.theatre-container');
    const productionTitle = document.querySelector('.production-title');
    
    return {
      hasMarqueeHeader: !!marqueeHeader,
      hasTheatreContainer: !!theatreContainer,
      hasProductionTitle: !!productionTitle,
      bodyClasses: document.body.className
    };
  });
  
  return hasTheatricalClasses;
}