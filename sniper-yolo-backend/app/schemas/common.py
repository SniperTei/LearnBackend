"""Common Pydantic models for pagination and error responses."""
from pydantic import BaseModel
from typing import Generic, TypeVar, List

T = TypeVar('T')


class PaginationParams(BaseModel):
    """Common pagination parameters."""
    skip: int = 0
    limit: int = 100


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response model."""
    items: List[T]
    total: int
    skip: int
    limit: int


class ErrorResponse(BaseModel):
    """Standard error response model."""
    detail: str
    status_code: int
    error: str


class SuccessResponse(BaseModel):
    """Standard success response model."""
    message: str
    status_code: int = 200
    data: dict = {}