import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from '@/lib/store';

// isolate state per test
beforeEach(() => {
  const { getState, setState } = useStore;
  setState({ ...getState(), monthlyBudget: 2000, additionalIncomes: [], expenses: [] });
});

describe('store calculations', () => {
  it('calculates recommended savings as income - expenses (>=0)', () => {
    const { calculateRecommendedSavings, addExpense } = useStore.getState();
    expect(calculateRecommendedSavings()).toBe(2000);
    // add expense: 250
    vi.spyOn(useStore.getState(), 'saveToCloud').mockResolvedValue();
    useStore.setState({ expenses: [{ id: '1', amount: 250, category: 'x', description: 'y', date: new Date().toISOString() }] });
    expect(useStore.getState().calculateRecommendedSavings()).toBe(1750);
  });
});

