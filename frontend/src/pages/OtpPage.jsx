function OtpPage({ onNext }) {
  return (
    <div>
      <h1>Enter OTP</h1>
      <button onClick={onNext}>Verify OTP</button>
    </div>
  );
}

export default OtpPage;