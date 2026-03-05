from uuid import uuid4


def _register_and_login(client, *, password: str = 'InitialPass123!') -> tuple[dict, str]:
    suffix = uuid4().hex[:8]
    user_payload = {
        'email': f'user_{suffix}@example.com',
        'username': f'user_{suffix}',
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


def test_me_update_and_password_change_flow(client):
    user_payload, token = _register_and_login(client)
    headers = {'Authorization': f'Bearer {token}'}

    me_res = client.get('/api/v1/users/me', headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()['email'] == user_payload['email']

    updated_username = f"{user_payload['username']}_new"
    update_res = client.patch('/api/v1/users/me', json={'username': updated_username}, headers=headers)
    assert update_res.status_code == 200
    assert update_res.json()['username'] == updated_username

    wrong_password_res = client.patch(
        '/api/v1/users/me/password',
        json={'current_password': 'wrong-password', 'new_password': 'NewPass123!'},
        headers=headers,
    )
    assert wrong_password_res.status_code == 400

    password_change_res = client.patch(
        '/api/v1/users/me/password',
        json={'current_password': 'InitialPass123!', 'new_password': 'NewPass123!'},
        headers=headers,
    )
    assert password_change_res.status_code == 204

    relogin_res = client.post(
        '/api/v1/auth/login',
        data={'username': updated_username, 'password': 'NewPass123!'},
    )
    assert relogin_res.status_code == 200


def test_non_admin_cannot_list_users(client):
    _, token = _register_and_login(client)
    res = client.get('/api/v1/users', headers={'Authorization': f'Bearer {token}'})
    assert res.status_code == 403
