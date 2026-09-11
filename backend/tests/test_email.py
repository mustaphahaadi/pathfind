from unittest.mock import patch

from backend.email import (
    notify_mentee_status_update,
    notify_mentor_new_request,
    notify_mentor_verification_status,
    send_email,
)


def test_send_email_console():
    """Verify that send_email executes cleanly in console mock mode."""
    success = send_email(
        to_email="[EMAIL_ADDRESS]",
        subject="Test Subject",
        body_text="Hello World",
    )
    assert success is True


@patch("backend.email.send_email")
def test_notify_mentor_new_request(mock_send):
    mock_send.return_value = True
    notify_mentor_new_request(
        mentor_email="mentor@example.com",
        mentee_name="Alice Smith",
        mentee_email="alice@example.com",
        subject_title="Python Career Guidance",
        request_type="one_on_one",
    )
    mock_send.assert_called_once()
    args, kwargs = mock_send.call_args
    assert kwargs["to_email"] == "mentor@example.com"
    assert "Alice Smith" in kwargs["body_text"]
    assert "Python Career Guidance" in kwargs["subject"]


@patch("backend.email.send_email")
def test_notify_mentee_status_update(mock_send):
    mock_send.return_value = True
    notify_mentee_status_update(
        mentee_email="mentee@example.com",
        mentor_name="Bob Johnson",
        new_status="accepted",
        response_message="Glad to help! Let's schedule a call.",
    )
    mock_send.assert_called_once()
    args, kwargs = mock_send.call_args
    assert kwargs["to_email"] == "mentee@example.com"
    assert "ACCEPTED" in kwargs["subject"]
    assert "Glad to help!" in kwargs["body_text"]


@patch("backend.email.send_email")
def test_notify_mentor_verification_status(mock_send):
    mock_send.return_value = True
    notify_mentor_verification_status(
        mentor_email="mentor@example.com",
        mentor_name="Dr. Sarah Jenkins",
        status="VERIFIED",
    )
    mock_send.assert_called_once()
    args, kwargs = mock_send.call_args
    assert kwargs["to_email"] == "mentor@example.com"
    assert "VERIFIED" in kwargs["subject"]
    assert "APPROVED" in kwargs["body_text"]
