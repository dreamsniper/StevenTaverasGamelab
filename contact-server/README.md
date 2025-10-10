Contact Server
================

This is a minimal Express server that receives contact form POSTs and forwards them via SMTP using Nodemailer.

Setup
-----

1. Copy `.env.example` to `.env` and fill in your SMTP credentials. For iCloud email you should create an app-specific password and use these recommended settings:

```
SMTP_HOST=smtp.mail.me.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_icloud_address@icloud.com
SMTP_PASS=YOUR_APP_SPECIFIC_PASSWORD
TO_EMAIL=steven.taveras@icloud.com
```

2. Install dependencies:

```bash
cd contact-server
npm install
```

3. Start the server:

```bash
npm start
```

The server listens on port 3001 by default. You can set `PORT` in the `.env` file to change it.

Security notes
--------------
- Use an app-specific password instead of your main iCloud password.
- Consider running this server behind HTTPS and enabling additional protections in production.
- The server includes a basic rate limiter, but you should also add CAPTCHAs or additional verification for public sites.
