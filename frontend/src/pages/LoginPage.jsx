import { useState,useMemo,useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { sendOtp } from "../services/otpManager";

export default function LoginPage() {
    const { sendOtp: goToOtp } = useAuth();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isValidEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),[email]);

    const handleSubmit = useCallback(async () => {
    if (!isValidEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await sendOtp(email.trim().toLowerCase());
      if (result.success) {
        goToOtp(email.trim().toLowerCase());
      } else {
        setError(result.message || "Failed to send OTP. Please try again.");
      }
    } catch {
      setError("Cannot reach the server. Is the backend running on port 4000?");
    } finally {
      setLoading(false);
    }
  }, [email, isValidEmail, goToOtp]);

  return (
    <div className="screen">
      <div className="card">

        <div className="brand">
          <div className="brand-dot" />
          <span>LOKAL</span>
        </div>

        <h1 className="heading">Sign in</h1>
        <p className="subtext">
          Enter your email — we'll send you a one-time code.
        </p>

        <div className="field-group">
          <label className="field-label">Email address</label>
          <input
            type="email"
            className="field-input"
            placeholder="you@example.com"
            value={email}
            autoFocus
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {error && <span className="field-error">{error}</span>}
        </div>

        <button
          className={`btn-primary${loading ? " loading" : ""}${!isValidEmail ? " disabled" : ""}`}
          onClick={handleSubmit}
          disabled={loading || !isValidEmail}
        >
          {loading ? <span className="spinner" /> : "Send OTP"}
        </button>

      </div>
    </div>
  );
}