#!/bin/bash

# Check if environment is provided as an argument
ENV=${1:-development}

# Export the environment variable
export ENVIRONMENT=$ENV

# Run the application
if [ "$ENV" = "production" ]; then
    uvicorn app.main:app --host 0.0.0.0 --port 8000
else
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
fi 