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
  { code: "MXN", symbol: "Mex$", name: "Mexican Peso" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
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
    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }
    const data = await response.json();
    if (!data || typeof data !== 'object' || !data.rates) {
      throw new Error('Invalid exchange rate payload');
    }
    cachedRates = data.rates;
    lastFetchTime = Date.now();
    return data.rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    // Graceful fallback: keep previous cache if available, else minimal default
    if (cachedRates) return cachedRates;
    return { USD: 1 };
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
