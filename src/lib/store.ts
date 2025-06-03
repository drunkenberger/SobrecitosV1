import { v4 as uuidv4 } from 'uuid';
import {
  StorageType,
  getUserSettings,
  updateSupabaseBudget,
  addSupabaseIncome,
  addSupabaseCategory,
  addSupabaseExpense,
  addSupabaseSavingsGoal,
  addSupabaseFuturePayment,
  getSupabaseStore
} from "./supabaseStore";
import { supabase } from "./supabase";
import { create } from "zustand";

// Types
export interface Income {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  budget: number;
  isRecurring?: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  isRecurring?: boolean;
  recurringType?: "weekly" | "monthly";
  recurringDay?: number;
  currency?: {
    code: string;
    symbol: string;
    name: string;
  };
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
}

export interface FuturePayment {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  category: string;
  isPaid: boolean;
}

export interface ExpenseInput {
  id?: string;
  amount: number;
  category: string;
  description: string;
}

export interface BudgetStore {
  monthlyBudget: number;
  additionalIncomes: Income[];
  categories: Category[];
  expenses: Expense[];
  savingsGoals: SavingsGoal[];
  futurePayments: FuturePayment[];
  currency: {
    code: string;
    symbol: string;
    name: string;
  };
}

// Helper function to generate consistent IDs
const generateId = () => uuidv4();

// Default Data
export const defaultStore: BudgetStore = {
  currency: { code: "USD", symbol: "$", name: "US Dollar" },
  monthlyBudget: 2000,
  additionalIncomes: [],
  categories: [
    {
      id: generateId(),
      name: "Groceries",
      color: "#4CAF50",
      budget: 500,
      isRecurring: false,
    },
    {
      id: generateId(),
      name: "Utilities",
      color: "#2196F3",
      budget: 300,
      isRecurring: true,
    },
    {
      id: generateId(),
      name: "Entertainment",
      color: "#9C27B0",
      budget: 200,
      isRecurring: false,
    },
  ],
  expenses: [],
  savingsGoals: [],
  futurePayments: [],
};

// Store interface
export interface Store extends BudgetStore {
  // Cloud operations
  loadFromCloud: () => Promise<void>;
  saveToCloud: () => Promise<void>;

  // Store operations
  updateMonthlyBudget: (amount: number) => Promise<void>;
  addIncome: (income: Omit<Income, "id" | "date">) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addExpense: (expense: ExpenseInput) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addSavingsGoal: (goal: Omit<SavingsGoal, "id">) => Promise<void>;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => Promise<void>;
  deleteSavingsGoal: (id: string) => Promise<void>;
  addFuturePayment: (payment: Omit<FuturePayment, "id" | "isPaid">) => Promise<void>;
  updateFuturePayment: (id: string, updates: Partial<FuturePayment>) => Promise<void>;
  calculateRecommendedSavings: () => number;
  distributeAutoSavings: (amount: number) => void;
}

// Create store
export const useStore = create<Store>((set, get) => ({
  ...defaultStore,

  loadFromCloud: async () => {
    try {
      const settings = await getUserSettings();

      if (settings.storageType !== StorageType.CLOUD) {
        console.error("Cloud storage is required");
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      const user = session?.session?.user;

      if (!user) {
        console.error("No authenticated user");
        return;
      }

      const store = await getSupabaseStore();
      if (store) {
        set(store);
      }

    } catch (error) {
      console.error("Error loading from cloud:", error);
    }
  },

  saveToCloud: async () => {
    try {
      const settings = await getUserSettings();

      if (settings.storageType !== StorageType.CLOUD) {
        console.error("Cloud storage is required");
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      const user = session?.session?.user;

      if (!user) {
        console.error("No authenticated user");
        return;
      }

      const store = get();

      // Save all data to Supabase
      await Promise.all([
        updateSupabaseBudget(store.monthlyBudget),
        ...store.additionalIncomes.map(income =>
          addSupabaseIncome({ description: income.description, amount: income.amount })
        ),
        ...store.categories.map(category =>
          addSupabaseCategory({ name: category.name, color: category.color, budget: category.budget, isRecurring: category.isRecurring })
        ),
        ...store.expenses.map(expense =>
          addSupabaseExpense({ ...expense, id: expense.id })
        ),
        ...store.savingsGoals.map(goal =>
          addSupabaseSavingsGoal({ name: goal.name, targetAmount: goal.targetAmount, currentAmount: goal.currentAmount, deadline: goal.deadline, color: goal.color })
        ),
        ...store.futurePayments.map(payment =>
          addSupabaseFuturePayment({ ...payment, id: payment.id })
        )
      ]);

    } catch (error) {
      console.error("Error saving to cloud:", error);
    }
  },

  updateMonthlyBudget: async (amount: number) => {
    const store = get();
    set({ ...store, monthlyBudget: amount });
    await get().saveToCloud();
  },

  addIncome: async (income: Omit<Income, "id" | "date">) => {
    const store = get();
    const newIncome: Income = {
      ...income,
      id: generateId(),
      date: new Date().toISOString(),
    };
    set({
      ...store,
      additionalIncomes: [...store.additionalIncomes, newIncome]
    });
    await get().saveToCloud();
  },

  deleteIncome: async (id: string) => {
    const store = get();
    set({
      ...store,
      additionalIncomes: store.additionalIncomes.filter(income => income.id !== id)
    });
    await get().saveToCloud();
  },

  addCategory: async (category: Omit<Category, "id">) => {
    const store = get();
    const newCategory: Category = {
      ...category,
      id: generateId()
    };
    set({
      ...store,
      categories: [...store.categories, newCategory]
    });
    await get().saveToCloud();
  },

  updateCategory: async (id: string, updates: Partial<Category>) => {
    const store = get();
    set({
      ...store,
      categories: store.categories.map((cat: Category) =>
        cat.id === id ? { ...cat, ...updates } : cat
      )
    });
    await get().saveToCloud();
  },

  deleteCategory: async (id: string) => {
    const store = get();
    set({
      ...store,
      categories: store.categories.filter((cat: Category) => cat.id !== id)
    });
    await get().saveToCloud();
  },

  addExpense: async (expense: ExpenseInput) => {
    const store = get();
    const categoryExists = store.categories.some((cat: Category) => cat.name === expense.category);

    if (!categoryExists) {
      const newCategory: Category = {
        id: generateId(),
        name: expense.category,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        budget: expense.amount,
      };

      await get().addCategory(newCategory);
    }

    const newExpense: Expense = {
      ...expense,
      id: expense.id || generateId(),
      date: new Date().toISOString(),
    };

    set({
      ...store,
      expenses: [...store.expenses, newExpense]
    });

    await get().saveToCloud();
  },

  deleteExpense: async (id: string) => {
    const store = get();
    set({
      ...store,
      expenses: store.expenses.filter((exp: Expense) => exp.id !== id)
    });
    await get().saveToCloud();
  },

  addSavingsGoal: async (goal: Omit<SavingsGoal, "id">) => {
    const store = get();
    const newGoal: SavingsGoal = {
      ...goal,
      id: generateId()
    };
    set({
      ...store,
      savingsGoals: [...store.savingsGoals, newGoal]
    });
    await get().saveToCloud();
  },

  updateSavingsGoal: async (id: string, updates: Partial<SavingsGoal>) => {
    const store = get();
    set({
      ...store,
      savingsGoals: store.savingsGoals.map((goal: SavingsGoal) =>
        goal.id === id ? { ...goal, ...updates } : goal
      )
    });
    await get().saveToCloud();
  },

  deleteSavingsGoal: async (id: string) => {
    const store = get();
    set({
      ...store,
      savingsGoals: store.savingsGoals.filter((goal: SavingsGoal) => goal.id !== id)
    });
    await get().saveToCloud();
  },

  addFuturePayment: async (payment: Omit<FuturePayment, "id" | "isPaid">) => {
    const store = get();
    const categoryExists = store.categories.some((cat: Category) => cat.name === payment.category);

    if (!categoryExists) {
      const newCategory: Category = {
        id: generateId(),
        name: payment.category,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        budget: payment.amount,
      };

      await get().addCategory(newCategory);
    }

    const newPayment: FuturePayment = {
      ...payment,
      id: generateId(),
      isPaid: false
    };

    set({
      ...store,
      futurePayments: [...store.futurePayments, newPayment]
    });

    await get().saveToCloud();
  },

  updateFuturePayment: async (id: string, updates: Partial<FuturePayment>) => {
    const store = get();
    set({
      ...store,
      futurePayments: store.futurePayments.map((payment: FuturePayment) =>
        payment.id === id ? { ...payment, ...updates } : payment
      )
    });
    await get().saveToCloud();
  },

  calculateRecommendedSavings: () => {
    const store = get();
    const totalIncome = store.monthlyBudget +
      (store.additionalIncomes || []).reduce((sum: number, inc: Income) => sum + (inc.amount || 0), 0);

    const totalExpenses = (store.expenses || []).reduce(
      (sum: number, exp: Expense) => sum + (exp.amount || 0),
      0
    );

    return Math.max(0, totalIncome - totalExpenses);
  },

  distributeAutoSavings: (amount: number) => {
    const store = get();
    const totalNeeded = store.savingsGoals.reduce(
      (sum: number, goal: SavingsGoal) => sum + (goal.targetAmount - goal.currentAmount),
      0
    );

    if (totalNeeded <= 0) return;

    const updatedGoals = store.savingsGoals.map((goal: SavingsGoal) => {
      const needed = goal.targetAmount - goal.currentAmount;
      if (needed <= 0) return goal;

      const proportion = needed / totalNeeded;
      const allocation = amount * proportion;

      return {
        ...goal,
        currentAmount: goal.currentAmount + allocation
      };
    });

    set({
      ...store,
      savingsGoals: updatedGoals
    });
  }
}));

// Helper functions for backward compatibility
export const getStore = () => useStore.getState();
export const setStore = (newState: Partial<Store>) => useStore.setState(newState);
export const getStoreSynced = () => useStore.getState();
export const calculateRecommendedSavings = () => useStore.getState().calculateRecommendedSavings();
export const syncLocalToSupabase = async () => {
  await useStore.getState().saveToCloud();
};
