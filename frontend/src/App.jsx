import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import OtpPage from "./pages/OtpPage";
import SessionPage from "./pages/SessionPage";

export default function App() {
  const { screen } = useAuth();

  return (
    <>
      {screen === "login"   && <LoginPage />}
      {screen === "otp"     && <OtpPage />}
      {screen === "session" && <SessionPage />}
    </>
  );
}