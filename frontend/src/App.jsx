import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import OtpPage from "./pages/OtpPage";
import SessionPage from "./pages/SessionPage";

function App() {
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");

  const handleLoginNext = (userEmail) => {
    setEmail(userEmail); 
    setStep("otp");
  };

  const handleOtpNext = () => setStep("session");

  const handleLogout = () => {
    setEmail("");
    setStep("login");
  };

  if (step === "login") return <LoginPage onNext={handleLoginNext} />;
  if (step === "otp") return <OtpPage onNext={handleOtpNext} />;
  if (step === "session") return <SessionPage email={email} onLogout={handleLogout} />;

  return null;
}

export default App;
