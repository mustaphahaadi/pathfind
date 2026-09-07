from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def test_create_mentorship_request():
    payload = {
        "mentee_id": "user-123",
        "mentor_id": "mentor-456",
        "request_type": "cv_review",
        "subject": "Resume review before internship applications",
        "message": "I would appreciate feedback on my CV and interview readiness.",
    }

    response = client.post("/mentorship-requests", json=payload)

    assert response.status_code == 201, response.text
    body = response.json()
    assert body["mentee_id"] == "user-123"
    assert body["mentor_id"] == "mentor-456"
    assert body["request_type"] == "cv_review"
    assert body["status"] == "pending"
    assert "id" in body
    assert body["subject"] == payload["subject"]


def test_get_mentorship_requests_and_valid_types():
    list_response = client.get("/mentorship-requests")
    assert list_response.status_code == 200, list_response.text
    items = list_response.json()
    assert isinstance(items, list)
    assert len(items) >= 1

    types_response = client.get("/mentorship-request-types")
    assert types_response.status_code == 200, types_response.text
    types = types_response.json()
    assert "cv_review" in types
    assert "portfolio_feedback" in types


def test_reject_invalid_request_type():
    response = client.post(
        "/mentorship-requests",
        json={
            "mentee_id": "user-456",
            "mentor_id": "mentor-789",
            "request_type": "not_a_valid_type",
            "subject": "Invalid request",
            "message": "This should fail validation.",
        },
    )

    assert response.status_code == 422, response.text
