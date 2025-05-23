from pydantic import BaseModel


class TravelResponse(BaseModel):
    """Model for travel information response.

    This model represents the structure of travel information responses
    generated by the AI service.

    Attributes:
        destination (str): Destination country
        origin (str): Origin country
        visaRequirements (str): Visa requirements information
        documents (List[str]): List of required documents
        advisories (List[str]): List of travel advisories
        estimatedProcessingTime (str): Estimated time for processing
        embassyInformation (str): Embassy contact information
        timestamp (str): Response timestamp
    """

    destination: str
    origin: str
    visaRequirements: str
    documents: list[str]
    advisories: list[str]
    estimatedProcessingTime: str
    embassyInformation: str
    timestamp: str
