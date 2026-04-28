# StrayHelp Admin Dashboard

React + TypeScript web dashboard for StrayHelp administration.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `VITE_API_BASE_URL`: Backend API URL (http://localhost:5000 for development)
- `VITE_API_TIMEOUT`: API timeout in milliseconds

### 3. Run Development Server
```bash
npm run dev
```

Dashboard will be available at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

## Features

### Phase 1 (Current)
- ✅ Authentication (Login/Logout)
- ✅ Dashboard Overview with metrics
- ✅ Analytics with charts (Recharts)
- ✅ Protected routes

### Phase 2 (Coming Soon)
- User Management (CRUD)
- Report Moderation (Approve/Reject)
- User Administration

### Phase 3 (Coming Soon)
- Donation Tracking
- Campaign Management
- Organization Management
- Advanced Analytics

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Layout.tsx    # Main layout wrapper
│   └── ProtectedRoute.tsx  # Auth guard
├── context/          # React Context for state
│   └── AuthContext.tsx      # Authentication state
├── pages/            # Page-level components
│   ├── LoginPage.tsx
│   └── DashboardPage.tsx
├── services/         # API client
│   └── apiClient.ts
├── types/            # TypeScript interfaces
│   └── index.ts
├── styles/           # CSS/Tailwind
│   └── index.css
├── utils/            # Helper functions
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## Tech Stack
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Recharts
- **State Management**: React Context API

## Login Credentials (Development)
- Email: `admin@strayhelp.local`
- Password: (any value for demo)

## Development Workflow

1. Create new page in `src/pages/`
2. Import `Layout` component for consistent UI
3. Fetch data using `apiClient` service
4. Create types in `src/types/index.ts`
5. Style using Tailwind CSS classes

## Deployment

### Netlify
```bash
npm run build
# Deploy the dist/ folder
```

### Vercel
```bash
npm run build
# Deploy using Vercel CLI or GitHub integration
```

## Next Steps
1. Implement Users management page
2. Implement Reports moderation page
3. Add error boundaries
4. Add loading states and skeletons
5. Implement pagination
6. Add export to CSV/PDF functionality
7. Add real-time updates (WebSockets)
