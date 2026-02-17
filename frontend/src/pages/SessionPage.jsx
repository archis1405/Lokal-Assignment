import { useState , useEffect } from "react";

function SessionPage({email,onLogout}) {

    const [elapsed, setElapsed] = useState(0);
    const startTime = new Date();

    useEffect(() => {
        const timer = setInterval(() => setElapsed((prev) => prev + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };


    return (
        <div style={{ textAlign: "center", marginTop: "80px" }}>
            <h1>Welcome, {email}</h1>

            <p>Session started at {startTime.toLocaleTimeString()}</p>
            
            <p>Elapsed time: {formatTime(elapsed)}</p>
            
            <button onClick={onLogout}>Logout</button>
        </div>
    );
}

export default SessionPage;