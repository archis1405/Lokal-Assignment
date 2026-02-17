import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import OtpPage from "./pages/OtpPage";
import SessionPage from "./pages/SessionPage";

function App() {
  const [step, setStep] = useState("login");

  if (step === "login") return <LoginPage onNext={() => setStep("otp")} />;
  if (step === "otp") return <OtpPage onNext={() => setStep("session")} />;
  if (step === "session") return <SessionPage />;

  return null;
}

export default App;
