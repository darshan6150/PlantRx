import { db } from "./db";
import { currencyRates, type InsertCurrencyRate } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

// Live currency API - Free with no rate limits
const CURRENCY_API_BASE = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const FALLBACK_API_BASE = "https://currency-api.pages.dev/v1/currencies";

// Supported currencies for PlantRx
const SUPPORTED_CURRENCIES = ["USD", "EUR", "GBP", "AED"];

interface CurrencyApiResponse {
  [key: string]: {
    [currency: string]: number;
  };
}

/**
 * Fetch live exchange rates from free currency API
 */
async function fetchLiveRates(): Promise<Record<string, number>> {
  const rates: Record<string, number> = {};
  
  try {
    // Fetch SAR rates (our base currency)
    const primaryUrl = `${CURRENCY_API_BASE}/sar.json`;
    const fallbackUrl = `${FALLBACK_API_BASE}/sar.json`;
    
    let response: Response;
    try {
      response = await fetch(primaryUrl, { 
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PlantRx-Currency-Service/1.0'
        }
      });
    } catch (error) {
      console.log('⚠️ Primary API failed, trying fallback...');
      response = await fetch(fallbackUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PlantRx-Currency-Service/1.0'
        }
      });
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: CurrencyApiResponse = await response.json();
    const sarRates = data.sar;
    
    if (!sarRates) {
      throw new Error('No SAR rates found in API response');
    }
    
    // Convert to our supported currencies
    for (const currency of SUPPORTED_CURRENCIES) {
      const currencyKey = currency.toLowerCase();
      if (sarRates[currencyKey]) {
        rates[currency] = sarRates[currencyKey];
        console.log(`📊 ${currency}: 1 SAR = ${sarRates[currencyKey]} ${currency}`);
      }
    }
    
    // Add SAR as base (1:1 ratio)
    rates['SAR'] = 1;
    
    return rates;
    
  } catch (error) {
    console.error('❌ Error fetching live currency rates:', error);
    
    // Return fallback rates if API fails
    console.log('🔄 Using fallback exchange rates...');
    return {
      SAR: 1,
      USD: 0.2667,
      EUR: 0.2533,
      GBP: 0.2133,
      AED: 0.9803
    };
  }
}

/**
 * Update currency rates in database
 */
export async function updateCurrencyRates(): Promise<number> {
  console.log('🔄 Fetching live currency rates...');
  
  const liveRates = await fetchLiveRates();
  let updatedCount = 0;
  
  for (const [currency, rate] of Object.entries(liveRates)) {
    try {
      // Check if currency rate exists
      const existing = await db
        .select()
        .from(currencyRates)
        .where(eq(currencyRates.targetCurrency, currency))
        .limit(1);
      
      if (existing.length > 0) {
        // Update existing rate
        await db
          .update(currencyRates)
          .set({ 
            rate: rate,
            lastUpdated: new Date()
          })
          .where(eq(currencyRates.targetCurrency, currency));
        
        console.log(`✅ Updated ${currency}: 1 SAR = ${rate}`);
      } else {
        // Insert new rate
        await db
          .insert(currencyRates)
          .values({
            baseCurrency: "SAR",
            targetCurrency: currency,
            rate: rate
          });
        
        console.log(`🆕 Added ${currency}: 1 SAR = ${rate}`);
      }
      
      updatedCount++;
      
    } catch (error) {
      console.error(`❌ Error updating ${currency} rate:`, error);
    }
  }
  
  console.log(`✅ Updated ${updatedCount} currency rates`);
  return updatedCount;
}

/**
 * Get all currency rates from database
 */
export async function getCurrencyRates(): Promise<Record<string, number>> {
  try {
    const rates = await db
      .select({
        currency: currencyRates.targetCurrency,
        rate: currencyRates.rate
      })
      .from(currencyRates)
      .orderBy(currencyRates.targetCurrency);
    
    const rateMap: Record<string, number> = {};
    
    for (const rate of rates) {
      rateMap[rate.currency] = rate.rate;
    }
    
    // Ensure SAR is always included as base
    if (!rateMap['SAR']) {
      rateMap['SAR'] = 1;
    }
    
    return rateMap;
    
  } catch (error) {
    console.error('❌ Error fetching currency rates from database:', error);
    
    // Return fallback rates
    return {
      SAR: 1,
      USD: 0.2667,
      EUR: 0.2533,
      GBP: 0.2133,
      AED: 0.9803
    };
  }
}

/**
 * Convert price from SAR to target currency
 */
export function convertPrice(sarPrice: number, targetCurrency: string, rates: Record<string, number>): number {
  const rate = rates[targetCurrency];
  if (!rate) {
    console.warn(`⚠️ No rate found for ${targetCurrency}, using 1:1`);
    return sarPrice;
  }
  
  return sarPrice * rate;
}

/**
 * Format price with currency symbol
 */
export function formatPrice(sarPrice: number, targetCurrency: string, rates: Record<string, number>): string {
  const convertedPrice = convertPrice(sarPrice, targetCurrency, rates);
  
  const symbols: Record<string, string> = {
    SAR: '﷼',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'د.إ'
  };
  
  const symbol = symbols[targetCurrency] || targetCurrency;
  return `${symbol}${convertedPrice.toFixed(2)}`;
}

/**
 * Initialize currency rates on startup
 */
export async function initializeCurrencyRates(): Promise<void> {
  console.log('🚀 Initializing currency rates system...');
  
  try {
    await updateCurrencyRates();
    console.log('✅ Currency rates initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing currency rates:', error);
  }
}

/**
 * Schedule currency rate updates (call this periodically)
 */
export function scheduleCurrencyUpdates(): void {
  // Update rates every 30 minutes
  const UPDATE_INTERVAL = 30 * 60 * 1000; // 30 minutes in milliseconds
  
  setInterval(async () => {
    console.log('⏰ Scheduled currency rate update...');
    await updateCurrencyRates();
  }, UPDATE_INTERVAL);
  
  console.log('📅 Currency rate updates scheduled every 30 minutes');
}