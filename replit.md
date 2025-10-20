# Creative Portfolio Application

## Overview

This is a modern full-stack web application that serves as a creative developer portfolio, showcasing 3D web experiences, interactive animations, and modern UI/UX design. The application features a single-page portfolio with sections for hero content, about information, project showcases, and contact forms. It's built with React on the frontend and Express.js on the backend, emphasizing visual appeal with 3D animations, gradient backgrounds, and smooth transitions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component development
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom CSS variables for theming, featuring a dark color scheme with gradient accents
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible design
- **Animations**: Framer Motion for smooth animations, transitions, and scroll-based interactions
- **3D Graphics**: Spline 3D viewer (@splinetool/viewer@1.10.82) for interactive 3D scenes in hero section
- **State Management**: TanStack Query (React Query) for server state management and API data fetching
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Schema Validation**: Zod for runtime type checking and API request validation
- **API Design**: RESTful endpoints with JSON responses and proper error handling
- **Development**: In-memory storage fallback for development environments
- **Session Management**: Connect-pg-simple for PostgreSQL-backed session storage

### Data Storage
- **Primary Database**: PostgreSQL via Neon Database serverless connection
- **Database Schema**: User management and contact message storage with UUID primary keys
- **Migrations**: Drizzle Kit for database schema management and migrations
- **Development Fallback**: In-memory storage implementation for local development

### Styling and Design System
- **Design Tokens**: CSS custom properties for consistent theming across components
- **Color Scheme**: Dark theme with purple, cyan, and pink gradient accents
  - Background gradient: `linear-gradient(135deg, hsl(222, 84%, 5%) 0%, hsl(220, 26%, 14%) 100%)`
  - Text gradient: `linear-gradient(135deg, hsl(239, 84%, 67%) 0%, hsl(190, 81%, 42%) 50%, hsl(330, 81%, 60%) 100%)`
- **Typography**: Inter font family (weight 700 for logo) with supporting Google Fonts integration
- **Component Library**: Comprehensive UI component system built on Radix primitives
- **Responsive Design**: Mobile-first approach with Tailwind CSS responsive utilities
- **3D Integration**: Spline viewer embedded in hero section background for immersive 3D experience

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and data fetching
- **framer-motion**: Animation and gesture library for interactive experiences
- **react-hook-form**: Performant form library with minimal re-renders
- **wouter**: Minimalist routing library for React applications

### UI and Styling
- **@radix-ui/***: Comprehensive collection of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework for rapid styling
- **class-variance-authority**: Utility for creating component variants
- **clsx**: Conditional className utility for dynamic styling

### Backend Infrastructure
- **express**: Fast, minimalist web framework for Node.js
- **drizzle-orm**: TypeScript ORM with SQL-like query builder
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **connect-pg-simple**: PostgreSQL session store for Express

### Development and Build Tools
- **vite**: Next-generation frontend build tool with hot module replacement
- **typescript**: Static type checking for JavaScript
- **@replit/vite-plugin-***: Replit-specific development plugins for enhanced debugging
- **esbuild**: Fast JavaScript bundler for production builds

### Validation and Schema
- **zod**: TypeScript-first schema validation library
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation
- **@hookform/resolvers**: Validation resolvers for React Hook Form

The application emphasizes performance, accessibility, and visual appeal, with a focus on creating an engaging portfolio experience that showcases modern web development capabilities through interactive 3D elements and smooth animations.