import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function buildOtpEmail(toEmail, code) {
  return {
    from:    process.env.EMAIL_FROM,
    to:      toEmail,
    subject: `${code} is your Lokal verification code`,

    text: `Your Lokal one-time code is: ${code}\n\nThis code expires in 60 seconds.\nDo not share this with anyone.`,

    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0b0c0f;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#0b0c0f;padding:48px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" role="presentation"
               style="background:#13151a;border-radius:16px;border:1px solid rgba(255,255,255,0.07);padding:40px 36px;max-width:480px;width:100%;">

          <!-- Brand -->
          <tr>
            <td style="padding-bottom:32px;">
              <span style="font-size:12px;font-weight:700;letter-spacing:0.15em;color:rgba(240,240,238,0.4);text-transform:uppercase;">
                ● &nbsp;LOKAL
              </span>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td style="padding-bottom:10px;">
              <h1 style="margin:0;font-size:24px;font-weight:800;color:#f0f0ee;letter-spacing:-0.02em;">
                Your verification code
              </h1>
            </td>
          </tr>

          <!-- Subtext -->
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:14px;color:rgba(240,240,238,0.5);line-height:1.7;">
                Use the code below to sign in to Lokal.<br>
                It expires in <strong style="color:#f0f0ee;">60 seconds</strong> and can only be used once.
              </p>
            </td>
          </tr>

          <!-- OTP code box -->
          <tr>
            <td style="padding-bottom:32px;">
              <div style="background:#1c1f27;border:1px solid rgba(255,255,255,0.07);border-left:4px solid #e8ff4a;border-radius:12px;padding:24px;text-align:center;">
                <span style="font-size:40px;font-weight:800;letter-spacing:0.3em;color:#e8ff4a;font-family:'Courier New',monospace;">
                  ${code}
                </span>
              </div>
            </td>
          </tr>

          <!-- Security note -->
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:12px;color:rgba(240,240,238,0.3);line-height:1.7;">
                🔒 &nbsp;Never share this code with anyone. Lokal will never ask for your OTP by phone or email.<br>
                If you didn't request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;">
              <p style="margin:0;font-size:11px;color:rgba(240,240,238,0.2);">
                Sent to ${toEmail} &nbsp;·&nbsp; Lokal Auth
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}

export async function sendOtpEmail(email, code) {
  const mail = buildOtpEmail(email, code);
  const info = await transporter.sendMail(mail);
  console.log(`[mailer] OTP sent to ${email}  (messageId: ${info.messageId})`);
  return info;
}

export async function verifyMailerConnection() {
  await transporter.verify();
  console.log("[mailer] SMTP connection verified");
}
