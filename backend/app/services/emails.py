import urllib.request
import json
import os

EMAILJS_SERVICE_ID = "service_aqqtip3"
EMAILJS_USER_ID = "IFVDxR1oL_If1UC54"
EMAILJS_ACCESS_TOKEN = "1CJeFliPV1jBWEx3jcXvV"
EMAILJS_OTP_TEMPLATE = "template_ibmbisu"
EMAILJS_WELCOME_TEMPLATE = "template_vhdmteo"

def send_emailjs(template_id: str, template_params: dict):
    url = "https://api.emailjs.com/api/v1.0/email/send"
    payload = {
        "service_id": EMAILJS_SERVICE_ID,
        "template_id": template_id,
        "user_id": EMAILJS_USER_ID,
        "accessToken": EMAILJS_ACCESS_TOKEN,
        "template_params": template_params
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                print(f"EmailJS sent successfully: {template_id}")
            else:
                print(f"EmailJS failed: {response.read()}")
    except Exception as e:
        print(f"Failed to send email via EmailJS: {e}")

def send_otp_email(to_email: str, otp: str):
    # Pass various param names that the user might have configured in their template
    params = {
        "to_email": to_email,
        "otp": otp,
        "message": f"Your verification code is: {otp}"
    }
    send_emailjs(EMAILJS_OTP_TEMPLATE, params)

def send_reset_password_email(to_email: str, reset_link: str):
    params = {
        "to_email": to_email,
        "reset_link": reset_link,
        "message": f"Click the link to reset your password: {reset_link}"
    }
    # Using welcome template as fallback for reset link if no dedicated reset template was provided
    send_emailjs(EMAILJS_WELCOME_TEMPLATE, params)

