import { describe, it, expect } from 'vitest';
import { convertCurrency, formatCurrency, currencies } from '@/lib/currency';

describe('currency utils', () => {
  it('formats currency with symbol and two decimals', () => {
    const usd = currencies.find(c => c.code === 'USD')!;
    expect(formatCurrency(1234.5, usd)).toMatch(/\$1,234\.50|\$1.234,50/);
  });

  it('converts currency when same code returns original amount', async () => {
    const amount = await convertCurrency(100, 'USD', 'USD');
    expect(amount).toBe(100);
  });

  it('handles missing target rate by returning original amount', async () => {
    const amount = await convertCurrency(100, 'USD', 'XYZ');
    expect(amount).toBe(100);
  });
});

