export type User = {
  id: number;
  email: string;
  username: string;
  profileImage?: string;
  membershipTier: 'free' | 'premium' | 'enterprise';
  cryptoBalance?: number;
  portfolioValue?: number;
  aiCreditsRemaining?: number;
  maxMonthlySearches?: number;
  lastLogin?: Date;
  preferences?: UserPreferences;
};

export type UserPreferences = {
  darkMode: boolean;
  language: string;
  currency: string;
  pushNotifications: boolean;
  emailAlerts: boolean;
  priceAlerts: boolean;
  favoriteCoins: string[];
};