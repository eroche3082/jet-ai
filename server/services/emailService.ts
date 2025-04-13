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

interface TravelSummaryParams {
  userName: string;
  destination: string;
  tripDuration: number;
  travelCategory: string;
  totalSpent: number;
  pointsEarned: number;
  mediaUrl?: string;
  postCaption?: string;
  postHashtags?: string;
  travelAccessCode: string;
  dashboardUrl: string;
}

export function generateTravelSummaryEmail(params: TravelSummaryParams): string {
  const {
    userName,
    destination,
    tripDuration,
    travelCategory,
    totalSpent,
    pointsEarned,
    mediaUrl,
    postCaption,
    postHashtags,
    travelAccessCode,
    dashboardUrl
  } = params;

  // Format the money amounts with proper currency formatting
  const formattedTotalSpent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(totalSpent);

  // Format dates
  const today = new Date();
  const tripEndDate = new Date();
  tripEndDate.setDate(today.getDate() - 1); // Yesterday
  const tripStartDate = new Date(tripEndDate);
  tripStartDate.setDate(tripEndDate.getDate() - (tripDuration - 1));
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formattedStartDate = formatDate(tripStartDate);
  const formattedEndDate = formatDate(tripEndDate);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your ${destination} Trip Summary - JET AI</title>
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
      padding: 0;
    }
    .header {
      background-color: #050b17;
      padding: 20px;
      text-align: center;
    }
    .hero {
      background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${mediaUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'});
      background-size: cover;
      background-position: center;
      color: white;
      padding: 60px 20px;
      text-align: center;
    }
    .hero h1 {
      margin: 0;
      font-size: 32px;
      text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
    }
    .hero p {
      font-size: 18px;
      margin: 10px 0 0;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
    }
    .trip-stats {
      background-color: #4a89dc;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .stats-grid {
      display: inline-block;
      width: 32%;
      vertical-align: top;
      padding: 10px 0;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      margin: 5px 0;
    }
    .stat-label {
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 30px 20px;
      background-color: #fff;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      color: #4a89dc;
      margin-bottom: 15px;
      font-size: 20px;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 10px;
    }
    .memories-img {
      width: 100%;
      max-height: 300px;
      object-fit: cover;
      border-radius: 5px;
      margin-bottom: 15px;
    }
    .social-post {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 5px;
      margin-top: 15px;
    }
    .hashtags {
      color: #4a89dc;
      font-size: 14px;
    }
    .rewards-box {
      background-color: #f0f7ff;
      border: 1px solid #d0e1f9;
      border-radius: 5px;
      padding: 15px;
      margin-top: 20px;
    }
    .access-code {
      background-color: #050b17;
      color: white;
      padding: 10px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 16px;
      letter-spacing: 1px;
      margin: 15px 0;
      text-align: center;
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
    .footer {
      background-color: #050b17;
      color: #fff;
      text-align: center;
      padding: 20px;
      font-size: 12px;
    }
    .logo {
      max-width: 150px;
    }
    .social-icon {
      margin: 0 5px;
      color: white;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://i.imgur.com/LZ4TQkz.png" alt="JET AI Logo" class="logo">
    </div>
    
    <div class="hero">
      <h1>${destination} Trip Summary</h1>
      <p>${formattedStartDate} - ${formattedEndDate}</p>
    </div>
    
    <div class="trip-stats">
      <div class="stats-grid">
        <div class="stat-value">${tripDuration}</div>
        <div class="stat-label">DAYS</div>
      </div>
      <div class="stats-grid">
        <div class="stat-value">${formattedTotalSpent}</div>
        <div class="stat-label">SPENT</div>
      </div>
      <div class="stats-grid">
        <div class="stat-value">+${pointsEarned}</div>
        <div class="stat-label">JETPOINTS</div>
      </div>
    </div>
    
    <div class="content">
      <div class="section">
        <h2 class="section-title">Trip Overview</h2>
        <p>Hello ${userName},</p>
        <p>Thank you for using JET AI to enhance your recent trip to ${destination}. We've prepared this summary to help you remember the amazing experiences and to award you with JetPoints for your journey.</p>
        <p>Your trip was categorized as: <strong>${travelCategory}</strong></p>
      </div>
      
      ${mediaUrl ? `
      <div class="section">
        <h2 class="section-title">Trip Memories</h2>
        <img src="${mediaUrl}" alt="Trip to ${destination}" class="memories-img">
        ${postCaption ? `
        <div class="social-post">
          <p>${postCaption}</p>
          ${postHashtags ? `<p class="hashtags">${postHashtags}</p>` : ''}
        </div>
        ` : ''}
      </div>
      ` : ''}
      
      <div class="section">
        <h2 class="section-title">Rewards Update</h2>
        <p>You've earned <strong>${pointsEarned} JetPoints</strong> from this trip! These points can be redeemed for travel discounts, upgrades, and exclusive experiences.</p>
        
        <div class="rewards-box">
          <p><strong>Your JET AI Travel Access Code:</strong></p>
          <div class="access-code">${travelAccessCode}</div>
          <p>Use this code when contacting our concierge service for premium assistance with your next journey.</p>
        </div>
      </div>
      
      <div class="section">
        <h2 class="section-title">Ready for Your Next Adventure?</h2>
        <p>Visit your JET AI dashboard to explore personalized recommendations for your next trip, based on your travel preferences and history.</p>
        <center>
          <a href="${dashboardUrl}" class="button">Open Your Dashboard</a>
        </center>
      </div>
    </div>
    
    <div class="footer">
      <p>Connect with us</p>
      <div>
        <a href="#" class="social-icon">Facebook</a> |
        <a href="#" class="social-icon">Twitter</a> |
        <a href="#" class="social-icon">Instagram</a>
      </div>
      <p>&copy; 2025 JET AI Travel Assistant | All Rights Reserved</p>
      <p><small>This is an automated summary of your recent trip. If you have any questions, please contact our support team.</small></p>
    </div>
  </div>
</body>
</html>
  `;
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