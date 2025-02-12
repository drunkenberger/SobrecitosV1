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
  ],
  expenses: [],
  savingsGoals: [],
  futurePayments: [],
};

// Store Functions
export const getStore = (): BudgetStore => {
  try {
    const stored = localStorage.getItem("budget_store");
    return stored ? JSON.parse(stored) : defaultStore;
  } catch {
    return defaultStore;
  }
};

export const setStore = (store: BudgetStore) => {
  localStorage.setItem("budget_store", JSON.stringify(store));
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
  setStore(store);
};

export const addExpense = (expense: Omit<Expense, "id" | "date">) => {
  const store = getStore();
  store.expenses.push({
    ...expense,
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString(),
  });
  setStore(store);
};

export const deleteExpense = (id: string) => {
  const store = getStore();
  store.expenses = store.expenses.filter((expense) => expense.id !== id);
  setStore(store);
};

export const addSavingsGoal = (goal: Omit<SavingsGoal, "id">) => {
  const store = getStore();
  store.savingsGoals.push({
    ...goal,
    id: Math.random().toString(36).substr(2, 9),
  });
  setStore(store);
};

export const updateSavingsGoal = (
  id: string,
  updates: Partial<SavingsGoal>,
) => {
  const store = getStore();
  store.savingsGoals = store.savingsGoals.map((goal) =>
    goal.id === id ? { ...goal, ...updates } : goal,
  );
  setStore(store);
};

export const deleteSavingsGoal = (id: string) => {
  const store = getStore();
  store.savingsGoals = store.savingsGoals.filter((goal) => goal.id !== id);
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
        message: `You've spent ${Math.round(
          (categorySpent / cat.budget) * 100,
        )}% of your ${cat.name} budget`,
        severity: categorySpent > cat.budget ? "high" : "medium",
      });
    }
  });

  return alerts;
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
