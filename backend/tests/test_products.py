def test_list_products(client):
    response = client.get('/api/v1/products')
    assert response.status_code == 200
