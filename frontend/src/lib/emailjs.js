/**
 * Send OTP email via EmailJS directly from the browser.
 * Credentials come from Vercel environment variables (NEXT_PUBLIC_ prefix = available in browser).
 */
export const sendOTPEmail = async (toEmail, otp, subject = "Verification Code") => {
  const serviceId  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.NEXT_PUBLIC_EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn("[EmailJS] Missing env vars — check Vercel settings");
    return;
  }

  try {
    const body = {
      service_id:      serviceId,
      template_id:     templateId,
      user_id:         publicKey,
      template_params: {
        to_email: toEmail,
        otp:      otp,
        message:  `${subject}: ${otp}`
      }
    };

    // Include private key only if set (bypasses domain restriction without whitelisting)
    if (privateKey) body.accessToken = privateKey;

    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body)
    });

    if (res.status === 200) {
      console.log("[EmailJS] ✅ Email sent to", toEmail);
    } else {
      const text = await res.text();
      console.warn("[EmailJS] ⚠️ Failed:", res.status, text);
    }
  } catch (e) {
    console.warn("[EmailJS] ❌ Network error:", e);
  }
};
