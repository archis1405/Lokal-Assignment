import { logOtpGenerated, logOtpSuccess, logOtpFailure } from "./analytics";

const BASE = "/api";

export async function sendOtp(email) {
  const res  = await fetch(`${BASE}/send-otp`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email }),
  });
  const data = await res.json();

  if (data.success) logOtpGenerated(email);

  return data;
}

export async function verifyOtp(email, otp) {
  const res  = await fetch(`${BASE}/verify-otp`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email, otp }),
  });
  const data = await res.json();

  if (data.success) {
    logOtpSuccess(email);
  } else {
    logOtpFailure(email, data.reason, data.remaining);
  }

  return data;
}
