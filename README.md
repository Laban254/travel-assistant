# Travel Query Assistant

A web application that helps users get detailed travel information including visa requirements, documents needed, and travel advisories using AI.

## Live Demo
- Frontend: [https://travel-assistant-alpha.vercel.app/](https://travel-assistant-alpha.vercel.app/)
- Backend API: [https://travel-assistant-b08x.onrender.com](https://travel-assistant-b08x.onrender.com)

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

## Documentation

### Getting Started
For detailed installation and setup instructions, please refer to:
- [Frontend Setup](frontend/README.md)
- [Backend Setup](backend/README.md)

### LLM Prompts Documentation
The application uses Google's Gemini AI model to generate travel information. Detailed documentation about the prompts used can be found in [docs/PROMPTS.md](docs/PROMPTS.md).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
