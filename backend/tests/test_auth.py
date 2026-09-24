# ---------------------------------------------------------------------------
# Shared test helpers — imported by test_mentorship_requests.py
# ---------------------------------------------------------------------------

DEFAULT_PASSWORD = "testpassword123"


def signup(client, email: str, role: str = "mentee") -> dict:
    """Sign up a user with DEFAULT_PASSWORD and return the response JSON."""
    response = client.post("/auth/signup", json={
        "email": email,
        "password": DEFAULT_PASSWORD,
        "role": role,
    })
    return response.json()


def token_for(client, email: str) -> str:
    """Return a bearer token for an already-signed-up user."""
    response = client.post("/auth/signin", json={
        "email": email,
        "password": DEFAULT_PASSWORD,
    })
    return response.json()["access_token"]


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

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


def test_update_profile_to_mentor(client):
    signup(client, "user_to_mentor@example.com", role="mentee")
    token = token_for(client, "user_to_mentor@example.com")
    headers = {"Authorization": f"Bearer {token}"}

    response = client.patch("/profiles/me", json={
        "full_name": "New Mentor Name",
        "job_title": "Senior DevOps Engineer",
        "company": "Tech Corp",
        "role": "mentor"
    }, headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "mentor"
    assert data["verification_status"] == "pending_verification"
    assert data["profile"]["full_name"] == "New Mentor Name"
    assert data["profile"]["job_title"] == "Senior DevOps Engineer"