from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, List
import logging
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.travel_query import TravelQuery
from app.schemas.travel_query import TravelQueryCreate, TravelQueryResponse
from app.services.gemini_service import GeminiService
from app.services.history_service import HistoryService

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/query", response_model=TravelQueryResponse)
async def create_travel_query(
    query: TravelQueryCreate,
    db: Session = Depends(get_db)
) -> TravelQueryResponse:
    """Create a new travel query and get AI-generated travel information.
    
    Args:
        query (TravelQueryCreate): The travel query details including destination and origin
        db (Session): Database session dependency
        
    Returns:
        TravelQueryResponse: Complete response including AI-generated travel information
        
    Raises:
        HTTPException: If there's an error processing the query or generating the response
    """
    try:
        gemini_service = GeminiService()
        
        travel_info = await gemini_service.get_travel_info(
            query=query.query,
            destination=query.destination,
            origin=query.origin
        )
        
        db_query = TravelQuery(
            query=query.query,
            destination=query.destination,
            origin=query.origin,
            response=travel_info
        )
        db.add(db_query)
        db.commit()
        db.refresh(db_query)
        
        return TravelQueryResponse(
            id=db_query.id,
            query=db_query.query,
            destination=db_query.destination,
            origin=db_query.origin,
            response=db_query.response,
            created_at=db_query.created_at
        )
        
    except ValueError as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

@router.get("/history", response_model=List[TravelQueryResponse])
async def get_query_history(
    db: Session = Depends(get_db)
) -> List[TravelQueryResponse]:
    """Retrieve the history of all travel queries.
    
    Args:
        db (Session): Database session dependency
        
    Returns:
        List[TravelQueryResponse]: List of all previous travel queries and their responses
        
    Raises:
        HTTPException: If there's an error retrieving the history
    """
    try:
        queries = db.query(TravelQuery).order_by(TravelQuery.created_at.desc()).all()
        responses = []
        for query in queries:
            # Ensure all required fields are present in the response
            response = query.response.copy()  # Create a copy to avoid modifying the original
            
            # Add missing required fields with default values
            if "origin" not in response:
                response["origin"] = query.origin or "Not specified"
            if "embassyInformation" not in response:
                response["embassyInformation"] = f"Contact the {query.destination} embassy for more information"
            if "timestamp" not in response:
                from datetime import datetime
                response["timestamp"] = datetime.utcnow().isoformat()
            
            # Ensure other required fields are present
            required_fields = [
                "destination", "visaRequirements", "documents",
                "advisories", "estimatedProcessingTime"
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
                    created_at=query.created_at
                )
            )
        return responses
    except Exception as e:
        logger.error(f"Error fetching history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{query_id}", response_model=TravelQueryResponse)
async def get_query_by_id(
    query_id: int,
    db: Session = Depends(get_db)
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
        query = db.query(TravelQuery).filter(TravelQuery.id == query_id).first()
        if not query:
            raise HTTPException(status_code=404, detail="Query not found")
        return TravelQueryResponse(
            id=query.id,
            query=query.query,
            destination=query.destination,
            origin=query.origin,
            response=query.response,
            created_at=query.created_at
        )
    except Exception as e:
        logger.error(f"Error fetching query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/history/{query_id}")
async def delete_query(
    query_id: int,
    db: Session = Depends(get_db)
) -> dict:
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
        query = db.query(TravelQuery).filter(TravelQuery.id == query_id).first()
        if not query:
            raise HTTPException(status_code=404, detail="Query not found")
        
        db.delete(query)
        db.commit()
        return {"message": "Query deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def extract_travel_info(query: str) -> tuple[Optional[str], str]:
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