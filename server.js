// ============================================================
//  AMR AMMAR PORTFOLIO — CONTACT FORM BACKEND
//  server.js
//
//  SETUP INSTRUCTIONS:
//  1. Make sure Node.js is installed on your machine
//  2. Open terminal in this folder and run:
//       npm install
//  3. Create a Gmail App Password:
//       - Go to your Google Account → Security
//       - Enable 2-Step Verification (required)
//       - Go to Security → App Passwords
//       - Select app: Mail, Select device: Other → name it "Portfolio"
//       - Copy the 16-character password Google gives you
//  4. Open this file and fill in YOUR_GMAIL_APP_PASSWORD below
//  5. Run the server:
//       node server.js
//  6. The server will run on http://localhost:3000
// ============================================================

const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');

const app  = express();
const PORT = 3000;

// ---- YOUR CREDENTIALS (fill these in) ----
const YOUR_GMAIL         = 'amr.ammar.data@gmail.com';
const YOUR_APP_PASSWORD  = 'YOUR_GMAIL_APP_PASSWORD'; // 16-char app password from Google
// ------------------------------------------

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serves your HTML/CSS/JS files

// ---- Nodemailer transporter ----
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: YOUR_GMAIL,
    pass: YOUR_APP_PASSWORD,
  },
});

// ---- Contact form endpoint ----
app.post('/send', async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  const mailOptions = {
    from: `"Portfolio Contact" <${YOUR_GMAIL}>`,
    to: YOUR_GMAIL,
    replyTo: email,
    subject: `📩 New message from ${name} — Portfolio`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a1120; color: #e8f4ff; padding: 32px; border-radius: 12px; border: 1px solid #00d4ff33;">
        <h2 style="color: #00d4ff; margin-top: 0;">New Portfolio Message</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #7a9abf; width: 80px;"><strong>Name:</strong></td>
            <td style="padding: 10px 0; color: #e8f4ff;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #7a9abf;"><strong>Email:</strong></td>
            <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #00d4ff;">${email}</a></td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #00d4ff22; margin: 20px 0;" />
        <p style="color: #7a9abf; margin-bottom: 8px;"><strong>Message:</strong></p>
        <p style="color: #e8f4ff; line-height: 1.8; background: #050a14; padding: 16px; border-radius: 8px; border-left: 3px solid #00d4ff;">${message.replace(/\n/g, '<br>')}</p>
        <p style="color: #3d5a73; font-size: 12px; margin-top: 24px; margin-bottom: 0;">Sent from your portfolio at amrammar.dev</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent from ${name} <${email}>`);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Email error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to send email. Check server logs.' });
  }
});

// ---- Start server ----
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📬 Emails will be sent to: ${YOUR_GMAIL}`);
  console.log(`📁 Open http://localhost:${PORT} in your browser to see the portfolio`);
});
