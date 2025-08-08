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

export interface Debt {
  id: string;
  name: string;
  creditor: string;
  totalAmount: number;
  remainingAmount: number;
  interestRate?: number;
  minimumPayment: number;
  dueDate: string;
  createdDate: string;
  color: string;
  type: "credit_card" | "loan" | "mortgage" | "student_loan" | "personal" | "other";
  description?: string;
}

export interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;
  date: string;
  type: "minimum" | "extra" | "payoff";
  description?: string;
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
  debts: Debt[];
  debtPayments: DebtPayment[];
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
  debts: [],
  debtPayments: [],
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
  addDebt: (debt: Omit<Debt, "id" | "createdDate">) => Promise<void>;
  updateDebt: (id: string, updates: Partial<Debt>) => Promise<void>;
  deleteDebt: (id: string) => Promise<void>;
  makeDebtPayment: (payment: Omit<DebtPayment, "id" | "date">) => Promise<void>;
  getDebtPayments: (debtId: string) => DebtPayment[];
  calculateDebtStatistics: () => {
    totalDebt: number;
    totalMinimumPayments: number;
    totalInterest: number;
    debtToIncomeRatio: number;
    payoffProjections: { debtId: string; monthsToPayoff: number; totalInterest: number }[];
  };
  calculateRecommendedSavings: () => number;
  distributeAutoSavings: (amount: number) => void;
  allocateFundsToGoal: (goalId: string, amount: number) => Promise<void>;
  resetStore: () => void;
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
        console.log("Cloud storage not enabled, skipping save to cloud");
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      const user = session?.session?.user;

      if (!user) {
        console.log("No authenticated user, skipping save to cloud");
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
    
    try {
      await get().saveToCloud();
    } catch (error) {
      console.log("Cloud save failed (expected during testing):", error);
    }
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

      // Add category directly to avoid recursive calls
      const currentStore = get();
      set({
        ...currentStore,
        categories: [...currentStore.categories, newCategory]
      });
    }

    const newExpense: Expense = {
      ...expense,
      id: expense.id || generateId(),
      date: new Date().toISOString(),
    };

    set({
      ...get(),
      expenses: [...get().expenses, newExpense]
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
  },

  allocateFundsToGoal: async (goalId: string, amount: number) => {
    const store = get();
    
    // Find the goal to update
    const goalIndex = store.savingsGoals.findIndex(goal => goal.id === goalId);
    if (goalIndex === -1) {
      throw new Error("Savings goal not found");
    }
    
    // Calculate available balance (total income - expenses)
    const totalIncome = store.monthlyBudget + 
      (store.additionalIncomes || []).reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = (store.expenses || []).reduce((sum, exp) => sum + exp.amount, 0);
    const availableBalance = totalIncome - totalExpenses;
    
    if (amount > availableBalance) {
      throw new Error("Insufficient available balance");
    }
    
    // Update the savings goal
    const updatedGoals = [...store.savingsGoals];
    updatedGoals[goalIndex] = {
      ...updatedGoals[goalIndex],
      currentAmount: updatedGoals[goalIndex].currentAmount + amount
    };
    
    // Create a record of this allocation as an expense
    const allocationExpense: Expense = {
      id: generateId(),
      description: `Savings allocation to ${updatedGoals[goalIndex].name}`,
      amount: amount,
      category: "Savings",
      date: new Date().toISOString(),
    };
    
    // Ensure Savings category exists
    let categories = store.categories;
    const savingsCategoryExists = categories.some(cat => cat.name === "Savings");
    if (!savingsCategoryExists) {
      const savingsCategory: Category = {
        id: generateId(),
        name: "Savings",
        color: "#10B981",
        budget: 0,
        isRecurring: false,
      };
      categories = [...categories, savingsCategory];
    }
    
    // Update the store
    set({
      ...store,
      savingsGoals: updatedGoals,
      expenses: [...store.expenses, allocationExpense],
      categories: categories
    });
    
    await get().saveToCloud();
  },

  addDebt: async (debt: Omit<Debt, "id" | "createdDate">) => {
    const store = get();
    const newDebt: Debt = {
      ...debt,
      id: generateId(),
      createdDate: new Date().toISOString()
    };
    
    set({
      ...store,
      debts: [...store.debts, newDebt]
    });
    
    await get().saveToCloud();
  },

  updateDebt: async (id: string, updates: Partial<Debt>) => {
    const store = get();
    set({
      ...store,
      debts: store.debts.map((debt: Debt) => 
        debt.id === id ? { ...debt, ...updates } : debt
      )
    });
    
    await get().saveToCloud();
  },

  deleteDebt: async (id: string) => {
    const store = get();
    set({
      ...store,
      debts: store.debts.filter((debt: Debt) => debt.id !== id),
      debtPayments: store.debtPayments.filter((payment: DebtPayment) => payment.debtId !== id)
    });
    
    await get().saveToCloud();
  },

  makeDebtPayment: async (payment: Omit<DebtPayment, "id" | "date">) => {
    const store = get();
    
    const debtIndex = store.debts.findIndex(debt => debt.id === payment.debtId);
    if (debtIndex === -1) {
      throw new Error("Debt not found");
    }
    
    const debt = store.debts[debtIndex];
    const newRemainingAmount = Math.max(0, debt.remainingAmount - payment.amount);
    
    const newDebtPayment: DebtPayment = {
      ...payment,
      id: generateId(),
      date: new Date().toISOString()
    };
    
    // Update debt remaining amount
    const updatedDebts = [...store.debts];
    updatedDebts[debtIndex] = {
      ...debt,
      remainingAmount: newRemainingAmount
    };
    
    // Record payment as expense
    const paymentExpense: Expense = {
      id: generateId(),
      description: `Debt payment: ${debt.name}`,
      amount: payment.amount,
      category: "Debt Payment",
      date: new Date().toISOString(),
    };
    
    // Ensure Debt Payment category exists
    let categories = store.categories;
    const debtCategoryExists = categories.some(cat => cat.name === "Debt Payment");
    if (!debtCategoryExists) {
      const debtCategory: Category = {
        id: generateId(),
        name: "Debt Payment",
        color: "#EF4444",
        budget: 0,
        isRecurring: false,
      };
      categories = [...categories, debtCategory];
    }
    
    set({
      ...store,
      debts: updatedDebts,
      debtPayments: [...store.debtPayments, newDebtPayment],
      expenses: [...store.expenses, paymentExpense],
      categories: categories
    });
    
    await get().saveToCloud();
  },

  getDebtPayments: (debtId: string) => {
    const store = get();
    return store.debtPayments.filter(payment => payment.debtId === debtId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  calculateDebtStatistics: () => {
    const store = get();
    const totalIncome = store.monthlyBudget + 
      (store.additionalIncomes || []).reduce((sum, income) => sum + income.amount, 0);
    
    const totalDebt = store.debts.reduce((sum, debt) => sum + debt.remainingAmount, 0);
    const totalMinimumPayments = store.debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    
    const totalInterest = store.debts.reduce((sum, debt) => {
      const monthlyRate = (debt.interestRate || 0) / 100 / 12;
      return sum + (debt.remainingAmount * monthlyRate);
    }, 0);
    
    const debtToIncomeRatio = totalIncome > 0 ? (totalMinimumPayments / totalIncome) * 100 : 0;
    
    // Calculate payoff projections (simplified - paying minimum only)
    const payoffProjections = store.debts.map(debt => {
      if (debt.minimumPayment <= 0 || debt.remainingAmount <= 0) {
        return { debtId: debt.id, monthsToPayoff: 0, totalInterest: 0 };
      }
      
      const monthlyRate = (debt.interestRate || 0) / 100 / 12;
      let balance = debt.remainingAmount;
      let totalInterestPaid = 0;
      let months = 0;
      const maxMonths = 600; // 50 years max to prevent infinite loops
      
      while (balance > 0 && months < maxMonths) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = Math.max(0, debt.minimumPayment - interestPayment);
        
        if (principalPayment <= 0) {
          // Minimum payment doesn't cover interest - debt will never be paid off
          return { debtId: debt.id, monthsToPayoff: -1, totalInterest: -1 };
        }
        
        totalInterestPaid += interestPayment;
        balance -= principalPayment;
        months++;
        
        if (balance < 0.01) break; // Close enough to zero
      }
      
      return { 
        debtId: debt.id, 
        monthsToPayoff: months >= maxMonths ? -1 : months, 
        totalInterest: totalInterestPaid 
      };
    });
    
    return {
      totalDebt,
      totalMinimumPayments,
      totalInterest,
      debtToIncomeRatio,
      payoffProjections
    };
  },

  resetStore: () => {
    console.log("Resetting store to default state");
    set(defaultStore);
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
