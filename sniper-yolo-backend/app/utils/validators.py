"""Custom Pydantic validators."""
from pydantic import validator
from typing import Any


def validate_positive_int(value: int) -> int:
    """Validate that an integer is positive."""
    if value <= 0:
        raise ValueError("Value must be positive")
    return value


def validate_not_empty_string(value: str) -> str:
    """Validate that a string is not empty."""
    if not value or not value.strip():
        raise ValueError("String cannot be empty")
    return value.strip()


def validate_email_domain(email: str, allowed_domains: list[str]) -> str:
    """Validate email domain."""
    domain = email.split('@')[-1]
    if domain not in allowed_domains:
        raise ValueError(f"Email domain must be one of {allowed_domains}")
    return email