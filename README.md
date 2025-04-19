# Travel Query Application

A full-stack application for querying travel requirements and visa information using AI-powered responses.

## Features

- Real-time travel information queries
- AI-powered responses using Google's Gemini
- Query history tracking
- Modern, responsive UI
- Secure API endpoints
- MongoDB database integration

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Axios for API calls
- React Query for data fetching
- React Router for navigation

### Backend
- FastAPI
- MongoDB
- Google's Gemini AI
- Motor (MongoDB async driver)
- Pydantic for data validation

## Project Structure

```
travel-query-app/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── package.json
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── db/
│   └── requirements.txt
└── README.md
```

## Setup

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file:
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=travel_query
GEMINI_API_KEY=your_gemini_api_key_here
```

5. Start the development server:
```bash
uvicorn app.main:app --reload
```

## Environment Variables

### Frontend
- `VITE_API_URL`: Backend API URL (default: http://localhost:8000)

### Backend
- `MONGODB_URL`: MongoDB connection string
- `DATABASE_NAME`: MongoDB database name
- `GEMINI_API_KEY`: Google Gemini API key

## API Documentation

Once the backend server is running, you can access:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

### Frontend Development
- Uses Vite for fast development
- ESLint and Prettier for code quality
- TypeScript for type safety
- Tailwind CSS for styling

### Backend Development
- FastAPI for high-performance API
- MongoDB for flexible data storage
- Async/await for better performance
- Comprehensive error handling

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
pytest
```

## Deployment

### Frontend Deployment
1. Build the production version:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` directory to your hosting service.

### Backend Deployment
1. Set up a production environment with:
   - Python 3.8+
   - MongoDB
   - Environment variables

2. Install production dependencies:
```bash
pip install -r requirements.txt
```

3. Run with a production server:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
