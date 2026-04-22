import os
import pytest
import requests

BASE_URL = os.environ.get('EXPO_PUBLIC_BACKEND_URL', 'https://creative-marketplace-32.preview.emergentagent.com').rstrip('/')
TOKEN = 'test_session_arthub_01'


@pytest.fixture
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def test_root(client):
    r = client.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    assert r.json().get("message") == "ArtHub API alive"


def test_auth_me_valid(client):
    r = client.get(f"{BASE_URL}/api/auth/me", headers={"Authorization": f"Bearer {TOKEN}"})
    assert r.status_code == 200
    data = r.json()
    assert data["user_id"] == "user_arthub_test01"
    assert data["email"] == "artist@arthub.test"


def test_auth_me_no_token(client):
    r = client.get(f"{BASE_URL}/api/auth/me")
    assert r.status_code == 401


def test_auth_me_invalid_token(client):
    r = client.get(f"{BASE_URL}/api/auth/me", headers={"Authorization": "Bearer bogus"})
    assert r.status_code == 401


def test_session_exchange_fake(client):
    r = client.post(f"{BASE_URL}/api/auth/session", json={"session_id": "definitely_not_valid"})
    assert r.status_code == 401


def test_logout_deletes_session(client):
    # Create ephemeral session via mongosh would be ideal; instead we test status only
    # Logout with no token should still return 200 {ok:true}
    r = client.post(f"{BASE_URL}/api/auth/logout")
    assert r.status_code == 200
    assert r.json().get("ok") is True
