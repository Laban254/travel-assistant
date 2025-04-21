from datetime import datetime

from pydantic import BaseModel

from app.models.travel_response import TravelResponse


class TravelQueryBase(BaseModel):
    """Base schema for travel query data.

    Attributes:
        query (str): The user's travel-related question
        destination (str): The destination country
        origin (Optional[str]): The origin country, if specified
    """

    query: str
    destination: str
    origin: str | None = None


class TravelQueryCreate(TravelQueryBase):
    """Schema for creating a new travel query.
    Inherits all fields from TravelQueryBase.
    """

    pass


class TravelQueryResponse(TravelQueryBase):
    """Schema for complete travel query response including AI-generated information.

    Attributes:
        id (int): Unique identifier for the query
        response (TravelResponse): AI-generated travel information
        created_at (datetime): Query creation timestamp
    """

    id: int
    response: TravelResponse
    created_at: datetime

    class Config:
        from_attributes = True
