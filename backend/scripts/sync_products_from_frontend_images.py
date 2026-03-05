from pathlib import Path
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'backend'))

from app.core.database import Base, SessionLocal, engine
from app.core.migrations import apply_sqlite_migrations
from app.models import *  # noqa: F403,F401
from app.models.product import Product


PRODUCT_NAMES = [
    'WOLFz Noir Crest',
    'WOLFz Nightline Oversize',
    'WOLFz Mono Stamp',
    'WOLFz Shadowmark',
    'WOLFz Street Crest',
    'WOLFz Steelline',
    'WOLFz Graphite Drop',
]

PRICE_POINTS = [699.0, 749.0, 799.0, 849.0, 899.0, 999.0]
COMPARE_AT = 1200.0


def _normalize_name(filename: str) -> str:
    return re.sub(r' \(\d+\)(?=\.[a-zA-Z0-9]+$)', '', filename).strip()


def _safe_name(filename: str) -> str:
    stem, ext = filename.rsplit('.', 1)
    stem = re.sub(r'[^a-zA-Z0-9]+', '-', stem).strip('-').lower()
    return f'{stem}.{ext.lower()}'


def sync_products() -> None:
    Base.metadata.create_all(bind=engine)
    apply_sqlite_migrations(engine)

    products_dir = ROOT / 'frontend' / 'public' / 'products'
    image_files = [
        p for p in products_dir.iterdir()
        if p.is_file() and p.name != '.gitkeep' and ' ' not in p.name
    ]

    unique = {}
    for image in image_files:
        key = _normalize_name(image.name)
        if key not in unique:
            unique[key] = image

    images = sorted(unique.values(), key=lambda p: p.name)
    groups = [images[i:i + 2] for i in range(0, len(images), 2)]

    session = SessionLocal()
    created = 0
    updated = 0

    session.query(Product).filter(Product.slug.like('wolfz-tee-%')).delete(synchronize_session=False)
    session.commit()

    for idx, group in enumerate(groups, start=1):
        name = PRODUCT_NAMES[(idx - 1) % len(PRODUCT_NAMES)]
        price = PRICE_POINTS[(idx - 1) % len(PRICE_POINTS)]
        code = str(idx).zfill(2)
        slug = f'wolfz-tee-{code}'
        safe_files = []
        for image in group:
            safe = _safe_name(image.name)
            safe_path = products_dir / safe
            if safe_path != image and not safe_path.exists():
                safe_path.write_bytes(image.read_bytes())
            safe_files.append(safe_path.name)
        image_urls = [f'/products/{name}' for name in safe_files]
        image_url = image_urls[0] if image_urls else ''

        existing = session.query(Product).filter(Product.slug == slug).first()
        if existing:
            existing.name = name
            existing.image_url = image_url
            existing.image_urls = json.dumps(image_urls)
            existing.description = existing.description or 'Premium WOLFz t-shirt drop with front and back views.'
            existing.price = price
            existing.compare_at_price = COMPARE_AT
            if existing.stock is None or existing.stock <= 0:
                existing.stock = 20
            updated += 1
        else:
            session.add(Product(
                name=name,
                slug=slug,
                description='Premium WOLFz t-shirt drop with front and back views.',
                image_url=image_url,
                image_urls=json.dumps(image_urls),
                price=price,
                compare_at_price=COMPARE_AT,
                stock=20,
                category_id=None,
            ))
            created += 1

    session.commit()
    total = session.query(Product).count()

    print(f'Created: {created}')
    print(f'Updated: {updated}')
    print(f'Total products: {total}')

    session.close()


if __name__ == '__main__':
    sync_products()
