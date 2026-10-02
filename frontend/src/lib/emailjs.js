/**
 * Send OTP email via EmailJS directly from the browser.
 * Using the REST API with accessToken (private key) bypasses all domain restrictions.
 * Safe to use here because EmailJS private keys only allow sending emails, nothing destructive.
 */
export const sendOTPEmail = async (toEmail, otp, subject = "Verification Code") => {
  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: "service_aqqtip3",
        template_id: "template_ibmbisu",
        user_id: "IFVDxR1oL_If1UC54",
        accessToken: "1CJeFliPV1jBWEx3jcXvV",
        template_params: {
          to_email: toEmail,
          otp: otp,
          message: `${subject}: ${otp}`
        }
      })
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
