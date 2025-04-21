# Travel Query Assistant Backend

FastAPI backend service for the Travel Query Assistant application.

## Features

- RESTful API endpoints
- Google Gemini AI integration
- Database migrations with Alembic
- Rate limiting
- Comprehensive logging
- Pre-commit hooks for code quality
- GitHub Actions CI

## Tech Stack

- FastAPI
- SQLAlchemy ORM
- PostgreSQL
- Google Gemini AI
- Pydantic
- Pre-commit (Ruff, Black)
- GitHub Actions

## Getting Started

### Prerequisites

- Python 3.12+
- PostgreSQL
- Google Gemini API key

### Installation

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Install pre-commit hooks:
```bash
pre-commit install
```

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/travel_app
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Running the Application

1. Start the development server:
```bash
uvicorn app.main:app --reload
```

2. Access the API documentation:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

### Code Quality

- Pre-commit hooks are installed automatically
- Run `pre-commit run --all-files` to check all files
- CI checks run on every push and pull request

### Running Pre-commit

Pre-commit can be run in several ways:

1. **Automatic Run (on commit)**:
   ```bash
   git add .
   git commit -m "your message"
   # pre-commit will run automatically
   ```

2. **Manual Run (on all files)**:
   ```bash
   pre-commit run --all-files
   ```

3. **Manual Run (on specific files)**:
   ```bash
   pre-commit run --files path/to/file1.py path/to/file2.py
   ```

If pre-commit finds issues:
- It will automatically fix some issues (like formatting with Black)
- For other issues, it will show you what needs to be fixed
- You'll need to fix those issues manually
- Then run `git add` again and try committing

### Project Structure

```
backend/
├── app/
│   ├── api/           # API endpoints
│   ├── core/          # Core functionality
│   ├── models/        # Database models
│   ├── schemas/       # Pydantic schemas
│   └── services/      # Business logic
├── alembic/           # Database migrations
├── tests/             # Test files
└── requirements.txt   # Dependencies
```

### Database Migrations

1. Create a new migration:
```bash
alembic revision --autogenerate -m "description"
```

2. Apply migrations:
```bash
alembic upgrade head
```

### Testing

Run tests with:
```bash
pytest
```

## API Endpoints

- `POST /api/v1/query` - Create a new travel query
- `GET /api/v1/history` - Get query history
- `GET /api/v1/history/{id}` - Get specific query
- `DELETE /api/v1/history/{id}` - Delete a query

## Contributing

1. Follow the conventional commit format
2. Run pre-commit hooks before committing
3. Ensure all tests pass
4. Update documentation as needed

## License

This project is licensed under the MIT License.

