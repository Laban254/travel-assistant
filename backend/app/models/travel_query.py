from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, Integer, String
from sqlalchemy.sql import func

from app.core.database import Base


class TravelQuery(Base):
    """Database model for storing travel queries and their responses.

    This model represents a table that stores travel queries and their AI-generated responses.

    Attributes:
        id (int): Primary key
        query (str): The user's travel-related question
        destination (str): The destination country
        origin (str): The origin country (optional)
        response (JSON): AI-generated response containing travel information
        created_at (DateTime): Timestamp of when the query was created
    """

    __tablename__ = "travel_queries"

    id = Column(Integer, primary_key=True, index=True)
    query = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    origin = Column(String, nullable=True)
    response = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Ensure response has timestamp when creating new instance
        if "response" in kwargs and isinstance(kwargs["response"], dict):
            if "timestamp" not in kwargs["response"]:
                kwargs["response"]["timestamp"] = datetime.utcnow().isoformat()
            self.response = kwargs["response"]
