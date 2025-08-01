// Currency conversion and formatting utilities
// Exchange rates are approximate and should be updated regularly in production

export const CURRENCIES = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rate: 1.0 // Base currency
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rate: 0.92 // 1 USD = 0.92 EUR (approximate)
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rate: 0.79 // 1 USD = 0.79 GBP (approximate)
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    rate: 1.35 // 1 USD = 1.35 CAD (approximate)
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    rate: 1.52 // 1 USD = 1.52 AUD (approximate)
  }
};

export const DEFAULT_CURRENCY = 'USD';

// Convert amount from USD to target currency
export const convertCurrency = (amountUSD, targetCurrency) => {
  if (!CURRENCIES[targetCurrency]) {
    console.warn(`Currency ${targetCurrency} not supported, using USD`);
    return amountUSD;
  }
  
  return amountUSD * CURRENCIES[targetCurrency].rate;
};

// Convert amount from source currency to USD
export const convertToUSD = (amount, sourceCurrency) => {
  if (!CURRENCIES[sourceCurrency]) {
    console.warn(`Currency ${sourceCurrency} not supported, using USD`);
    return amount;
  }
  
  return amount / CURRENCIES[sourceCurrency].rate;
};

// Format currency with proper symbol and locale
export const formatCurrency = (amount, currency = DEFAULT_CURRENCY) => {
  if (!CURRENCIES[currency]) {
    currency = DEFAULT_CURRENCY;
  }
  
  const currencyInfo = CURRENCIES[currency];
  
  // Use Intl.NumberFormat for proper localization
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter.format(amount);
};

// Format currency with custom symbol (for better control)
export const formatCurrencyCustom = (amount, currency = DEFAULT_CURRENCY) => {
  if (!CURRENCIES[currency]) {
    currency = DEFAULT_CURRENCY;
  }
  
  const currencyInfo = CURRENCIES[currency];
  
  // Format number with commas
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(amount));
  
  return `${currencyInfo.symbol}${formattedNumber}`;
};

// Get currency options for dropdowns
export const getCurrencyOptions = () => {
  return Object.keys(CURRENCIES).map(code => ({
    value: code,
    label: `${CURRENCIES[code].symbol} ${CURRENCIES[code].name} (${code})`,
    symbol: CURRENCIES[code].symbol,
    name: CURRENCIES[code].name
  }));
};

// Update exchange rates (in production, this would fetch from an API)
export const updateExchangeRates = async () => {
  try {
    // In production, fetch from a reliable exchange rate API
    // For demo purposes, we'll use static rates
    console.log('Exchange rates updated (demo - using static rates)');
    return true;
  } catch (error) {
    console.error('Failed to update exchange rates:', error);
    return false;
  }
};

// Currency conversion for ROI scenarios
export const convertROIScenario = (scenario, targetCurrency) => {
  if (targetCurrency === 'USD') {
    return scenario; // No conversion needed
  }
  
  return {
    ...scenario,
    costRange: {
      min: convertCurrency(scenario.costRange.min, targetCurrency),
      max: convertCurrency(scenario.costRange.max, targetCurrency)
    },
    costs: Object.keys(scenario.costs || {}).reduce((acc, key) => {
      acc[key] = convertCurrency(scenario.costs[key], targetCurrency);
      return acc;
    }, {}),
    // Update industry benchmarks if they contain cost data
    industryBenchmarks: Object.keys(scenario.industryBenchmarks || {}).reduce((acc, industry) => {
      acc[industry] = {
        ...scenario.industryBenchmarks[industry],
        // ROI percentages stay the same, only costs change
      };
      return acc;
    }, {})
  };
};

// Detect user's likely currency based on browser locale
export const detectUserCurrency = () => {
  try {
    const locale = navigator.language || navigator.userLanguage;
    
    // Simple currency detection based on common locales
    const currencyMap = {
      'en-US': 'USD',
      'en-GB': 'GBP', 
      'en-CA': 'CAD',
      'en-AU': 'AUD',
      'de': 'EUR',
      'fr': 'EUR',
      'es': 'EUR',
      'it': 'EUR',
      'nl': 'EUR'
    };
    
    // Check for exact match first
    if (currencyMap[locale]) {
      return currencyMap[locale];
    }
    
    // Check for language code only
    const languageCode = locale.split('-')[0];
    const regionCode = locale.split('-')[1];
    
    // Check specific regions
    if (regionCode) {
      const regionMap = {
        'GB': 'GBP',
        'CA': 'CAD', 
        'AU': 'AUD',
        'DE': 'EUR',
        'FR': 'EUR',
        'ES': 'EUR',
        'IT': 'EUR',
        'NL': 'EUR'
      };
      
      if (regionMap[regionCode]) {
        return regionMap[regionCode];
      }
    }
    
    // Fallback to USD
    return DEFAULT_CURRENCY;
    
  } catch (error) {
    console.warn('Could not detect user currency:', error);
    return DEFAULT_CURRENCY;
  }
};