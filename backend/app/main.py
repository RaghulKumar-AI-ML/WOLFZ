from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.database import Base, engine
from app.core.migrations import apply_sqlite_migrations
from app.models import *  # noqa: F403


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    if settings.AUTO_CREATE_TABLES:
        Base.metadata.create_all(bind=engine)
        apply_sqlite_migrations(engine)
    yield


app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
if settings.ENABLE_GZIP:
    app.add_middleware(GZipMiddleware, minimum_size=settings.GZIP_MINIMUM_SIZE)
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get('/health')
def healthcheck() -> dict[str, str]:
    return {'status': 'ok'}
