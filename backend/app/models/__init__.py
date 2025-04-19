"""
Data models package for the Travel Query application
"""

# This file is intentionally empty to make the directory a Python package 

from .travel_query import TravelQuery
from .query_history import QueryHistory
from .travel_response import TravelResponse

__all__ = ["TravelQuery", "QueryHistory", "TravelResponse"] 