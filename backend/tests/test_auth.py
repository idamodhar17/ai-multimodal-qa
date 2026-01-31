def test_register_validation(client):
    res = client.post("/auth/register", json={})
    assert res.status_code == 422


def test_login_validation(client):
    res = client.post("/auth/login", json={})
    assert res.status_code == 422
