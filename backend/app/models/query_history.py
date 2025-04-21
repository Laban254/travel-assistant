from sqlalchemy import JSON, Column, DateTime, Integer, String
from sqlalchemy.sql import func

from app.core.database import Base


class QueryHistory(Base):
    """Database model for storing travel query history.

    This model represents a table that stores past travel queries and their AI-generated responses.

    Attributes:
        id (int): Primary key
        query (str): The user's travel-related question
        response (JSON): AI-generated response containing travel information
        created_at (DateTime): Timestamp of when the query was created
    """

    __tablename__ = "query_history"

    id = Column(Integer, primary_key=True, index=True)
    query = Column(String, nullable=False)
    response = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def to_dict(self):
        """Convert the model instance to a dictionary.

        Returns:
            dict: Dictionary representation of the model instance
        """
        return {
            "id": self.id,
            "query": self.query,
            "response": self.response,
            "created_at": self.created_at.isoformat(),
        }
