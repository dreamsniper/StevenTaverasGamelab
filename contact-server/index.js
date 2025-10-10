require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.TO_EMAIL) {
  console.warn('Warning: SMTP credentials or TO_EMAIL not set. See .env.example');
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.get('/', (req, res) => res.json({ status: 'ok' }));

app.post('/send', async (req, res) => {
  const { name, email, projectType, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' });

  const mail = {
    from: `${name} <${email}>`,
    to: process.env.TO_EMAIL,
    subject: `Website Contact: ${projectType || 'General'} - ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nProject Type: ${projectType || 'N/A'}\n\nMessage:\n${message}`
  };

  try {
    const info = await transporter.sendMail(mail);
    return res.json({ ok: true, info });
  } catch (err) {
    console.error('Mail send error', err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

app.listen(PORT, () => console.log(`Contact server listening on ${PORT}`));
