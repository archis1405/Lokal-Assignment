
const STORAGE_KEY = "auth_analytics";
const MAX_ENTRIES = 50;

export const Events = {
  OTP_GENERATED: "otp_generated",
  OTP_VALIDATION_SUCCESS: "otp_validation_success",
  OTP_VALIDATION_FAILURE: "otp_validation_failure",
  LOGOUT: "logout",
};

export function logEvent(event, data = {}) {
  const entry = { event, data, timestamp: new Date().toISOString() };

  console.log(`[Analytics] ${event}`, data);

  try {
    const log = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    log.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log.slice(-MAX_ENTRIES)));
  } catch (e) {
    console.warn("[Analytics] Could not persist event:", e);
  }
}


export const logOtpGenerated = (email) => logEvent(Events.OTP_GENERATED, { email });

export const logOtpSuccess = (email) => logEvent(Events.OTP_VALIDATION_SUCCESS, { email });

export const logOtpFailure = (email, reason, remaining) => logEvent(Events.OTP_VALIDATION_FAILURE, { email, reason, remaining });

export const logLogout = (email, sessionSeconds) => logEvent(Events.LOGOUT, { email, sessionSeconds });
