import "dotenv/config";
import express from "express";
import cors    from "cors";
import { createOtp, verifyOtp, deleteOtp, MAX_ATTEMPTS } from "./otpStore.js";
import { sendOtpEmail, verifyMailerConnection }           from "./mailer.js";

const app  = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({
  
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
}));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (v) => typeof v === "string" && EMAIL_RE.test(v.trim());

app.post("/api/send-otp", async (req, res) => {
    const { email } = req.body;

  
    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email address." });
    }

    const normalised = email.trim().toLowerCase();
  
    try {
    
        deleteOtp(normalised);              
        const code = createOtp(normalised); 
        await sendOtpEmail(normalised, code); 

        console.log(`[send-otp] OTP dispatched → ${normalised}`);
    
        return res.json({
      
            success:   true,      
            message:   "OTP sent. Please check your inbox.",
            expiresIn: 60,
    
        });
  
    } 
    catch (err) {
    
        console.error("[send-otp] Error:", err.message);
        return res.status(500).json({
      
            success: false,
            message: "Failed to send OTP email. Please check server SMTP config.",
    
        });
  
    }

});
app.post("/api/verify-otp", (req, res) => {
  
    const { email, otp } = req.body;

    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email address." });
    }

    if (typeof otp !== "string" || !/^\d{6}$/.test(otp)) {
        return res.status(400).json({ success: false, message: "OTP must be exactly 6 digits." });
    }
    const normalised = email.trim().toLowerCase();
    const result     = verifyOtp(normalised, otp);

  
    if (result.success) {
        console.log(`[verify-otp] Success → ${normalised}`);
        return res.json({ success: true, message: "OTP verified successfully." });
  
    }
  
    const messages = {
    
        no_otp:       "No OTP found for this email. Please request a new one.",
        expired:      "This OTP has expired. Please request a new one.",
        max_attempts: `Maximum ${MAX_ATTEMPTS} attempts reached. Please request a new OTP.`,
        wrong_code:   `Incorrect code. ${result.remaining} attempt${result.remaining !== 1 ? "s" : ""} remaining.`,
  
    };
    console.warn(`[verify-otp] Failed → ${normalised} (${result.reason})`);


  
    return res.status(400).json({
        success:   false,
        reason:    result.reason,
        remaining: result.remaining ?? null,
        message:   messages[result.reason] ?? "Verification failed.",
  
    });

});

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});


app.listen(PORT, async () => {

    console.log(`\nBackend running → http://localhost:${PORT}`);
    console.log(`Accepting requests from: ${process.env.CLIENT_ORIGIN || "http://localhost:5173"}\n`);

    if (!process.env.SMTP_USER || process.env.SMTP_USER === "your_gmail@gmail.com") {
        console.warn("SMTP Error - Check the credentials");
        return;
    }
  
    try {
        await verifyMailerConnection();
    } 
    catch (err) {   
        console.error("SMTP connection failed:", err.message);
        console.error("Double-check SMTP_* values in backend/.env\n");
  
    }
});
