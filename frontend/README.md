# Travel Query Frontend

A React-based frontend for the Travel Query application, providing a modern and responsive interface for querying travel information.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── QueryForm.tsx
│   │   ├── ResponseCard.tsx
│   │   ├── QueryHistory.tsx
│   │   └── ui/
│   ├── pages/
│   │   └── index.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   └── styles/
├── public/
├── package.json
└── README.md
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

3. Start the development server:
```bash
npm run dev
```

## Features

- Modern, responsive UI with Tailwind CSS
- Real-time travel information queries
- Query history tracking and management
- Interactive response display
- Error handling and user feedback
- Dark mode support
- Mobile-friendly design

## Components

### QueryForm
- Input fields for travel query
- Destination and origin selection
- Submit button with loading state

### ResponseCard
- Display of travel information
- Organized sections for different types of information
- Icons and visual indicators
- Responsive layout

### QueryHistory
- List of previous queries
- Quick access to past responses
- Delete functionality
- Modal view for detailed information

## API Integration

The frontend communicates with the backend API using the following endpoints:

```typescript
interface TravelResponse {
    destination: string;
    origin: string;
    visaRequirements: string;
    documents: string[];
    advisories: string[];
    estimatedProcessingTime: string;
    embassyInformation: string;
    timestamp: string;
}

interface TravelQuery {
    id: number;
    query: string;
    destination: string;
    origin: string;
    response: TravelResponse;
    created_at: string;
}
```

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run test`: Run tests
- `npm run lint`: Run linter

### Styling

- Tailwind CSS for utility-first styling
- Custom components with shadcn/ui
- Responsive design breakpoints
- Dark mode support

### State Management

- React Query for data fetching
- Local state for UI components
- Context for theme management

## Dependencies

- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Query
- Axios
- date-fns
- Lucide Icons
