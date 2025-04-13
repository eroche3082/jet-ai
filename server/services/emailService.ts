import { MailService } from '@sendgrid/mail';

// Initialize SendGrid
const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY as string);

interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: any[];
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    // JET AI branding
    const fromEmail = 'notifications@jetai.travel';
    const fromName = 'JET AI Travel Assistant';

    await mailService.send({
      to: params.to,
      from: {
        email: fromEmail,
        name: fromName
      },
      subject: params.subject,
      text: params.text || '', // Ensure we always have a string
      html: params.html || '', // Ensure we always have a string
      attachments: params.attachments,
    });
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export function generateWelcomeEmail(userData: any): { text: string, html: string } {
  const { name, code, category } = userData;
  
  // Plain text version
  const text = `
Welcome to JET AI Travel Assistant, ${name}!

We're excited to have you onboard and look forward to helping you plan incredible journeys.

Your personalized JET AI code: ${code}
User category: ${category}

Keep this code safe as you'll need it to access your premium features and personalized recommendations.

Ready to start exploring? Log in to your dashboard to discover destinations tailored to your preferences.

Safe travels,
The JET AI Team
`;

  // HTML version with styling
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Welcome to JET AI</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #050b17;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 20px;
      background-color: #f9f9f9;
    }
    .footer {
      background-color: #050b17;
      color: #fff;
      text-align: center;
      padding: 10px;
      font-size: 12px;
    }
    .logo {
      max-width: 150px;
    }
    .code-box {
      background-color: #4a89dc;
      color: white;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
      text-align: center;
      font-family: monospace;
      font-size: 18px;
      letter-spacing: 1px;
    }
    .button {
      display: inline-block;
      background-color: #4a89dc;
      color: white;
      text-decoration: none;
      padding: 12px 25px;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
    h1, h2 {
      color: #4a89dc;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://i.imgur.com/LZ4TQkz.png" alt="JET AI Logo" class="logo">
    </div>
    <div class="content">
      <h1>Welcome to JET AI, ${name}!</h1>
      <p>We're thrilled to have you onboard and look forward to helping you discover amazing destinations around the world.</p>
      
      <h2>Your JET AI Profile</h2>
      <p>Based on your preferences, we've identified you as a:</p>
      <h3 style="color: #4a89dc;">${category}</h3>
      
      <p>Your personalized JET AI access code:</p>
      <div class="code-box">
        ${code}
      </div>
      <p><small>Keep this code safe, you'll need it to access premium features and personalized recommendations.</small></p>
      
      <p>Ready to start exploring? Log in to your dashboard to discover destinations tailored to your preferences.</p>
      
      <a href="https://jetai.travel/dashboard" class="button">Access Your Dashboard</a>
      
      <p>If you have any questions, simply reply to this email or contact our support team.</p>
      
      <p>Safe travels,<br>The JET AI Team</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 JET AI Travel Assistant | All Rights Reserved</p>
      <p><small>This email was sent to ${userData.email}</small></p>
    </div>
  </div>
</body>
</html>
`;

  return { text, html };
}