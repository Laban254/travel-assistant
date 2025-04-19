from sqlalchemy.orm import Session
from typing import List, Optional

from app.models import TravelResponse, TravelQuery
from app.schemas.travel_query import TravelQueryCreate

class HistoryService:
    """Service for managing travel query history in the database.
    
    This service handles CRUD operations for travel queries, including storing
    new queries, retrieving query history, and managing individual queries.
    """

    def __init__(self, db: Session):
        self.db = db

    def save_query(self, query: str, response: dict) -> TravelQuery:
        """Save a new travel query to the database.
        
        Args:
            query (str): The user's travel-related question
            response (dict): The AI-generated response
            
        Returns:
            TravelQuery: The saved query record
        """
        db_query = TravelQuery(
            query=query,
            response=response
        )
        self.db.add(db_query)
        self.db.commit()
        self.db.refresh(db_query)
        return db_query

    def get_history(self, limit: Optional[int] = 10) -> List[TravelQuery]:
        """Retrieve travel query history.
        
        Args:
            limit (Optional[int]): Maximum number of queries to return. Defaults to 10.
            
        Returns:
            List[TravelQuery]: List of travel query records
        """
        return self.db.query(TravelQuery)\
            .order_by(TravelQuery.created_at.desc())\
            .limit(limit)\
            .all()

    def get_query_by_id(self, query_id: int) -> Optional[TravelQuery]:
        """Retrieve a specific travel query by its ID.
        
        Args:
            query_id (int): ID of the query to retrieve
            
        Returns:
            Optional[TravelQuery]: The requested query record, or None if not found
        """
        return self.db.query(TravelQuery).filter(TravelQuery.id == query_id).first()

    @staticmethod
    async def create_query(
        db: Session,
        query: TravelQueryCreate,
        response: TravelResponse
    ) -> TravelQuery:
        """Create a new travel query record in the database.
        
        Args:
            db (Session): Database session
            query (TravelQueryCreate): The travel query details
            response (TravelResponse): The AI-generated response
            
        Returns:
            TravelQuery: The created query record
            
        Raises:
            Exception: If there's an error creating the record
        """
        db_query = TravelQuery(
            query=query.query,
            destination=query.destination,
            origin=query.origin,
            response=response.dict()
        )
        db.add(db_query)
        db.commit()
        db.refresh(db_query)
        return db_query

    @staticmethod
    async def get_query_history(
        db: Session,
        limit: Optional[int] = None
    ) -> List[TravelQuery]:
        """Retrieve the history of travel queries.
        
        Args:
            db (Session): Database session
            limit (Optional[int], optional): Maximum number of queries to return. Defaults to None.
            
        Returns:
            List[TravelQuery]: List of travel query records
        """
        query = db.query(TravelQuery).order_by(TravelQuery.created_at.desc())
        if limit:
            query = query.limit(limit)
        return query.all()

    @staticmethod
    async def get_query_by_id(
        db: Session,
        query_id: int
    ) -> Optional[TravelQuery]:
        """Retrieve a specific travel query by its ID.
        
        Args:
            db (Session): Database session
            query_id (int): ID of the query to retrieve
            
        Returns:
            Optional[TravelQuery]: The requested query record, or None if not found
        """
        return db.query(TravelQuery).filter(TravelQuery.id == query_id).first()

    @staticmethod
    async def delete_query(
        db: Session,
        query_id: int
    ) -> bool:
        """Delete a travel query from the database.
        
        Args:
            db (Session): Database session
            query_id (int): ID of the query to delete
            
        Returns:
            bool: True if query was deleted, False if not found
        """
        query = await HistoryService.get_query_by_id(db, query_id)
        if query:
            db.delete(query)
            db.commit()
            return True
        return False 