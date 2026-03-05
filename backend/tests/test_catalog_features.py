from uuid import uuid4


def _register_and_login(client, password: str = 'InitialPass123!') -> tuple[dict, str]:
    suffix = uuid4().hex[:8]
    user_payload = {
        'email': f'catalog_{suffix}@example.com',
        'username': f'catalog_{suffix}',
        'password': password,
    }
    register_res = client.post('/api/v1/auth/register', json=user_payload)
    assert register_res.status_code == 201
    login_res = client.post(
        '/api/v1/auth/login',
        data={'username': user_payload['username'], 'password': password},
    )
    assert login_res.status_code == 200
    return user_payload, login_res.json()['access_token']


def _create_product(client) -> dict:
    suffix = uuid4().hex[:8]
    payload = {
        'name': f'Wolf Tee {suffix}',
        'slug': f'wolf-tee-{suffix}',
        'description': 'Cotton tee',
        'image_url': '',
        'price': 24.99,
        'stock': 10,
        'category_id': None,
    }
    res = client.post('/api/v1/products', json=payload)
    assert res.status_code == 201
    return res.json()


def test_categories_reviews_and_wishlist_flow(client):
    _, token = _register_and_login(client)
    headers = {'Authorization': f'Bearer {token}'}

    category_payload = {'name': f'Hoodies-{uuid4().hex[:6]}', 'slug': f'hoodies-{uuid4().hex[:6]}', 'description': 'Warm'}
    category_res = client.post('/api/v1/categories', json=category_payload)
    assert category_res.status_code == 201

    list_categories_res = client.get('/api/v1/categories')
    assert list_categories_res.status_code == 200
    assert len(list_categories_res.json()) >= 1

    product = _create_product(client)

    add_wishlist_res = client.post('/api/v1/wishlist', json={'product_id': product['id']}, headers=headers)
    assert add_wishlist_res.status_code == 200
    assert add_wishlist_res.json()['items'][0]['product_id'] == product['id']

    review_res = client.post(
        '/api/v1/reviews',
        json={'product_id': product['id'], 'rating': 5, 'title': 'Great', 'comment': 'Loved it'},
        headers=headers,
    )
    assert review_res.status_code == 201

    product_reviews_res = client.get(f"/api/v1/reviews/product/{product['id']}")
    assert product_reviews_res.status_code == 200
    assert len(product_reviews_res.json()) == 1
