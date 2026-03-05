def test_list_orders_requires_auth(client):
    response = client.get('/api/v1/orders')
    assert response.status_code == 401
