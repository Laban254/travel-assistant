# Travel Query Assistant

A modern web application that helps users get detailed travel information including visa requirements, documents needed, and travel advisories using AI.

## Features

- AI-powered travel information generation
- Query history tracking
- User authentication
- Rate limiting
- Comprehensive logging
- Code quality checks with pre-commit hooks

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Shadcn UI

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Google Gemini AI
- Pre-commit hooks (Ruff, Black)
- GitHub Actions CI

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.12+
- PostgreSQL
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/travel-query-app.git
cd travel-query-app
```

2. Set up the frontend:
```bash
cd frontend
npm install
```

3. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
pre-commit install
```

4. Configure environment variables:
- Create `.env` files in both frontend and backend directories
- See `.env.example` files for required variables

5. Start the development servers:
```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Development

### Code Quality
- Pre-commit hooks are installed automatically
- Run `pre-commit run --all-files` to check all files
- CI checks run on every push and pull request

### Project Structure
```
travel-query-app/
├── frontend/          # Next.js frontend
├── backend/           # FastAPI backend
│   ├── app/          # Application code
│   ├── alembic/      # Database migrations
│   └── tests/        # Test files
└── README.md         # This file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
