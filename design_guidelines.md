# Design Guidelines: AI Image Analysis Tool

## Design Approach

**Selected Approach:** Design System + Industry Reference Hybrid

**Justification:** This is a utility-focused workflow automation tool where consistency, learnability, and efficiency are paramount. Drawing from Make.com's proven node-based interface patterns while maintaining a cohesive design system ensures professional UX.

**Key References:**
- Make.com: Node-based automation interface, clean visual connections, workflow canvas
- Zapier: Simplified workflow builder, clear state indicators, intuitive drag-and-drop
- Figma: Canvas interaction patterns, infinite zoom workspace

**Core Design Principles:**
1. **Visual Clarity:** Every node, connection, and state must be immediately recognizable
2. **Spatial Organization:** Logical left-to-right flow (upload → analysis → results)
3. **Feedback-Rich:** Real-time visual feedback for all interactions (drag, drop, processing)
4. **Purposeful Simplicity:** Minimal chrome, maximum canvas space

---

## Color Palette

### Light Mode (Primary)
- **Primary Brand:** #6366F1 (indigo) - node highlights, active states, primary CTAs
- **Secondary Brand:** #8B5CF6 (purple) - AI analysis indicators, processing states
- **Background Base:** #F8FAFC (light grey) - canvas background
- **Surface:** #FFFFFF (white) - nodes, panels, cards
- **Success:** #10B981 (green) - successful analysis, completed states
- **Error:** #EF4444 (red) - failed states, validation errors
- **Warning:** #F59E0B (amber) - processing, in-progress states
- **Text Primary:** #1F2937 (dark grey) - headings, labels
- **Text Secondary:** #6B7280 (medium grey) - descriptions, metadata
- **Text Muted:** #9CA3AF (light grey) - placeholders, hints
- **Border:** #E5E7EB (very light grey) - node borders, dividers
- **Connection Lines:** #CBD5E1 (slate) - workflow connections, default state
- **Active Connection:** #6366F1 (indigo) - highlighted connections during interaction

### Dark Mode (Optional Enhancement)
- Background: #0F172A (slate-900)
- Nodes: #1E293B (slate-800)
- Text: #F1F5F9 (slate-100)

---

## Typography

**Font Stack:**
- Primary: 'Inter', sans-serif (UI, labels, data)
- Secondary: 'Roboto', sans-serif (fallback, body text)
- Monospace: 'Monaco', 'Courier New', monospace (JSON output, code)

**Type Scale:**
- **Hero/Large Headings:** text-2xl (24px) font-semibold - page titles
- **Section Headings:** text-lg (18px) font-medium - panel headers, node titles
- **Body/Labels:** text-sm (14px) font-normal - default UI text
- **Metadata/Small:** text-xs (12px) font-normal - timestamps, secondary info
- **Code/JSON:** text-xs (12px) font-mono - analysis output

**Line Heights:**
- Headings: leading-tight (1.25)
- Body: leading-normal (1.5)
- Code: leading-relaxed (1.625)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistency
- Micro spacing (p-2, gap-2): 8px - tight element spacing
- Standard spacing (p-4, m-4): 16px - default component padding
- Section spacing (p-6, mb-6): 24px - panel sections
- Large spacing (p-8, gap-8): 32px - major layout sections
- Extra-large (p-12, p-16): 48px-64px - canvas margins

**Layout Structure:**
```
┌─────────────────────────────────────────┐
│ Top Navigation Bar (h-16)               │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │   Canvas Workspace          │
│ (w-64)   │   (Infinite scroll)         │
│          │                              │
│ Controls │   [Upload Node] ──→ [AI]    │
│ & Tools  │                              │
│          │   Results Panel (slide-up)  │
└──────────┴──────────────────────────────┘
```

**Responsive Breakpoints:**
- Mobile (<768px): Stack sidebar above canvas, collapsible
- Tablet (768px-1024px): Narrow sidebar (w-48)
- Desktop (>1024px): Full sidebar (w-64), optimal canvas space

---

## Component Library

### A. Navigation & Layout

**Top Navigation Bar:**
- Height: h-16 (64px)
- Background: white with border-b border-gray-200
- Elements: Logo (left), workspace title (center), user menu (right)
- Padding: px-6
- Shadow: subtle shadow-sm for depth

**Sidebar Panel:**
- Width: w-64 (256px) on desktop
- Background: white
- Border: border-r border-gray-200
- Padding: p-4
- Sections: Node palette, Settings, Help
- Scrollable: overflow-y-auto

### B. Node Components

**Base Node Style:**
- Background: white
- Border: 2px solid #E5E7EB (gray-200), rounded-lg (8px radius)
- Padding: p-4
- Shadow: shadow-md on hover, shadow-lg when selected
- Width: w-64 (256px) minimum
- Transition: all transitions duration-200

**Node States:**
- Default: border-gray-200, bg-white
- Hover: border-indigo-300, shadow-md
- Active/Selected: border-indigo-500, shadow-lg, ring-2 ring-indigo-200
- Processing: border-amber-400, animated pulse
- Success: border-green-400, checkmark indicator
- Error: border-red-400, error icon

**Node Structure:**
```
[Icon] Node Title (text-sm font-medium)
──────────────────────────
Description (text-xs text-gray-600)
[Settings/Config area]
● Connection Point (right edge)
```

**Upload Node Specific:**
- Icon: Upload cloud (indigo-500)
- Drag-drop zone: dashed border-2 border-indigo-300
- Active drag-over: bg-indigo-50
- File preview: thumbnail 80x80px with remove button

**AI Analysis Node:**
- Icon: Brain/sparkle (purple-500)
- Loading state: animated gradient background
- Progress indicator: linear progress bar (green)

### C. Connection Lines

**Visual Style:**
- Path: Curved bezier paths (not straight lines)
- Stroke width: 2px default, 3px on hover
- Color: slate-300 default, indigo-500 when active
- Arrow: Chevron endpoint indicating data flow direction
- Animation: Dashed line animation during processing (flow effect)

**Connection Points:**
- Size: w-3 h-3 (12px) rounded-full
- Position: Centered on node edge
- Color: gray-400 inactive, indigo-500 active
- Hover: scale-125 transform

### D. Results Panel

**Panel Style:**
- Position: Fixed bottom or slide-in from right
- Background: white
- Border: border-t or border-l border-gray-200
- Height: 40vh (bottom) or full-height (side)
- Shadow: shadow-2xl for depth
- Animation: slide-up or slide-left transition

**Content Layout:**
- Header: Analysis ID, timestamp, status badge
- Body: Scrollable results area (overflow-y-auto)
- Sections: Error details, Environment, Probable cause, Suggested fix
- Footer: Copy JSON button, Actions

**Result Cards:**
- Background: bg-gray-50
- Border: border border-gray-200, rounded-md (6px)
- Padding: p-4
- Margin: mb-3 between cards
- Labels: text-xs font-medium text-gray-700, uppercase tracking-wide
- Values: text-sm text-gray-900

### E. Form Elements

**Buttons:**
- Primary: bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700
- Secondary: bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50
- Outline on images: backdrop-blur-sm bg-white/90 (no custom hover states)
- Danger: bg-red-600 text-white
- Text spacing: tracking-normal

**Input Fields:**
- Height: h-10 (40px)
- Border: border border-gray-300, rounded-md
- Focus: ring-2 ring-indigo-500 border-indigo-500
- Padding: px-3
- Dark mode compatible: bg-white in light, bg-gray-800 in dark

**Badges:**
- Status badges: px-2 py-1 text-xs rounded-full
- Success: bg-green-100 text-green-800
- Error: bg-red-100 text-red-800
- Warning: bg-amber-100 text-amber-800
- Info: bg-blue-100 text-blue-800

### F. Data Display

**JSON Viewer:**
- Background: bg-gray-900
- Text: font-mono text-xs
- Color scheme: Syntax highlighting (keys: cyan, strings: green, numbers: orange)
- Padding: p-4
- Border radius: rounded-lg
- Copy button: Absolute top-right, opacity-0 group-hover:opacity-100

**Key-Value Pairs:**
- Layout: Grid with gap-4
- Key: text-xs font-medium text-gray-500 uppercase
- Value: text-sm text-gray-900 font-normal
- Divider: border-b border-gray-100 between pairs

---

## Animation Guidelines

**Use Sparingly:**
- Node drag: smooth transform with spring physics
- Connection drawing: animated path stroke-dasharray
- Processing state: gentle pulse on node border (2s duration)
- Panel transitions: slide-up/slide-in (300ms ease-out)
- Hover states: Quick scale/shadow changes (150ms)

**Avoid:**
- Excessive bounce effects
- Rotating spinners (use linear progress instead)
- Parallax scrolling
- Confetti or celebratory animations

---

## Imagery

**No Hero Images:** This is a utility application - launch directly into the canvas workspace.

**Icon Usage:**
- Upload icon: Cloud with up arrow (heroicons/upload-cloud)
- AI icon: Sparkles or brain (heroicons/sparkles)
- Success: Check circle (heroicons/check-circle)
- Error: Exclamation triangle (heroicons/exclamation-triangle)
- Settings: Cog (heroicons/cog-6-tooth)
- Use outline style for default, solid for active states

**Image Preview Thumbnails:**
- Uploaded images: 80x80px rounded thumbnails in upload node
- Fit: object-cover
- Border: border-2 border-gray-200

---

## Accessibility & Polish

- Maintain WCAG AA contrast ratios (4.5:1 for text)
- Keyboard navigation: Tab through nodes, Enter to select, Arrow keys to move
- Focus indicators: ring-2 ring-indigo-500 on all interactive elements
- Screen reader labels: aria-label on all nodes and connections
- Dark mode: Consistent implementation across all panels and inputs
- Loading states: Skeleton screens for results panel, spinner for node processing