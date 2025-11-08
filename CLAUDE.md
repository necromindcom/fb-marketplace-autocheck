# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome Manifest V3 extension called "Auto Groups Checker" that automatically checks and marks relevant listings on Facebook Marketplace. The extension targets Facebook Marketplace seller pages.

## Architecture

The extension follows a standard Chrome extension architecture with four main components:

1. **background.js** - Service worker that handles extension installation lifecycle
2. **content.js** - Main logic injected into Facebook Marketplace pages that:
   - Creates a floating UI modal with include/exclude keyword inputs
   - Scans checkboxes on the page using multiple fallback selectors
   - Filters items by normalizing text (removing diacritics, lowercasing)
   - Auto-checks/unchecks checkboxes based on keyword matching with scroll delay
   - Monitors URL changes to show/hide widget on correct pages only
   - Persists widget position and collapse state using chrome.storage API
3. **popup.html** - Extension popup that provides a link to Facebook Marketplace
4. **web/** - Marketing landing page (separate from extension):
   - SEO-optimized static HTML pages (index, privacy, terms, 404)
   - Tailwind CSS styling built from `web/src/input.css` to `web/css/output.css`
   - Designed for deployment to GitHub Pages, Netlify, or Vercel

### Key Technical Details

**Content Script Execution:**
- Runs on `marketplace/you/selling` and `marketplace/you/dashboard` pages
- Uses IIFE pattern to avoid global scope pollution
- Creates a fixed-position modal in top-right corner (70px from top, 13px from right)

**Selector Strategy:**
The extension uses a fallback array of selectors (`CONTAINER_SELECTORS`) to find marketplace items, as Facebook's DOM structure changes frequently:
- `div[data-testid="marketplace_feed_item"]`
- `div[role="article"]`
- Various class-based selectors (`x1yztbdb`, `x9f619.x1n2onr6`, `x1jx94hy`)

**Text Normalization:**
The `normalizeText()` function (content.js:147-154) is critical for keyword matching:
- Converts to lowercase
- Removes diacritics using Unicode normalization (NFD) for Czech characters
- Strips special characters while preserving Czech letters (čšžříťňďěáéíóúůý)
- Normalizes whitespace

**Checkbox Processing:**
Uses staggered timeouts (`SCROLL_DELAY = 100ms`) to avoid race conditions when programmatically clicking checkboxes. Each checkbox click is delayed by `index * SCROLL_DELAY` to ensure Facebook's UI can process the interaction.

**URL Monitoring System:**
Facebook is a Single Page Application (SPA), so the extension implements sophisticated URL monitoring to detect navigation without page reloads:
- Intercepts `history.pushState()` and `history.replaceState()` to detect programmatic navigation
- Listens to `popstate` events for back/forward button clicks
- Fallback polling (1s interval) compares current URL to detect any missed changes
- Shows widget only on `marketplace/you/selling` and `marketplace/you/dashboard` pages
- Automatically removes widget when navigating away from target pages

**Widget State Persistence:**
Uses `chrome.storage.sync` API to save user preferences across sessions:
- Widget position (`top`, `left`) - saved on drag end
- Collapse state - saved when toggling widget body
- State persists across browser restarts and syncs across devices (if Chrome sync enabled)

## Development Commands

### Initial Setup
```bash
npm install
```

### Tailwind CSS Build
The project uses Tailwind CSS for the web landing pages in the `/web` directory:

- **Development mode** (watch for changes):
  ```bash
  npm run dev
  ```
  Watches `web/src/input.css` and rebuilds to `web/css/output.css` automatically. Keep this running during development.

- **Production build** (minified):
  ```bash
  npm run build
  ```
  Generates minified CSS for production. Use before creating releases or deploying the landing page.

**Note:** The Tailwind config (`tailwind.config.js`) scans `web/**/*.{html,js}`, `popup.html`, and `content.js` for classes. Custom colors defined: `primary-{50,100,500,600}` for Facebook blue theme.

### Loading the Extension
1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select this directory

### Testing Changes
After code changes:
1. Go to `chrome://extensions/`
2. Click the reload icon for "Auto Groups Checker"
3. Refresh any open Facebook Marketplace tabs

### Manifest Permissions
- `activeTab` + `scripting` - Required for content script injection
- `storage` - Saves widget position and collapse state across sessions
- `host_permissions` - Limited to Facebook Marketplace seller pages only

## Code Conventions

- UI text and console messages are in English
- Uses Ionicons (https://ionic.io/ionicons) loaded via CDN for all UI icons
- All timing-sensitive operations use sequential setTimeout with SCROLL_DELAY multiplier
- Error handling wraps all async/DOM operations to prevent script crashes

## UI Features

**Draggable Modal:**
The filter modal is fully draggable. Users can click and drag the header to reposition it anywhere on the screen. The extension uses interact.js library for smooth dragging with a fallback to vanilla JS implementation (`simpleInitializeDragging()`) if the library fails to load. Implements boundary checking to keep the modal within viewport bounds.

**Collapsible Interface:**
The modal can be collapsed to show only the header using the chevron button. When collapsed, the body content fades out and height animates to 0. The chevron icon switches between `chevron-down` (expanded) and `chevron-up` (collapsed).

**Dynamic Counter:**
The modal displays a live counter showing "X / Y checked" that updates in real-time as checkboxes are clicked. The `updateCounter()` function is called after initial load and after each checkbox state change to keep the count accurate.

**Icon System:**
All icons use Ionicons web components (loaded from `https://unpkg.com/ionicons@latest`). Icons are self-registering custom elements and don't require manual initialization. Icons are rendered using `<ion-icon name="icon-name"></ion-icon>` tags. Icon names can be changed dynamically via `element.setAttribute('name', 'new-icon')`. Icons used:
- `sparkles` - header icon
- `checkmark-circle` - counter status
- `search` - include input
- `close-circle` - exclude input (red gradient)
- `play-circle` - run button (changes to `hourglass` during processing)
- `chevron-down/up` - collapse toggle
- `close` - close button
- `reorder-two` - drag handle
- `information-circle/checkmark-circle/warning/alert-circle/checkmark-done-circle` - message states
