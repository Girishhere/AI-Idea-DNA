import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")

def send_email(to_email: str, subject: str, body: str):
    if not SMTP_USER or not SMTP_PASS:
        print(f"Mock Email to {to_email} | Subject: {subject} | Body: {body}")
        return

    try:
        msg = MIMEMultipart()
        msg["From"] = SMTP_USER
        msg["To"] = to_email
        msg["Subject"] = subject

        msg.attach(MIMEText(body, "html"))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)
        server.quit()
        print(f"Email sent successfully to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")

def send_otp_email(to_email: str, otp: str):
    subject = "Verify your AI Idea DNA Account"
    body = f"""
    <h2>Welcome to AI Idea DNA!</h2>
    <p>Your verification code is: <strong>{otp}</strong></p>
    <p>Please enter this code on the signup page to verify your account.</p>
    """
    send_email(to_email, subject, body)

def send_reset_password_email(to_email: str, reset_link: str):
    subject = "Reset your AI Idea DNA Password"
    body = f"""
    <h2>Password Reset Request</h2>
    <p>You have requested to reset your password. Click the link below to set a new password:</p>
    <a href="{reset_link}">{reset_link}</a>
    <p>If you did not request this, please ignore this email.</p>
    """
    send_email(to_email, subject, body)
