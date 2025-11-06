# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome Manifest V3 extension called "Auto Groups Checker" that automatically checks and marks relevant listings on Facebook Marketplace. The extension targets Facebook Marketplace seller pages.

## Architecture

The extension follows a standard Chrome extension architecture with three main components:

1. **background.js** - Service worker that handles extension installation lifecycle
2. **content.js** - Main logic injected into Facebook Marketplace pages that:
   - Creates a floating UI modal with include/exclude keyword inputs
   - Scans checkboxes on the page using multiple fallback selectors
   - Filters items by normalizing text (removing diacritics, lowercasing)
   - Auto-checks/unchecks checkboxes based on keyword matching with scroll delay
3. **popup.html** - Extension popup that provides a link to Facebook Marketplace

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

## Development Commands

### Loading the Extension
1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select this directory

### Testing Changes
After code changes:
1. Go to `chrome://extensions/`
2. Click the reload icon for "Facebook Marketplace Filter"
3. Refresh any open Facebook Marketplace tabs

### Manifest Permissions
- `activeTab` + `scripting` - Required for content script injection
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
