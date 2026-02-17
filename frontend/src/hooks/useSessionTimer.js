import { useState, useEffect, useMemo } from "react";

export function useSessionTimer(startTime) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!startTime) return;

        const interval = setInterval(() => {
            const seconds = Math.floor((Date.now() - startTime) / 1000);
            setElapsed(seconds);
        }, 1000);

        return () => clearInterval(interval); 
    }, [startTime]);

    const formatted = useMemo(() => {

        const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
        const ss = String(elapsed % 60).padStart(2, "0");
    
        return `${mm}:${ss}`;
    }, [elapsed]);

    return { elapsed, formatted };
}
