# Project Architecture

## Overview

Clean, modular architecture following best practices for Next.js 16 with App Router.

## Core Principles

- **Maximum 100 lines per file**
- **No code comments** - self-documenting code
- **Modular CSS** - Tailwind utility classes only
- **Clean decomposition** - Single responsibility principle
- **shadcn/ui first** - Use shadcn components wherever possible

## Directory Structure

### `/src/app`
Next.js App Router pages and layouts

- `(auth)/` - Authentication pages (login, register)
- `(main)/` - Main application pages (map, dashboard)
- `layout.tsx` - Root layout with providers
- `providers.tsx` - React Query and Toaster setup

### `/src/shared`
Shared application code

#### `/shared/api`
Service layer for API communication

- `auth.service.ts` - Authentication endpoints
- `pollution.service.ts` - Pollution CRUD operations

#### `/shared/components`
React components organized by domain

- `ui/` - shadcn/ui components
- `map/` - Map-related components
- `pollution/` - Pollution-specific components
- `layout/` - Layout components (Header, etc.)

#### `/shared/hooks`
Custom React hooks

- `use-auth.ts` - Authentication state and actions
- `use-pollution.ts` - Pollution data management

#### `/shared/lib`
Utilities and configurations

- `axios.ts` - Axios instance with interceptors
- `utils.ts` - Utility functions (cn, etc.)

#### `/shared/types`
TypeScript type definitions

- `index.ts` - All application types

## Data Flow

### Authentication Flow
1. User submits credentials via form
2. `useAuth` hook calls `authService`
3. Service makes API request via axios instance
4. Interceptor adds auth token
5. Response updates React Query cache
6. UI re-renders with new state

### Pollution Point Flow
1. User clicks map or fills form
2. Component calls `usePollution` hook
3. Hook triggers mutation via `pollutionService`
4. Service handles FormData for file uploads
5. React Query invalidates cache
6. Map and lists auto-update

## State Management

### React Query
- Server state management
- Automatic caching and invalidation
- Optimistic updates
- Background refetching

### Local State
- Component state with `useState`
- Form state with `react-hook-form`
- No global state needed

## API Layer

### Axios Interceptors

**Request Interceptor**
- Injects auth token from cookies
- Adds default headers

**Response Interceptor**
- Handles 401 errors
- Redirects to login on auth failure

### Service Pattern
Each domain has a service file with methods:
- `getAll()` - Fetch list
- `getById()` - Fetch single item
- `create()` - Create new item
- `update()` - Update existing item
- `delete()` - Delete item

## Component Patterns

### Client Components
All interactive components use `'use client'` directive

### Props Interface
Each component has typed props interface

### Composition
Components compose smaller components for reusability

## Styling

### Tailwind CSS
- Utility-first approach
- No custom CSS files
- Responsive design with breakpoints
- Dark mode support via CSS variables

### shadcn/ui
- Pre-built accessible components
- Customizable via Tailwind
- Consistent design system

## Type Safety

### TypeScript
- Strict mode enabled
- No `any` types (except Yandex Maps API)
- Proper type inference
- Zod for runtime validation

## Performance

### Code Splitting
- Automatic with Next.js App Router
- Dynamic imports where needed

### Image Optimization
- Next.js Image component for photos
- Lazy loading

### Caching
- React Query stale-while-revalidate
- 60s stale time default

## Security

### Authentication
- JWT tokens in HTTP-only cookies
- Automatic token refresh
- Protected routes

### Input Validation
- Zod schemas for forms
- Server-side validation required

## Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Hook testing with @testing-library/react-hooks
- Service mocking with MSW

### Integration Tests
- E2E with Playwright
- API integration tests

## Deployment

### Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_YANDEX_MAPS_KEY` - Maps API key

### Build
```bash
npm run build
npm start
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Future Enhancements

- WebSocket for real-time updates
- PWA support for offline mode
- Multi-language support (i18n)
- Advanced analytics dashboard
- Mobile app with React Native
