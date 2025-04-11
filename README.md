# JetAI Smart Travel Agent

## Overview
JetAI is a comprehensive AI-powered travel planning platform that helps users discover destinations, create personalized itineraries, and book travel experiences. The platform features a white-label architecture that enables partners to deploy their own branded versions, monetize through affiliate programs, and embed JetAI functionality on their own websites.

## Key Features

### Core Functionality
- AI-powered travel chat assistant using Google's Gemini 1.5 Flash model
- Personalized destination recommendations based on user preferences
- Detailed travel itinerary generation
- Integration with travel booking services
- Responsive design for all devices

### Premium Membership System
- Tiered membership model (Basic, Freemium, Premium)
- AI credit system for pay-per-use functionality
- Stripe payment processing integration
- Subscription management

### Partner & White-Label Features
- Partner Dashboard with analytics and performance metrics
- White-label deployment with subdomain support
- Custom branding and theming
- Embeddable widgets for third-party websites
- Affiliate program with revenue sharing

## Technical Implementation

### Front-End
- React with TypeScript
- Tailwind CSS and shadcn/ui for responsive design
- React Query for data fetching and state management
- Wouter for lightweight routing
- ReactMarkdown for formatted chat messages

### Back-End
- Node.js with Express
- PostgreSQL database with Drizzle ORM
- Google Gemini AI integration
- OpenAI fallback capability
- Stripe payment processing

### Security & Performance
- Environment variables for sensitive configuration
- API key security management
- Responsive caching and lazy loading
- Error handling and fallback mechanisms

## Environment Requirements

The following environment variables are required to run JetAI:

```
# Database Connection
DATABASE_URL=postgresql://username:password@hostname:port/database

# AI Service API Keys
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here  # Optional fallback

# Stripe Integration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_PRICE_ID=price_your_subscription_price_id
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (copy .env.example to .env and fill in values)
4. Run database migrations: `npm run db:push`
5. Start the development server: `npm run dev`

## Deployment

The application is ready for deployment using Replit's deployment system, which will build and host the application with appropriate scaling capabilities.

## Future Development

- Integration with more travel service providers
- Enhanced AI capabilities with multimodal inputs
- Mobile application development
- Expanded analytics dashboard
- Additional customization options for white-label partners