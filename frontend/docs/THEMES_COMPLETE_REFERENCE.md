# Complete Themes Reference

This document contains the complete CSS definitions for all 48 theme combinations in the Task Writer application.

## Theme Structure

Each of the 12 color schemes has 4 variants:
1. Light mode: `.color-{scheme}`
2. Dark mode: `.color-{scheme}.dark`
3. High contrast light: `.color-{scheme}.high-contrast:not(.dark)`
4. High contrast dark: `.color-{scheme}.high-contrast.dark`

## Complete CSS Definitions

```css
/* Color Scheme Theme Definitions
 * Task Writer - Dual-Dimension Theming System
 * 
 * Each color scheme has 4 variants:
 * 1. Light mode: .color-{scheme}
 * 2. Dark mode: .color-{scheme}.dark
 * 3. High contrast light: .color-{scheme}.high-contrast:not(.dark)
 * 4. High contrast dark: .color-{scheme}.high-contrast.dark
 *
 * CSS Specificity Order (CRITICAL):
 * 1. Base color scheme (lowest)
 * 2. Dark mode override (medium)
 * 3. High contrast override (highest)
 */

/* =============================================================================
   ONYX COLOR SCHEME (Default - migrated from variables.css)
   Sophisticated charcoal and washed white theme
   ============================================================================= */

.color-onyx {
  /* Light mode - matches existing theme */
  --background: #ffffff;
  --surface: #f5f5f5;
  --surface-hover: rgba(0, 0, 0, 0.05);
  --text: #121212;
  --text-muted: #6e6e6e;
  --text-background: #ffffff;
  --accent: #121212;
  --accent-hover: #2a2a2a;
  --border: #e5e5e5;
  --border-thin: rgba(229, 229, 229, 0.2);
  --input-bg: #ffffff;
  --scrollbar: #d1d5db;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  /* Status colors - theme-aware */
  --status-error: #dc2626;
  --status-error-bg: rgba(220, 38, 38, 0.1);
  --status-warning: #d97706;
  --status-warning-bg: rgba(217, 119, 6, 0.1);
  --status-info: #2563eb;
  --status-info-bg: rgba(37, 99, 235, 0.1);
  --status-success: #059669;
  --status-success-bg: rgba(5, 150, 105, 0.1);
  
  /* Enhanced effects (none for regular theme) */
  --accent-glow: none;
  --text-glow: none;
  --neon-border: none;
}

.color-onyx.dark {
  /* Dark mode - matches existing dark theme */
  --background: #121212;
  --surface: #1e1e1e;
  --surface-hover: rgba(255, 255, 255, 0.05);
  --text: #ffffff;
  --text-muted: #9e9e9e;
  --text-background: #121212;
  --accent: #ffffff;
  --accent-hover: #e0e0e0;
  --border: #2a2a2a;
  --border-thin: rgba(42, 42, 42, 0.3);
  --input-bg: #2a2a2a;
  --scrollbar: #3a3a3a;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  /* Status colors - theme-aware (brighter for dark mode) */
  --status-error: #ef4444;
  --status-error-bg: rgba(239, 68, 68, 0.15);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.15);
  --status-info: #3b82f6;
  --status-info-bg: rgba(59, 130, 246, 0.15);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.15);
}

.color-onyx.high-contrast:not(.dark) {
  /* Light high contrast */
  --background: #ffffff !important;
  --surface: #f0f0f0 !important;
  --surface-hover: rgba(0, 0, 0, 0.15) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #0000ff !important;
  --accent-hover: #0066ff !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  /* Status colors - high contrast light */
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #0066cc !important;
  --status-info-bg: rgba(0, 102, 204, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  /* Enhanced effects (none for high contrast) */
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

.color-onyx.high-contrast.dark {
  /* Dark high contrast */
  --background: #000000 !important;
  --surface: #1a1a1a !important;
  --surface-hover: rgba(255, 255, 255, 0.15) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #ffff00 !important;
  --accent-hover: #ffff66 !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #1a1a1a !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(255, 255, 255, 0.3) !important;
  
  /* Status colors - high contrast dark */
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.25) !important;
  --status-info: #3399ff !important;
  --status-info-bg: rgba(51, 153, 255, 0.25) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.25) !important;
  
  /* Enhanced effects (none for high contrast) */
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

/* =============================================================================
   OCEAN BLUE COLOR SCHEME
   Calming blues and teals for focused work
   ============================================================================= */

.color-ocean-blue {
  /* Light ocean blue */
  --background: #ffffff;
  --surface: #f0f9ff;
  --surface-hover: rgba(14, 165, 233, 0.05);
  --text: #0c4a6e;
  --text-muted: #0369a1;
  --text-background: #ffffff;
  --accent: #0284c7;
  --accent-hover: #0369a1;
  --border: #bae6fd;
  --border-thin: rgba(14, 165, 233, 0.2);
  --input-bg: #ffffff;
  --scrollbar: #94a3b8;
  --shadow: 0 2px 8px rgba(14, 165, 233, 0.1);
  
  /* Status colors - ocean blue theme */
  --status-error: #e11d48;
  --status-error-bg: rgba(225, 29, 72, 0.1);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.1);
  --status-info: #0284c7;
  --status-info-bg: rgba(2, 132, 199, 0.1);
  --status-success: #0d9488;
  --status-success-bg: rgba(13, 148, 136, 0.1);
  
  /* Enhanced effects (subtle for ocean blue) */
  --accent-glow: none;
  --text-glow: none;
  --neon-border: none;
}

.color-ocean-blue.dark {
  /* Dark ocean blue */
  --background: #0c1821;
  --surface: #164e63;
  --surface-hover: rgba(14, 165, 233, 0.1);
  --text: #f0f9ff;
  --text-muted: #bae6fd;
  --text-background: #0c1821;
  --accent: #0ea5e9;
  --accent-hover: #38bdf8;
  --border: #0e7490;
  --border-thin: rgba(14, 116, 144, 0.6);
  --input-bg: #164e63;
  --scrollbar: #0ea5e9;
  --shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
  
  /* Status colors - ocean blue dark */
  --status-error: #f43f5e;
  --status-error-bg: rgba(244, 63, 94, 0.15);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.15);
  --status-info: #0ea5e9;
  --status-info-bg: rgba(14, 165, 233, 0.15);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.15);
}

.color-ocean-blue.high-contrast:not(.dark) {
  /* Light high contrast ocean blue */
  --background: #ffffff !important;
  --surface: #e0f7fa !important;
  --surface-hover: rgba(0, 0, 255, 0.15) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #0000ff !important;
  --accent-hover: #0066ff !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  /* Status colors - high contrast ocean blue light */
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #0066cc !important;
  --status-info-bg: rgba(0, 102, 204, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  /* Enhanced effects (none for high contrast) */
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

.color-ocean-blue.high-contrast.dark {
  /* Dark high contrast ocean blue */
  --background: #000000 !important;
  --surface: #001122 !important;
  --surface-hover: rgba(0, 170, 255, 0.15) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #00aaff !important;
  --accent-hover: #33bbff !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #001122 !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(255, 255, 255, 0.3) !important;
  
  /* Status colors - high contrast ocean blue dark */
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.25) !important;
  --status-info: #3399ff !important;
  --status-info-bg: rgba(51, 153, 255, 0.25) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.25) !important;
  
  /* Enhanced effects (none for high contrast) */
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

/* =============================================================================
   FOREST GREEN COLOR SCHEME
   Natural greens and earth tones, easy on eyes
   ============================================================================= */

.color-forest-green {
  /* Light forest green */
  --background: #ffffff;
  --surface: #f6fdf6;
  --surface-hover: rgba(34, 197, 94, 0.05);
  --text: #14532d;
  --text-muted: #166534;
  --text-background: #ffffff;
  --accent: #16a34a;
  --accent-hover: #15803d;
  --border: #bbf7d0;
  --border-thin: rgba(34, 197, 94, 0.2);
  --input-bg: #ffffff;
  --scrollbar: #86efac;
  --shadow: 0 2px 8px rgba(34, 197, 94, 0.1);
  
  /* Status colors - forest green theme */
  --status-error: #dc2626;
  --status-error-bg: rgba(220, 38, 38, 0.1);
  --status-warning: #ea580c;
  --status-warning-bg: rgba(234, 88, 12, 0.1);
  --status-info: #0369a1;
  --status-info-bg: rgba(3, 105, 161, 0.1);
  --status-success: #15803d;
  --status-success-bg: rgba(21, 128, 61, 0.1);
  
  /* Enhanced effects (none for forest green) */
  --accent-glow: none;
  --text-glow: none;
  --neon-border: none;
}

.color-forest-green.dark {
  /* Dark forest green */
  --background: #0a1f0f;
  --surface: #15432a;
  --surface-hover: rgba(34, 197, 94, 0.1);
  --text: #dcfce7;
  --text-muted: #bbf7d0;
  --text-background: #0a1f0f;
  --accent: #22c55e;
  --accent-hover: #4ade80;
  --border: #166534;
  --border-thin: rgba(22, 101, 52, 0.6);
  --input-bg: #15432a;
  --scrollbar: #22c55e;
  --shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
  
  /* Status colors - forest green dark */
  --status-error: #ef4444;
  --status-error-bg: rgba(239, 68, 68, 0.15);
  --status-warning: #f97316;
  --status-warning-bg: rgba(249, 115, 22, 0.15);
  --status-info: #0ea5e9;
  --status-info-bg: rgba(14, 165, 233, 0.15);
  --status-success: #22c55e;
  --status-success-bg: rgba(34, 197, 94, 0.15);
}

.color-forest-green.high-contrast:not(.dark) {
  /* Light high contrast forest green */
  --background: #ffffff !important;
  --surface: #e8f5e8 !important;
  --surface-hover: rgba(0, 128, 0, 0.15) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #008000 !important;
  --accent-hover: #006600 !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  /* Status colors - high contrast forest green light */
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #0066cc !important;
  --status-info-bg: rgba(0, 102, 204, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  /* Enhanced effects (none for high contrast) */
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

.color-forest-green.high-contrast.dark {
  /* Dark high contrast forest green */
  --background: #000000 !important;
  --surface: #001100 !important;
  --surface-hover: rgba(0, 255, 0, 0.15) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #00ff00 !important;
  --accent-hover: #33ff33 !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #001100 !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(255, 255, 255, 0.3) !important;
  
  /* Status colors - high contrast forest green dark */
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.25) !important;
  --status-info: #3399ff !important;
  --status-info-bg: rgba(51, 153, 255, 0.25) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.25) !important;
  
  /* Enhanced effects (none for high contrast) */
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

/* =============================================================================
   ROYAL PURPLE COLOR SCHEME
   Elegant purples for creative work
   ============================================================================= */

.color-royal-purple {
  /* Light royal purple */
  --background: #ffffff;
  --surface: #faf5ff;
  --surface-hover: rgba(147, 51, 234, 0.05);
  --text: #581c87;
  --text-muted: #7c2d92;
  --text-background: #ffffff;
  --accent: #9333ea;
  --accent-hover: #7c3aed;
  --border: #ddd6fe;
  --border-thin: rgba(147, 51, 234, 0.2);
  --input-bg: #ffffff;
  --scrollbar: #c4b5fd;
  --shadow: 0 2px 8px rgba(147, 51, 234, 0.1);
  
  /* Status colors - royal purple theme */
  --status-error: #e11d48;
  --status-error-bg: rgba(225, 29, 72, 0.1);
  --status-warning: #d97706;
  --status-warning-bg: rgba(217, 119, 6, 0.1);
  --status-info: #7c3aed;
  --status-info-bg: rgba(124, 58, 237, 0.1);
  --status-success: #059669;
  --status-success-bg: rgba(5, 150, 105, 0.1);
  
  /* Enhanced effects (none for royal purple) */
  --accent-glow: none;
  --text-glow: none;
  --neon-border: none;
}

.color-royal-purple.dark {
  /* Dark royal purple */
  --background: #1a0f2e;
  --surface: #2d1b4e;
  --surface-hover: rgba(147, 51, 234, 0.1);
  --text: #e9d5ff;
  --text-muted: #ddd6fe;
  --text-background: #1a0f2e;
  --accent: #a855f7;
  --accent-hover: #c084fc;
  --border: #6b21a8;
  --border-thin: rgba(107, 33, 168, 0.6);
  --input-bg: #2d1b4e;
  --scrollbar: #a855f7;
  --shadow: 0 2px 8px rgba(147, 51, 234, 0.3);
  
  /* Status colors - royal purple dark */
  --status-error: #f43f5e;
  --status-error-bg: rgba(244, 63, 94, 0.15);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.15);
  --status-info: #a855f7;
  --status-info-bg: rgba(168, 85, 247, 0.15);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.15);
}

.color-royal-purple.high-contrast:not(.dark) {
  /* Light high contrast royal purple */
  --background: #ffffff !important;
  --surface: #f0e6ff !important;
  --surface-hover: rgba(128, 0, 128, 0.15) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #800080 !important;
  --accent-hover: #660066 !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  /* Status colors - high contrast royal purple light */
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #0066cc !important;
  --status-info-bg: rgba(0, 102, 204, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  /* Enhanced effects (none for high contrast) */
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

.color-royal-purple.high-contrast.dark {
  /* Dark high contrast royal purple */
  --background: #000000 !important;
  --surface: #220011 !important;
  --surface-hover: rgba(255, 0, 255, 0.15) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #ff00ff !important;
  --accent-hover: #ff33ff !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #220011 !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(255, 255, 255, 0.3) !important;
  
  /* Status colors - high contrast royal purple dark */
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.25) !important;
  --status-info: #3399ff !important;
  --status-info-bg: rgba(51, 153, 255, 0.25) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.25) !important;
  
  /* Enhanced effects (none for high contrast) */
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

/* =============================================================================
   CYBERPUNK COLOR SCHEME
   High-tech neon aesthetic with enhanced effects
   ============================================================================= */

.color-cyberpunk {
  /* Light cyberpunk - neon on light background */
  --background: #ffffff;
  --surface: #f5f5f5;
  --surface-hover: rgba(255, 0, 255, 0.05);
  --text: #000000;
  --text-muted: #333333;
  --text-background: #ffffff;
  --accent: #ff00ff;
  --accent-hover: #cc00cc;
  --border: #00ffff;
  --border-thin: rgba(0, 255, 255, 0.4);
  --input-bg: #ffffff;
  --scrollbar: #ff00ff;
  --shadow: 0 0 20px rgba(255, 0, 255, 0.3), 0 0 40px rgba(0, 255, 255, 0.2);
  
  /* Status colors - cyberpunk neon */
  --status-error: #ff0066;
  --status-error-bg: rgba(255, 0, 102, 0.2);
  --status-warning: #ffaa00;
  --status-warning-bg: rgba(255, 170, 0, 0.2);
  --status-info: #00ffff;
  --status-info-bg: rgba(0, 255, 255, 0.2);
  --status-success: #00ff00;
  --status-success-bg: rgba(0, 255, 0, 0.2);
  
  /* Enhanced cyberpunk effects */
  --accent-glow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
  --text-glow: 0 0 5px currentColor, 0 0 10px currentColor;
  --neon-border: 0 0 5px currentColor, 0 0 10px currentColor, inset 0 0 5px currentColor;
}

.color-cyberpunk.dark {
  /* Dark cyberpunk - maximum neon intensity */
  --background: #000000;
  --surface: #0a0a0a;
  --surface-hover: rgba(0, 255, 255, 0.1);
  --text: #00ff00;
  --text-muted: #00cc00;
  --text-background: #000000;
  --accent: #00ffff;
  --accent-hover: #33ffff;
  --border: #ff00ff;
  --border-thin: rgba(255, 0, 255, 0.6);
  --input-bg: #0a0a0a;
  --scrollbar: #00ff00;
  --shadow: 0 0 30px rgba(0, 255, 255, 0.6), 0 0 60px rgba(255, 0, 255, 0.4), 0 0 90px rgba(0, 255, 0, 0.2);
  
  /* Status colors - cyberpunk neon dark */
  --status-error: #ff0066;
  --status-error-bg: rgba(255, 0, 102, 0.25);
  --status-warning: #ffaa00;
  --status-warning-bg: rgba(255, 170, 0, 0.25);
  --status-info: #00ffff;
  --status-info-bg: rgba(0, 255, 255, 0.25);
  --status-success: #00ff00;
  --status-success-bg: rgba(0, 255, 0, 0.25);
  
  /* Intense cyberpunk effects for dark mode */
  --accent-glow: 0 0 15px currentColor, 0 0 30px currentColor, 0 0 45px currentColor;
  --text-glow: 0 0 8px currentColor, 0 0 15px currentColor;
  --neon-border: 0 0 8px currentColor, 0 0 15px currentColor, inset 0 0 8px currentColor;
}

.color-cyberpunk.high-contrast:not(.dark) {
  /* Light high contrast cyberpunk */
  --background: #ffffff !important;
  --surface: #000000 !important;
  --surface-hover: rgba(255, 0, 255, 0.15) !important;
  --text: #00ff00 !important;
  --text-muted: #00ff00 !important;
  --text-background: #ffffff !important;
  --accent: #ff00ff !important;
  --accent-hover: #ff33ff !important;
  --border: #00ffff !important;
  --border-thin: #00ffff !important;
  --input-bg: #ffffff !important;
  --scrollbar: #ff00ff !important;
  --shadow: 0 0 20px rgba(255, 0, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.6) !important;
  
  /* Status colors - high contrast cyberpunk light */
  --status-error: #ff0066 !important;
  --status-error-bg: rgba(255, 0, 102, 0.3) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.3) !important;
  --status-info: #00ffff !important;
  --status-info-bg: rgba(0, 255, 255, 0.3) !important;
  --status-success: #00ff00 !important;
  --status-success-bg: rgba(0, 255, 0, 0.3) !important;
  
  /* Enhanced cyberpunk effects */
  --accent-glow: 0 0 12px currentColor, 0 0 24px currentColor, 0 0 36px currentColor !important;
  --text-glow: 0 0 6px currentColor, 0 0 12px currentColor !important;
  --neon-border: 0 0 6px currentColor, 0 0 12px currentColor, inset 0 0 6px currentColor !important;
}

.color-cyberpunk.high-contrast.dark {
  /* Dark high contrast cyberpunk - ultimate neon */
  --background: #000000 !important;
  --surface: #111111 !important;
  --surface-hover: rgba(0, 255, 255, 0.2) !important;
  --text: #00ff00 !important;
  --text-muted: #00ff00 !important;
  --text-background: #000000 !important;
  --accent: #00ffff !important;
  --accent-hover: #33ffff !important;
  --border: #ff00ff !important;
  --border-thin: #ff00ff !important;
  --input-bg: #111111 !important;
  --scrollbar: #00ff00 !important;
  --shadow: 0 0 40px rgba(0, 255, 255, 0.8), 0 0 80px rgba(255, 0, 255, 0.6), 0 0 120px rgba(0, 255, 0, 0.4) !important;
  
  /* Status colors - high contrast cyberpunk dark */
  --status-error: #ff0066 !important;
  --status-error-bg: rgba(255, 0, 102, 0.4) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.4) !important;
  --status-info: #00ffff !important;
  --status-info-bg: rgba(0, 255, 255, 0.4) !important;
  --status-success: #00ff00 !important;
  --status-success-bg: rgba(0, 255, 0, 0.4) !important;
  
  /* Ultimate cyberpunk effects */
  --accent-glow: 0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor !important;
  --text-glow: 0 0 10px currentColor, 0 0 20px currentColor !important;
  --neon-border: 0 0 10px currentColor, 0 0 20px currentColor, inset 0 0 10px currentColor !important;
}

/* =============================================================================
   SUNSET ORANGE COLOR SCHEME
   Warm energetic oranges for creative work
   ============================================================================= */

.color-sunset-orange {
  /* Light sunset orange */
  --background: #ffffff;
  --surface: #fff7ed;
  --surface-hover: rgba(234, 88, 12, 0.05);
  --text: #9a3412;
  --text-muted: #c2410c;
  --text-background: #ffffff;
  --accent: #ea580c;
  --accent-hover: #dc2626;
  --border: #fed7aa;
  --border-thin: rgba(234, 88, 12, 0.2);
  --input-bg: #ffffff;
  --scrollbar: #fb923c;
  --shadow: 0 2px 8px rgba(234, 88, 12, 0.1);
  
  /* Status colors - sunset orange theme */
  --status-error: #dc2626;
  --status-error-bg: rgba(220, 38, 38, 0.1);
  --status-warning: #ea580c;
  --status-warning-bg: rgba(234, 88, 12, 0.1);
  --status-info: #0369a1;
  --status-info-bg: rgba(3, 105, 161, 0.1);
  --status-success: #059669;
  --status-success-bg: rgba(5, 150, 105, 0.1);
  
  /* Enhanced effects (warm glow for sunset orange) */
  --accent-glow: 0 0 8px rgba(234, 88, 12, 0.4);
  --text-glow: 0 0 4px rgba(234, 88, 12, 0.3);
  --neon-border: 0 0 6px rgba(234, 88, 12, 0.3);
}

.color-sunset-orange.dark {
  /* Dark sunset orange */
  --background: #1f1108;
  --surface: #431a03;
  --surface-hover: rgba(234, 88, 12, 0.1);
  --text: #fff7ed;
  --text-muted: #fed7aa;
  --text-background: #1f1108;
  --accent: #f97316;
  --accent-hover: #fb923c;
  --border: #9a3412;
  --border-thin: rgba(154, 52, 18, 0.6);
  --input-bg: #431a03;
  --scrollbar: #f97316;
  --shadow: 0 2px 8px rgba(234, 88, 12, 0.3);
  
  /* Status colors - sunset orange dark */
  --status-error: #ef4444;
  --status-error-bg: rgba(239, 68, 68, 0.15);
  --status-warning: #f97316;
  --status-warning-bg: rgba(249, 115, 22, 0.15);
  --status-info: #0ea5e9;
  --status-info-bg: rgba(14, 165, 233, 0.15);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.15);
  
  /* Enhanced sunset effects for dark mode */
  --accent-glow: 0 0 12px rgba(249, 115, 22, 0.6);
  --text-glow: 0 0 6px rgba(249, 115, 22, 0.4);
  --neon-border: 0 0 8px rgba(249, 115, 22, 0.4);
}

.color-sunset-orange.high-contrast:not(.dark) {
  /* Light high contrast sunset orange */
  --background: #ffffff !important;
  --surface: #ffeecc !important;
  --surface-hover: rgba(255, 102, 0, 0.15) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #ff6600 !important;
  --accent-hover: #cc5500 !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  /* Status colors - high contrast sunset orange light */
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #0066cc !important;
  --status-info-bg: rgba(0, 102, 204, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  /* Enhanced effects (warm for high contrast) */
  --accent-glow: 0 0 10px rgba(255, 102, 0, 0.6) !important;
  --text-glow: 0 0 5px rgba(255, 102, 0, 0.4) !important;
  --neon-border: 0 0 8px rgba(255, 136, 0, 0.6) !important;
}

.color-sunset-orange.high-contrast.dark {
  /* Dark high contrast sunset orange */
  --background: #000000 !important;
  --surface: #221100 !important;
  --surface-hover: rgba(255, 170, 0, 0.15) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #ffaa00 !important;
  --accent-hover: #ffcc33 !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #221100 !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(255, 255, 255, 0.3) !important;
  
  /* Status colors - high contrast sunset orange dark */
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.25) !important;
  --status-info: #3399ff !important;
  --status-info-bg: rgba(51, 153, 255, 0.25) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.25) !important;
  
  /* Enhanced warm effects for high contrast dark */
  --accent-glow: 0 0 15px rgba(255, 170, 0, 0.8) !important;
  --text-glow: 0 0 8px rgba(255, 170, 0, 0.6) !important;
  --neon-border: 0 0 12px rgba(255, 170, 0, 0.8) !important;
}

/* =============================================================================
   OFFICE COLOR SCHEME
   Conservative corporate blues and grays
   ============================================================================= */

.color-office {
  /* Light office */
  --background: #ffffff;
  --surface: #f8fafc;
  --surface-hover: rgba(59, 130, 246, 0.05);
  --text: #1e293b;
  --text-muted: #475569;
  --text-background: #ffffff;
  --accent: #3b82f6;
  --accent-hover: #2563eb;
  --border: #e2e8f0;
  --border-thin: rgba(59, 130, 246, 0.2);
  --input-bg: #ffffff;
  --scrollbar: #94a3b8;
  --shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
  
  /* Status colors - office theme */
  --status-error: #b91c1c;
  --status-error-bg: rgba(185, 28, 28, 0.1);
  --status-warning: #d97706;
  --status-warning-bg: rgba(217, 119, 6, 0.1);
  --status-info: #1d4ed8;
  --status-info-bg: rgba(29, 78, 216, 0.1);
  --status-success: #047857;
  --status-success-bg: rgba(4, 120, 87, 0.1);
  
  /* Enhanced effects (subtle professional glow for office) */
  --accent-glow: 0 0 4px rgba(59, 130, 246, 0.2);
  --text-glow: none;
  --neon-border: 0 0 3px rgba(59, 130, 246, 0.2);
}

.color-office.dark {
  /* Dark office */
  --background: #0f172a;
  --surface: #1e293b;
  --surface-hover: rgba(59, 130, 246, 0.1);
  --text: #f1f5f9;
  --text-muted: #cbd5e1;
  --text-background: #0f172a;
  --accent: #60a5fa;
  --accent-hover: #93c5fd;
  --border: #334155;
  --border-thin: rgba(51, 65, 85, 0.6);
  --input-bg: #1e293b;
  --scrollbar: #60a5fa;
  --shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  
  /* Status colors - office dark */
  --status-error: #dc2626;
  --status-error-bg: rgba(220, 38, 38, 0.15);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.15);
  --status-info: #3b82f6;
  --status-info-bg: rgba(59, 130, 246, 0.15);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.15);
  
  /* Enhanced professional effects for dark office */
  --accent-glow: 0 0 6px rgba(96, 165, 250, 0.3);
  --text-glow: none;
  --neon-border: 0 0 4px rgba(96, 165, 250, 0.3);
}

.color-office.high-contrast:not(.dark) {
  /* Light high contrast office */
  --background: #ffffff !important;
  --surface: #f0f4f8 !important;
  --surface-hover: rgba(0, 0, 255, 0.15) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #0066cc !important;
  --accent-hover: #0055aa !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  /* Status colors - high contrast office light */
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #0066cc !important;
  --status-info-bg: rgba(0, 102, 204, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  /* Enhanced effects (professional for high contrast) */
  --accent-glow: 0 0 6px rgba(0, 102, 204, 0.4) !important;
  --text-glow: none !important;
  --neon-border: 0 0 5px rgba(0, 102, 204, 0.4) !important;
}

.color-office.high-contrast.dark {
  /* Dark high contrast office */
  --background: #000000 !important;
  --surface: #001122 !important;
  --surface-hover: rgba(51, 153, 255, 0.15) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #3399ff !important;
  --accent-hover: #66bbff !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #001122 !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(255, 255, 255, 0.3) !important;
  
  /* Status colors - high contrast office dark */
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.25) !important;
  --status-info: #3399ff !important;
  --status-info-bg: rgba(51, 153, 255, 0.25) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.25) !important;
  
  /* Enhanced professional effects for high contrast dark */
  --accent-glow: 0 0 8px rgba(51, 153, 255, 0.5) !important;
  --text-glow: none !important;
  --neon-border: 0 0 6px rgba(51, 153, 255, 0.5) !important;
}

/* =============================================================================
   TERMINAL COLOR SCHEME
   Classic green-on-black terminal aesthetic
   ============================================================================= */

.color-terminal {
  /* Light terminal */
  --background: #ffffff;
  --surface: #f5f5f5;
  --surface-hover: rgba(0, 255, 0, 0.05);
  --text: #000000;
  --text-muted: #333333;
  --text-background: #ffffff;
  --accent: #00aa00;
  --accent-hover: #008800;
  --border: #cccccc;
  --border-thin: rgba(0, 170, 0, 0.2);
  --input-bg: #ffffff;
  --scrollbar: #00aa00;
  --shadow: 0 2px 8px rgba(0, 170, 0, 0.1);
  
  /* Status colors - terminal theme */
  --status-error: #ef4444;
  --status-error-bg: rgba(239, 68, 68, 0.2);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.2);
  --status-info: #06b6d4;
  --status-info-bg: rgba(6, 182, 212, 0.2);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.2);
  
  /* Enhanced effects (subtle for terminal) */
  --accent-glow: 0 0 5px currentColor;
  --text-glow: 0 0 3px currentColor;
  --neon-border: 0 0 3px currentColor;
}

.color-terminal.dark {
  /* Dark terminal - classic green terminal */
  --background: #000000;
  --surface: #001100;
  --surface-hover: rgba(0, 255, 0, 0.1);
  --text: #00ff00;
  --text-muted: #00cc00;
  --text-background: #000000;
  --accent: #00ff00;
  --accent-hover: #33ff33;
  --border: #00aa00;
  --border-thin: rgba(0, 170, 0, 0.6);
  --input-bg: #001100;
  --scrollbar: #00ff00;
  --shadow: 0 0 20px rgba(0, 255, 0, 0.4);
  
  /* Status colors - terminal dark */
  --status-error: #ff4444;
  --status-error-bg: rgba(255, 68, 68, 0.25);
  --status-warning: #ffaa00;
  --status-warning-bg: rgba(255, 170, 0, 0.25);
  --status-info: #00ccff;
  --status-info-bg: rgba(0, 204, 255, 0.25);
  --status-success: #00ff00;
  --status-success-bg: rgba(0, 255, 0, 0.25);
  
  /* Enhanced terminal effects for dark mode */
  --accent-glow: 0 0 8px currentColor, 0 0 15px currentColor;
  --text-glow: 0 0 5px currentColor, 0 0 10px currentColor;
  --neon-border: 0 0 5px currentColor;
}

.color-terminal.high-contrast:not(.dark) {
  /* Light high contrast terminal */
  --background: #ffffff !important;
  --surface: #f0f0f0 !important;
  --surface-hover: rgba(0, 128, 0, 0.15) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #008000 !important;
  --accent-hover: #006600 !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  /* Status colors - high contrast terminal light */
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #0066cc !important;
  --status-info-bg: rgba(0, 102, 204, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  /* Enhanced effects (minimal for high contrast) */
  --accent-glow: 0 0 6px rgba(0, 128, 0, 0.4) !important;
  --text-glow: 0 0 3px rgba(0, 128, 0, 0.3) !important;
  --neon-border: 0 0 4px rgba(0, 128, 0, 0.4) !important;
}

.color-terminal.high-contrast.dark {
  /* Dark high contrast terminal */
  --background: #000000 !important;
  --surface: #001100 !important;
  --surface-hover: rgba(0, 255, 0, 0.15) !important;
  --text: #00ff00 !important;
  --text-muted: #00ff00 !important;
  --text-background: #000000 !important;
  --accent: #00ff00 !important;
  --accent-hover: #33ff33 !important;
  --border: #00ff00 !important;
  --border-thin: #00ff00 !important;
  --input-bg: #001100 !important;
  --scrollbar: #00ff00 !important;
  --shadow: 0 0 30px rgba(0, 255, 0, 0.8) !important;
  
  /* Status colors - high contrast terminal dark */
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.3) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.3) !important;
  --status-info: #3399ff !important;
  --status-info-bg: rgba(51, 153, 255, 0.3) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.3) !important;
  
  /* Enhanced terminal effects for high contrast dark */
  --accent-glow: 0 0 10px currentColor, 0 0 20px currentColor !important;
  --text-glow: 0 0 8px currentColor, 0 0 15px currentColor !important;
  --neon-border: 0 0 8px currentColor, 0 0 15px currentColor !important;
}

/* =============================================================================
   MIDNIGHT BLUE COLOR SCHEME
   Sophisticated dark blues for late-night work
   ============================================================================= */

.color-midnight-blue {
  /* Light midnight blue */
  --background: #ffffff;
  --surface: #f1f5f9;
  --surface-hover: rgba(29, 78, 216, 0.05);
  --text: #1e3a8a;
  --text-muted: #3b82f6;
  --text-background: #ffffff;
  --accent: #1d4ed8;
  --accent-hover: #1e40af;
  --border: #bfdbfe;
  --border-thin: rgba(29, 78, 216, 0.2);
  --input-bg: #ffffff;
  --scrollbar: #60a5fa;
  --shadow: 0 2px 8px rgba(29, 78, 216, 0.1);
  
  /* Status colors - midnight blue theme */
  --status-error: #f87171;
  --status-error-bg: rgba(248, 113, 113, 0.2);
  --status-warning: #fbbf24;
  --status-warning-bg: rgba(251, 191, 36, 0.2);
  --status-info: #60a5fa;
  --status-info-bg: rgba(96, 165, 250, 0.2);
  --status-success: #34d399;
  --status-success-bg: rgba(52, 211, 153, 0.2);
  
  /* Enhanced effects (sophisticated glow for midnight blue) */
  --accent-glow: 0 0 6px rgba(29, 78, 216, 0.3);
  --text-glow: 0 0 3px rgba(29, 78, 216, 0.2);
  --neon-border: 0 0 5px rgba(29, 78, 216, 0.3);
}

.color-midnight-blue.dark {
  /* Dark midnight blue */
  --background: #0c1326;
  --surface: #1e293b;
  --surface-hover: rgba(59, 130, 246, 0.1);
  --text: #dbeafe;
  --text-muted: #93c5fd;
  --text-background: #0c1326;
  --accent: #3b82f6;
  --accent-hover: #60a5fa;
  --border: #1e40af;
  --border-thin: rgba(30, 64, 175, 0.6);
  --input-bg: #1e293b;
  --scrollbar: #3b82f6;
  --shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  
  /* Status colors - midnight blue dark */
  --status-error: #f87171;
  --status-error-bg: rgba(248, 113, 113, 0.25);
  --status-warning: #fbbf24;
  --status-warning-bg: rgba(251, 191, 36, 0.25);
  --status-info: #60a5fa;
  --status-info-bg: rgba(96, 165, 250, 0.25);
  --status-success: #34d399;
  --status-success-bg: rgba(52, 211, 153, 0.25);
  
  /* Enhanced midnight effects for dark mode */
  --accent-glow: 0 0 10px rgba(59, 130, 246, 0.5);
  --text-glow: 0 0 5px rgba(59, 130, 246, 0.3);
  --neon-border: 0 0 8px rgba(59, 130, 246, 0.4);
}

.color-midnight-blue.high-contrast:not(.dark) {
  /* Light high contrast midnight blue */
  --background: #ffffff !important;
  --surface: #e6f0ff !important;
  --surface-hover: rgba(0, 0, 255, 0.15) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #0033cc !important;
  --accent-hover: #0022aa !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  /* Status colors - high contrast midnight blue light */
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #0066cc !important;
  --status-info-bg: rgba(0, 102, 204, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  /* Enhanced effects (sophisticated for high contrast) */
  --accent-glow: 0 0 8px rgba(0, 51, 204, 0.5) !important;
  --text-glow: 0 0 4px rgba(0, 51, 204, 0.3) !important;
  --neon-border: 0 0 6px rgba(0, 51, 204, 0.5) !important;
}

.color-midnight-blue.high-contrast.dark {
  /* Dark high contrast midnight blue */
  --background: #000000 !important;
  --surface: #001133 !important;
  --surface-hover: rgba(51, 153, 255, 0.15) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #3399ff !important;
  --accent-hover: #66bbff !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #001133 !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(255, 255, 255, 0.3) !important;
  
  /* Status colors - high contrast midnight blue dark */
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.25) !important;
  --status-info: #3399ff !important;
  --status-info-bg: rgba(51, 153, 255, 0.25) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.25) !important;
  
  /* Enhanced midnight effects for high contrast dark */
  --accent-glow: 0 0 12px rgba(51, 153, 255, 0.7) !important;
  --text-glow: 0 0 6px rgba(51, 153, 255, 0.5) !important;
  --neon-border: 0 0 10px rgba(51, 153, 255, 0.7) !important;
}

/* =============================================================================
   CRIMSON RED COLOR SCHEME
   Bold high-energy reds for active work
   ============================================================================= */

.color-crimson-red {
  /* Light crimson red */
  --background: #ffffff;
  --surface: #fef2f2;
  --surface-hover: rgba(220, 38, 38, 0.05);
  --text: #991b1b;
  --text-muted: #dc2626;
  --text-background: #ffffff;
  --accent: #dc2626;
  --accent-hover: #b91c1c;
  --border: #fecaca;
  --border-thin: rgba(220, 38, 38, 0.2);
  --input-bg: #ffffff;
  --scrollbar: #f87171;
  --shadow: 0 2px 8px rgba(220, 38, 38, 0.1);
  
  /* Status colors - crimson red theme */
  --status-error: #dc2626;
  --status-error-bg: rgba(220, 38, 38, 0.15);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.15);
  --status-info: #3b82f6;
  --status-info-bg: rgba(59, 130, 246, 0.15);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.15);
  
  /* Enhanced effects (intense glow for crimson red) */
  --accent-glow: 0 0 8px rgba(220, 38, 38, 0.4);
  --text-glow: 0 0 4px rgba(220, 38, 38, 0.3);
  --neon-border: 0 0 6px rgba(220, 38, 38, 0.4);
}

.color-crimson-red.dark {
  /* Dark crimson red */
  --background: #1f0a0a;
  --surface: #451a1a;
  --surface-hover: rgba(220, 38, 38, 0.1);
  --text: #fef2f2;
  --text-muted: #fecaca;
  --text-background: #1f0a0a;
  --accent: #ef4444;
  --accent-hover: #f87171;
  --border: #991b1b;
  --border-thin: rgba(153, 27, 27, 0.6);
  --input-bg: #451a1a;
  --scrollbar: #ef4444;
  --shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
  
  /* Status colors - crimson red dark */
  --status-error: #ef4444;
  --status-error-bg: rgba(239, 68, 68, 0.2);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.2);
  --status-info: #3b82f6;
  --status-info-bg: rgba(59, 130, 246, 0.2);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.2);
  
  /* Enhanced crimson effects for dark mode */
  --accent-glow: 0 0 12px rgba(239, 68, 68, 0.6);
  --text-glow: 0 0 6px rgba(239, 68, 68, 0.4);
  --neon-border: 0 0 10px rgba(239, 68, 68, 0.5);
}

.color-crimson-red.high-contrast:not(.dark) {
  /* Light high contrast crimson red */
  --background: #ffffff !important;
  --surface: #ffcccc !important;
  --surface-hover: rgba(204, 0, 0, 0.15) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #cc0000 !important;
  --accent-hover: #aa0000 !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  /* Status colors - high contrast crimson red light */
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #0066cc !important;
  --status-info-bg: rgba(0, 102, 204, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  /* Enhanced effects (intense for high contrast) */
  --accent-glow: 0 0 10px rgba(204, 0, 0, 0.6) !important;
  --text-glow: 0 0 5px rgba(204, 0, 0, 0.4) !important;
  --neon-border: 0 0 8px rgba(204, 0, 0, 0.6) !important;
}

.color-crimson-red.high-contrast.dark {
  /* Dark high contrast crimson red */
  --background: #000000 !important;
  --surface: #220000 !important;
  --surface-hover: rgba(255, 51, 51, 0.15) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #ff3333 !important;
  --accent-hover: #ff6666 !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #220000 !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(255, 255, 255, 0.3) !important;
  
  /* Status colors - high contrast crimson red dark */
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.3) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.3) !important;
  --status-info: #3399ff !important;
  --status-info-bg: rgba(51, 153, 255, 0.3) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.3) !important;
  
  /* Enhanced crimson effects for high contrast dark */
  --accent-glow: 0 0 15px rgba(255, 51, 51, 0.8) !important;
  --text-glow: 0 0 8px rgba(255, 51, 51, 0.6) !important;
  --neon-border: 0 0 12px rgba(255, 51, 51, 0.8) !important;
}

/* =============================================================================
   WARM SEPIA COLOR SCHEME
   Comfortable brown/beige tones for reading
   ============================================================================= */

.color-warm-sepia {
  /* Light warm sepia */
  --background: #fefdf8;
  --surface: #faf8f0;
  --surface-hover: rgba(161, 98, 7, 0.05);
  --text: #713f12;
  --text-muted: #a16207;
  --text-background: #fefdf8;
  --accent: #d97706;
  --accent-hover: #b45309;
  --border: #fde68a;
  --border-thin: rgba(161, 98, 7, 0.2);
  --input-bg: #fefdf8;
  --scrollbar: #f59e0b;
  --shadow: 0 2px 8px rgba(161, 98, 7, 0.1);
  
  /* Status colors - warm sepia theme */
  --status-error: #dc2626;
  --status-error-bg: rgba(220, 38, 38, 0.1);
  --status-warning: #d97706;
  --status-warning-bg: rgba(217, 119, 6, 0.1);
  --status-info: #2563eb;
  --status-info-bg: rgba(37, 99, 235, 0.1);
  --status-success: #059669;
  --status-success-bg: rgba(5, 150, 105, 0.1);
  
  /* Enhanced effects (warm reading glow for sepia) */
  --accent-glow: 0 0 6px rgba(161, 98, 7, 0.3);
  --text-glow: 0 0 2px rgba(161, 98, 7, 0.2);
  --neon-border: 0 0 4px rgba(161, 98, 7, 0.3);
}

.color-warm-sepia.dark {
  /* Dark warm sepia */
  --background: #1c1810;
  --surface: #3c2e1e;
  --surface-hover: rgba(217, 119, 6, 0.1);
  --text: #fefdf8;
  --text-muted: #fde68a;
  --text-background: #1c1810;
  --accent: #f59e0b;
  --accent-hover: #fbbf24;
  --border: #713f12;
  --border-thin: rgba(113, 63, 18, 0.6);
  --input-bg: #3c2e1e;
  --scrollbar: #f59e0b;
  --shadow: 0 2px 8px rgba(217, 119, 6, 0.3);
  
  /* Status colors - warm sepia dark */
  --status-error: #ef4444;
  --status-error-bg: rgba(239, 68, 68, 0.15);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.15);
  --status-info: #3b82f6;
  --status-info-bg: rgba(59, 130, 246, 0.15);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.15);
  
  /* Enhanced warm sepia effects for dark mode */
  --accent-glow: 0 0 8px rgba(217, 119, 6, 0.4);
  --text-glow: 0 0 4px rgba(217, 119, 6, 0.3);
  --neon-border: 0 0 6px rgba(217, 119, 6, 0.3);
}

.color-warm-sepia.high-contrast:not(.dark) {
  /* Light high contrast warm sepia */
  --background: #ffffff !important;
  --surface: #fff8e6 !important;
  --surface-hover: rgba(153, 102, 0, 0.15) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #996600 !important;
  --accent-hover: #775500 !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  /* Status colors - high contrast warm sepia light */
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #0066cc !important;
  --status-info-bg: rgba(0, 102, 204, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  /* Enhanced effects (warm for high contrast) */
  --accent-glow: 0 0 8px rgba(153, 102, 0, 0.5) !important;
  --text-glow: 0 0 4px rgba(153, 102, 0, 0.3) !important;
  --neon-border: 0 0 6px rgba(153, 102, 0, 0.5) !important;
}

.color-warm-sepia.high-contrast.dark {
  /* Dark high contrast warm sepia */
  --background: #000000 !important;
  --surface: #221100 !important;
  --surface-hover: rgba(255, 204, 0, 0.15) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #ffcc00 !important;
  --accent-hover: #ffdd33 !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #221100 !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(255, 255, 255, 0.3) !important;
  
  /* Status colors - high contrast warm sepia dark */
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.25) !important;
  --status-info: #3399ff !important;
  --status-info-bg: rgba(51, 153, 255, 0.25) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.25) !important;
  
  /* Enhanced warm sepia effects for high contrast dark */
  --accent-glow: 0 0 10px rgba(255, 204, 0, 0.7) !important;
  --text-glow: 0 0 6px rgba(255, 204, 0, 0.5) !important;
  --neon-border: 0 0 8px rgba(255, 204, 0, 0.7) !important;
}

/* =============================================================================
   ROSE GOLD COLOR SCHEME
   Modern pink and gold aesthetics
   ============================================================================= */

.color-rose-gold {
  /* Light rose gold */
  --background: #ffffff;
  --surface: #fdf2f8;
  --surface-hover: rgba(225, 29, 72, 0.05);
  --text: #9f1239;
  --text-muted: #e11d48;
  --text-background: #ffffff;
  --accent: #e11d48;
  --accent-hover: #be185d;
  --border: #fce7f3;
  --border-thin: rgba(225, 29, 72, 0.2);
  --input-bg: #ffffff;
  --scrollbar: #f472b6;
  --shadow: 0 2px 8px rgba(225, 29, 72, 0.1);
  
  /* Status colors - rose gold theme */
  --status-error: #e11d48;
  --status-error-bg: rgba(225, 29, 72, 0.1);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.1);
  --status-info: #8b5cf6;
  --status-info-bg: rgba(139, 92, 246, 0.1);
  --status-success: #059669;
  --status-success-bg: rgba(5, 150, 105, 0.1);
  
  /* Enhanced effects (elegant glow for rose gold) */
  --accent-glow: 0 0 8px rgba(225, 29, 72, 0.3);
  --text-glow: 0 0 4px rgba(225, 29, 72, 0.2);
  --neon-border: 0 0 6px rgba(225, 29, 72, 0.3);
}

.color-rose-gold.dark {
  /* Dark rose gold */
  --background: #1f0a13;
  --surface: #4c1d30;
  --surface-hover: rgba(225, 29, 72, 0.1);
  --text: #fdf2f8;
  --text-muted: #fce7f3;
  --text-background: #1f0a13;
  --accent: #f43f5e;
  --accent-hover: #fb7185;
  --border: #9f1239;
  --border-thin: rgba(159, 18, 57, 0.6);
  --input-bg: #4c1d30;
  --scrollbar: #f43f5e;
  --shadow: 0 2px 8px rgba(225, 29, 72, 0.3);
  
  /* Status colors - rose gold dark */
  --status-error: #f43f5e;
  --status-error-bg: rgba(244, 63, 94, 0.15);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.15);
  --status-info: #8b5cf6;
  --status-info-bg: rgba(139, 92, 246, 0.15);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.15);
  
  /* Enhanced rose gold effects for dark mode */
  --accent-glow: 0 0 10px rgba(244, 63, 94, 0.5);
  --text-glow: 0 0 5px rgba(244, 63, 94, 0.3);
  --neon-border: 0 0 8px rgba(244, 63, 94, 0.4);
}

.color-rose-gold.high-contrast:not(.dark) {
  /* Light high contrast rose gold */
  --background: #ffffff !important;
  --surface: #ffddee !important;
  --surface-hover: rgba(204, 0, 102, 0.15) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #cc0066 !important;
  --accent-hover: #aa0055 !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  /* Status colors - high contrast rose gold light */
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #0066cc !important;
  --status-info-bg: rgba(0, 102, 204, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  /* Enhanced effects (elegant for high contrast) */
  --accent-glow: 0 0 10px rgba(204, 0, 102, 0.6) !important;
  --text-glow: 0 0 5px rgba(204, 0, 102, 0.4) !important;
  --neon-border: 0 0 8px rgba(204, 0, 102, 0.6) !important;
}

.color-rose-gold.high-contrast.dark {
  /* Dark high contrast rose gold */
  --background: #000000 !important;
  --surface: #220011 !important;
  --surface-hover: rgba(255, 102, 204, 0.15) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #ff66cc !important;
  --accent-hover: #ff99dd !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #220011 !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(255, 255, 255, 0.3) !important;
  
  /* Status colors - high contrast rose gold dark */
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.25) !important;
  --status-info: #3399ff !important;
  --status-info-bg: rgba(51, 153, 255, 0.25) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.25) !important;
  
  /* Enhanced rose gold effects for high contrast dark */
  --accent-glow: 0 0 12px rgba(255, 102, 204, 0.7) !important;
  --text-glow: 0 0 6px rgba(255, 102, 204, 0.5) !important;
  --neon-border: 0 0 10px rgba(255, 102, 204, 0.7) !important;
}
```

## Summary

This document contains all 48 theme combinations with complete CSS variable definitions including:

- **12 Base Color Schemes**: onyx, ocean-blue, forest-green, royal-purple, cyberpunk, sunset-orange, office, terminal, midnight-blue, crimson-red, warm-sepia, rose-gold

- **4 Variants Each**: light, dark, high-contrast light, high-contrast dark

- **Complete Variable Sets**: background, surface, text, accent, border, status colors, enhanced effects, and all other theming properties

- **Distinctive Status Colors**: Each theme has unique status colors that match its aesthetic while maintaining semantic meaning (errors still look like errors, but in theme-appropriate colors)

Each theme is fully self-contained with all necessary CSS custom properties for proper theming functionality.