import logging
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

logger = logging.getLogger("pathfind.email")

EMAIL_SERVICE = os.getenv("EMAIL_SERVICE", "console")  # "console", "smtp", "ses"
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "noreply@pathfind.org")


def send_email(to_email: str, subject: str, body_text: str, body_html: str | None = None) -> bool:
    """Send an email via the configured service provider ('ses', 'smtp', or 'console')."""
    if EMAIL_SERVICE == "ses":
        try:
            import boto3

            client = boto3.client("ses", region_name=os.getenv("AWS_REGION", "us-east-1"))
            body_dict = {"Text": {"Data": body_text, "Charset": "UTF-8"}}
            if body_html:
                body_dict["Html"] = {"Data": body_html, "Charset": "UTF-8"}

            client.send_email(
                Source=SENDER_EMAIL,
                Destination={"ToAddresses": [to_email]},
                Message={
                    "Subject": {"Data": subject, "Charset": "UTF-8"},
                    "Body": body_dict,
                },
            )
            logger.info("Email sent via AWS SES to %s", to_email)
            return True
        except Exception as e:
            logger.error("Failed to send email via AWS SES to %s: %s", to_email, e)
            return False

    elif EMAIL_SERVICE == "smtp":
        try:
            smtp_server = os.getenv("SMTP_SERVER", "localhost")
            smtp_port = int(os.getenv("SMTP_PORT", "587"))
            smtp_user = os.getenv("SMTP_USERNAME", "")
            smtp_password = os.getenv("SMTP_PASSWORD", "")

            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = SENDER_EMAIL
            msg["To"] = to_email

            msg.attach(MIMEText(body_text, "plain"))
            if body_html:
                msg.attach(MIMEText(body_html, "html"))

            with smtplib.SMTP(smtp_server, smtp_port) as server:
                if smtp_user and smtp_password:
                    server.starttls()
                    server.login(smtp_user, smtp_password)
                server.sendmail(SENDER_EMAIL, [to_email], msg.as_string())
            logger.info("Email sent via SMTP to %s", to_email)
            return True
        except Exception as e:
            logger.error("Failed to send email via SMTP to %s: %s", to_email, e)
            return False

    else:
        # Fallback to console / log output
        print(
            f"\n--- EMAIL SENT (CONSOLE MOCK) ---\n"
            f"To: {to_email}\nSubject: {subject}\nBody:\n{body_text}\n"
            f"---------------------------------\n"
        )
        logger.info("Logged mock email to console for %s", to_email)
        return True


def notify_mentor_new_request(
    mentor_email: str,
    mentee_name: str,
    mentee_email: str,
    subject_title: str,
    request_type: str,
):
    """Notify a mentor that a mentee has submitted a mentorship request."""
    subject = f"[Pathfind] New Mentorship Request: {subject_title}"
    req_type_str = request_type.upper()
    body = (
        f"Hello,\n\n"
        f"You have received a new {req_type_str} mentorship request on Pathfind from "
        f"{mentee_name} ({mentee_email}).\n\n"
        f"Subject: {subject_title}\n\n"
        f"Please log in to your Pathfind dashboard to review the request and accept or decline.\n\n"
        f"Best regards,\nThe Pathfind Team"
    )
    send_email(to_email=mentor_email, subject=subject, body_text=body)


def notify_mentee_status_update(
    mentee_email: str,
    mentor_name: str,
    new_status: str,
    response_message: str | None = None,
):
    """Notify a mentee that their mentorship request status has been updated."""
    subject = f"[Pathfind] Mentorship Request Update: {new_status.upper()}"
    msg_part = f"\nMentor Note: {response_message}\n" if response_message else ""
    body = (
        f"Hello,\n\n"
        f"Your mentorship request to {mentor_name} has been updated to: {new_status.upper()}.\n"
        f"{msg_part}\n"
        f"Log in to your Pathfind dashboard for more details.\n\n"
        f"Best regards,\nThe Pathfind Team"
    )
    send_email(to_email=mentee_email, subject=subject, body_text=body)


def notify_mentor_verification_status(
    mentor_email: str,
    mentor_name: str,
    status: str,
):
    """Notify a mentor of their application verification status (Approved / Rejected)."""
    subject = f"[Pathfind] Mentor Application Status: {status.upper()}"
    if status.upper() == "VERIFIED":
        body = (
            f"Hello {mentor_name},\n\n"
            f"Congratulations! Your mentor profile on Pathfind has been VERIFIED and APPROVED by our admin team.\n"
            f"Your profile is now visible in the mentor directory for mentees to discover.\n\n"
            f"Best regards,\nThe Pathfind Team"
        )
    else:
        body = (
            f"Hello {mentor_name},\n\n"
            f"Thank you for applying to be a mentor on Pathfind.\n"
            f"Unfortunately, your profile application was REJECTED at this time.\n"
            f"Feel free to reach out to support for feedback.\n\n"
            f"Best regards,\nThe Pathfind Team"
        )
    send_email(to_email=mentor_email, subject=subject, body_text=body)
