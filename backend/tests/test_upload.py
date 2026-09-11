import io
from fastapi import status
from .test_auth import signup, token_for


def auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def test_unauthenticated_file_upload(client):
    """File upload without authentication token must be rejected with 401."""
    files = {"file": ("test_resume.pdf", b"%PDF-1.4 test resume content", "application/pdf")}
    response = client.post("/upload", files=files)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_valid_pdf_file_upload(client):
    """Uploading a valid PDF file with authentication returns 201 Created."""
    signup(client, "mentee_upload@example.com")
    token = token_for(client, "mentee_upload@example.com")
    files = {"file": ("sample_resume.pdf", b"%PDF-1.4 Mock resume content for testing", "application/pdf")}
    response = client.post("/upload", files=files, headers=auth(token))
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["filename"] == "sample_resume.pdf"
    assert data["url"].startswith("/static/uploads/")
    assert data["size_bytes"] > 0


def test_valid_image_file_upload(client):
    """Uploading a valid PNG profile avatar returns 201 Created."""
    signup(client, "mentor_upload@example.com", role="mentor")
    token = token_for(client, "mentor_upload@example.com")
    files = {"file": ("avatar.png", b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR", "image/png")}
    response = client.post("/upload", files=files, headers=auth(token))
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["filename"] == "avatar.png"
    assert data["url"].startswith("/static/uploads/")


def test_invalid_extension_upload(client):
    """Uploading files with unsupported extensions (e.g. .exe) returns 400 Bad Request."""
    signup(client, "mentee_upload2@example.com")
    token = token_for(client, "mentee_upload2@example.com")
    files = {"file": ("script.sh", b"#!/bin/bash\necho hello", "text/x-shellscript")}
    response = client.post("/upload", files=files, headers=auth(token))
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "File extension '.sh' is not supported" in response.json()["detail"]


def test_oversized_file_upload(client):
    """Uploading files larger than 5 MB returns 400 Bad Request."""
    signup(client, "mentee_upload3@example.com")
    token = token_for(client, "mentee_upload3@example.com")
    large_content = b"0" * (5 * 1024 * 1024 + 100)  # slightly larger than 5 MB
    files = {"file": ("huge_file.pdf", io.BytesIO(large_content), "application/pdf")}
    response = client.post("/upload", files=files, headers=auth(token))
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "exceeds maximum limit" in response.json()["detail"]
