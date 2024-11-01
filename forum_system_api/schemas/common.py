from typing import Literal

from pydantic import BaseModel, Field


class FilterParams(BaseModel):
    order: Literal["asc", "desc"] = "asc"
    order_by: Literal["name", "created_at"] = "created_at"
    limit: int = Field(20, gt=0, le=100)
    offset: int = Field(0, ge=0)


class TopicFilterParams(BaseModel):
    order: Literal["asc", "desc"] = "desc"
    order_by: Literal["title", "created_at"] = "created_at"
    limit: int = Field(10, gt=0, le=100)
    offset: int = Field(0, ge=0)
