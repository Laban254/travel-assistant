# Travel Query Backend

A FastAPI backend for processing travel-related queries and providing visa and document information using Google's Gemini AI.

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── travel_query.py
│   │   ├── query_history.py
│   │   └── travel_response.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── travel_query.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── database.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── gemini_service.py
│   │   └── history_service.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── endpoints/
│   │           ├── __init__.py
│   │           └── travel.py
│   └── utils/
│       └── __init__.py
├── tests/
├── requirements.txt
├── .env
├── .env.example
├── .env.production
└── run.sh
```

## Features

### Core Functionality
- AI-powered travel information generation using Google's Gemini
- Real-time query processing
- Comprehensive travel information including:
  - Visa requirements
  - Required documents
  - Travel advisories
  - Processing times
  - Embassy information

### Data Management
- SQLite database integration for persistent storage
- Query history tracking and retrieval
- Automatic field validation using Pydantic schemas
- Default value handling for missing fields
- Timestamp management for all responses

### API Features
- RESTful endpoints with proper HTTP methods
- Request/response validation using Pydantic
- Comprehensive error handling
- Swagger UI documentation
- Rate limiting and security measures

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./travel_queries.db
```

4. Run the development server:
```bash
./run.sh
```

## API Endpoints

### Travel Query Endpoints
- `POST /api/v1/travel/query`: Submit a travel query
  ```json
  {
    "query": "What do I need to travel to Japan?",
    "destination": "Japan",
    "origin": "United States"
  }
  ```

- `GET /api/v1/travel/history`: Retrieve query history
  - Returns paginated list of previous queries
  - Includes full response data

- `GET /api/v1/travel/history/{query_id}`: Get specific query details
  - Returns detailed information for a specific query

### Response Structure
```json
{
    "id": 1,
    "query": "What do I need to travel to Japan?",
    "destination": "Japan",
    "origin": "United States",
    "response": {
        "destination": "Japan",
        "origin": "United States",
        "visaRequirements": "Tourist visa required for stays up to 90 days",
        "documents": [
            "Valid passport",
            "Completed visa application",
            "Proof of accommodation"
        ],
        "advisories": [
            "Check local COVID-19 restrictions",
            "Register with embassy upon arrival"
        ],
        "estimatedProcessingTime": "2-4 weeks",
        "embassyInformation": "Contact Japanese Embassy for details",
        "timestamp": "2024-04-19T20:47:59.394462"
    },
    "created_at": "2024-04-19T20:47:59.394462"
}
```

## Error Handling

The API provides detailed error responses for various scenarios:

- 400 Bad Request: Invalid input data
- 404 Not Found: Query not found
- 500 Internal Server Error: Server-side issues
- 503 Service Unavailable: External service issues

## Testing

Run tests with:
```bash
pytest
```

Test coverage includes:
- API endpoint functionality
- Data validation
- Error handling
- Service integration
- Database operations

## Dependencies

- FastAPI: Web framework
- Uvicorn: ASGI server
- SQLAlchemy: Database ORM
- Google Generative AI: Gemini integration
- Pydantic: Data validation
- Python-dotenv: Environment management

