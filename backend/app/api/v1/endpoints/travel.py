import re

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.logging_config import setup_logging
from app.core.rate_limiter import RateLimiter, rate_limit
from app.models.travel_query import TravelQuery
from app.schemas.travel_query import TravelQueryCreate, TravelQueryResponse
from app.services.gemini_service import GeminiService
from app.services.history_service import HistoryService

logger = setup_logging()

router = APIRouter()
gemini_service = GeminiService()
history_service = HistoryService()

query_rate_limiter = RateLimiter(
    max_requests=10, time_window=60
)  # 10 requests per minute
history_rate_limiter = RateLimiter(
    max_requests=5, time_window=60
)  # 5 requests per minute


@router.post("/query", response_model=TravelQueryResponse)
@rate_limit(times=5, minutes=1)
async def create_travel_query(
    request: Request, query: TravelQueryCreate, db: Session = Depends(get_db)
) -> TravelQueryResponse:
    """Create a new travel query and get AI-generated travel information.

    Args:
        request (Request): FastAPI request object
        query (TravelQueryCreate): The travel query details including destination and origin
        db (Session): Database session dependency

    Returns:
        TravelQueryResponse: Complete response including AI-generated travel information

    Raises:
        HTTPException: If there's an error processing the query or generating the response
    """
    try:
        logger.info(f"Received travel query: {query.destination} - {query.query}")

        logger.debug("Initialized Gemini service")

        travel_info = await gemini_service.get_travel_info(
            query=query.query, destination=query.destination, origin=query.origin
        )
        logger.info(f"Successfully generated response for {query.destination}")

        db_query = TravelQuery(
            query=query.query,
            destination=query.destination,
            origin=query.origin,
            response=travel_info,
        )
        db.add(db_query)
        db.commit()
        db.refresh(db_query)
        logger.debug(f"Saved query to database with ID: {db_query.id}")

        return TravelQueryResponse(
            id=db_query.id,
            query=db_query.query,
            destination=db_query.destination,
            origin=db_query.origin,
            response=db_query.response,
            created_at=db_query.created_at,
        )

    except ValueError as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        logger.error(f"Unexpected error processing query: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, detail="An unexpected error occurred"
        ) from e


@router.get("/history", response_model=list[TravelQueryResponse])
@history_rate_limiter
async def get_query_history(
    request: Request, db: Session = Depends(get_db)
) -> list[TravelQueryResponse]:
    """Retrieve the history of all travel queries.

    Args:
        request (Request): FastAPI request object
        db (Session): Database session dependency

    Returns:
        List[TravelQueryResponse]: List of all previous travel queries and their responses

    Raises:
        HTTPException: If there's an error retrieving the history
    """
    try:
        logger.info("Fetching query history")
        queries = db.query(TravelQuery).order_by(TravelQuery.created_at.desc()).all()
        logger.debug(f"Found {len(queries)} queries in history")

        responses = []
        for query in queries:
            response = query.response.copy()

            if "origin" not in response:
                response["origin"] = query.origin or "Not specified"
            if "embassyInformation" not in response:
                response["embassyInformation"] = (
                    f"Contact the {query.destination} embassy for more information"
                )
            response["timestamp"] = query.created_at.isoformat()

            required_fields = [
                "destination",
                "visaRequirements",
                "documents",
                "advisories",
                "estimatedProcessingTime",
            ]

            for field in required_fields:
                if field not in response:
                    response[field] = "Information not available"

            responses.append(
                TravelQueryResponse(
                    id=query.id,
                    query=query.query,
                    destination=query.destination,
                    origin=query.origin,
                    response=response,
                    created_at=query.created_at,
                )
            )
        logger.info("Successfully retrieved and formatted query history")
        return responses
    except Exception as e:
        logger.error(f"Error fetching history: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, detail="Failed to fetch query history"
        ) from e


@router.get("/history/{query_id}", response_model=TravelQueryResponse)
async def get_query_by_id(
    query_id: int, db: Session = Depends(get_db)
) -> TravelQueryResponse:
    """Retrieve a specific travel query by its ID.

    Args:
        query_id (int): The ID of the travel query to retrieve
        db (Session): Database session dependency

    Returns:
        TravelQueryResponse: The requested travel query and its response

    Raises:
        HTTPException: If the query is not found or there's an error retrieving it
    """
    try:
        logger.info(f"Fetching query with ID: {query_id}")
        query = db.query(TravelQuery).filter(TravelQuery.id == query_id).first()
        if not query:
            logger.warning(f"Query with ID {query_id} not found")
            raise HTTPException(status_code=404, detail="Query not found")
        logger.debug(f"Successfully retrieved query with ID: {query_id}")
        return TravelQueryResponse(
            id=query.id,
            query=query.query,
            destination=query.destination,
            origin=query.origin,
            response=query.response,
            created_at=query.created_at,
        )
    except Exception as e:
        logger.error(f"Error fetching query: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.delete("/history/{query_id}")
async def delete_query(query_id: int, db: Session = Depends(get_db)) -> dict:
    """Delete a specific travel query from the history.

    Args:
        query_id (int): The ID of the travel query to delete
        db (Session): Database session dependency

    Returns:
        dict: Success message confirming deletion

    Raises:
        HTTPException: If the query is not found or there's an error deleting it
    """
    try:
        logger.info(f"Attempting to delete query with ID: {query_id}")
        query = db.query(TravelQuery).filter(TravelQuery.id == query_id).first()
        if not query:
            logger.warning(f"Query with ID {query_id} not found for deletion")
            raise HTTPException(status_code=404, detail="Query not found")

        db.delete(query)
        db.commit()
        logger.info(f"Successfully deleted query with ID: {query_id}")
        return {"message": "Query deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting query: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e)) from e


def extract_travel_info(query: str) -> tuple[str | None, str]:
    """Extract origin and destination from query text."""
    origin_destination_regex = r"(?:from|travel(?:ing)? from)\s+([a-zA-Z\s]+)\s+(?:to|visit(?:ing)?)\s+([a-zA-Z\s]+)"
    destination_regex = r"(?:to|visit(?:ing)?)\s+([a-zA-Z\s]+)"

    origin = None
    destination = None

    origin_destination_match = re.search(origin_destination_regex, query, re.IGNORECASE)
    if origin_destination_match:
        origin = origin_destination_match.group(1).strip()
        destination = origin_destination_match.group(2).strip()
    else:
        destination_match = re.search(destination_regex, query, re.IGNORECASE)
        if destination_match:
            destination = destination_match.group(1).strip()

    if not destination:
        destination = "Unknown destination"

    return origin, destination
