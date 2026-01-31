def test_upload_requires_auth(client):
    res = client.post("/upload/")
    assert res.status_code == 401
