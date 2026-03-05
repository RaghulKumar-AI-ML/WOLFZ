from sqlalchemy import text

from app.core.database import IS_SQLITE


def _column_exists(conn, table: str, column: str) -> bool:
    rows = conn.execute(text(f'PRAGMA table_info({table})')).fetchall()
    return any(row[1] == column for row in rows)


def apply_sqlite_migrations(engine) -> None:  # noqa: ANN001
    if not IS_SQLITE:
        return

    with engine.connect() as conn:
        if _column_exists(conn, 'products', 'compare_at_price') is False:
            conn.execute(text("ALTER TABLE products ADD COLUMN compare_at_price REAL DEFAULT 0"))
        if _column_exists(conn, 'products', 'image_urls') is False:
            conn.execute(text("ALTER TABLE products ADD COLUMN image_urls TEXT DEFAULT '[]'"))

        if _column_exists(conn, 'orders', 'shipping_name') is False:
            conn.execute(text("ALTER TABLE orders ADD COLUMN shipping_name TEXT DEFAULT ''"))
        if _column_exists(conn, 'orders', 'shipping_phone') is False:
            conn.execute(text("ALTER TABLE orders ADD COLUMN shipping_phone TEXT DEFAULT ''"))
        if _column_exists(conn, 'orders', 'shipping_address1') is False:
            conn.execute(text("ALTER TABLE orders ADD COLUMN shipping_address1 TEXT DEFAULT ''"))
        if _column_exists(conn, 'orders', 'shipping_address2') is False:
            conn.execute(text("ALTER TABLE orders ADD COLUMN shipping_address2 TEXT DEFAULT ''"))
        if _column_exists(conn, 'orders', 'shipping_city') is False:
            conn.execute(text("ALTER TABLE orders ADD COLUMN shipping_city TEXT DEFAULT ''"))
        if _column_exists(conn, 'orders', 'shipping_state') is False:
            conn.execute(text("ALTER TABLE orders ADD COLUMN shipping_state TEXT DEFAULT ''"))
        if _column_exists(conn, 'orders', 'shipping_postal_code') is False:
            conn.execute(text("ALTER TABLE orders ADD COLUMN shipping_postal_code TEXT DEFAULT ''"))
        if _column_exists(conn, 'orders', 'shipping_country') is False:
            conn.execute(text("ALTER TABLE orders ADD COLUMN shipping_country TEXT DEFAULT ''"))
        if _column_exists(conn, 'orders', 'delivery_status') is False:
            conn.execute(text("ALTER TABLE orders ADD COLUMN delivery_status TEXT DEFAULT 'processing'"))

        conn.commit()
