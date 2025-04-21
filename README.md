# Travel Query Assistant

An AI-powered travel information system that provides detailed travel requirements, visa information, and advisories using Google's Gemini AI.

## Architecture

```
travel-query-app/
├── frontend/          # Next.js application
└── backend/          # FastAPI service
```

## Key Features

- AI-powered travel information generation
- Natural language query processing
- Database-agnostic design (MySQL/PostgreSQL)
- Dark mode support
- Responsive web interface
- Comprehensive logging system

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy ORM
- Google Gemini AI
- MySQL/PostgreSQL
- Pydantic

### Frontend
- Next.js 15.2
- TypeScript
- Tailwind CSS
- Shadcn UI
- Framer Motion

## Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database and API keys

# Start server
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL or PostgreSQL
- Google Gemini API key

### Environment Variables

#### Backend
```env
DATABASE_URL=mysql://user:password@localhost:3306/travel_app
GEMINI_API_KEY=your_gemini_api_key
```

#### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Project Structure

### Backend Components
- RESTful API endpoints
- Database models and migrations
- AI service integration
- Query history management
- Logging and error handling

### Frontend Components
- Travel query interface
- Real-time API integration
- Response visualization
- Theme management
- Error handling and notifications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
