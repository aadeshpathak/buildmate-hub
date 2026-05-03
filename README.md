# BuildMate Hub

A modern, responsive web application for renting construction equipment in India. BuildMate Hub serves as a premium platform connecting construction companies with heavy equipment providers, offering a seamless booking experience with real-time availability and comprehensive equipment details.

## Site is live on

[Click here](https://buildmate-hub.vercel.app/)

## Features

- **Equipment Catalog**: Browse a wide range of construction machinery with detailed specifications, pricing, and availability
- **Advanced Search & Filtering**: Find equipment by category, location, price range, and availability status
- **User Authentication**: Secure login and registration system for customers and providers
- **Booking System**: Real-time booking with date selection, duration calculation, and instant confirmation
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations and glassmorphism effects
- **Dashboard**: User dashboard for managing bookings, wishlist, and account settings

## Tech Stack

### Frontend

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components built on Radix UI
- **Framer Motion** - Smooth animations and transitions
- **TanStack Query** - Powerful data fetching and caching
- **React Router** - Client-side routing
- **Vite** - Fast build tool and development server

### Development Tools

- **ESLint** - Code linting
- **Bun** - Fast JavaScript runtime and package manager
- **Playwright** - End-to-end testing

## Installation

### Prerequisites

- Node.js 18+ or Bun
- Git

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/prathameshtwrofficial/buildmate-hub.git
   cd buildmate-hub
   ```

2. **Install dependencies**

   ```bash
   # Using npm
   npm install

   # Using bun (recommended)
   bun install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with necessary environment variables (if any)

4. **Start development server**

   ```bash
   # Using npm
   npm run dev

   # Using bun
   bun run dev
   ```

5. **Build for production**

   ```bash
   # Using npm
   npm run build

   # Using bun
   bun run build
   ```

## Usage

### For Users

1. **Browse Equipment**: Visit the homepage to explore available machinery
2. **Search & Filter**: Use the search bar and category filters to find specific equipment
3. **Create Account**: Register for an account to access booking features
4. **Book Equipment**: Select dates, calculate costs, and confirm bookings
5. **Manage Bookings**: View and manage your bookings in the dashboard

### For Equipment Providers

1. **List Equipment**: Contact us to list your machinery on the platform
2. **Manage Listings**: Update availability and pricing through the provider dashboard

## Project Structure

```
buildmate-hub/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   └── Footer.tsx    # Footer component
│   ├── pages/            # Page components
│   │   ├── Dashboard.tsx # Main dashboard
│   │   ├── ProductDetail.tsx # Equipment details
│   │   └── Index.tsx     # Landing page
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── data/             # Mock data and constants
│   └── assets/           # Images and icons
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## API Reference

The application uses mock data for demonstration. In production, it would connect to a backend API with endpoints for:

- `GET /api/equipment` - Retrieve equipment listings
- `POST /api/bookings` - Create new bookings
- `GET /api/bookings/:userId` - Get user bookings
- `POST /api/auth/login` - User authentication

## Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e
```

## Deployment

The application is built with Vite and can be deployed to any static hosting service:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider (Netlify, Vercel, etc.)

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

**Prathamesh Tiwari**

- Portfolio: [click to open](https://www.self.so/prathamesh-surendra-tiwari-resume)
- Email: [prathameshtwrofficial@gmai.com]

Project Link: [visit link](https://github.com/prathameshtwrofficial/buildmate-hub)

## Acknowledgments

- Built with modern web technologies
- UI inspired by contemporary design trends
- Special thanks to the open-source community

---

_Made with ❤️ by Prathamesh Tiwari_</content>
<parameter name="filePath">
