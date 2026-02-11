# Text Selection to GitHub Issue Feature

## Overview
This feature allows users to select any text on the website and create a GitHub issue directly from that selection.

## How It Works

### User Flow:
1. **Select Text**: User highlights any text on any page
2. **Prompt for Title**: A prompt appears asking for an issue title (shows preview of selected text)
3. **Confirm Creation**: A confirmation dialog shows the title and selected text
4. **Create Issue**: If confirmed, creates a GitHub issue via API
5. **Success Notification**: Shows success message with issue URL
6. **Optional Open**: Asks if user wants to open the issue in GitHub

### Technical Implementation:

**Component**: `TextSelectionAlert.tsx`
- Client-side component that listens for text selection
- Uses `mouseup` event to detect when user finishes selecting text
- Prevents duplicate triggers with `isCreating` state
- Integrated into root layout (works on all pages)

**API Integration**: 
- Uses existing `/api/issues/create` endpoint
- Sends POST request with:
  - `title`: User-provided issue title
  - `body`: Formatted markdown with selected text, page URL, and timestamp

**Issue Format**:
```markdown
**Selected Text:**
> [User's selected text]

**Page URL:** [Current page URL]

**Timestamp:** [ISO timestamp]
```

## Files Modified:

1. **Created**: `src/components/TextSelectionAlert.tsx`
   - Main component with selection logic
   
2. **Modified**: `src/app/layout.tsx`
   - Added `<TextSelectionAlert />` component to root layout

## Features:

✅ Works on all pages (integrated in root layout)
✅ Shows preview of selected text in prompt
✅ Confirmation dialog before creating issue
✅ Full error handling with user-friendly messages
✅ Success notification with issue URL
✅ Optional auto-open issue in new tab
✅ Prevents duplicate triggers during issue creation
✅ Captures page context (URL, timestamp)
✅ Formats selected text as blockquote in issue

## Usage:

1. Navigate to any page on the website
2. Select any text with your mouse
3. Follow the prompts to create a GitHub issue
4. View the created issue on GitHub

## Requirements:

- GitHub credentials must be configured in `.env`
- `/api/issues/create` endpoint must be functional
- User must have internet connection for API calls
