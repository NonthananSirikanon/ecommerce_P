# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development Tasks
- `npm run dev` - Start the development server with hot module replacement
- `npm run build` - Build the application for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint to check code quality and style
- `npm run preview` - Preview the production build locally

### Lint and Type Checking
Always run `npm run lint` after making code changes to ensure code quality standards are met.

## Project Architecture

This is a React + TypeScript + Vite e-commerce application with the following structure:

### Technology Stack
- **Frontend**: React 19.1.1 with TypeScript
- **Routing**: React Router DOM 7.8.1 for client-side navigation
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS 4.1.12 with @tailwindcss/vite plugin
- **Icons**: Lucide React for consistent iconography
- **Authentication**: Context-based auth with localStorage persistence
- **Linting**: ESLint with TypeScript and React plugins

### Project Structure
```
src/
├── components/          # Reusable UI components
├── context/            # React Context providers
├── hooks/             # Custom React hooks (future use)
├── pages/             # Page components for routing
├── types/             # TypeScript type definitions
└── utils/             # Utility functions (future use)
```

### Component Architecture
- **`src/components/Header.tsx`**: Navigation header with authentication, responsive mobile menu, search, and cart functionality
- **`src/components/HeroSection.tsx`**: Landing page hero section
- **`src/components/FeaturedProducts.tsx`**: Product showcase section
- **`src/components/Features.tsx`**: Feature highlights section
- **`src/components/Footer.tsx`**: Site footer
- **`src/components/Product_Card.tsx`**: Reusable product card component with Product interface

### Page Components
- **`src/pages/HomePage.tsx`**: Main landing page combining hero, products, and features
- **`src/pages/LoginPage.tsx`**: User authentication login form
- **`src/pages/RegisterPage.tsx`**: User registration form with separate firstName/lastName fields

### Authentication System
- **Context**: `src/context/AuthContext.tsx` provides global auth state management
- **Types**: `src/types/auth.ts` defines User, AuthState, and credentials interfaces
- **API Service**: `src/utils/authService.ts` handles authentication API calls
- **API Client**: `src/utils/api.ts` provides HTTP client with automatic token handling
- **Backend Integration**: 
  - Login: `POST http://localhost:3001/api/auth/login`
  - Register: `POST http://localhost:3001/api/auth/register`
- **Features**: 
  - JWT token authentication with refresh token support
  - LocalStorage persistence for tokens and user data
  - Automatic token injection in API requests
  - Thai language UI with validation messages
  - Protected cart functionality (only visible when authenticated)
  - User data includes firstName, lastName, email, role, and verification status

### Key Patterns
- Uses functional components with React hooks
- TypeScript interfaces for type safety (see types/ directory)
- Responsive design with Tailwind CSS classes
- Context API for global state management (authentication)
- React Router for client-side navigation
- Click-outside handlers for dropdown menus
- Thai language content in navigation and UI elements

### Entry Points
- `src/main.tsx`: Application entry point with React 19 createRoot
- `src/App.tsx`: Main app wrapper with AuthProvider, Router, and route definitions
- `index.html`: HTML template with Vite integration

## Code Style Guidelines

- Follow the existing ESLint configuration with TypeScript and React rules
- Use functional components with hooks
- Maintain consistent Tailwind CSS class organization
- Use TypeScript interfaces for props and data structures
- Follow existing naming conventions (PascalCase for components, camelCase for variables)