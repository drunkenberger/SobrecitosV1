import { supabase } from "./supabase";
import { PostgrestError } from '@supabase/supabase-js';
import { 
  BudgetStore,
  Income,
  Category,
  Expense,
  SavingsGoal,
  FuturePayment,
  defaultStore,
  ExpenseInput
} from "./store";

// Storage type enum
export enum StorageType {
  CLOUD = 'cloud'
}

// User settings interface
export interface UserSettings {
  storageType: StorageType;
  syncEnabled: boolean;
  lastSynced?: string;
}

// Default settings
export const defaultUserSettings: UserSettings = {
  storageType: StorageType.CLOUD,
  syncEnabled: true,
  lastSynced: new Date().toISOString()
};

// Get user settings
export const getUserSettings = async (): Promise<UserSettings> => {
  try {
    const { data } = await supabase.auth.getSession();
    const user = data?.session?.user;

    if (!user) {
      console.log("No authenticated user, returning default settings");
      return defaultUserSettings;
    }

    const { data: settings, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.log("User settings not found, creating new settings");
      
      // Create user settings if they don't exist
      const newSettings = {
        id: user.id,
        storage_type: StorageType.CLOUD,
        sync_enabled: true,
        last_synced: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { error: insertError } = await supabase
        .from("user_settings")
        .insert(newSettings);
        
      if (insertError) {
        console.error("Error creating user settings:", insertError);
      } else {
        console.log("Created new user settings with CLOUD storage");
      }
      
      return defaultUserSettings;
    }

    return {
      storageType: StorageType.CLOUD,
      syncEnabled: settings.sync_enabled,
      lastSynced: settings.last_synced
    };
  } catch (error) {
    console.error("Error in getUserSettings:", error);
    return defaultUserSettings;
  }
};

// Save user settings
export const saveUserSettings = async (settings: UserSettings): Promise<void> => {
  try {
    const { data } = await supabase.auth.getSession();
    const user = data?.session?.user;

    if (!user) {
      console.error("No authenticated user to save settings for");
      return;
    }

    const { error } = await supabase
      .from("user_settings")
      .upsert({
        id: user.id,
        storage_type: StorageType.CLOUD,
        sync_enabled: settings.syncEnabled,
        last_synced: settings.lastSynced || new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error("Error saving user settings:", error);
    }
  } catch (error) {
    console.error("Error in saveUserSettings:", error);
  }
};

// Get budget from Supabase
export const getSupabaseBudget = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from("budgets")
      .select("monthly_budget")
      .single();

    if (error) {
      console.error("Error fetching budget:", error);
      return defaultStore.monthlyBudget;
    }

    return data.monthly_budget;
  } catch (error) {
    console.error("Error in getSupabaseBudget:", error);
    return defaultStore.monthlyBudget;
  }
};

// Update budget in Supabase
export const updateSupabaseBudget = async (amount: number): Promise<void> => {
  try {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    
    if (!user) throw new Error("User not authenticated");

    // Check if a budget record exists
    const { data: budgetData, error: selectError } = await supabase
      .from("budgets")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (selectError && selectError.code !== "PGRST116") { // PGRST116 is "not found"
      console.error("Error checking budget:", selectError);
      return;
    }

    if (budgetData) {
      // Update existing budget
      const { error } = await supabase
        .from("budgets")
        .update({
          monthly_budget: amount,
          updated_at: new Date().toISOString()
        })
        .eq("id", budgetData.id);

      if (error) {
        console.error("Error updating budget:", error);
      }
    } else {
      // Create new budget
      const { error } = await supabase
        .from("budgets")
        .insert({
          user_id: user.id,
          monthly_budget: amount
        });

      if (error) {
        console.error("Error creating budget:", error);
      }
    }
  } catch (error) {
    console.error("Error in updateSupabaseBudget:", error);
  }
};

// Get incomes from Supabase
export const getSupabaseIncomes = async (): Promise<Income[]> => {
  try {
    const { data, error } = await supabase
      .from("incomes")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching incomes:", error);
      return [];
    }

    return data.map((income: any) => ({
      id: income.id,
      description: income.description,
      amount: income.amount,
      date: income.date
    }));
  } catch (error) {
    console.error("Error in getSupabaseIncomes:", error);
    return [];
  }
};

// Add income to Supabase
export const addSupabaseIncome = async (income: Omit<Income, "id" | "date">): Promise<void> => {
  try {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase.from("incomes").insert({
      user_id: user.id,
      description: income.description,
      amount: income.amount,
      date: new Date().toISOString()
    });

    if (error) {
      console.error("Error adding income:", error);
    }
  } catch (error) {
    console.error("Error in addSupabaseIncome:", error);
  }
};

// Delete income from Supabase
export const deleteSupabaseIncome = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.from("incomes").delete().eq("id", id);

    if (error) {
      console.error("Error deleting income:", error);
    }
  } catch (error) {
    console.error("Error in deleteSupabaseIncome:", error);
  }
};

// Get categories from Supabase
export const getSupabaseCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      return defaultStore.categories;
    }

    return data.map((category: any) => ({
      id: category.id,
      name: category.name,
      color: category.color,
      budget: category.budget,
      isRecurring: category.is_recurring
    }));
  } catch (error) {
    console.error("Error in getSupabaseCategories:", error);
    return defaultStore.categories;
  }
};

// Add category to Supabase
export const addSupabaseCategory = async (category: Omit<Category, "id">): Promise<void> => {
  try {
    // Updated to Supabase v2
    const { data } = await supabase.auth.getSession();
    const user = data?.session?.user;
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase.from("categories").insert({
      user_id: user.id,
      name: category.name,
      color: category.color,
      budget: category.budget,
      is_recurring: category.isRecurring || false
    });

    if (error) {
      console.error("Error adding category:", error);
    }
  } catch (error) {
    console.error("Error in addSupabaseCategory:", error);
  }
};

// Update category in Supabase
export const updateSupabaseCategory = async (id: string, updates: Partial<Category>): Promise<void> => {
  try {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.color !== undefined) updateData.color = updates.color;
    if (updates.budget !== undefined) updateData.budget = updates.budget;
    if (updates.isRecurring !== undefined) updateData.is_recurring = updates.isRecurring;

    const { error } = await supabase
      .from("categories")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating category:", error);
    }
  } catch (error) {
    console.error("Error in updateSupabaseCategory:", error);
  }
};

// Delete category from Supabase
export const deleteSupabaseCategory = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      console.error("Error deleting category:", error);
    }
  } catch (error) {
    console.error("Error in deleteSupabaseCategory:", error);
  }
};

// Get expenses from Supabase
export const getSupabaseExpenses = async (): Promise<Expense[]> => {
  try {
    const { data: expenses, error: expensesError } = await supabase
      .from("expenses")
      .select(`
        id,
        amount,
        description,
        date,
        is_recurring,
        recurring_type,
        recurring_day,
        categories(name)
      `)
      .order("date", { ascending: false });

    if (expensesError) {
      console.error("Error fetching expenses:", expensesError);
      return [];
    }

    return expenses.map((expense: any) => ({
      id: expense.id,
      amount: expense.amount,
      category: expense.categories?.name || "Uncategorized",
      description: expense.description,
      date: expense.date,
      isRecurring: expense.is_recurring,
      recurringType: expense.recurring_type,
      recurringDay: expense.recurring_day
    }));
  } catch (error) {
    console.error("Error in getSupabaseExpenses:", error);
    return [];
  }
};

// Add expense to Supabase
export const addSupabaseExpense = async (expense: ExpenseInput & { id: string }): Promise<void> => {
  try {
    // Updated to Supabase v2
    const { data } = await supabase.auth.getSession();
    const user = data?.session?.user;
    if (!user) throw new Error("User not authenticated");

    // Get category ID
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("name", expense.category)
      .single();

    if (categoryError && categoryError.code !== "PGRST116") { // PGRST116 is "not found"
      console.error("Error finding category:", categoryError);
      return;
    }

    const { error } = await supabase
      .from("expenses")
      .insert({
        id: expense.id,
        user_id: user.id,
        category_id: categoryData?.id || null,
        description: expense.description,
        amount: expense.amount,
        date: new Date().toISOString()
      }) as { error: PostgrestError | null };

    if (error) {
      console.error("Error adding expense:", error);
    }
  } catch (error) {
    console.error("Error in addSupabaseExpense:", error);
  }
};

// Delete expense from Supabase
export const deleteSupabaseExpense = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.from("expenses").delete().eq("id", id);

    if (error) {
      console.error("Error deleting expense:", error);
    }
  } catch (error) {
    console.error("Error in deleteSupabaseExpense:", error);
  }
};

// Get savings goals from Supabase
export const getSupabaseSavingsGoals = async (): Promise<SavingsGoal[]> => {
  try {
    const { data, error } = await supabase
      .from("savings_goals")
      .select("*")
      .order("deadline");

    if (error) {
      console.error("Error fetching savings goals:", error);
      return [];
    }

    return data.map((goal: any) => ({
      id: goal.id,
      name: goal.name,
      targetAmount: goal.target_amount,
      currentAmount: goal.current_amount,
      deadline: goal.deadline,
      color: goal.color
    }));
  } catch (error) {
    console.error("Error in getSupabaseSavingsGoals:", error);
    return [];
  }
};

// Add savings goal to Supabase
export const addSupabaseSavingsGoal = async (goal: Omit<SavingsGoal, "id">): Promise<void> => {
  try {
    // Updated to Supabase v2
    const { data } = await supabase.auth.getSession();
    const user = data?.session?.user;
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase.from("savings_goals").insert({
      user_id: user.id,
      name: goal.name,
      target_amount: goal.targetAmount,
      current_amount: goal.currentAmount,
      deadline: goal.deadline,
      color: goal.color
    });

    if (error) {
      console.error("Error adding savings goal:", error);
    }
  } catch (error) {
    console.error("Error in addSupabaseSavingsGoal:", error);
  }
};

// Update savings goal in Supabase
export const updateSupabaseSavingsGoal = async (
  id: string,
  updates: Partial<SavingsGoal>
): Promise<void> => {
  try {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.targetAmount !== undefined) updateData.target_amount = updates.targetAmount;
    if (updates.currentAmount !== undefined) updateData.current_amount = updates.currentAmount;
    if (updates.deadline !== undefined) updateData.deadline = updates.deadline;
    if (updates.color !== undefined) updateData.color = updates.color;

    const { error } = await supabase
      .from("savings_goals")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating savings goal:", error);
    }
  } catch (error) {
    console.error("Error in updateSupabaseSavingsGoal:", error);
  }
};

// Delete savings goal from Supabase
export const deleteSupabaseSavingsGoal = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.from("savings_goals").delete().eq("id", id);

    if (error) {
      console.error("Error deleting savings goal:", error);
    }
  } catch (error) {
    console.error("Error in deleteSupabaseSavingsGoal:", error);
  }
};

// Get future payments from Supabase
export const getSupabaseFuturePayments = async (): Promise<FuturePayment[]> => {
  try {
    const { data: payments, error: paymentsError } = await supabase
      .from("future_payments")
      .select(`
        id,
        description,
        amount,
        due_date,
        is_paid,
        categories(name)
      `)
      .order("due_date");

    if (paymentsError) {
      console.error("Error fetching future payments:", paymentsError);
      return [];
    }

    return payments.map((payment: any) => ({
      id: payment.id,
      description: payment.description,
      amount: payment.amount,
      dueDate: payment.due_date,
      category: payment.categories?.name || "Uncategorized",
      isPaid: payment.is_paid
    }));
  } catch (error) {
    console.error("Error in getSupabaseFuturePayments:", error);
    return [];
  }
};

// Add future payment to Supabase
export const addSupabaseFuturePayment = async (
  payment: Omit<FuturePayment, "isPaid"> & { isPaid: boolean }
): Promise<void> => {
  try {
    // Updated to Supabase v2
    const { data } = await supabase.auth.getSession();
    const user = data?.session?.user;
    if (!user) throw new Error("User not authenticated");

    // Get category ID
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("name", payment.category)
      .single();

    if (categoryError && categoryError.code !== "PGRST116") { // PGRST116 is "not found"
      console.error("Error finding category:", categoryError);
      return;
    }

    const { error } = await supabase
      .from("future_payments")
      .insert({
        id: payment.id,
        user_id: user.id,
        category_id: categoryData?.id || null,
        description: payment.description,
        amount: payment.amount,
        due_date: payment.dueDate,
        is_paid: payment.isPaid
      }) as { error: PostgrestError | null };

    if (error) {
      console.error("Error adding future payment:", error);
    }
  } catch (error) {
    console.error("Error in addSupabaseFuturePayment:", error);
  }
};

// Update future payment in Supabase
export const updateSupabaseFuturePayment = async (
  id: string,
  updates: Partial<FuturePayment>
): Promise<void> => {
  try {
    const updateData: any = {};
    
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
    if (updates.isPaid !== undefined) updateData.is_paid = updates.isPaid;
    
    if (updates.category !== undefined) {
      // Get category ID
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", updates.category)
        .single();

      if (categoryError && categoryError.code !== "PGRST116") {
        console.error("Error finding category:", categoryError);
      } else {
        updateData.category_id = categoryData?.id || null;
      }
    }

    const { error } = await supabase
      .from("future_payments")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating future payment:", error);
    }
  } catch (error) {
    console.error("Error in updateSupabaseFuturePayment:", error);
  }
};

// Delete future payment from Supabase
export const deleteSupabaseFuturePayment = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.from("future_payments").delete().eq("id", id);

    if (error) {
      console.error("Error deleting future payment:", error);
    }
  } catch (error) {
    console.error("Error in deleteSupabaseFuturePayment:", error);
  }
};

// Get complete budget store from Supabase
export const getSupabaseStore = async (): Promise<BudgetStore> => {
  try {
    const [
      monthlyBudget,
      additionalIncomes,
      categories,
      expenses,
      savingsGoals,
      futurePayments
    ] = await Promise.all([
      getSupabaseBudget(),
      getSupabaseIncomes(),
      getSupabaseCategories(),
      getSupabaseExpenses(),
      getSupabaseSavingsGoals(),
      getSupabaseFuturePayments()
    ]);

    // Get currency from budgets table
    const { data: budgetData, error: budgetError } = await supabase
      .from("budgets")
      .select("currency_code, currency_symbol, currency_name")
      .single();

    if (budgetError && budgetError.code !== "PGRST116") {
      console.error("Error fetching currency:", budgetError);
    }

    const currency = budgetData ? {
      code: budgetData.currency_code,
      symbol: budgetData.currency_symbol,
      name: budgetData.currency_name
    } : defaultStore.currency;

    return {
      monthlyBudget,
      additionalIncomes,
      categories,
      expenses,
      savingsGoals,
      futurePayments,
      debts: [],
      debtPayments: [],
      investments: [],
      investmentTransactions: [],
      currency
    };
  } catch (error) {
    console.error("Error in getSupabaseStore:", error);
    return defaultStore;
  }
};

// Sync local data to Supabase
export const syncLocalToSupabase = async (): Promise<boolean> => {
  try {
    console.log("Starting syncLocalToSupabase...");
    // Updated to Supabase v2
    const { data } = await supabase.auth.getSession();
    const user = data?.session?.user;
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get local data
    const localData = JSON.parse(localStorage.getItem("budget_store") || "{}");
    console.log("Local data to sync:", localData);
    
    // 1. Update budget
    await updateSupabaseBudget(localData.monthlyBudget || defaultStore.monthlyBudget);
    console.log("Budget updated");
    
    // 2. Get existing data from Supabase to avoid duplications
    const existingCategories = await getSupabaseCategories();
    const existingExpenses = await getSupabaseExpenses();
    const existingIncomes = await getSupabaseIncomes();
    const existingSavingsGoals = await getSupabaseSavingsGoals();
    const existingFuturePayments = await getSupabaseFuturePayments();
    
    console.log("Existing data retrieved for deduplication");
    
    // 3. Sync categories (needed for expenses and future payments)
    if (localData.categories && localData.categories.length > 0) {
      console.log("Syncing categories:", localData.categories.length);
      
      const categoriesToSync = localData.categories.filter((localCat: Category) => 
        !existingCategories.some(existingCat => existingCat.id === localCat.id)
      );
      
      if (categoriesToSync.length > 0) {
        console.log(`Syncing ${categoriesToSync.length} new categories`);
        const categoriesData = categoriesToSync.map((cat: Category) => ({
          id: cat.id,
          user_id: user.id,
          name: cat.name,
          color: cat.color,
          budget: cat.budget,
          is_recurring: cat.isRecurring || false
        }));
        
        const { error: categoriesError } = await supabase
          .from("categories")
          .insert(categoriesData) as { error: PostgrestError | null };
          
        if (categoriesError) {
          console.error("Error inserting categories:", categoriesError);
        } else {
          console.log("Categories synced successfully");
        }
      } else {
        console.log("No new categories to sync");
      }
    }
    
    // 4. Sync incomes
    if (localData.additionalIncomes && localData.additionalIncomes.length > 0) {
      console.log("Checking incomes to sync:", localData.additionalIncomes.length);
      
      const incomesToSync = localData.additionalIncomes.filter((localIncome: Income) => 
        !existingIncomes.some(existingIncome => existingIncome.id === localIncome.id)
      );
      
      if (incomesToSync.length > 0) {
        console.log(`Syncing ${incomesToSync.length} new incomes`);
        const incomesData = incomesToSync.map((income: Income) => ({
          id: income.id,
          user_id: user.id,
          description: income.description,
          amount: income.amount,
          date: income.date
        }));
        
        const { error: incomesError } = await supabase
          .from("incomes")
          .insert(incomesData) as { error: PostgrestError | null };
          
        if (incomesError) {
          console.error("Error inserting incomes:", incomesError);
        } else {
          console.log("Incomes synced successfully");
        }
      } else {
        console.log("No new incomes to sync");
      }
    }
    
    // 5. Sync expenses
    if (localData.expenses && localData.expenses.length > 0) {
      console.log("Checking expenses to sync:", localData.expenses.length);
      
      const expensesToSync = localData.expenses.filter((localExpense: Expense) => 
        !existingExpenses.some(existingExpense => existingExpense.id === localExpense.id)
      );
      
      if (expensesToSync.length > 0) {
        console.log(`Syncing ${expensesToSync.length} new expenses`);
        
        // For each expense, ensure the category exists
        for (const expense of expensesToSync) {
          const categoryId = existingCategories.find(cat => cat.name === expense.category)?.id;
          
          const { error: expenseError } = await supabase
            .from("expenses")
            .insert({
              id: expense.id,
              user_id: user.id,
              category_id: categoryId || null,
              description: expense.description,
              amount: expense.amount,
              date: expense.date
            }) as { error: PostgrestError | null };
          
          if (expenseError) {
            console.error(`Error inserting expense ${expense.description}:`, expenseError);
          }
        }
        console.log("Expenses synced successfully");
      } else {
        console.log("No new expenses to sync");
      }
    }
    
    // 6. Sync savings goals
    if (localData.savingsGoals && localData.savingsGoals.length > 0) {
      console.log("Checking savings goals to sync:", localData.savingsGoals.length);
      
      const goalsToSync = localData.savingsGoals.filter((localGoal: SavingsGoal) => 
        !existingSavingsGoals.some(existingGoal => existingGoal.id === localGoal.id)
      );
      
      if (goalsToSync.length > 0) {
        console.log(`Syncing ${goalsToSync.length} new savings goals`);
        const goalsData = goalsToSync.map((goal: SavingsGoal) => ({
          id: goal.id,
          user_id: user.id,
          name: goal.name,
          target_amount: goal.targetAmount,
          current_amount: goal.currentAmount,
          deadline: goal.deadline,
          color: goal.color
        }));
        
        const { error: goalsError } = await supabase
          .from("savings_goals")
          .insert(goalsData) as { error: PostgrestError | null };
          
        if (goalsError) {
          console.error("Error inserting savings goals:", goalsError);
        } else {
          console.log("Savings goals synced successfully");
        }
      } else {
        console.log("No new savings goals to sync");
      }
    }
    
    // 7. Sync future payments
    if (localData.futurePayments && localData.futurePayments.length > 0) {
      console.log("Checking future payments to sync:", localData.futurePayments.length);
      
      const paymentsToSync = localData.futurePayments.filter((localPayment: FuturePayment) => 
        !existingFuturePayments.some(existingPayment => existingPayment.id === localPayment.id)
      );
      
      if (paymentsToSync.length > 0) {
        console.log(`Syncing ${paymentsToSync.length} new future payments`);
        
        for (const payment of paymentsToSync) {
          const categoryId = existingCategories.find(cat => cat.name === payment.category)?.id;
          
          const { error: paymentError } = await supabase
            .from("future_payments")
            .insert({
              id: payment.id,
              user_id: user.id,
              category_id: categoryId || null,
              description: payment.description,
              amount: payment.amount,
              due_date: payment.dueDate,
              is_paid: payment.isPaid
            }) as { error: PostgrestError | null };
          
          if (paymentError) {
            console.error(`Error inserting future payment ${payment.description}:`, paymentError);
          }
        }
        console.log("Future payments synced successfully");
      } else {
        console.log("No new future payments to sync");
      }
    }
    
    // 8. Update user settings
    await saveUserSettings({
      storageType: StorageType.CLOUD,
      syncEnabled: true,
      lastSynced: new Date().toISOString()
    });
    
    console.log("Sync completed successfully");
    return true;
  } catch (error) {
    console.error("Error in syncLocalToSupabase:", error);
    return false;
  }
};

// Sync Supabase data to local
export const syncSupabaseToLocal = async (): Promise<boolean> => {
  try {
    // Get data from Supabase
    const storeData = await getSupabaseStore();
    
    // Save to localStorage
    localStorage.setItem("budget_store", JSON.stringify(storeData));
    
    // Update user settings with last sync time
    await saveUserSettings({
      storageType: StorageType.CLOUD,
      syncEnabled: true,
      lastSynced: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error("Error in syncSupabaseToLocal:", error);
    return false;
  }
}; 