# BuildRent Webapp Context

## Overview
BuildRent is a React-based web application for renting construction machinery in India. It serves as a premium platform connecting construction companies with heavy equipment providers. The app features a modern, responsive UI with 3D elements and smooth animations.

## Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for smooth transitions and interactions
- **Routing**: React Router DOM for client-side navigation
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **3D Graphics**: React Three Fiber and Drei for 3D scenes
- **Icons**: Lucide React
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Package Manager**: Bun (evident from bun.lockb file)
- **Linting**: ESLint with TypeScript support

## Project Structure

### Root Files
- `index.html`: Main HTML template with meta tags for SEO
- `package.json`: Project dependencies and scripts
- `vite.config.ts`: Vite configuration with React plugin
- `tsconfig.json/tsconfig.*.json`: TypeScript configurations
- `tailwind.config.ts`: Tailwind CSS configuration with custom theme
- `eslint.config.js`: ESLint configuration
- `components.json`: shadcn/ui configuration
- `postcss.config.js`: PostCSS configuration for Tailwind

### Source Code (`src/`)
- `main.tsx`: Application entry point that renders the App component
- `App.tsx`: Root component with routing setup and global providers (QueryClient, Toaster, TooltipProvider)
- `index.css`: Global styles including Tailwind imports and custom CSS variables

#### Pages (`src/pages/`)
- `Index.tsx`: Main landing page combining all sections
- `AdminLogin.tsx`: Simple login page for admin access
- `AdminDashboard.tsx`: Comprehensive admin dashboard with multiple tabs
- `NotFound.tsx`: 404 error page

#### Components (`src/components/`)
- **Core Sections**: HeroSection, MachinesSection, CategoriesSection, HowItWorks, CTASection, Footer
- **UI Components**: Extensive shadcn/ui library components (Button, Input, Dialog, etc.)
- **Custom Components**: Navbar, MachineCard, BookingModal, HeroScene (3D scene)
- **Layout Components**: NavLink for navigation links

#### Data (`src/data/`)
- `machines.ts`: Contains machine data, categories, and statistics as TypeScript constants

#### Hooks (`src/hooks/`)
- `use-toast.ts`: Toast notification hook
- `use-mobile.tsx`: Mobile device detection hook

#### Lib (`src/lib/`)
- `utils.ts`: Utility functions (cn for className merging)

#### Assets (`src/assets/`)
- Machine images (backhoe, crane, bulldozer, mixer)
- Hero background image

#### Public (`public/`)
- Static assets: favicon, robots.txt, placeholder SVG

## Key Features

### Public User Features
1. **Hero Section**: Eye-catching landing with 3D animated construction scene, call-to-action buttons, and key statistics
2. **Machine Categories**: Overview of available equipment categories (Machines, Materials, Equipment, Packages)
3. **Machine Listing**: 
   - Search functionality
   - Filter by availability and type
   - Grid layout of machine cards with details
4. **Booking System**: Modal-based booking with date selection, duration input, and price calculation
5. **Responsive Design**: Mobile-first approach with adaptive layouts

### Admin Features
1. **Authentication**: Simple password-based login ("admin123")
2. **Dashboard Overview**: Statistics cards showing revenue, active bookings, machine count, customer count
3. **Machine Management**: Table view of all machines with CRUD operations (view, edit, delete)
4. **Booking Management**: View and manage bookings (approve/reject pending, view completed)
5. **Message Center**: Handle customer inquiries and messages
6. **Settings**: Basic configuration options (business name, contact email, password change)

## Data Models

### Machine Interface
```typescript
interface Machine {
  id: string;
  name: string;
  category: string;
  image: string;
  pricePerHour: number;
  pricePerDay: number;
  rating: number;
  reviews: number;
  available: boolean;
  location: string;
  specs: Record<string, string>;
  description: string;
}
```

### Categories and Stats
- Categories array with id, name, icon, count, and description
- Stats array with label and value for hero section display

## Architecture Patterns

### Component Architecture
- Functional components with hooks
- Separation of concerns (pages, components, UI primitives)
- Reusable component library (shadcn/ui)

### State Management
- Local component state with useState
- Server state management with TanStack Query
- Session storage for admin authentication

### Styling Approach
- Utility-first CSS with Tailwind
- Custom CSS variables for theming
- Glass morphism design with backdrop blur effects
- Responsive design with mobile-first approach

### Animation Strategy
- Page transitions with Framer Motion
- Micro-interactions on buttons and cards
- Scroll-triggered animations
- Loading states and transitions

## Development Workflow

### Scripts
- `npm run dev`: Start development server
- `npm run build`: Production build
- `npm run build:dev`: Development build
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build
- `npm run test`: Run Vitest tests
- `npm run test:watch`: Watch mode for tests

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier (via ESLint) for code formatting
- Husky for git hooks (potential future addition)

## Deployment Considerations
- Static site generation ready (Vite build outputs static files)
- SEO optimized with proper meta tags
- Responsive design for all devices
- Fast loading with optimized assets

## Future Enhancements
Based on the codebase structure, potential additions could include:
- Real backend API integration
- User authentication and profiles
- Payment gateway integration
- Real-time booking updates
- Advanced search and filtering
- Machine maintenance tracking
- Customer review system
- Multi-language support

This context provides a comprehensive overview for developers new to the project, covering all major aspects from setup to deployment.