import google.generativeai as genai
from typing import Dict, Any, Optional
from ..core.config import get_settings
from app.core.logging_config import setup_logging
import json

logger = setup_logging()
settings = get_settings()

class GeminiService:
    """Service for interacting with Google's Gemini AI model to generate travel information.
    
    This service handles the generation of travel-related information including visa requirements,
    required documents, travel advisories, and other relevant details for international travel.
    It uses Google's Gemini 1.5 Flash model for generating responses.
    
    Attributes:
        api_key (str): Gemini API key from environment variables
        model: Configured Gemini model instance
    """

    def __init__(self):
        """Initialize the GeminiService with API configuration.
        
        Sets up the Gemini API client with the provided API key and configures
        the model for generating travel information.
        
        Raises:
            ValueError: If the Gemini API key is not configured in environment variables
        """
        try:
            logger.info("Initializing Gemini service")
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-pro')
            logger.info("Gemini service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini service: {str(e)}", exc_info=True)
            raise

    async def get_travel_info(self, query: str, destination: str, origin: str = None) -> Dict[str, Any]:
        """Generate travel information using the Gemini AI model.
        
        Processes a travel-related query and returns structured information about
        visa requirements, documents, advisories, and other travel details.
        
        Args:
            query (str): The user's travel-related question
            destination (str): The destination country
            origin (str, optional): The origin country. Defaults to None.
            
        Returns:
            Dict[str, Any]: Generated travel information including:
                - destination (str): The destination country
                - origin (str): The origin country
                - visaRequirements (str): Detailed visa requirements
                - documents (List[str]): List of required documents
                - advisories (List[str]): List of travel advisories
                - estimatedProcessingTime (str): Estimated visa processing time
                - embassyInformation (str): Embassy contact information
                - timestamp (str): ISO format timestamp of the response
            
        Raises:
            ValueError: If the API response is invalid or missing required fields
            Exception: If there's an error communicating with the AI model
        """
        try:
            logger.info(f"Generating travel info for destination: {destination}, origin: {origin}")
            prompt = self._format_prompt(query, destination, origin)
            logger.debug("Generated prompt for Gemini model")
            
            response = await self._make_api_request(prompt)
            logger.info(f"Successfully generated response for {destination}")
            
            parsed_response = self._parse_response(response)
            logger.debug("Successfully parsed Gemini response")
            
            return parsed_response
        except Exception as e:
            logger.error(f"Error in Gemini service: {str(e)}", exc_info=True)
            raise

    def _format_prompt(self, query: str, destination: str, origin: str = None) -> str:
        """Format the prompt for the Gemini AI model.
        
        Creates a structured prompt that includes the user's query and travel details
        to get comprehensive travel information from the AI model.
        
        Args:
            query (str): The user's travel-related question
            destination (str): The destination country
            origin (str, optional): The origin country. Defaults to None.
            
        Returns:
            str: Formatted prompt for the AI model with clear instructions
                 for generating structured travel information
        """
        logger.debug(f"Formatting prompt for query: {query}")
        base_prompt = f"""You are a travel advisor specializing in international travel requirements.
        Please provide detailed information about travel requirements from {origin or 'any country'} to {destination}.

        Query: {query}

        Please provide the following information in JSON format:
        1. Visa requirements
        2. Required documents
        3. Travel advisories
        4. Estimated processing time
        5. Embassy information

        Format your response as a JSON object with these exact keys:
        {{
            "destination": "{destination}",
            "origin": "{origin or 'any country'}",
            "visaRequirements": "detailed visa requirements",
            "documents": ["list", "of", "required", "documents"],
            "advisories": ["list", "of", "travel", "advisories"],
            "estimatedProcessingTime": "estimated processing time",
            "embassyInformation": "embassy contact information",
            "timestamp": "current timestamp"
        }}"""

        return base_prompt

    async def _make_api_request(self, prompt: str) -> str:
        """Make an API request to the Gemini service.
        
        Sends the formatted prompt to the Gemini API and retrieves the response.
        
        Args:
            prompt (str): The formatted prompt to send to the API
            
        Returns:
            str: Raw response from the API
            
        Raises:
            ValueError: If the API response is empty or invalid
            Exception: If there's an error communicating with the API
        """
        try:
            logger.debug("Making API request to Gemini")
            response = self.model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.8,
                    "top_k": 40,
                    "max_output_tokens": 1024,
                }
            )
            
            if not response.text:
                logger.error("Empty response received from Gemini API")
                raise Exception("Empty response from Gemini API")
            
            logger.debug("Successfully received response from Gemini API")
            return response.text
        except Exception as e:
            logger.error(f"API request failed: {str(e)}", exc_info=True)
            raise

    def _parse_response(self, response_text: str) -> Dict[str, Any]:
        """Parse the AI model's response into structured travel information.
        
        Extracts and structures the AI model's response into specific categories
        of travel information, ensuring all required fields are present and
        adding a timestamp if missing.
        
        Args:
            response_text (str): Raw response from the AI model
            
        Returns:
            Dict[str, Any]: Structured travel information containing:
                - destination (str): The destination country
                - origin (str): The origin country
                - visaRequirements (str): Detailed visa requirements
                - documents (List[str]): List of required documents
                - advisories (List[str]): List of travel advisories
                - estimatedProcessingTime (str): Estimated visa processing time
                - embassyInformation (str): Embassy contact information
                - timestamp (str): ISO format timestamp
            
        Raises:
            ValueError: If the response is missing required fields or is invalid JSON
            Exception: If there's an error parsing the response
        """
        try:
            logger.debug("Starting to parse Gemini response")
            cleaned_text = response_text.strip()
            if cleaned_text.startswith('```json'):
                cleaned_text = cleaned_text[7:]
            if cleaned_text.endswith('```'):
                cleaned_text = cleaned_text[:-3]
            cleaned_text = cleaned_text.strip()
            
            response_data = json.loads(cleaned_text)
            logger.debug("Successfully parsed JSON response")
            
            required_fields = [
                "destination", "origin", "visaRequirements",
                "documents", "advisories", "estimatedProcessingTime",
                "embassyInformation"
            ]
            
            for field in required_fields:
                if field not in response_data:
                    logger.error(f"Missing required field in response: {field}")
                    raise ValueError(f"Missing required field: {field}")
            
            from datetime import datetime
            if "timestamp" not in response_data:
                response_data["timestamp"] = datetime.utcnow().isoformat()
            else:
                try:
                    parsed_time = datetime.fromisoformat(response_data["timestamp"].replace("Z", "+00:00"))
                    response_data["timestamp"] = parsed_time.isoformat()
                except ValueError:
                    logger.warning("Invalid timestamp format in response, using current time")
                    response_data["timestamp"] = datetime.utcnow().isoformat()
            
            logger.debug("Successfully validated and formatted response data")
            return response_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse response as JSON: {response_text}")
            raise ValueError("Invalid JSON response from AI model")
        except Exception as e:
            logger.error(f"Error parsing response: {str(e)}", exc_info=True)
            raise 