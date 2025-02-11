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

interface BudgetStore {
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

// Local Storage Keys
const getStoreKey = (userId: string) => `budget_store_${userId}`;

// Default Data
const defaultStore: BudgetStore = {
  currency: { code: "USD", symbol: "$", name: "US Dollar" },
  monthlyBudget: 2000,
  additionalIncomes: [],
  categories: [
    {
      id: "1",
      name: "Groceries",
      color: "#4CAF50",
      budget: 500,
      isRecurring: false,
    },
    {
      id: "2",
      name: "Utilities",
      color: "#2196F3",
      budget: 300,
      isRecurring: true,
    },
    {
      id: "3",
      name: "Entertainment",
      color: "#9C27B0",
      budget: 200,
      isRecurring: false,
    },
    {
      id: "4",
      name: "Transportation",
      color: "#FF9800",
      budget: 150,
      isRecurring: true,
    },
    {
      id: "5",
      name: "Shopping",
      color: "#E91E63",
      budget: 250,
      isRecurring: false,
    },
  ],
  expenses: [],
  savingsGoals: [
    {
      id: "1",
      name: "Emergency Fund",
      targetAmount: 5000,
      currentAmount: 2000,
      deadline: new Date("2024-12-31").toISOString(),
      color: "#4CAF50",
    },
    {
      id: "2",
      name: "Vacation",
      targetAmount: 3000,
      currentAmount: 500,
      deadline: new Date("2024-08-31").toISOString(),
      color: "#2196F3",
    },
  ],
  futurePayments: [
    {
      id: "1",
      description: "Rent Payment",
      amount: 1200,
      dueDate: new Date("2024-03-01").toISOString(),
      category: "Housing",
      isPaid: false,
    },
    {
      id: "2",
      description: "Car Insurance",
      amount: 150,
      dueDate: new Date("2024-03-15").toISOString(),
      category: "Insurance",
      isPaid: false,
    },
  ],
};

// Store Functions
export const getStore = (): BudgetStore => {
  try {
    const currentUser = JSON.parse(
      localStorage.getItem("budget_current_user") || "null",
    );
    if (!currentUser) return defaultStore;

    const stored = localStorage.getItem(getStoreKey(currentUser.id));
    if (!stored) return defaultStore;

    const parsedStore = JSON.parse(stored);
    if (!parsedStore.savingsGoals) {
      parsedStore.savingsGoals = [];
    }
    if (!parsedStore.futurePayments) {
      parsedStore.futurePayments = [];
    }
    return parsedStore;
  } catch (error) {
    console.error("Error getting store:", error);
    return defaultStore;
  }
};

export const setStore = (store: BudgetStore) => {
  try {
    const currentUser = JSON.parse(
      localStorage.getItem("budget_current_user") || "null",
    );
    if (!currentUser) return;

    localStorage.setItem(getStoreKey(currentUser.id), JSON.stringify(store));
  } catch (error) {
    console.error("Error setting store:", error);
  }
};

// Helper Functions
export const updateMonthlyBudget = (amount: number) => {
  const store = getStore();
  store.monthlyBudget = amount;
  setStore(store);
};

export const addIncome = (income: Omit<Income, "id" | "date">) => {
  const store = getStore();
  store.additionalIncomes.push({
    ...income,
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString(),
  });
  setStore(store);
};

export const deleteIncome = (id: string) => {
  const store = getStore();
  store.additionalIncomes = store.additionalIncomes.filter(
    (income) => income.id !== id,
  );
  setStore(store);
};

export const addCategory = (category: Omit<Category, "id">) => {
  const store = getStore();
  store.categories.push({
    ...category,
    id: Math.random().toString(36).substr(2, 9),
  });
  setStore(store);
};

export const updateCategory = (id: string, updates: Partial<Category>) => {
  const store = getStore();
  store.categories = store.categories.map((cat) =>
    cat.id === id ? { ...cat, ...updates } : cat,
  );
  setStore(store);
};

export const deleteCategory = (id: string) => {
  const store = getStore();
  store.categories = store.categories.filter((cat) => cat.id !== id);
  store.expenses = store.expenses.filter((exp) => exp.category !== id);
  setStore(store);
};

export const addExpense = (expense: Omit<Expense, "id" | "date">) => {
  const store = getStore();
  const newExpense = {
    ...expense,
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString(),
    currency: expense.currency || store.currency,
  };

  if (expense.isRecurring) {
    if (expense.recurringType === "monthly") {
      newExpense.recurringDay = new Date().getDate();
    } else if (expense.recurringType === "weekly") {
      newExpense.recurringDay = new Date().getDay();
    }
  }

  store.expenses.push(newExpense);
  setStore(store);

  if (expense.isRecurring) {
    scheduleRecurringExpense(newExpense);
  }
};

export const deleteExpense = (id: string) => {
  const store = getStore();
  store.expenses = store.expenses.filter((expense) => expense.id !== id);
  setStore(store);
};

const scheduleRecurringExpense = (expense: Expense) => {
  const store = getStore();
  const today = new Date();
  let nextDate: Date;

  if (expense.recurringType === "monthly") {
    nextDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      expense.recurringDay,
    );
  } else {
    // Weekly: Add 7 days to current date
    nextDate = new Date(today);
    nextDate.setDate(today.getDate() + 7);
  }

  const nextExpense = {
    ...expense,
    id: Math.random().toString(36).substr(2, 9),
    date: nextDate.toISOString(),
  };

  store.expenses.push(nextExpense);
  setStore(store);
};

export const addFuturePayment = (
  payment: Omit<FuturePayment, "id" | "isPaid">,
) => {
  const store = getStore();
  store.futurePayments.push({
    ...payment,
    id: Math.random().toString(36).substr(2, 9),
    isPaid: false,
  });
  setStore(store);
};

export const updateFuturePayment = (
  id: string,
  updates: Partial<FuturePayment>,
) => {
  const store = getStore();
  store.futurePayments = store.futurePayments.map((payment) =>
    payment.id === id ? { ...payment, ...updates } : payment,
  );
  setStore(store);
};

export const deleteFuturePayment = (id: string) => {
  const store = getStore();
  store.futurePayments = store.futurePayments.filter(
    (payment) => payment.id !== id,
  );
  setStore(store);
};

export const calculateRecommendedSavings = () => {
  const store = getStore();
  const totalIncome =
    store.monthlyBudget +
    store.additionalIncomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = store.expenses.reduce(
    (sum, exp) => sum + exp.amount,
    0,
  );

  const targetSavingsRate = 0.2;
  const availableForSavings = totalIncome - totalExpenses;
  const recommendedSavings = Math.min(
    availableForSavings,
    totalIncome * targetSavingsRate,
  );

  return {
    recommendedSavings,
    availableForSavings,
    totalIncome,
    savingsPercentage: (recommendedSavings / totalIncome) * 100,
  };
};

export const distributeAutoSavings = (amount: number) => {
  const store = getStore();
  const sortedGoals = [...store.savingsGoals].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
  );

  let remainingAmount = amount;

  sortedGoals.forEach((goal) => {
    if (remainingAmount <= 0) return;

    const remaining = goal.targetAmount - goal.currentAmount;
    if (remaining <= 0) return;

    const allocation = Math.min(remainingAmount, remaining);
    updateSavingsGoal(goal.id, {
      currentAmount: goal.currentAmount + allocation,
    });
    remainingAmount -= allocation;
  });

  return amount - remainingAmount;
};

export const addSavingsGoal = (goal: Omit<SavingsGoal, "id">) => {
  const store = getStore();
  if (!store.savingsGoals) {
    store.savingsGoals = [];
  }
  const newGoal = {
    ...goal,
    id: Math.random().toString(36).substr(2, 9),
  };
  store.savingsGoals.push(newGoal);
  setStore(store);
  return newGoal;
};

export const updateSavingsGoal = (
  id: string,
  updates: Partial<SavingsGoal>,
) => {
  const store = getStore();
  if (!store.savingsGoals) {
    store.savingsGoals = [];
    return;
  }
  store.savingsGoals = store.savingsGoals.map((goal) =>
    goal.id === id ? { ...goal, ...updates } : goal,
  );
  setStore(store);
};

export const deleteSavingsGoal = (id: string) => {
  const store = getStore();
  if (!store.savingsGoals) {
    store.savingsGoals = [];
    return;
  }
  store.savingsGoals = store.savingsGoals.filter((goal) => goal.id !== id);
  setStore(store);
};

export const getBudgetAlerts = () => {
  const store = getStore();
  const alerts = [];

  const totalSpent = store.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalBudget =
    store.monthlyBudget +
    store.additionalIncomes.reduce((sum, inc) => sum + inc.amount, 0);

  if (totalSpent > totalBudget * 0.9) {
    alerts.push({
      type: "overall",
      message: `You've spent ${Math.round((totalSpent / totalBudget) * 100)}% of your total budget`,
      severity: totalSpent > totalBudget ? "high" : "medium",
    });
  }

  store.categories.forEach((cat) => {
    const categorySpent = store.expenses
      .filter((exp) => exp.category === cat.name)
      .reduce((sum, exp) => sum + exp.amount, 0);

    if (categorySpent > cat.budget * 0.9) {
      alerts.push({
        type: "category",
        category: cat.name,
        message: `You've spent ${Math.round((categorySpent / cat.budget) * 100)}% of your ${cat.name} budget`,
        severity: categorySpent > cat.budget ? "high" : "medium",
      });
    }
  });

  return alerts;
};
