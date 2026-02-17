import { useState, useMemo, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useSessionTimer } from "../hooks/useSessionTimer";
import { logLogout } from "../services/analytics";

export default function SessionScreen() {
  
    const { email, logout } = useAuth();

  
    const [startTime] = useState(() => Date.now());

  
    const { elapsed, formatted } = useSessionTimer(startTime);

  
    const startTimeDisplay = useMemo(() => new Date(startTime).toLocaleTimeString(), [startTime]);

  
    const ring = useMemo(() => {
    const r    = 44;
    const circ = 2 * Math.PI * r;
    const pct  = (elapsed % 60) / 60;
    
    return { 
        circ, dashoffset: circ * (1 - pct) 
    };
  
}, [elapsed]);

  
const handleLogout = useCallback(() => {
    
    logLogout(email, elapsed);
    logout();
  
}, [email, elapsed, logout]);

  
return (
    <div className="screen session-screen">
      <div className="card card--wide">
        <div className="brand">
          <div className="brand-dot brand-dot--active" />
          <span>LOKAL</span>
          <span className="live-badge">LIVE</span>
        </div>

        <div className="user-card">
          <div className="user-avatar">{email[0].toUpperCase()}</div>
          <div className="user-email">{email}</div>
          <div className="user-meta">Session started at {startTimeDisplay}</div>
        </div>

        <div className="timer">
          <svg
            className="timer__ring"
            width={120}
            height={120}
            viewBox="0 0 100 100"
            aria-label={`Session duration: ${formatted}`}>

            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke="var(--ring-bg)"
              strokeWidth="5"
            />

            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={ring.circ}
              strokeDashoffset={ring.dashoffset}
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dashoffset 0.9s linear" }}
            />
          </svg>

          <div className="timer__label">
            <span className="timer__value">{formatted}</span>
            <span className="timer__sub">duration</span>
          </div>
        </div>

        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
}
