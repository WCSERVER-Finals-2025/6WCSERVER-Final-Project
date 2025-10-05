# Design Guidelines: Student Portfolio & Project Repository

## Design Approach

**Selected Approach**: Design System - Material Design with GitHub-inspired elements

**Justification**: Educational repository platform requiring clear information hierarchy, professional credibility, and familiar patterns that students and educators recognize. Drawing inspiration from GitHub (repository feel), LinkedIn (professional profiles), and Material Design (clean, accessible components).

**Core Principles**:
- Academic professionalism without corporate stiffness
- Clear content hierarchy for information-dense layouts
- Approachable and familiar UI patterns
- Efficient navigation for quick project discovery

---

## Color Palette

### Light Mode
- **Background**: 0 0% 98% (primary), 0 0% 100% (cards)
- **Text**: 220 13% 18% (primary), 220 9% 46% (secondary)
- **Borders**: 220 13% 91%
- **Primary Brand**: 217 91% 60% (professional blue)
- **Success** (Approved): 142 71% 45%
- **Warning** (Pending): 38 92% 50%
- **Danger** (Rejected): 0 84% 60%

### Dark Mode
- **Background**: 222 47% 11% (primary), 217 33% 17% (cards)
- **Text**: 210 40% 98% (primary), 215 20% 65% (secondary)
- **Borders**: 217 33% 23%
- **Primary Brand**: 217 91% 65%
- **Success**: 142 71% 45%
- **Warning**: 38 92% 55%
- **Danger**: 0 84% 65%

---

## Typography

**Font Families** (via Google Fonts CDN):
- **Primary**: Inter (headings, UI elements)
- **Secondary**: Source Sans Pro (body text, descriptions)
- **Code/Tags**: JetBrains Mono (for tags, technical labels)

**Scale**:
- Hero/Page Titles: text-4xl font-bold (36px)
- Section Headers: text-2xl font-semibold (24px)
- Card Titles: text-lg font-medium (18px)
- Body Text: text-base (16px)
- Captions/Meta: text-sm (14px)
- Tags/Labels: text-xs font-medium (12px)

---

## Layout System

**Spacing Units**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Card gaps: gap-4 to gap-6
- Section spacing: py-8 to py-12
- Container max-width: max-w-7xl

**Dashboard Grid Structure**:
- Left Sidebar (fixed): w-64 (navigation)
- Main Content Area: flex-1 with max-w-4xl
- Right Sidebar: w-80 (Profile Card, Top Projects)
- Grid layout: grid grid-cols-1 lg:grid-cols-[256px_1fr_320px]

---

## Component Library

### Navigation
- **Sidebar Navigation**: Fixed left sidebar with icon + label links
- **Active State**: Primary blue background with white text
- **Hover**: Subtle gray background (light mode) / lighter card bg (dark mode)

### Cards
- **Standard Card**: Rounded corners (rounded-lg), border (border), shadow-sm
- **Profile Card**: Centered avatar, name (text-xl font-semibold), role badge, stats grid
- **Project Card**: Thumbnail/icon top, title + description, tags row, metadata footer (author, date, rating)
- **Compact List Item**: For "Recent Approved" and "My Projects" - horizontal layout with small thumbnail, title, status badge

### Forms
- **Input Fields**: border, rounded-md, p-3, focus:ring-2 focus:ring-primary
- **File Upload**: Drag-and-drop zone with dashed border, upload icon, file list below
- **Dropdowns**: Custom select with chevron icon, options list with hover states
- **Buttons**: 
  - Primary: bg-primary text-white rounded-md px-4 py-2
  - Secondary: border border-primary text-primary rounded-md px-4 py-2
  - Danger: bg-red-600 text-white rounded-md px-4 py-2

### Project Feed
- **Feed Post Layout**: Full-width card, author info header (avatar, name, timestamp), project thumbnail (if available), title + description, tags, action footer (thumbs up/down counts, comment count)
- **Spacing**: gap-6 between posts, p-6 internal padding

### Status Badges
- **Approved**: Green background, white text, rounded-full px-3 py-1
- **Pending**: Yellow/orange background, dark text, rounded-full px-3 py-1
- **Rejected**: Red background, white text, rounded-full px-3 py-1

### Engagement Elements
- **Thumbs Up/Down**: Icon buttons with count, active state shows filled icon + primary color
- **Comments Section**: Nested layout, avatar + name + timestamp header, comment text, reply button

### Search & Filters
- **Search Bar**: Full-width input with search icon, placeholder "Search projects..."
- **Filter Chips**: Rounded pills for tags/courses, clickable, active state with primary background
- **Filter Panel**: Collapsible sidebar or dropdown with checkboxes for courses, categories

### Top Projects Widget
- **Layout**: Numbered list (1-5), small thumbnail, project title, thumbs up count
- **Visual**: Compact spacing (gap-2), hover effect on entire row

---

## Images

### Profile Pictures
- **Location**: Profile Card (top), Feed Posts (author avatar), Project Cards (author avatar)
- **Sizes**: Large (128px) for Profile Card, Small (40px) for feed/cards
- **Style**: Circular (rounded-full), border in dark mode

### Project Thumbnails
- **Location**: Project Cards (top), Feed Posts (below description), Project Detail page (hero)
- **Aspect Ratio**: 16:9 for consistency
- **Fallback**: Gray background with document/code icon if no image uploaded
- **Style**: rounded-lg, object-cover

### File Type Icons
- **Location**: Project attachments list, file upload preview
- **Types**: PDF, ZIP, DOC, CODE file icons using Heroicons or Font Awesome
- **Style**: Colored by file type (PDF=red, ZIP=purple, etc.)

---

## Dashboard Layout Sections

### Left Sidebar (Navigation)
- Logo/App name (top)
- Navigation links: Dashboard, Browse Projects, My Projects, Upload Project, Profile
- Teacher-only link: Pending Approvals (with badge count)

### Main Content (Feed/Browse)
- Page title + action button (e.g., "Upload Project")
- Search bar + filter chips
- Feed grid (grid-cols-1 gap-6)
- Pagination at bottom

### Right Sidebar
1. **Profile Card** (top): Avatar, name, role, stats (projects count, rating), "View Profile" link
2. **Recent Approved Repositories**: Scrollable list, max 5 items
3. **Top Projects**: Numbered list, max 5 items

---

## Animations

**Use Sparingly**:
- Hover transitions: transition-colors duration-200
- Card hover: subtle shadow increase (hover:shadow-md)
- Button hover: slight opacity change
- No complex animations or scroll effects

---

## Accessibility

- All interactive elements keyboard accessible
- Focus rings visible (ring-2 ring-offset-2)
- Color contrast meets WCAG AA standards
- Form labels and ARIA attributes for screen readers
- Dark mode toggle accessible with keyboard