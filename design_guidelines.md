# MIA Design Guidelines
**AI Content Creator for Hair, Beauty & Barbering Industry**

## Design Approach

**Reference-Based Approach** drawing inspiration from:
- **Canva**: Intuitive content creation workflow, template browsing
- **Instagram**: Feed-style content display, visual-first layouts
- **Notion**: Clean information architecture, organized content management
- **Linear**: Modern typography, crisp UI elements

**Key Principles:**
1. Creative energy meets professional polish
2. Visual-first interface that celebrates beauty industry aesthetics
3. Streamlined content generation workflow
4. Gallery-style content showcase

## Typography System

**Font Families:**
- Primary: Inter (clean, modern for UI elements)
- Accent: Playfair Display or Abril Fatface (elegant headers for beauty industry sophistication)

**Hierarchy:**
- Hero Headlines: text-5xl to text-7xl, font-bold, accent font
- Section Headers: text-3xl to text-4xl, font-semibold
- Card Titles: text-xl, font-semibold
- Body Text: text-base, font-normal
- Captions/Meta: text-sm, font-medium
- Labels: text-xs, uppercase, tracking-wider

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Micro spacing: p-2, gap-2
- Component spacing: p-4, p-6, gap-4
- Section spacing: p-8, p-12, py-16, py-24
- Major layout: p-16, p-24

**Container Strategy:**
- Max width: max-w-7xl for main content
- Sidebar: w-64 fixed width
- Content grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for content cards

## Core Layout Structure

### 1. Hero Section (Landing/Dashboard)
- Height: min-h-screen with split layout
- Left side (60%): Hero content with headline, subheadline, primary CTA
- Right side (40%): Showcase area with example generated content in phone mockup frames
- Background: Subtle gradient mesh or abstract beauty-themed pattern
- CTA buttons on hero: backdrop-blur-lg bg-white/10 treatment

### 2. Main Application Layout
**Sidebar Navigation (Left, Fixed):**
- Width: w-64
- Sticky positioning
- Navigation items with icons (Heroicons)
- Sections: Dashboard, Create Content, Content Library, Templates, Settings

**Main Content Area:**
- Full width minus sidebar
- Padding: p-8 to p-12
- Content max-width: max-w-6xl mx-auto

### 3. Content Generation Interface
**Two-Column Layout:**
- Left (40%): Generation form with inputs
- Right (60%): Live preview/output area

**Form Structure:**
- Content type selector: Large pill buttons in grid (Instagram Post, TikTok Script, Reels Idea)
- Industry prompts: Dropdown with predefined templates
- Custom input: Textarea with character count
- Advanced options: Collapsible accordion section
- Generate button: Large, prominent, full-width

### 4. Content Library
**Masonry Grid Layout:**
- grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Card-based design with hover elevation
- Each card: generated content preview, metadata, action buttons
- Filter bar: Top sticky bar with chips for content type, date, platform
- Search: Prominent search input with icon

## Component Library

### Cards (Content Previews)
- Rounded corners: rounded-xl
- Shadow: shadow-md with hover:shadow-xl transition
- Padding: p-6
- Image preview at top (if applicable): aspect-ratio-square or 9:16
- Content snippet below
- Footer: metadata (date, platform icons) + action buttons

### Buttons
**Primary CTA:**
- Padding: px-8 py-4
- Rounded: rounded-full
- Font: font-semibold text-lg
- Icon + text combination

**Secondary:**
- Padding: px-6 py-3
- Rounded: rounded-lg
- Border variant with subtle background

**Icon Buttons:**
- Size: w-10 h-10
- Rounded: rounded-full
- Centered icon

### Form Inputs
- Height: h-12 to h-14 for text inputs
- Padding: px-4
- Rounded: rounded-lg
- Border: 2px border
- Focus state: ring-4 ring-opacity-20

### Pill Selectors (Content Types)
- Display: flex items-center gap-2
- Padding: px-6 py-3
- Rounded: rounded-full
- Selected state: solid background, unselected: border outline
- Icons from Heroicons

### Content Templates Gallery
- Grid layout: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Template cards with preview thumbnail
- Hover: scale-105 transform
- Quick use button overlay on hover

## Icons
**Library:** Heroicons (via CDN)
**Common Icons:**
- Sparkles (AI generation)
- Photo (Instagram)
- Film (TikTok/Reels)
- DocumentText (Scripts)
- Collection (Library)
- Cog (Settings)
- Plus (Create new)
- Heart (Save/favorite)
- Share (Export)

## Images Section

### Hero Section Image
**Type:** Collage-style showcase of beauty content
**Placement:** Right side of split hero (40% width)
**Description:** Modern smartphone mockups displaying sample Instagram posts and TikTok videos featuring hairstyling transformations, salon environments, and beauty products. Arranged in slightly overlapping, tilted composition for dynamic energy.
**Treatment:** Subtle shadow, possibly with floating effect

### Content Cards
**Type:** Thumbnail previews
**Placement:** Top of each content card in library
**Description:** Generated content previews - either text-based post layouts or video script thumbnails with beauty industry imagery (scissors, brushes, hair products, before/after transformations)

### Template Gallery
**Type:** Template thumbnails
**Placement:** Template selection grid
**Description:** Visual previews of different content templates showing layout/structure for various post types (tutorial format, product showcase, transformation reveal, etc.)

### Empty States
**Type:** Illustration
**Placement:** Content library when empty, generation preview before content created
**Description:** Minimalist line art illustrations of beauty tools (scissors, comb, mirror) with encouraging "Create your first post" messaging

## Animations
**Minimal, purposeful animations only:**
- Card hover: Subtle scale (scale-105) and shadow transition
- Button press: Gentle scale down (scale-95)
- Content generation: Loading spinner with "Generating..." state
- New content appearance: Subtle fade-in from bottom

## Responsive Behavior

**Desktop (lg+):** Sidebar + main content side-by-side
**Tablet (md):** Collapsible sidebar, 2-column grids
**Mobile (base):** Hidden sidebar with hamburger menu, single column, stacked form/preview

**Form Layout Responsive:**
- Desktop: Side-by-side form and preview
- Mobile: Stacked with tabs to switch between input and preview

## Accessibility
- Form labels clearly associated with inputs
- Icon buttons include aria-labels
- Focus indicators on all interactive elements
- Sufficient contrast ratios throughout
- Keyboard navigation support for all workflows