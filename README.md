# UniSpace – Campus Boarding Management Platform (Frontend)

A modern, responsive React + TypeScript application for managing student boarding accommodations, maintenance requests, cleaning services, and user profiles on campus.

## 🚀 Features

### User Roles & Access
- **Students**: Browse boarding listings, book accommodations, submit maintenance/cleaning requests, view profile
- **Landlords**: Post boarding listings, manage maintenance requests, track bookings, view accepted services
- **Admin**: Manage users, create staff accounts, view system-wide analytics
- **Finance Manager**: Track payments and financial reports
- **Cleaning Staff**: Accept/complete cleaning jobs and maintenance requests

### Core Functionality
- 🏠 **Boarding Listings** – Browse and filter available rooms near campus
- 💫 **Favorites** – Save preferred boarding listings for later
- 🔧 **Maintenance Requests** – Submit and track plumbing, electrical, general repairs, and cleaning services
- 🧹 **Cleaning Services** – Choose from 3 tiers (Basic, Deep, Move-Out) with add-ons
- 📋 **Booking Management** – Create reservations and track booking status
- 👤 **User Profiles** – Edit profile details, view accepted services and notifications
- 🔔 **Notifications** – Real-time alerts for maintenance status changes, bookings, and system updates
- 🌙 **Dark/Light Mode** – Theme toggle with persistent storage

### Authentication
- Email/password login and registration
- **Google Sign-In** – One-click login with role selection
- Password strength indicator
- Role-based access control

## 🛠 Tech Stack

- **React 19** – UI library
- **TypeScript** – Type safety
- **Vite** – Lightning-fast build tool
- **React Router v7** – Client-side routing
- **Lucide React** – Icon library
- **Leaflet + React-Leaflet** – Interactive maps
- **CSS Variables** – Theming system (light/dark mode)

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:5000`

### Setup

```bash
# Navigate to frontend directory
cd ITPM-Frontend

# Install dependencies
npm install

# Create .env file (see Environment Variables below)
cp .env.example .env

# Update .env with your values
```

## 🌍 Environment Variables

Create a `.env` file in the `ITPM-Frontend` directory:

```dotenv
# Google Sign-In (from Google Cloud Console)
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

## 🏃 Running the App

### Development
```bash
npm start
# or
npm run dev
```
Runs on `http://localhost:5173` by default with hot module reloading.

### Build for Production
```bash
npm run build
```
Outputs optimized build to `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── App.tsx                 # Main app with routing
├── App.css                 # Global styles
├── index.css               # CSS tokens (theme system)
├── main.tsx                # React entry point
├── Components/
│   ├── Navbar.tsx          # Navigation bar
│   ├── Footer.tsx          # Footer
│   ├── FeaturedListings.tsx
│   ├── Features.tsx
│   ├── Hero.tsx
│   ├── Testimonials.tsx
│   └── Common/             # Reusable components
├── Pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── AdminDashboard.tsx
│   ├── FinanceManagerDashboard.tsx
│   ├── CleaningStaffDashboard.tsx
│   ├── UserProfilePage.tsx
│   ├── EditProfilePage.tsx
│   ├── MaintenancePage.tsx
│   ├── CleaningServicePage.tsx
│   ├── BoardingFormPage.tsx
│   ├── BoardingDetailsPage.tsx
│   ├── BookingPaymentPage.tsx
│   ├── FavouritesPage.tsx
│   ├── NotificationsPage.tsx
│   └── AllBoardingsPage.tsx
└── assets/                 # Images, icons

public/
├── index.html              # HTML template
└── vite.config.ts          # Vite configuration
```

## 🎨 Theming System

The app uses **CSS variable tokens** for light/dark mode consistency:

- Theme preference stored in `localStorage`
- Root element gets `data-theme="light"` or `data-theme="dark"`
- All colors use `var(--color-name)` for automatic switching
- Key tokens: `--text-primary`, `--bg-primary`, `--border-1`, `--btn-primary-bg`, etc.

Toggle theme via Navbar sun/moon icon.

## 🔐 Authentication Flow

### Email/Password
1. User registers/logs in
2. Backend validates and returns user object
3. User stored in `localStorage` under key `user`
4. App routes based on `user.userType`

### Google Sign-In
1. User clicks "Sign in with Google"
2. Google Identity Services prompts login
3. Frontend sends ID token to `/users/google` endpoint
4. User selects role (Student/Landlord) on first sign-in
5. Backend verifies token and creates/returns user
6. Same routing flow as email login

## 📡 API Integration

Base URL: `http://localhost:5000`

### Key Endpoints
- `POST /users/login` – Email login
- `POST /users/register` – User registration
- `POST /users/google` – Google Sign-In
- `GET /boardings` – List all boardings
- `POST /maintenance` – Create maintenance request
- `GET /maintenance` – List maintenance requests
- `PATCH /maintenance/:id/status` – Update request status
- `GET /notifications` – Fetch user notifications

## 🧪 Form Validation

- **Phone**: 10 digits only (sanitized while typing)
- **Full Name**: Letters and spaces only
- **Email**: RFC-compliant email format
- **Issue Description**: Letters, spaces, and newlines only
- **Passwords**: Minimum 6 characters, strength indicator

## 🌙 Dark Mode

- Default respects system preference (`prefers-color-scheme`)
- Toggle via Navbar button
- Persisted in `localStorage` under key `theme`
- All pages use CSS tokens for seamless switching

## 🗺 Interactive Maps

Boarding listing pages use Leaflet maps with:
- OpenStreetMap tiles
- Draggable markers for location selection
- Interactive zoom/pan controls

## 📱 Responsive Design

Built for all screen sizes:
- Mobile-first approach
- Flexible grids and layouts
- Touch-friendly buttons and inputs
- Optimized for 320px and up

## ⚡ Performance

- Fast build & dev server via Vite
- Code splitting for routes
- CSS variable-based theming (no theme lib bloat)
- Optimized icons via Lucide React
- Lazy-loaded images and components

## 🐛 Troubleshooting

### "Backend not found"
- Ensure `npm start` is running in `ITPM-Back` folder
- Check `http://localhost:5000` is accessible

### "Google Sign-In not configured"
- Add `VITE_GOOGLE_CLIENT_ID` to `.env`
- Restart dev server (Vite reads `.env` at startup)

### Build fails with TypeScript errors
- Check `tsconfig.json` and `tsconfig.app.json`
- Run `npm run lint` to see all issues
- Missing type definitions? Install `@types/package-name`

### Theme not persisting
- Check localStorage is enabled in browser
- Look for `theme` key in DevTools → Application → Storage

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Router Docs](https://reactrouter.com)

## 📄 License

This project is part of the UniSpace Campus Boarding Management system.

## 🤝 Support

For issues or questions, contact the development team or create an issue in the repository.

---

**Last Updated**: May 2026  
**Version**: 1.0.0
