# LLM Prompts Documentation

This document provides detailed information about the prompts used with the Large Language Model (Google Gemini) in the Travel Query Assistant application.

## Travel Information Generation Prompt

### Purpose
This prompt is used to generate comprehensive travel information including visa requirements, required documents, travel advisories, and embassy information.

### Location
- File: `backend/app/services/gemini_service.py`
- Method: `_format_prompt()`

### Prompt Template
```python
You are a travel advisor specializing in international travel requirements.
Please provide detailed information about travel requirements from {origin or 'any country'} to {destination}.

Query: {query}

Please provide the following information in JSON format:
1. Visa requirements
2. Required documents
3. Travel advisories
4. Estimated processing time
5. Embassy information

Format your response as a JSON object with these exact keys:
{
    "destination": "{destination}",
    "origin": "{origin or 'any country'}",
    "visaRequirements": "detailed visa requirements",
    "documents": ["list", "of", "required", "documents"],
    "advisories": ["list", "of", "travel", "advisories"],
    "estimatedProcessingTime": "estimated processing time",
    "embassyInformation": "embassy contact information",
    "timestamp": "current timestamp"
}
```

### Parameters
- `query`: The user's specific travel-related question
- `destination`: The destination country
- `origin`: (Optional) The origin country

### Model Configuration
- Model: Gemini 1.5 Pro
- Temperature: 0.7
- Top P: 0.8
- Top K: 40
- Max Output Tokens: 1024

### Expected Response Format
The LLM is expected to return a JSON object with the following structure:
```json
{
    "destination": "string",
    "origin": "string",
    "visaRequirements": "string",
    "documents": ["string"],
    "advisories": ["string"],
    "estimatedProcessingTime": "string",
    "embassyInformation": "string",
    "timestamp": "string (ISO format)"
}
```

### Response Handling
- The response is parsed and validated to ensure all required fields are present
- Missing timestamps are automatically added in ISO format
- Invalid JSON responses trigger error handling
- Empty responses are rejected with appropriate error messages

## Best Practices
1. Always include specific country names in the prompt
2. Keep user queries focused on travel requirements
3. Ensure JSON formatting is explicitly requested
4. Include all necessary fields in the response template
5. Maintain consistent key names in the JSON structure

## Error Handling
The prompt system includes several layers of error handling:
1. Input validation before prompt generation
2. Response format validation
3. JSON parsing error handling
4. Missing field detection
5. Timestamp validation and correction 