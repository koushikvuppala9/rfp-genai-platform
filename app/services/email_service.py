import os
import smtplib
from email.mime.text import MIMEText

from dotenv import load_dotenv

load_dotenv()


def send_email(subject: str, body: str, to_emails: list[str]):
    sender = os.getenv("GMAIL_SENDER")
    password = os.getenv("GMAIL_APP_PASSWORD")

    if not sender or not password:
        raise Exception("Missing email credentials")

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = ", ".join(to_emails)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender, password)
        server.sendmail(sender, to_emails, msg.as_string())
