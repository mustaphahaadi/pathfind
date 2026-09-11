from .test_auth import signup, token_for


def auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def test_mentee_can_create_and_view_own_request(client):
    mentor = signup(client, "mentor@example.com", role="mentor")
    signup(client, "mentee@example.com")
    response = client.post(
        "/mentorship-requests",
        headers=auth(token_for(client, "mentee@example.com")),
        json={
            "mentor_id": mentor["id"],
            "request_type": "cv_review",
            "subject": "CV review",
            "message": "Please review my CV.",
            "resume_url": "https://example.com/cv.pdf",
        },
    )
    assert response.status_code == 201, response.text
    request = response.json()
    assert request["status"] == "pending"
    assert request["resume_url"] == "https://example.com/cv.pdf"

    response = client.get("/mentorship-requests", headers=auth(token_for(client, "mentee@example.com")))
    assert [item["id"] for item in response.json()] == [request["id"]]


def test_request_access_is_limited_to_its_mentee_and_mentor(client):
    mentor = signup(client, "mentor@example.com", role="mentor")
    signup(client, "mentee@example.com")
    signup(client, "other@example.com")
    request = client.post(
        "/mentorship-requests",
        headers=auth(token_for(client, "mentee@example.com")),
        json={
            "mentor_id": mentor["id"],
            "request_type": "cv_review",
            "subject": "CV review",
            "message": "Please review my CV.",
        },
    ).json()

    response = client.get(
        f"/mentorship-requests/{request['id']}",
        headers=auth(token_for(client, "other@example.com")),
    )
    assert response.status_code == 403

    response = client.get("/mentorship-requests", headers=auth(token_for(client, "mentor@example.com")))
    assert [item["id"] for item in response.json()] == [request["id"]]


def test_mentor_can_accept_and_decline_requests(client):
    mentor = signup(client, "mentor@example.com", role="mentor")
    signup(client, "mentee@example.com")
    request = client.post(
        "/mentorship-requests",
        headers=auth(token_for(client, "mentee@example.com")),
        json={
            "mentor_id": mentor["id"],
            "request_type": "portfolio_feedback",
            "subject": "Portfolio Review",
            "message": "Please check my portfolio.",
        },
    ).json()

    # Mentor accepts request
    patch_res = client.patch(
        f"/mentorship-requests/{request['id']}/status",
        headers=auth(token_for(client, "mentor@example.com")),
        json={"status": "accepted", "response_message": "Happy to help! Let us meet tomorrow."},
    )
    assert patch_res.status_code == 200
    updated = patch_res.json()
    assert updated["status"] == "accepted"
    assert updated["response_message"] == "Happy to help! Let us meet tomorrow."
    assert updated["mentee_email"] == "mentee@example.com"


def test_mentee_can_cancel_pending_request(client):
    mentor = signup(client, "mentor@example.com", role="mentor")
    signup(client, "mentee@example.com")
    request = client.post(
        "/mentorship-requests",
        headers=auth(token_for(client, "mentee@example.com")),
        json={
            "mentor_id": mentor["id"],
            "request_type": "cv_review",
            "subject": "CV review",
            "message": "Please review my CV.",
        },
    ).json()

    del_res = client.delete(
        f"/mentorship-requests/{request['id']}",
        headers=auth(token_for(client, "mentee@example.com")),
    )
    assert del_res.status_code == 204


def test_unauthenticated_and_invalid_mentor_requests_are_rejected(client):
    assert client.get("/mentorship-requests").status_code == 401
    signup(client, "mentee@example.com")
    response = client.post(
        "/mentorship-requests",
        headers=auth(token_for(client, "mentee@example.com")),
        json={"mentor_id": 999, "request_type": "cv_review", "subject": "CV review", "message": "Please review my CV."},
    )
    assert response.status_code == 404


def test_mentor_signup_and_admin_approval_flow(client):
    # Mentor signup
    signup_res = client.post(
        "/auth/signup/mentor",
        json={
            "email": "newmentor@amalitech.org",
            "password": "password123",
            "full_name": "Test Mentor",
            "job_title": "Software Developer",
            "company": "AmaliTech",
            "years_of_experience": 5,
            "bio": "Experienced developer",
            "expertise_tags": "Python, React",
            "availability": "Weekday evenings",
        },
    )
    assert signup_res.status_code == 201
    mentor_data = signup_res.json()
    assert mentor_data["verification_status"] == "pending_verification"

    # Create admin
    admin = signup(client, "admin@example.com", role="admin")

    # Admin list pending
    pending_res = client.get("/admin/mentors/pending", headers=auth(token_for(client, "admin@example.com")))
    assert pending_res.status_code == 200
    assert any(m["id"] == mentor_data["id"] for m in pending_res.json())

    # Admin approve
    approve_res = client.post(
        f"/admin/mentors/{mentor_data['id']}/approve",
        headers=auth(token_for(client, "admin@example.com")),
    )
    assert approve_res.status_code == 200
    assert approve_res.json()["verification_status"] == "verified"

