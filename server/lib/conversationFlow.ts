export const conversationFlow = [
  {
    key: 'name',
    prompt: "👋 Welcome aboard JetAI! I'm your personal travel concierge. First, may I know your name?",
    required: true,
  },
  {
    key: 'email',
    prompt: "📧 Thank you! Can I also get your email address so I can save your preferences and itinerary?",
    required: true,
  },
  {
    key: 'destination',
    prompt: "🌍 Great! Where are you dreaming of going? (City, country, or region)",
    required: true,
  },
  {
    key: 'budget',
    prompt: "💰 What's your travel budget? (Luxury, Mid-range, Budget-friendly)",
    required: true,
  },
  {
    key: 'dates',
    prompt: "📅 When are you planning to travel? (Month, season, or specific dates)",
    required: true,
  },
  {
    key: 'travelers',
    prompt: "👥 Who are you traveling with? (Solo, partner, family, friends)",
    required: true,
  },
  {
    key: 'interests',
    prompt: "🎯 What are your travel interests? (Beach, food, culture, nightlife, adventure, relaxation, nature, etc.)",
    required: true,
  },
  {
    key: 'confirmation',
    prompt: "✅ Would you like me to generate your personalized itinerary now, or modify any detail?",
    required: false,
  },
];