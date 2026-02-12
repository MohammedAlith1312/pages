# Text & Image Selection to GitHub Issue Feature

## Overview
This feature allows users to select any text or click any image on the website and create a GitHub issue directly from that selection.

## How It Works

### User Flow:
1. **Select Content**: 
   - **Text**: User highlights any text on any page.
   - **Image**: User clicks on any image.
2. **Issue Form**: A popup appears at the selection location.
3. **Submit**: User enters a description (first line becomes the issue title) and clicks "Create Issue".
4. **Success Notification**: Shows success message and automatically opens a "Linked Issue" card for management.

### Technical Implementation:

**Component**: `TextBlock.tsx`
- Client-side component that listens for both text selection (`mouseup`) and image clicks (`click`).
- Injected into the root layout to work across all pages.
- Dynamically calculates position to appear near the selection.
- Automatically highlights existing open issues on page load.

**API Integration**: 
- Uses `/api/issues/create` for creation.
- Uses `/api/issues/list` to fetch existing issues for highlighting.
- Sends POST request with:
  - `title`: Extracted from the first line of the description.
  - `body`: Formatted markdown with selected content, page URL, and metadata.

**Issue Format**:
```markdown
**Description:**
[User description]

**Selected [Text|Image]:**
[> Selected text OR markdown image]

**Page URL:**
[Current page URL]
```

## Files Modified:

1. **Created**: `src/components/TextBlock.tsx`
   - Main component handling selection, UI, and highlighting.
   
2. **Modified**: `src/app/layout.tsx`
   - Integrated `<TextBlock />` with server-side issue fetching.

## Features:

✅ Works with both Text and Images
✅ Automatic on-page highlighting of reported text
✅ Live issue management (view, edit, comment, close) from the page
✅ Smart selection type detection (Labels issues correctly)
✅ Works on all pages via root layout
✅ Captures full URL context

## Usage:

1. Navigate to any page on the website
2. Select any text with your mouse
3. Follow the prompts to create a GitHub issue
4. View the created issue on GitHub

## Requirements:

- GitHub credentials must be configured in `.env`
- `/api/issues/create` endpoint must be functional
- User must have internet connection for API calls
