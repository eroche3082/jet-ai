import axios from 'axios';

// Types for currency conversion
export interface ExchangeRate {
  code: string;
  rate: number;
  name: string;
  inverseRate?: number;
}

export interface CurrencyConversionResult {
  amount: number;
  from: string;
  to: string;
  rate: number;
  result: number;
  timestamp: number;
}

// Cache exchange rates to reduce API calls
interface RatesCache {
  [key: string]: {
    rates: { [currency: string]: number };
    timestamp: number;
  };
}

// Cache exchange rates for 1 hour
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds
const ratesCache: RatesCache = {};

/**
 * Fetch latest exchange rates from RapidAPI
 * @param baseCurrency The base currency code (e.g., 'USD')
 * @returns Exchange rates relative to the base currency
 */
export async function fetchExchangeRates(baseCurrency: string = 'USD'): Promise<ExchangeRate[]> {
  try {
    // Check cache first
    const cacheKey = baseCurrency.toUpperCase();
    const cachedData = ratesCache[cacheKey];
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
      // Return cached data if it's still valid
      return Object.entries(cachedData.rates).map(([code, rate]) => ({
        code,
        rate,
        name: getCurrencyName(code),
        inverseRate: 1 / rate,
      }));
    }
    
    // No valid cache, make API request
    const options = {
      method: 'GET',
      url: 'https://currency-exchange.p.rapidapi.com/listquotes',
      headers: {
        'X-RapidAPI-Key': import.meta.env.RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
      }
    };
    
    const response = await axios.request(options);
    const currencies = response.data;
    
    // Fetch exchange rates for each currency
    const exchangeRates: ExchangeRate[] = [];
    const rates: { [currency: string]: number } = {};
    
    for (const currency of currencies) {
      if (currency === baseCurrency) {
        // Base currency has rate of 1
        exchangeRates.push({
          code: currency,
          rate: 1,
          name: getCurrencyName(currency),
          inverseRate: 1,
        });
        rates[currency] = 1;
        continue;
      }
      
      const rateOptions = {
        method: 'GET',
        url: 'https://currency-exchange.p.rapidapi.com/exchange',
        params: {
          from: baseCurrency,
          to: currency,
          q: '1.0'
        },
        headers: {
          'X-RapidAPI-Key': import.meta.env.RAPIDAPI_KEY || '',
          'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
        }
      };
      
      try {
        const rateResponse = await axios.request(rateOptions);
        const rate = rateResponse.data;
        
        exchangeRates.push({
          code: currency,
          rate,
          name: getCurrencyName(currency),
          inverseRate: 1 / rate,
        });
        
        rates[currency] = rate;
      } catch (error) {
        console.error(`Error fetching rate for ${currency}:`, error);
      }
    }
    
    // Update cache
    ratesCache[cacheKey] = {
      rates,
      timestamp: Date.now(),
    };
    
    return exchangeRates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // Return fallback rates if API fails
    return getFallbackRates(baseCurrency);
  }
}

/**
 * Convert an amount from one currency to another
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<CurrencyConversionResult> {
  try {
    // Use the same base currency (USD) for consistent rates
    const baseCurrency = 'USD';
    
    // Check if we have cached rates
    const cacheKey = baseCurrency;
    const cachedData = ratesCache[cacheKey];
    
    let fromRate = 1;
    let toRate = 1;
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
      // Use cached rates
      fromRate = fromCurrency === baseCurrency ? 1 : cachedData.rates[fromCurrency];
      toRate = toCurrency === baseCurrency ? 1 : cachedData.rates[toCurrency];
    } else {
      // Fetch fresh rates
      const options = {
        method: 'GET',
        url: 'https://currency-exchange.p.rapidapi.com/exchange',
        params: {
          from: fromCurrency,
          to: toCurrency,
          q: '1.0'
        },
        headers: {
          'X-RapidAPI-Key': import.meta.env.RAPIDAPI_KEY || '',
          'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
        }
      };
      
      const response = await axios.request(options);
      const rate = response.data;
      
      return {
        amount,
        from: fromCurrency,
        to: toCurrency,
        rate,
        result: amount * rate,
        timestamp: Date.now(),
      };
    }
    
    // Calculate effective exchange rate between the two currencies
    const effectiveRate = toRate / fromRate;
    
    return {
      amount,
      from: fromCurrency,
      to: toCurrency,
      rate: effectiveRate,
      result: amount * effectiveRate,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error converting currency:', error);
    
    // Use fallback rate if API fails
    const fallbackRate = getFallbackRate(fromCurrency, toCurrency);
    
    return {
      amount,
      from: fromCurrency,
      to: toCurrency,
      rate: fallbackRate,
      result: amount * fallbackRate,
      timestamp: Date.now(),
    };
  }
}

/**
 * Get currency name from currency code
 */
function getCurrencyName(code: string): string {
  const currencyNames: { [key: string]: string } = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    JPY: 'Japanese Yen',
    CAD: 'Canadian Dollar',
    AUD: 'Australian Dollar',
    CHF: 'Swiss Franc',
    CNY: 'Chinese Yuan',
    HKD: 'Hong Kong Dollar',
    SGD: 'Singapore Dollar',
    SEK: 'Swedish Krona',
    KRW: 'South Korean Won',
    NOK: 'Norwegian Krone',
    NZD: 'New Zealand Dollar',
    INR: 'Indian Rupee',
    MXN: 'Mexican Peso',
    TWD: 'Taiwan Dollar',
    ZAR: 'South African Rand',
    BRL: 'Brazilian Real',
    DKK: 'Danish Krone',
  };
  
  return currencyNames[code] || code;
}

/**
 * Get fallback exchange rates in case the API fails
 * These are approximate rates and should only be used as a fallback
 */
function getFallbackRates(baseCurrency: string = 'USD'): ExchangeRate[] {
  const fallbackRatesUSD: { [key: string]: number } = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.75,
    JPY: 110,
    CAD: 1.25,
    AUD: 1.35,
    CHF: 0.92,
    CNY: 6.45,
    HKD: 7.78,
    SGD: 1.35,
    SEK: 8.5,
    KRW: 1100,
    NOK: 8.5,
    NZD: 1.4,
    INR: 75,
    MXN: 20,
    TWD: 28,
    ZAR: 15,
    BRL: 5.2,
    DKK: 6.3,
  };
  
  // If base currency is USD, return rates directly
  if (baseCurrency === 'USD') {
    return Object.entries(fallbackRatesUSD).map(([code, rate]) => ({
      code,
      rate,
      name: getCurrencyName(code),
      inverseRate: 1 / rate,
    }));
  }
  
  // Convert rates to the requested base currency
  const baseRate = fallbackRatesUSD[baseCurrency] || 1;
  const exchangeRates: ExchangeRate[] = [];
  
  for (const [code, usdRate] of Object.entries(fallbackRatesUSD)) {
    const rate = usdRate / baseRate;
    exchangeRates.push({
      code,
      rate,
      name: getCurrencyName(code),
      inverseRate: 1 / rate,
    });
  }
  
  return exchangeRates;
}

/**
 * Get approximate fallback rate between two currencies
 */
function getFallbackRate(fromCurrency: string, toCurrency: string): number {
  const fallbackRatesUSD: { [key: string]: number } = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.75,
    JPY: 110,
    CAD: 1.25,
    AUD: 1.35,
    CHF: 0.92,
    CNY: 6.45,
    HKD: 7.78,
    SGD: 1.35,
    SEK: 8.5,
    KRW: 1100,
    NOK: 8.5,
    NZD: 1.4,
    INR: 75,
    MXN: 20,
    TWD: 28,
    ZAR: 15,
    BRL: 5.2,
    DKK: 6.3,
  };
  
  const fromRate = fallbackRatesUSD[fromCurrency] || 1;
  const toRate = fallbackRatesUSD[toCurrency] || 1;
  
  return toRate / fromRate;
}