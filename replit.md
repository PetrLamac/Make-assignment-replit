# AI Image Analyzer - Error Screenshot Analysis Tool

## Overview

This application is a standalone AI-powered microservice designed to analyze error screenshots for customer support triage. Users upload error screenshots (PNG/JPEG, max 15MB) and receive structured JSON analysis including error details, probable causes, suggested fixes, and follow-up questions. The tool features a visual workflow canvas interface inspired by automation platforms like Make.com and Zapier, with a node-based drag-and-drop workflow builder.

**Key Features:**
- AI-powered error screenshot analysis using OpenAI Vision (GPT-5)
- Visual node-based workflow interface
- Real-time analysis results with detailed error information
- Structured JSON output for integration with automation tools
- Image upload validation and processing

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React 18 with TypeScript
- **Routing:** Wouter (lightweight client-side routing)
- **Styling:** Tailwind CSS with custom design system (shadcn/ui "new-york" style)
- **UI Components:** Radix UI primitives with custom theming
- **State Management:** TanStack Query (React Query) for server state
- **Workflow Visualization:** ReactFlow for node-based canvas interface
- **File Upload:** React Dropzone for drag-and-drop functionality

**Design System:**
- Custom color palette focused on indigo/purple tones for AI-related features
- Consistent component library using shadcn/ui conventions
- Typography: Inter (primary), Roboto (fallback)
- Responsive design with mobile-first approach
- Light mode primary (dark mode optional)

**Component Architecture:**
- Page-level components (`Home`, `NotFound`)
- Feature components (`WorkflowCanvas`, `ResultsPanel`, `TopNav`)
- Reusable node components (`UploadNode`, `AIAnalysisNode`)
- Comprehensive UI component library in `/components/ui`

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with TypeScript (ES Modules)
- **Framework:** Express.js
- **Development:** Vite for HMR and development server
- **Build:** esbuild for production bundling
- **File Upload:** Multer with in-memory storage (15MB limit)

**API Design:**
- RESTful endpoint: `POST /api/v1/analyze-image`
- Multipart form data upload
- Structured JSON response matching PRD schema
- Error handling with appropriate HTTP status codes

**Data Storage:**
- **Supabase PostgreSQL** for persistent storage of analysis results (as per PRD)
- Automatic fallback to in-memory storage (`MemStorage`) if Supabase credentials not configured
- Database-ready schema using Drizzle ORM (PostgreSQL compatible)
- Schema includes all analysis fields: error details, environment, confidence, etc.
- **Important:** Only extracted text/JSON metadata is stored, NOT the uploaded images (per PRD requirements)

**Image Processing Flow:**
1. File validation (type, size)
2. Base64 encoding for API transmission
3. OpenAI Vision API call with structured prompt
4. JSON response parsing and validation
5. Result storage and return

### Database Architecture

**ORM & Tooling:**
- **ORM:** Drizzle ORM with Drizzle-Kit for migrations
- **Driver:** Neon Database serverless driver for PostgreSQL
- **Schema Validation:** Zod schemas generated from Drizzle tables

**Schema Design:**
- `analysis_results` table with comprehensive error analysis fields
- UUID primary keys
- JSONB fields for structured data (environment, follow-up questions)
- Timestamp tracking for created records

**Current Implementation:**
- **Active:** Supabase PostgreSQL storage for persistent data
- Storage layer auto-detects Supabase credentials and switches between Supabase/in-memory storage
- Database schema defined with Drizzle ORM
- Migration script available at `migrations/0000_modern_purifiers.sql`
- See `SUPABASE_SETUP.md` for database setup instructions

### External Dependencies

**AI/ML Services:**
- **OpenAI API:** GPT-5 model for vision-based error analysis
  - Structured prompts for extracting error information
  - JSON response formatting
  - Confidence scoring and severity assessment

**Database Services:**
- **Supabase:** PostgreSQL database and backend-as-a-service (actively used)
  - Connection via `@supabase/supabase-js` SDK
  - Environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`
  - Stores analysis metadata (JSON/text only, no image storage per PRD)
  - Future enhancement path: Supabase Storage for optional image archival

**Frontend Libraries:**
- **Radix UI:** Headless accessible UI components (30+ primitives)
- **ReactFlow:** Canvas-based workflow visualization
- **TanStack Query:** Data fetching and caching
- **React Dropzone:** File upload handling
- **date-fns:** Date/time formatting

**Development Tools:**
- **Replit Plugins:** Runtime error overlay, cartographer, dev banner
- **Vite:** Development server with HMR
- **TypeScript:** Type safety across full stack

**Session Management:**
- **connect-pg-simple:** PostgreSQL session store for Express (configured)

**Validation & Type Safety:**
- **Zod:** Runtime schema validation
- **@hookform/resolvers:** Form validation integration
- **drizzle-zod:** Database schema to Zod conversion

**Build Tools:**
- **esbuild:** Fast production bundling
- **PostCSS:** CSS processing with Tailwind and Autoprefixer
- **tsx:** TypeScript execution for development