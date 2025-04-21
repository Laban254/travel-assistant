# Travel Query Frontend

A Next.js-based frontend for the Travel Query application, providing a modern and responsive interface for querying travel information.

## Project Structure

```
frontend/
├── app/                    # Next.js 13+ app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── theme-provider.tsx
│   ├── travel-query-app.tsx
│   └── response-card.tsx
├── lib/                   # Utility functions
│   ├── api.ts            # API client
│   └── utils.ts          # Helper functions
├── hooks/                # Custom React hooks
├── public/               # Static files
└── package.json
```

## Environment Variables

```bash
# .env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Tech Stack

- Next.js 15.2
- React 18
- TypeScript
- Tailwind CSS
- Shadcn UI
- Framer Motion
- Lucide Icons

## Features

- Travel query form with destination/origin extraction
- Real-time API integration
- Dark mode support
- Responsive design
- Loading states and error handling
- Toast notifications

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Components

### Main Components
- `TravelQueryApp`: Main application component
- `ResponseCard`: Displays travel information
- `ThemeProvider`: Manages dark/light mode

### UI Components (shadcn/ui)
- Button
- Card
- Dialog
- Input
- Alert
- Toast
- Label

## Development

The application uses:
- TypeScript for type safety
- Tailwind CSS for styling
- Next.js App Router
- Environment variables for configuration
- Framer Motion for animations
