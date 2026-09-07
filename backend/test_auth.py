def signup(client, email, password="defaultpassword", role="mentee"):
    response = client.post(
        "/auth/signup",
        json={"email": email, "password": password, "role": role},
    )
    assert response.status_code == 201, response.text
    return response.json()


def token_for(client, email, password="defaultpassword"):
    response = client.post(
        "/auth/signin",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200, response.text
    return response.json()["access_token"]
def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_signup_success(client):
    response = client.post("/auth/signup", json={
        "email": "test@example.com",
        "password": "securepassword123",
        "role": "mentee"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["role"] == "mentee"
    assert "id" in data
    assert "password" not in data  # make sure we never return the password


def test_signup_duplicate_email(client):
    client.post("/auth/signup", json={
        "email": "duplicate@example.com",
        "password": "password123"
    })
    response = client.post("/auth/signup", json={
        "email": "duplicate@example.com",
        "password": "differentpassword"
    })
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]


def test_signin_success(client):
    client.post("/auth/signup", json={
        "email": "signin@example.com",
        "password": "mypassword123"
    })
    response = client.post("/auth/signin", json={
        "email": "signin@example.com",
        "password": "mypassword123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_signin_wrong_password(client):
    client.post("/auth/signup", json={
        "email": "wrongpass@example.com",
        "password": "correctpassword"
    })
    response = client.post("/auth/signin", json={
        "email": "wrongpass@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401


def test_signin_nonexistent_user(client):
    response = client.post("/auth/signin", json={
        "email": "doesnotexist@example.com",
        "password": "whatever"
    })
    assert response.status_code == 401