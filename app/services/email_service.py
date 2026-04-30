import os
import smtplib
from email.mime.text import MIMEText
from pathlib import Path

from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(dotenv_path=PROJECT_ROOT / ".env")


def send_email(
    subject: str,
    body: str,
    to_emails: list[str],
    cc_emails: list[str] | None = None,
):
    sender = os.getenv("GMAIL_SENDER")
    password = os.getenv("GMAIL_APP_PASSWORD")

    if not sender or not password:
        raise Exception("Missing email credentials")

    cc_emails = cc_emails or []
    recipients = to_emails + cc_emails

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = ", ".join(to_emails)

    if cc_emails:
        msg["Cc"] = ", ".join(cc_emails)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender, password)
        server.sendmail(sender, recipients, msg.as_string())
