from sqlalchemy.orm import Session

from app.core.logging_config import setup_logging
from app.models import TravelQuery, TravelResponse
from app.schemas.travel_query import TravelQueryCreate

logger = setup_logging()


class HistoryService:
    """Service for managing travel query history in the database.

    This service handles CRUD operations for travel queries, including storing
    new queries, retrieving query history, and managing individual queries.
    """

    def __init__(self, db: Session):
        """Initialize the history service with a database session.

        Args:
            db (Session): Database session
        """
        self.db = db
        logger.debug("HistoryService initialized with database session")

    def save_query(self, query: str, response: dict) -> TravelQuery:
        """Save a new travel query to the database.

        Args:
            query (str): The user's travel-related question
            response (dict): The AI-generated response

        Returns:
            TravelQuery: The saved query record
        """
        try:
            logger.info(f"Saving new travel query: {query[:50]}...")
            db_query = TravelQuery(query=query, response=response)
            self.db.add(db_query)
            self.db.commit()
            self.db.refresh(db_query)
            logger.info(f"Successfully saved query with ID: {db_query.id}")
            return db_query
        except Exception as e:
            logger.error(f"Error saving query: {str(e)}", exc_info=True)
            raise

    def get_history(self, limit: int | None = 10) -> list[TravelQuery]:
        """Retrieve travel query history.

        Args:
            limit (Optional[int]): Maximum number of queries to return. Defaults to 10.

        Returns:
            List[TravelQuery]: List of travel query records
        """
        try:
            logger.info(f"Retrieving query history with limit: {limit}")
            queries = (
                self.db.query(TravelQuery)
                .order_by(TravelQuery.created_at.desc())
                .limit(limit)
                .all()
            )
            logger.info(f"Successfully retrieved {len(queries)} queries")
            return queries
        except Exception as e:
            logger.error(f"Error retrieving history: {str(e)}", exc_info=True)
            raise

    async def get_query_by_id(self, db: Session, query_id: int) -> TravelQuery | None:
        """Get a specific travel query by ID."""
        try:
            logger.info(f"Retrieving query with ID: {query_id}")
            query = db.query(TravelQuery).filter(TravelQuery.id == query_id).first()
            if not query:
                logger.warning(f"Query with ID {query_id} not found")
                return None
            logger.info(f"Successfully retrieved query with ID: {query_id}")
            return query
        except Exception as e:
            logger.error(f"Error retrieving query: {str(e)}", exc_info=True)
            raise

    @staticmethod
    async def create_query(
        db: Session, query: TravelQueryCreate, response: TravelResponse
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
        try:
            logger.info(f"Creating new query for destination: {query.destination}")
            db_query = TravelQuery(
                query=query.query,
                destination=query.destination,
                origin=query.origin,
                response=response.dict(),
            )
            db.add(db_query)
            db.commit()
            db.refresh(db_query)
            logger.info(f"Successfully created query with ID: {db_query.id}")
            return db_query
        except Exception as e:
            logger.error(f"Error creating query: {str(e)}", exc_info=True)
            raise

    @staticmethod
    async def get_query_history(
        db: Session, limit: int | None = None
    ) -> list[TravelQuery]:
        """Retrieve the history of travel queries.

        Args:
            db (Session): Database session
            limit (Optional[int], optional): Maximum number of queries to return. Defaults to None.

        Returns:
            List[TravelQuery]: List of travel query records
        """
        try:
            logger.info(f"Retrieving query history with limit: {limit}")
            queries = (
                db.query(TravelQuery)
                .order_by(TravelQuery.created_at.desc())
                .limit(limit)
                .all()
            )
            logger.info(f"Successfully retrieved {len(queries)} queries")
            return queries
        except Exception as e:
            logger.error(f"Error retrieving query history: {str(e)}", exc_info=True)
            raise

    @staticmethod
    async def delete_query(db: Session, query_id: int) -> bool:
        """Delete a travel query from the database.

        Args:
            db (Session): Database session
            query_id (int): ID of the query to delete

        Returns:
            bool: True if the query was deleted, False if not found
        """
        try:
            logger.info(f"Attempting to delete query with ID: {query_id}")
            query = db.query(TravelQuery).filter(TravelQuery.id == query_id).first()
            if not query:
                logger.warning(f"Query with ID {query_id} not found for deletion")
                return False

            db.delete(query)
            db.commit()
            logger.info(f"Successfully deleted query with ID: {query_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting query: {str(e)}", exc_info=True)
            raise
