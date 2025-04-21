# Travel Query App Backend

FastAPI backend for AI-powered travel information using Google's Gemini AI.

## Features

- AI-powered travel information generation
- Query history tracking
- Rate limiting middleware
- Comprehensive logging
- Database-agnostic design (MySQL/PostgreSQL)

## Tech Stack

- FastAPI
- SQLAlchemy (ORM)
- MySQL/PostgreSQL (configurable)
- Google Gemini AI
- Pydantic

## Project Structure

```
backend/
├── app/
│   ├── api/                    # API endpoints
│   │   └── v1/
│   │       └── endpoints/      # Version 1 API endpoints
│   │           └── travel.py   # Travel-related endpoints
│   ├── core/                   # Core application components
│   │   ├── config.py          # Application configuration
│   │   ├── database.py        # Database configuration
│   │   ├── logging_config.py  # Logging setup
│   │   ├── middleware.py      # Custom middleware
│   │   └── rate_limiter.py    # Rate limiting implementation
│   ├── models/                 # Database models
│   │   ├── travel_query.py
│   │   ├── query_history.py
│   │   └── travel_response.py
│   ├── schemas/               # Pydantic models
│   │   └── travel_query.py
│   ├── services/              # Business logic
│   │   ├── gemini_service.py  # Gemini AI integration
│   │   └── history_service.py # Query history management
│   ├── utils/                 # Utility functions
│   ├── main.py                # Application entry point
│   └── __init__.py
├── requirements.txt
└── README.md
```

## Configuration

```bash
# .env
DATABASE_URL=mysql://user:password@localhost:3306/travel_app
# or
DATABASE_URL=postgresql://user:password@localhost:5432/travel_app

GEMINI_API_KEY=your_gemini_api_key
```

## Key Components

### Database
- SQLAlchemy ORM for database operations
- Support for both MySQL and PostgreSQL
- Migrations handled via Alembic

### Rate Limiting
- Custom rate limiting middleware
- Configurable limits per endpoint
- IP-based request tracking

### Services
- GeminiService: AI-powered responses
- HistoryService: Query management
- Logging: Comprehensive event tracking

## Quick Start

```bash
# Setup
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run
uvicorn app.main:app --reload
```

API Docs: http://localhost:8000/docs

## Development

### Code Style
- Follow PEP 8 guidelines
- Use type hints
- Document all public functions and classes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

