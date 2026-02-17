import { useState } from "react";

function LoginPage({ onNext }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSendOtp(){
        if(!email){
            setError("Please provide a Valid Email!!");
            return;
        }

        try{
            setLoading(true);
            setError(null);

            const response = await fetch("YOUR_BACKEND_URL", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({ email }),});


            if(!response.ok){
                throw new Error("Failed to send OTP");
            }

            onNext(email);
        }
        catch(err){
            setError(err.message)
        }
        finally{
            setLoading(false);
        }

    }

    return (
        <div>
            <h1>Login</h1>

            <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={handleSendOtp} disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
            </button>

            {error && <p>{error}</p>}
        </div>);

}



export default LoginPage;
