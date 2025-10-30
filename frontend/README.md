# Caspian Sea Clean Map

Interactive pollution tracking platform for the Caspian Sea coastal region.

## Features

- **Interactive Map**: Yandex Maps integration for marking pollution points
- **User Roles**: Support for citizens, activists, and administrators
- **Real-time Updates**: Live pollution point tracking and status updates
- **Photo Upload**: Document pollution with images
- **Filtering**: Filter by status, type, and region
- **Statistics**: Dashboard with pollution analytics
- **Export Reports**: CSV export for data analysis

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Maps**: Yandex Maps API
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with interceptors
- **Cookies**: js-cookie

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_YANDEX_MAPS_KEY=your_yandex_maps_api_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (main)/          # Main application pages
│   └── providers.tsx    # React Query provider
├── shared/
│   ├── api/            # API service layer
│   ├── components/     # Reusable components
│   │   ├── ui/        # shadcn components
│   │   ├── map/       # Map components
│   │   ├── pollution/ # Pollution-specific components
│   │   └── layout/    # Layout components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities and axios instance
│   └── types/         # TypeScript types
```

## User Roles

### Citizens
- Report pollution points
- View pollution map
- Add photos and descriptions

### Activists
- All citizen features
- Update pollution status
- Access dashboard
- Export reports

### Administrators
- All activist features
- Delete pollution points
- Manage users

## API Integration

The app uses axios interceptors for:
- Automatic token injection
- 401 error handling
- Request/response logging

Services are organized by domain:
- `auth.service.ts`: Authentication
- `pollution.service.ts`: Pollution points CRUD

## Components

All components follow these principles:
- Maximum 100 lines per file
- Modular styling with Tailwind
- Clean, decomposed code
- No comments in production code
- shadcn/ui components where possible
