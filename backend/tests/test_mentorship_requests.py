# pyrefly: ignore [missing-import]
import pytest

from .test_auth import signup, token_for

pytestmark = pytest.mark.skip(
    reason="Requires auth middleware on mentorship endpoints (not yet implemented)"
)




def auth(token):
    return {"Authorization": f"Bearer {token}"}


def test_mentee_can_create_and_view_own_request(client):
    mentor = signup(client, "mentor@example.com", role="mentor")
    signup(client, "mentee@example.com")
    response = client.post("/mentorship-requests", headers=auth(token_for(client, "mentee@example.com")), json={"mentor_id": mentor["id"], "request_type": "cv_review", "subject": "CV review", "message": "Please review my CV."})
    assert response.status_code == 201, response.text
    request = response.json()
    assert request["status"] == "pending"
    response = client.get("/mentorship-requests", headers=auth(token_for(client, "mentee@example.com")))
    assert [item["id"] for item in response.json()] == [request["id"]]


def test_request_access_is_limited_to_its_mentee_and_mentor(client):
    mentor = signup(client, "mentor@example.com", role="mentor")
    signup(client, "mentee@example.com")
    signup(client, "other@example.com")
    request = client.post("/mentorship-requests", headers=auth(token_for(client, "mentee@example.com")), json={"mentor_id": mentor["id"], "request_type": "cv_review", "subject": "CV review", "message": "Please review my CV."}).json()
    response = client.get(f"/mentorship-requests/{request['id']}", headers=auth(token_for(client, "other@example.com")))
    assert response.status_code == 403
    response = client.get("/mentorship-requests", headers=auth(token_for(client, "mentor@example.com")))
    assert [item["id"] for item in response.json()] == [request["id"]]


def test_unauthenticated_and_invalid_mentor_requests_are_rejected(client):
    assert client.get("/mentorship-requests").status_code == 401
    signup(client, "mentee@example.com")
    response = client.post("/mentorship-requests", headers=auth(token_for(client, "mentee@example.com")), json={"mentor_id": 999, "request_type": "cv_review", "subject": "CV review", "message": "Please review my CV."})
    assert response.status_code == 404
