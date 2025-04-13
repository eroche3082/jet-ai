// Email Client for JET AI

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  fromName?: string;
}

/**
 * Sends an email using the server-side email service
 * This function makes an API call to the backend, which uses SendGrid
 */
export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        // Default sender information if not provided
        from: params.from || 'notifications@jetai.travel',
        fromName: params.fromName || 'JET AI Travel Assistant',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send email');
    }

    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

/**
 * Generates an HTML email template with JET AI branding
 */
export function generateEmailTemplate(
  title: string,
  content: string,
  userName: string = 'Traveler'
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
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
          color: white;
          padding: 20px;
          text-align: center;
        }
        .logo {
          max-width: 150px;
          margin-bottom: 10px;
        }
        .content {
          padding: 20px;
          background-color: white;
        }
        .footer {
          background-color: #f7f7f7;
          padding: 15px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .button {
          display: inline-block;
          background-color: #4a89dc;
          color: white;
          padding: 12px 20px;
          margin: 20px 0;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
        }
        h1 {
          color: #4a89dc;
          margin-top: 0;
        }
        .greeting {
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://i.imgur.com/X6JrY2K.png" alt="JET AI Logo" class="logo">
          <h2>JET AI Travel Assistant</h2>
        </div>
        <div class="content">
          <p class="greeting">Hello ${userName},</p>
          <h1>${title}</h1>
          ${content}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} JET AI. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends a welcome email to a new user
 */
export async function sendWelcomeEmail(email: string, name: string, accessCode: string): Promise<boolean> {
  const dashboardUrl = `${window.location.origin}/access-dashboard?code=${accessCode}`;
  
  const content = `
    <p>Welcome to JET AI, your intelligent travel companion!</p>
    <p>Your personal access code is: <strong>${accessCode}</strong></p>
    <p>With this code, you can access premium features and share your travel experiences with others.</p>
    <a href="${dashboardUrl}" class="button">Access Your Dashboard</a>
    <p>Thank you for choosing JET AI for your travel adventures. We're excited to help you explore the world!</p>
  `;
  
  return sendEmail({
    to: email,
    subject: 'Welcome to JET AI - Your Intelligent Travel Companion',
    html: generateEmailTemplate('Welcome Aboard!', content, name)
  });
}

/**
 * Sends an access code via email
 */
export async function sendAccessCodeEmail(email: string, name: string, accessCode: string, qrCodeUrl?: string): Promise<boolean> {
  const dashboardUrl = `${window.location.origin}/access-dashboard?code=${accessCode}`;
  
  let qrHtml = '';
  if (qrCodeUrl) {
    qrHtml = `
      <div style="text-align: center; margin: 20px 0;">
        <p>Scan this QR code to quickly access your dashboard:</p>
        <img src="${qrCodeUrl}" alt="Access QR Code" style="width: 200px; height: 200px;">
      </div>
    `;
  }
  
  const content = `
    <p>As requested, here is your JET AI access code:</p>
    <div style="background-color: #f0f7ff; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
      <span style="font-family: monospace; font-size: 24px; font-weight: bold;">${accessCode}</span>
    </div>
    ${qrHtml}
    <p>You can use this code to access your JET AI dashboard and unlock premium features.</p>
    <a href="${dashboardUrl}" class="button">Access Your Dashboard</a>
    <p>If you didn't request this code, please ignore this email.</p>
  `;
  
  return sendEmail({
    to: email,
    subject: 'Your JET AI Access Code',
    html: generateEmailTemplate('Your Access Code', content, name)
  });
}