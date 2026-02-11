# Universal Element Selection & GitHub Issue Creation

## Overview

Implement a comprehensive feature that allows users to select **any element** (text, images, buttons, sections, etc.) on any page of the website and create GitHub issues directly from those selections. This builds upon existing issue reporting functionality and extends it to support all element types with a seamless user experience.

## User Review Required

> [!IMPORTANT]
> **Selection Trigger Method**
> 
> We need to decide how users will activate element selection mode:
> - **Option A**: Keyboard modifier + Click (e.g., `Alt + Click` or `Ctrl + Click`)
> - **Option B**: Toggle button to enter "Report Mode" where all elements become selectable
> - **Option C**: Right-click context menu option "Report Issue with This Element"
> - **Option D**: Combination approach (toggle mode + visual indicators)
> 
> **Recommendation**: Option D provides the best UX - a floating "Report Issue" button that toggles selection mode with visual feedback.

> [!WARNING]
> **GitHub Authentication**
> 
> Verify that your `.env` file contains the required GitHub credentials:
> - `GITHUB_TOKEN` or GitHub App credentials
> - Repository owner and name configuration
> - Ensure the token/app has `issues: write` permissions

> [!IMPORTANT]
> **Repository Targeting for Poly Repo**
> 
> Since you mentioned poly repo support, we need to determine:
> - Should all issues go to `MohammedAlith1312/pages`?
> - Or should different pages/sections target different repositories?
> - Do you want a dropdown in the popup to select the target repository?

## Proposed Changes

### Phase 1: Core Infrastructure

#### [NEW] [IssueReportingContext.tsx](file:///d:/cms/pages/src/contexts/IssueReportingContext.tsx)

Create a React Context to manage global selection state and issue reporting functionality.

**Features**:
- Global state for selection mode (active/inactive)
- Selected element data storage
- Methods to capture element information
- Popup visibility control

**Exports**:
```typescript
interface IssueReportingContextType {
  isSelectionMode: boolean;
  toggleSelectionMode: () => void;
  selectedElement: SelectedElementData | null;
  openIssuePopup: (element: SelectedElementData) => void;
  closeIssuePopup: () => void;
}
```

---

#### [NEW] [IssueReportingProvider.tsx](file:///d:/cms/pages/src/providers/IssueReportingProvider.tsx)

Provider component that wraps the entire application and implements selection logic.

**Features**:
- Event listeners for element selection (click, text selection)
- Element data capture (type, content, CSS selector, position)
- Visual feedback for hoverable elements in selection mode
- Integration with IssuePopup component

**Selection Data Captured**:
- Element type (div, button, img, p, etc.)
- Text content or alt text
- CSS selector path
- Page URL and pathname
- Viewport position
- Timestamp

---

### Phase 2: UI Components

#### [NEW] [TextBlock.tsx](file:///d:/cms/pages/src/components/issue-reporting/TextBlock.tsx)

Reusable component to display selected content and issue form inputs.

**Features**:
- Read-only display of selected content with visual card
- Element type badge (e.g., "Button", "Image", "Text")
- Form inputs:
  - Issue title (required)
  - Issue description (required, textarea)
  - Labels/tags (optional)
- Validation logic
- Loading states during submission

**Props**:
```typescript
interface TextBlockProps {
  selectedElement: SelectedElementData;
  onSubmit: (issueData: IssueFormData) => Promise<void>;
  onCancel: () => void;
}
```

---

#### [NEW] [IssuePopup.tsx](file:///d:/cms/pages/src/components/issue-reporting/IssuePopup.tsx)

Modal/dialog component that appears when an element is selected.

**Features**:
- Modal overlay with backdrop
- Contains TextBlock component
- Success/error toast notifications
- Close on escape key or backdrop click
- Responsive design (mobile-friendly)

**Integration**:
- Uses `TextBlock` for form rendering
- Calls API route on submission
- Displays created issue URL on success

---

#### [NEW] [SelectionModeToggle.tsx](file:///d:/cms/pages/src/components/issue-reporting/SelectionModeToggle.tsx)

Floating action button to toggle selection mode on/off.

**Features**:
- Fixed position button (bottom-right corner)
- Visual indicator when selection mode is active
- Tooltip: "Report an Issue"
- Icon changes based on mode state
- Smooth animations

**Styling**:
- Uses your existing design system
- Glassmorphism effect
- Pulse animation when active

---

### Phase 3: API Integration

#### [NEW] [create/route.ts](file:///d:/cms/pages/src/app/api/issues/create/route.ts)

API route to handle GitHub issue creation via Octokit.

**Functionality**:
- Receives issue data from frontend
- Authenticates with GitHub using token/app credentials
- Creates issue with formatted body including:
  - Selected element details
  - Page context
  - User-provided title and description
  - Metadata (timestamp, element selector)
- Returns created issue URL and number
- Error handling with descriptive messages

**Request Body**:
```typescript
{
  title: string;
  description: string;
  elementType: string;
  elementContent: string;
  pageUrl: string;
  cssSelector: string;
  repository?: string; // For poly repo support
}
```

**Response**:
```typescript
{
  success: boolean;
  data?: {
    issueUrl: string;
    issueNumber: number;
  };
  error?: string;
}
```

---

#### [MODIFY] [api.ts](file:///d:/cms/pages/src/lib/api.ts)

Add client-side API helper function for issue creation.

**New Function**:
```typescript
export async function createIssueFromSelection(
  issueData: IssueFormData
): Promise<CreateIssueResponse>
```

**Features**:
- Type-safe API calls
- Error handling
- Request/response transformation

---

### Phase 4: Styling & Visual Feedback

#### [NEW] [issue-reporting.css](file:///d:/cms/pages/src/styles/issue-reporting.css)

Dedicated stylesheet for issue reporting components.

**Styles Include**:
- Selection mode visual feedback (element highlighting on hover)
- Popup/modal animations
- TextBlock card styling
- Toggle button styles
- Responsive breakpoints
- Dark mode support

**Key Features**:
- `.selection-mode-active` class for body
- `.selectable-element:hover` highlighting
- Smooth transitions and animations
- Accessibility focus indicators

---

### Phase 5: Application Integration

#### [MODIFY] [layout.tsx](file:///d:/cms/pages/src/app/layout.tsx)

Wrap the application with IssueReportingProvider.

**Changes**:
```tsx
import { IssueReportingProvider } from '@/providers/IssueReportingProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <IssueReportingProvider>
          {children}
          <SelectionModeToggle />
        </IssueReportingProvider>
      </body>
    </html>
  );
}
```

---

#### [MODIFY] [.env](file:///d:/cms/pages/.env)

Add required environment variables for GitHub integration.

**New Variables**:
```env
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_REPO_OWNER=MohammedAlith1312
GITHUB_REPO_NAME=pages
```

---

### Phase 6: Type Definitions

#### [NEW] [issue-reporting.types.ts](file:///d:/cms/pages/src/types/issue-reporting.types.ts)

TypeScript type definitions for the entire feature.

**Types Include**:
```typescript
interface SelectedElementData {
  elementType: string;
  content: string;
  cssSelector: string;
  pageUrl: string;
  pathname: string;
  timestamp: string;
  position?: { x: number; y: number };
}

interface IssueFormData {
  title: string;
  description: string;
  labels?: string[];
  repository?: string;
}

interface CreateIssueResponse {
  success: boolean;
  data?: {
    issueUrl: string;
    issueNumber: number;
  };
  error?: string;
}
```

---

## Implementation Flow

### System Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          APPLICATION LAYER                                      │
│  ┌──────────────────────┐          ┌────────────────────────────────────┐      │
│  │   layout.tsx         │          │  Pages (home, services, contact)   │      │
│  │   (Root Layout)      │──wraps──▶│  User-facing content               │      │
│  └──────────────────────┘          └────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────────────┘
                │                                      │
                │                                      │ User selects element
                ▼                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      ISSUE REPORTING SYSTEM                                     │
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────┐        │
│  │  IssueReportingProvider (Global State & Event Listeners)           │        │
│  │  • Listens for element clicks/selections                           │        │
│  │  • Captures element data (type, content, CSS selector)             │        │
│  │  • Manages selection mode state                                    │        │
│  └────────────────────────────────────────────────────────────────────┘        │
│                │                                                                │
│                │ provides                                                       │
│                ▼                                                                │
│  ┌────────────────────────────────────────────────────────────────────┐        │
│  │  IssueReportingContext (State Management)                          │        │
│  │  • isSelectionMode: boolean                                        │        │
│  │  • selectedElement: SelectedElementData | null                     │        │
│  │  • toggleSelectionMode(), openIssuePopup(), closeIssuePopup()     │        │
│  └────────────────────────────────────────────────────────────────────┘        │
│                │                                │                               │
│                │ renders                        │ opens with data               │
│                ▼                                ▼                               │
│  ┌──────────────────────────┐    ┌─────────────────────────────────┐          │
│  │ SelectionModeToggle      │    │  IssuePopup (Modal Dialog)      │          │
│  │ (Floating Action Button) │    │  • Backdrop overlay             │          │
│  │ • Toggle selection mode  │    │  • Close handlers               │          │
│  │ • Visual indicator       │    │  • Success/error notifications  │          │
│  └──────────────────────────┘    └─────────────────────────────────┘          │
│                                              │ contains                         │
│                                              ▼                                  │
│                                   ┌─────────────────────────────────┐          │
│                                   │  TextBlock (Form Component)     │          │
│                                   │  • Display selected element     │          │
│                                   │  • Input: Issue title           │          │
│                                   │  • Input: Description           │          │
│                                   │  • Submit button                │          │
│                                   └─────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────────┘
                                              │
                                              │ submits form
                                              ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                          │
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────┐        │
│  │  api.ts - createIssueFromSelection()                               │        │
│  │  • Type-safe API calls                                             │        │
│  │  • Error handling                                                  │        │
│  └────────────────────────────────────────────────────────────────────┘        │
│                │                                                                │
│                │ POST request                                                   │
│                ▼                                                                │
│  ┌────────────────────────────────────────────────────────────────────┐        │
│  │  /api/issues/create (Next.js API Route)                            │        │
│  │  • Receives issue data from frontend                               │        │
│  │  • Authenticates with GitHub                                       │        │
│  │  • Formats issue body with metadata                                │        │
│  └────────────────────────────────────────────────────────────────────┘        │
│                │                                                                │
│                │ authenticates & creates                                        │
│                ▼                                                                │
│  ┌────────────────────────────────────────────────────────────────────┐        │
│  │  Octokit Client (GitHub API)                                       │        │
│  │  • GitHub REST API wrapper                                         │        │
│  │  • Issue creation methods                                          │        │
│  └────────────────────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────────────────────┘
                │                                │
                │ creates issue                  │ returns issue URL
                ▼                                │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SERVICES                                       │
│  ┌────────────────────────────────────────────────────────────────────┐        │
│  │  GitHub Repository (Issues API)                                    │        │
│  │  • MohammedAlith1312/pages                                         │        │
│  │  • Issue creation endpoint                                         │        │
│  └────────────────────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────────────────────┘
                                              │
                                              │ response flows back
                                              ▼
                                    (Back to API Layer → UI)


┌─────────────────────────────────────────────────────────────────────────────────┐
│                         CONFIGURATION & DEPENDENCIES                            │
│                                                                                 │
│  ┌──────────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐  │
│  │ issue-reporting.types.ts │  │ issue-reporting.css  │  │     .env        │  │
│  │ • SelectedElementData    │  │ • Selection mode     │  │ • GITHUB_TOKEN  │  │
│  │ • IssueFormData          │  │ • Popup animations   │  │ • REPO_OWNER    │  │
│  │ • CreateIssueResponse    │  │ • Component styles   │  │ • REPO_NAME     │  │
│  └──────────────────────────┘  └──────────────────────┘  └─────────────────┘  │
│           │                              │                        │             │
│           └──────────(provides types to all components)───────────┘             │
│                                          │                                      │
│                         (provides styles & credentials)                         │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Execution Order

**Phase 1: Foundation** (10 min)
1. Create Type Definitions → `issue-reporting.types.ts`
2. Configure Environment → Update `.env` with GitHub credentials

**Phase 2: Core Infrastructure** (20 min)
3. Create Context → `IssueReportingContext.tsx`
4. Create Provider → `IssueReportingProvider.tsx` with event listeners

**Phase 3: UI Components** (40 min)
5. Build TextBlock → Form component with validation
6. Build IssuePopup → Modal wrapper with notifications
7. Build SelectionModeToggle → Floating action button

**Phase 4: API Integration** (30 min)
8. Create API Route → `/api/issues/create/route.ts` with Octokit
9. Add API Helpers → Update `api.ts` with client functions

**Phase 5: Styling & Integration** (20 min)
10. Create Styles → `issue-reporting.css` with animations
11. Integrate into Layout → Wrap app with provider

**Phase 6: Testing** (30 min)
12. Test & Verify → All test cases

### Detailed Step Breakdown

**Step 1: Type Definitions** (5 min)
- Create `issue-reporting.types.ts`
- Define all interfaces and types
- Export for use across components

**Step 2: Context & Provider** (20 min)
- Create `IssueReportingContext.tsx`
- Create `IssueReportingProvider.tsx`
- Implement selection mode logic
- Add event listeners for element capture
- Implement element data extraction

**Step 3: TextBlock Component** (15 min)
- Create component file
- Build form UI with inputs
- Add validation logic
- Implement submit/cancel handlers
- Style with existing design system

**Step 4: IssuePopup Component** (15 min)
- Create modal component
- Integrate TextBlock
- Add backdrop and close handlers
- Implement toast notifications
- Add animations

**Step 5: SelectionModeToggle** (10 min)
- Create floating action button
- Connect to context
- Add icons and tooltips
- Style with animations

**Step 6: API Route** (20 min)
- Create `/api/issues/create/route.ts`
- Set up Octokit client
- Implement issue creation logic
- Format issue body with metadata
- Add error handling

**Step 7: API Helpers** (10 min)
- Update `api.ts`
- Create `createIssueFromSelection` function
- Add type safety
- Implement error handling

**Step 8: Styles** (15 min)
- Create `issue-reporting.css`
- Add selection mode styles
- Add hover effects
- Implement responsive design
- Add dark mode support

**Step 9: Layout Integration** (5 min)
- Modify `layout.tsx`
- Wrap with provider
- Add toggle button
- Import styles

**Step 10: Environment Configuration** (5 min)
- Update `.env` file
- Add GitHub credentials
- Configure repository details

**Step 11: Testing & Verification** (30 min)
- Test text selection
- Test element selection (buttons, images, divs)
- Verify popup appears correctly
- Test issue creation
- Verify GitHub issue format
- Test on different pages
- Mobile responsiveness check

---

## Verification Plan

### Automated Tests

```bash
# Run existing tests to ensure no regressions
npm run test

# Type checking
npm run type-check
```

### Manual Verification

#### Test Case 1: Text Selection
1. Navigate to homepage
2. Click "Report Issue" toggle button
3. Select any text on the page
4. Verify popup appears with selected text
5. Fill in title and description
6. Submit and verify GitHub issue is created

#### Test Case 2: Button Selection
1. Enable selection mode
2. Click on any button (e.g., "Contact Us")
3. Verify popup shows element type as "Button"
4. Verify button text is captured
5. Create issue and check GitHub

#### Test Case 3: Image Selection
1. Enable selection mode
2. Click on an image
3. Verify popup shows element type as "Image"
4. Verify alt text or src is captured
5. Create issue and check format

#### Test Case 4: Section/Div Selection
1. Enable selection mode
2. Click on a section or div
3. Verify element type is captured
4. Verify CSS selector is included
5. Create issue

#### Test Case 5: Multiple Pages
1. Test on homepage
2. Test on services page
3. Test on contact page
4. Verify all pages work correctly

#### Test Case 6: Mobile Responsiveness
1. Open on mobile device/emulator
2. Test selection mode toggle
3. Test popup on small screens
4. Verify form is usable

#### Test Case 7: Error Handling
1. Test with invalid GitHub token
2. Test with network error
3. Verify error messages display correctly

---

## Success Criteria

✅ Users can toggle selection mode on/off  
✅ Any element (text, button, image, div) can be selected  
✅ Popup appears with correct element data  
✅ Form validation works properly  
✅ GitHub issues are created successfully  
✅ Issue body contains all relevant metadata  
✅ Works on all pages (home, services, contact, etc.)  
✅ Mobile responsive  
✅ No console errors  
✅ Existing functionality remains unaffected  

---

## Estimated Time

- **Development**: 2-3 hours
- **Testing**: 30-45 minutes
- **Total**: ~3-4 hours

---

## Dependencies

**Required Packages** (likely already installed):
- `@octokit/rest` - GitHub API client
- `react` - UI framework
- `next` - Framework

**Check Installation**:
```bash
npm list @octokit/rest
```

**If Not Installed**:
```bash
npm install @octokit/rest
```

---

## Rollback Plan

If issues arise during implementation:

1. **Remove Provider Wrapper** from `layout.tsx`
2. **Remove SelectionModeToggle** component
3. **Keep API Route** (doesn't affect existing functionality)
4. **Revert .env Changes** if needed

All changes are additive and non-breaking to existing functionality.
