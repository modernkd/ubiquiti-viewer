# Ubiquiti Device Viewer

A modern React application for browsing Ubiquiti's comprehensive device catalog. Built with TypeScript, Vite, and modern React patterns.

## Features

- **Dual View Modes**: Switch between grid and list views for optimal browsing
- **Expandable Details**: Click on devices to reveal additional information
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Data**: Fetches live data from Ubiquiti's public API
- **Error Handling**: Robust error handling with retry functionality
- **Loading States**: Smooth loading indicators during data fetching
- **Caching**: Intelligent caching to reduce API calls and improve performance

## Tech Stack

- **React 18** with TypeScript for type-safe component development
- **Vite** for fast development server and optimized production builds
- **CSS Modules** for scoped styling with camelCase class name conversion
- **TanStack Query** for efficient data fetching, caching, and state management
- **Lucide React** for consistent, customizable icons

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

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

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
├── components/          # Reusable UI components
│   ├── DeviceCard.tsx   # Individual device card component
│   ├── DeviceGrid.tsx   # Grid layout for devices
│   ├── DeviceList.tsx   # List layout for devices
│   ├── ViewToggle.tsx   # Toggle between grid/list views
│   ├── LoadingSpinner.tsx # Loading indicator
│   └── ErrorMessage.tsx # Error display component
├── hooks/              # Custom React hooks
│   └── useDevices.ts   # Hook for device data management
├── services/           # API services
│   └── deviceService.ts # Device data fetching service
├── types/              # TypeScript type definitions
│   └── device.ts       # Device-related types
├── App.tsx             # Main application component
├── App.module.css      # App-specific styles
└── index.css           # Global styles
```

## API Integration

The application fetches device data from Ubiquiti's public API endpoint:
`https://static.ui.com/fingerprint/ui/public.json`

### Data Structure

The API returns a comprehensive catalog of Ubiquiti devices including:

- Device icons and images
- Product information (name, SKU, abbreviations)
- Line information (airMAX, AirFiber, UniFi, etc.)
- Technical specifications
- Firmware and compatibility information

## Features in Detail

### View Modes

- **Grid View**: Card-based layout showing device icons, names, and basic info
- **List View**: Compact list layout with expandable details
- **Toggle**: Easy switching between views with persistent state

### Device Information

Each device displays:

- Product name and abbreviation
- Device line (airMAX, UniFi, etc.)
- SKU and system ID
- Device capabilities
- Short names and alternative identifiers

### Responsive Design

- **Desktop**: Full grid/list layouts with hover effects
- **Tablet**: Adjusted grid columns and spacing
- **Mobile**: Single column grid, optimized touch targets

### Error Handling

- Network error detection
- Timeout handling
- Retry functionality
- User-friendly error messages

### Performance

- Data caching (5-minute cache duration)
- Lazy loading of images
- Optimized re-renders
- Efficient state management

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

This project uses:

- **TypeScript** for type safety and better developer experience
- **CSS Modules** for scoped styling with proper "Go to Definition" navigation
- **ESLint** for code quality and consistency
- **Prettier** for automatic code formatting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational and demonstration purposes. Please refer to Ubiquiti's terms of service for any commercial use of their API data.

## Acknowledgments

- Ubiquiti Networks for providing the public device catalog API
- The React and TypeScript communities for excellent documentation and tools
