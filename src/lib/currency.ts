export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
];

interface ExchangeRates {
  [key: string]: number;
}

let cachedRates: ExchangeRates | null = null;
let lastFetchTime = 0;

export const getExchangeRates = async (
  baseCurrency: string = "USD",
): Promise<ExchangeRates> => {
  // Check cache (valid for 1 hour)
  if (cachedRates && Date.now() - lastFetchTime < 3600000) {
    return cachedRates;
  }

  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`,
    );
    const data = await response.json();
    cachedRates = data.rates;
    lastFetchTime = Date.now();
    return data.rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return { USD: 1, EUR: 0.85, GBP: 0.73, JPY: 110, CAD: 1.25, AUD: 1.35 };
  }
};

export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): Promise<number> => {
  if (fromCurrency === toCurrency) return amount;

  const rates = await getExchangeRates("USD");
  if (!rates[fromCurrency] || !rates[toCurrency]) return amount;

  // Convert to USD first (as base), then to target currency
  const amountInUSD = amount / rates[fromCurrency];
  return amountInUSD * rates[toCurrency];
};

export const formatCurrency = (amount: number, currency: Currency): string => {
  return `${currency.symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
