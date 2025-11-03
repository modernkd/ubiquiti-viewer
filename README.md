# Ubiquiti Device Viewer

A modern, responsive React application for browsing Ubiquiti's comprehensive device catalog. Built with TypeScript, Vite, and modern React patterns, featuring advanced search, filtering, and detailed device information.

## Features

- **Advanced Search with Autocomplete**: Intelligent search across device names, abbreviations, SKUs, and product lines with real-time suggestions and highlighted matches
- **Dual View Modes**: Switch between grid and list views for optimal browsing experience
- **Product Line Filtering**: Filter devices by product lines (UniFi, airMAX, AirFiber, etc.) with multi-select dropdown
- **Expandable Device Details**: Click on devices to reveal comprehensive technical specifications, compliance info, and capabilities
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices with adaptive layouts
- **Real-time Data**: Fetches live data from Ubiquiti's public API with intelligent caching
- **Robust Error Handling**: Comprehensive error handling with retry functionality and user-friendly messages
- **Performance Optimized**: Lazy loading, efficient state management, and optimized re-renders
- **URL State Management**: Search and filter state persists in URL for bookmarking and sharing
- **Security First**: Input sanitization and validation using DOMPurify and Zod schemas

## Tech Stack

- **React 19** with TypeScript for type-safe component development
- **Vite** for fast development server and optimized production builds
- **TanStack Query** for efficient data fetching, caching, and state management
- **TanStack React Table** for virtualized table rendering in list view
- **TanStack React Virtual** for performant large list virtualization
- **React Router DOM** for client-side routing and URL state management
- **Zod** for runtime type validation and schema enforcement
- **DOMPurify** for comprehensive input sanitization and XSS prevention
- **CSS Modules** for scoped styling with camelCase class name conversion

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ubiquiti-viewer
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file (optional - defaults to production API):

```bash
cp .env.local.example .env.local
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/                 # Reusable UI components
│   ├── DeviceCard.tsx         # Individual device card component
│   ├── DeviceGrid.tsx         # Grid layout for devices
│   ├── DeviceList.tsx         # List layout for devices
│   ├── DeviceToolbar.tsx      # Search, filters, and view controls
│   ├── SearchBar.tsx          # Advanced search with autocomplete
│   ├── ViewToggle.tsx         # Toggle between grid/list views
│   ├── DeviceFilters.tsx      # Product line filter dropdown
│   ├── DeviceIcon.tsx         # Device icon rendering component
│   ├── LoadingSpinner.tsx     # Loading indicator
│   ├── ErrorMessage.tsx       # Error display component
│   ├── ErrorBoundary.tsx      # Error boundary wrapper
│   └── devicedetails/         # Device detail components
│       ├── DeviceDetails.tsx  # Main device detail view
│       ├── DeviceDetailRoute.tsx # Routing for device details
│       ├── DeviceHeader.tsx   # Device header section
│       ├── DeviceImage.tsx    # Device image display
│       └── DeviceOpen.tsx     # Device detail modal/page
├── hooks/                     # Custom React hooks
│   ├── useDevices.ts          # Device data fetching hook
│   ├── useDeviceFilters.ts    # URL-synchronized filtering
│   ├── useDeviceSearch.ts     # Search functionality hook
│   └── useDeviceFilters.ts    # Combined filtering logic
├── services/                  # API services
│   └── deviceService.ts       # Device data fetching service
├── types/                     # TypeScript type definitions
│   └── device.ts              # Device-related types and interfaces
├── utils/                     # Utility functions
│   ├── deviceFilters.ts       # Search and filter utilities
│   ├── deviceTransformers.ts  # Data transformation utilities
│   ├── errorUtils.ts          # Error handling utilities
│   ├── securityUtils.ts       # Input sanitization utilities
│   └── validationUtils.ts     # Data validation utilities
├── config/                    # Configuration files
│   └── api.ts                 # API configuration
├── App.tsx                    # Main application component
├── App.module.css             # App-specific styles
└── index.css                  # Global styles
```

## Features in Detail

### Advanced Search with Autocomplete

The search functionality provides intelligent suggestions as you type:

- **Real-time Suggestions**: Generates up to 8 suggestions based on device names, abbreviations, SKUs, and product lines
- **Smart Matching**: Prioritizes exact matches, then prefix matches, then contains matches
- **Keyboard Navigation**: Use arrow keys to navigate suggestions, Enter to select, Escape to close
- **Visual Highlighting**: Matching text is underlined and bolded in suggestions
- **Debounced Input**: 300ms debounce prevents excessive API calls during typing

### View Modes

- **Grid View**: Card-based layout showing device icons, names, and basic info with hover effects
- **List View**: Compact table layout with expandable details and virtualized rendering for performance
- **Persistent State**: View preference is maintained across sessions

### Device Information

Each device displays comprehensive information including:

- Product name and abbreviation
- Device line (airMAX, UniFi, AirFiber, etc.)
- SKU and system ID
- Device capabilities and features
- Technical specifications (networking, power, radios)
- Compliance information (FCC, IC, CE markings)
- Firmware requirements and compatibility
- Short names and alternative identifiers

### Filtering System

- **Product Line Filters**: Multi-select dropdown to filter by device categories
- **URL Synchronization**: All filters and search state persist in URL parameters
- **Combined Filtering**: Search and product line filters work together seamlessly

### Responsive Design

- **Desktop**: Full grid/list layouts with hover effects and detailed interactions
- **Tablet**: Adjusted grid columns and spacing with touch-optimized controls
- **Mobile**: Single column grid, optimized touch targets

### Error Handling & Validation

- **Schema Validation**: Zod schemas ensure data integrity and provide graceful degradation
- **Network Error Handling**: Timeout detection and retry functionality
- **Input Sanitization**: DOMPurify prevents XSS attacks and validates all user inputs
- **Graceful Degradation**: App continues functioning even with partial data or API issues

### Performance Optimizations

- **Data Caching**: 5-minute cache duration reduces API calls
- **Lazy Loading**: Images and components load on demand
- **Virtualization**: Large lists use virtual scrolling for smooth performance
- **Optimized Re-renders**: Memoization and efficient state management
- **Bundle Splitting**: Code-split chunks for faster initial load

## API Integration

The application integrates with Ubiquiti's public device catalog API:

**Endpoint**: `https://static.ui.com/fingerprint/ui/public.json`

### Data Structure

The API provides a comprehensive catalog including:

- Device metadata (names, SKUs, abbreviations)
- Product line classifications
- Technical specifications and capabilities
- Compliance and regulatory information
- Firmware and compatibility data
- Visual assets (icons, images)

### Caching Strategy

- **Duration**: 5 minutes of client-side caching
- **Invalidation**: Manual refresh capability
- **Fallback**: Graceful handling of cache misses

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production with type checking
- `npm run build:analyze` - Build with bundle analysis report
- `npm run size-check` - Run bundle size checks against limits
- `npm run ci:build` - Combined build and size check for CI
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

### Code Quality

This project maintains high code quality standards:

- **TypeScript**: Strict type checking with comprehensive interfaces
- **ESLint**: Configured with React, TypeScript, and accessibility rules
- **CSS Modules**: Scoped styling prevents CSS conflicts
- **Bundle Size Limits**: Enforced size limits prevent bloat
- **Security**: Input validation and sanitization throughout

### Environment Configuration

Create a `.env.local` file for custom configuration:

```env
# API endpoint (defaults to production)
VITE_API_URL=https://static.ui.com/fingerprint/ui/public.json
```

## Deployment

### Build Process

1. **Type Checking**: TypeScript compilation ensures type safety
2. **Bundle Analysis**: Optional bundle visualization for optimization
3. **Size Limits**: Automated checks prevent bundle size regressions
4. **Asset Optimization**: Vite optimizes CSS, JS, and static assets

### Production Deployment

The built application is a static SPA suitable for deployment to:

- Static hosting services (**Netlify**, Vercel, GitHub Pages)
- CDN distributions
- Docker containers
- Traditional web servers

### Performance Monitoring

- Bundle size tracking with size-limit
- Build analysis with rollup-plugin-visualizer
- Runtime performance monitoring capabilities

## Acknowledgments

- **React and TypeScript communities** for excellent documentation and tools
- **Open source maintainers** of TanStack Query, Zod, DOMPurify, and other dependencies
