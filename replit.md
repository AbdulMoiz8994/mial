# MIA - AI Content Creator for Hair, Beauty & Barbering Industry

## Overview

MIA is an AI-powered content creation platform designed specifically for hair stylists, beauty professionals, and barbers. The application helps users generate engaging social media content for platforms like Instagram, TikTok, and Reels using AI-driven templates and prompts. Users can browse pre-built templates, generate custom content, save their creations to a library, and manage favorites.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized builds
- Wouter for lightweight client-side routing (no React Router dependency)

**UI Component System**
- shadcn/ui components (New York style variant) built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Component configuration centralized in `components.json`
- Custom CSS variables for theming (light/dark mode support via HSL color system)

**Design System**
- Typography: Inter (primary UI) + Playfair Display (accent/serif for beauty industry aesthetic)
- Spacing primitives: Tailwind's 2, 4, 6, 8, 12, 16, 24 unit system
- Visual-first layout inspired by Canva, Instagram feed aesthetics, Notion's information architecture
- Custom hover/active elevation effects for interactive elements

**State Management**
- TanStack Query (React Query) for server state management with optimistic updates
- Query client configured with custom fetch functions and error handling
- Local component state using React hooks

**Form Handling**
- React Hook Form with Zod schema validation via `@hookform/resolvers`
- Type-safe form validation aligned with backend schemas

### Backend Architecture

**Server Framework**
- Express.js with TypeScript
- Custom middleware for request logging and response capture
- Vite integration for development with HMR support
- Separation of concerns: routing, storage abstraction, and server setup

**API Structure**
- RESTful endpoints organized in `/api` namespace
- Resource-based routing:
  - `/api/content` - CRUD operations for generated content
  - `/api/templates` - Template browsing and usage tracking
  - `/api/generate` - AI content generation endpoint
- JSON request/response format with Zod validation
- Partial update support via PATCH endpoints

**Data Layer**
- Storage interface abstraction (`IStorage`) for flexible persistence implementation
- In-memory storage implementation (`MemStorage`) for development
- Drizzle ORM configured for PostgreSQL with schema-first approach
- Database schema defines: users, content, templates tables
- Zod schemas generated from Drizzle schemas for runtime validation

**Database Schema Design**
- `users`: Authentication with username/password
- `content`: Generated content with type, title, body, prompt, favorited flag, timestamps
- `templates`: Reusable prompt templates with category, usage count, and type classification
- Content types: instagram, tiktok, reels, script

### External Dependencies

**AI Integration**
- OpenAI API for content generation (conditional - feature degrades gracefully if API key not configured)
- Prompt engineering for beauty industry-specific content

**Database**
- Neon Database (serverless PostgreSQL via `@neondatabase/serverless`)
- Connection via DATABASE_URL environment variable
- Drizzle Kit for schema migrations in `./migrations` directory

**UI Component Libraries**
- Radix UI for accessible, unstyled primitives (accordion, dialog, dropdown, popover, etc.)
- Embla Carousel for content showcases
- Lucide React for consistent iconography
- date-fns for date formatting

**Development Tools**
- Replit-specific plugins for runtime error overlay, dev banner, and cartographer
- TypeScript with strict mode for type safety
- ESBuild for production server bundling
- Path aliases configured: `@/` (client src), `@shared/`, `@assets/`

**Session Management**
- connect-pg-simple for PostgreSQL-backed sessions (prepared for authentication implementation)

### Key Architectural Decisions

**Monorepo Structure**
- Single repository with `client/`, `server/`, and `shared/` directories
- Shared TypeScript schemas between frontend and backend prevent drift
- Unified build process with separate output directories

**Type Safety Strategy**
- Database schema as single source of truth (Drizzle schema → Zod schemas → TypeScript types)
- Runtime validation with Zod on API boundaries
- `drizzle-zod` for automated schema conversion

**Content Generation Flow**
1. User selects template or provides custom prompt
2. Frontend sends generation request to `/api/generate`
3. Backend calls OpenAI API with structured prompt
4. Generated content returned and optionally saved to database
5. Content accessible in library with search/filter capabilities

**Responsive Design**
- Mobile-first approach with Tailwind breakpoints
- Sidebar component with mobile drawer fallback
- Touch-friendly UI elements

**Performance Optimizations**
- Query client with infinite stale time for static data
- Lazy loading of routes and heavy components
- Optimistic updates for user interactions (favorites, saves)