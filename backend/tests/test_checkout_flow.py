from uuid import uuid4


def _register_and_login(client, password: str = 'InitialPass123!') -> tuple[dict, str]:
    suffix = uuid4().hex[:8]
    user_payload = {
        'email': f'checkout_{suffix}@example.com',
        'username': f'checkout_{suffix}',
        'password': password,
    }

    register_res = client.post('/api/v1/auth/register', json=user_payload)
    assert register_res.status_code == 201

    login_res = client.post(
        '/api/v1/auth/login',
        data={'username': user_payload['username'], 'password': password},
    )
    assert login_res.status_code == 200
    token = login_res.json()['access_token']
    return user_payload, token


def _create_product(client, *, price: float = 49.99, stock: int = 5) -> dict:
    suffix = uuid4().hex[:8]
    product_payload = {
        'name': f'Wolf Hoodie {suffix}',
        'slug': f'wolf-hoodie-{suffix}',
        'description': 'Premium hoodie',
        'image_url': '',
        'price': price,
        'stock': stock,
        'category_id': None,
    }
    create_res = client.post('/api/v1/products', json=product_payload)
    assert create_res.status_code == 201
    return create_res.json()


def test_checkout_and_payment_flow(client):
    _, token = _register_and_login(client)
    headers = {'Authorization': f'Bearer {token}'}
    product = _create_product(client, price=39.5, stock=6)

    add_res = client.post(
        '/api/v1/cart/items',
        json={'product_id': product['id'], 'quantity': 2},
        headers=headers,
    )
    assert add_res.status_code == 200
    assert add_res.json()['total'] == 79.0

    checkout_res = client.post('/api/v1/orders/checkout', json={'currency': 'USD'}, headers=headers)
    assert checkout_res.status_code == 201
    order = checkout_res.json()
    assert order['status'] == 'pending'
    assert order['total_amount'] == 79.0
    assert len(order['items']) == 1

    empty_cart_res = client.get('/api/v1/cart', headers=headers)
    assert empty_cart_res.status_code == 200
    assert empty_cart_res.json()['items'] == []

    intent_res = client.post('/api/v1/payments/intent', json={'order_id': order['id']}, headers=headers)
    assert intent_res.status_code == 200
    intent = intent_res.json()
    assert intent['status'] == 'pending'
    assert intent['order_id'] == order['id']

    confirm_res = client.post(
        '/api/v1/payments/confirm',
        json={'order_id': order['id'], 'payment_intent_id': intent['payment_intent_id']},
        headers=headers,
    )
    assert confirm_res.status_code == 200
    assert confirm_res.json()['status'] == 'succeeded'

    order_res = client.get(f"/api/v1/orders/{order['id']}", headers=headers)
    assert order_res.status_code == 200
    assert order_res.json()['status'] == 'paid'


def test_checkout_fails_when_stock_is_insufficient(client):
    _, token = _register_and_login(client)
    headers = {'Authorization': f'Bearer {token}'}
    product = _create_product(client, stock=1)

    add_res = client.post(
        '/api/v1/cart/items',
        json={'product_id': product['id'], 'quantity': 2},
        headers=headers,
    )
    assert add_res.status_code == 400
