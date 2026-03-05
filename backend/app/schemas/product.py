import json

from pydantic import BaseModel, field_validator


class ProductCreate(BaseModel):
    name: str
    slug: str
    description: str = ''
    image_url: str = ''
    image_urls: list[str] = []
    price: float
    compare_at_price: float | None = None
    stock: int = 0
    category_id: int | None = None

    @field_validator('image_urls', mode='before')
    @classmethod
    def parse_image_urls(cls, value):  # noqa: ANN001
        if value is None:
            return []
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            if not value.strip():
                return []
            try:
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return parsed
            except json.JSONDecodeError:
                return [value]
        return []


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    image_url: str | None = None
    image_urls: list[str] | None = None
    price: float | None = None
    compare_at_price: float | None = None
    stock: int | None = None
    category_id: int | None = None


class ProductOut(ProductCreate):
    id: int

    class Config:
        from_attributes = True
