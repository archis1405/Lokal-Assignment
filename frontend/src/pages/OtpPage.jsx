import { useState,useEffect } from "react";

const OTP_LENGTH = 6;
const OTP_EXPIRY = 60;


function OtpPage({ onNext }) {

    const [expired, setExpired] = useState(false);
    const [seconds, setSeconds] = useState(OTP_EXPIRY);
    

    useEffect(() => {
        if(expired) return;

        const timer = setInterval(() => {
            setSeconds((prev) => {
                if(prev<=1){
                    clearInterval(timer);
                    setExpired(true);
                    return 0;
                }

                return prev-1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [expired]);

    


    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Enter OTP</h1>
            <p>{expired ? "Code expired" : `Time remaining: ${seconds}s`}</p>
            <button onClick={onNext} disabled={expired}>
                Verify OTP
            </button>
        </div>
    );
}

export default OtpPage;