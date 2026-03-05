from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    product_id: int
    title: str = ''
    comment: str = ''
    rating: int = Field(ge=1, le=5)


class ReviewOut(BaseModel):
    id: int
    product_id: int
    user_id: int
    title: str
    comment: str
    rating: int

    class Config:
        from_attributes = True
