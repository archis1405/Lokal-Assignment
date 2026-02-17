import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { sendOtp, verifyOtp } from "../services/otpManager";

const OTP_EXPIRY_SECONDS = 60;

function useCountdown(active, resetSignal) {
    const [seconds, setSeconds] = useState(active ? OTP_EXPIRY_SECONDS : 0);
    const timerRef = useRef(null);
    const startRef = useRef(null);

    useEffect(() => {
        clearInterval(timerRef.current);

        if (!active) {
        const id = setTimeout(() => setSeconds(0), 0);
        return () => clearTimeout(id);
        }

        startRef.current = Date.now();

        const initId = setTimeout(() => setSeconds(OTP_EXPIRY_SECONDS), 0);

        timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startRef.current) / 1000);

        const remaining = Math.max(0, OTP_EXPIRY_SECONDS - elapsed);

        setSeconds(remaining);
            if (remaining <= 0){
                clearInterval(timerRef.current);
            } 
        }, 500);

        return () => {
            clearTimeout(initId);
            clearInterval(timerRef.current);
        };
    }, [active, resetSignal]);

  return seconds;
}

export default function OtpScreen() {
    const { email, verifySuccess, goBack } = useAuth();

    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [locked, setLocked] = useState(false);
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendToken, setResendToken] = useState(0); 

    const inputRefs = useRef([]);
    const countdown = useCountdown(!locked && !verified, resendToken);
    const expired = countdown <= 0 && !verified && !locked;
    const full = digits.every((d) => d !== "");

    const handleChange = useCallback((idx, val) => {
        if (!/^\d?$/.test(val)){
            return;
        }
            setDigits((prev) => {
            const next = [...prev];
            next[idx]  = val;
            return next;
        });

        setError("");
        if (val && idx < 5){
            inputRefs.current[idx + 1]?.focus();
        } 
    }, []);

    const handleKeyDown = useCallback((idx, e) => {
    
        if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      
            inputRefs.current[idx - 1]?.focus();
    
        }
  
    }, [digits]);

  
    const handlePaste = useCallback((e) => {
  
        e.preventDefault();
  
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
  
        if (pasted.length === 6) {
            setDigits(pasted.split(""));
            inputRefs.current[5]?.focus();
        }
  
    }, []);

  
    const handleVerify = useCallback(async () => {
    const code = digits.join("");
    if (code.length < 6 || loading) {
        return;
    }

    setLoading(true);
    setError("");

    try {
    
        const result = await verifyOtp(email, code);


      if (result.success) {
        
        setVerified(true);
        setTimeout(() => verifySuccess(email), 800);
        return;
      
    }

    
    setDigits(["", "", "", "", "", ""]);
    
    setTimeout(() => inputRefs.current[0]?.focus(), 0);


    
    if (result.reason === "max_attempts") setLocked(true);
    
    setError(result.message || "Verification failed.");
    
    } 
    catch {
    
        setError("Cannot reach the server. Please check your connection.");
    
    } 
    finally {
    
        setLoading(false);
    }
  
}, [digits, email, loading, verifySuccess]);

  const handleResend = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await sendOtp(email); // or ctxSendOtp(email) if using context
      if (result.success) {
        setDigits(["", "", "", "", "", ""]);
        setLocked(false);
        setResendToken((t) => t + 1);
        setTimeout(() => inputRefs.current[0]?.focus(), 0);
      } else {
        setError(result.message || "Failed to resend OTP.");
      }
    } catch {
      setError("Cannot reach the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [email]);

  return (
    <div className="screen">
      <div className="card">
        <div className="brand">
          <div className="brand-dot" />
          <span>LOKAL</span>
        </div>

        <h1 className="heading">Enter code</h1>
        <p className="subtext">
          A 6-digit code was sent to <strong>{email}</strong>.<br />
          Check your inbox (and spam folder).
        </p>

        <div className="otp-row" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              className={[
                "otp-cell",
                verified           ? "otp-cell--verified" : "",
                error && !verified ? "otp-cell--error"    : "",
              ].filter(Boolean).join(" ")}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              disabled={locked || expired || verified || loading}
            />
          ))}
        </div>

        {!expired && !locked && !verified && (
          <div className="countdown">
            <div className="countdown__bar">
              <div
                className="countdown__fill"
                style={{
                  width:      `${(countdown / OTP_EXPIRY_SECONDS) * 100}%`,
                  background: countdown < 15 ? "var(--danger)" : "var(--accent)",
                }}
              />
            </div>
            <span className="countdown__text">{countdown}s remaining</span>
          </div>
        )}

        {(expired || locked) && !verified && (
          <div className="alert alert--danger">
            {locked ? "Too many failed attempts." : "Code expired."}{" "}
            Click <strong>Resend OTP</strong> to get a new code.
          </div>
        )}

        {error && !locked && !expired && (
          <span className="field-error center">{error}</span>
        )}

        {verified && (
          <div className="alert alert--success">✓ Verified! Signing you in…</div>
        )}

        <button
          className={[
            "btn-primary",
            (!full || locked || expired || verified || loading) ? "disabled" : "",
            loading ? "loading" : "",
          ].filter(Boolean).join(" ")}
          onClick={handleVerify}
          disabled={!full || locked || expired || verified || loading}
        >
          {loading ? <span className="spinner" /> : "Verify"}
        </button>

        <div className="link-row">
          <button
            className={`btn-link${!expired && !locked ? " btn-link--dimmed" : ""}`}
            onClick={handleResend}
            disabled={loading}
          >
            Resend OTP
          </button>
          <button className="btn-link" onClick={goBack} disabled={loading}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}