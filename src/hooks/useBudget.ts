import { useMemo } from 'react';
import { useStore } from '@/lib/store';
import { logger } from '@/lib/logger';

/**
 * Custom hook for budget calculations and insights
 */
export function useBudget() {
  const {
    monthlyBudget,
    additionalIncomes,
    expenses,
    categories,
    savingsGoals,
    futurePayments,
    debts,
  } = useStore();

  const calculations = useMemo(() => {
    logger.debug('Recalculating budget insights');

    // Total Income
    const totalIncome = monthlyBudget +
      additionalIncomes.reduce((sum, income) => sum + income.amount, 0);

    // Total Expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Available Balance
    const availableBalance = totalIncome - totalExpenses;

    // Budget by Category
    const budgetByCategory = categories.map(category => ({
      ...category,
      spent: expenses
        .filter(exp => exp.category === category.id || exp.category === category.name)
        .reduce((sum, exp) => sum + exp.amount, 0),
      remaining: category.budget - expenses
        .filter(exp => exp.category === category.id || exp.category === category.name)
        .reduce((sum, exp) => sum + exp.amount, 0),
      percentUsed: category.budget > 0
        ? (expenses
            .filter(exp => exp.category === category.id || exp.category === category.name)
            .reduce((sum, exp) => sum + exp.amount, 0) / category.budget) * 100
        : 0,
    }));

    // Savings Progress
    const savingsProgress = {
      total: savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0),
      target: savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0),
      percentage: savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0) > 0
        ? (savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0) /
            savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)) * 100
        : 0,
    };

    // Upcoming Obligations
    const upcomingPayments = futurePayments
      .filter(payment => !payment.isPaid)
      .reduce((sum, payment) => sum + payment.amount, 0);

    const totalDebtPayments = debts
      .reduce((sum, debt) => sum + debt.minimumPayment, 0);

    const totalObligations = upcomingPayments + totalDebtPayments;

    // Financial Health Score (0-100)
    const healthScore = calculateHealthScore({
      availableBalance,
      totalIncome,
      totalExpenses,
      savingsRate: totalIncome > 0 ? (savingsProgress.total / totalIncome) * 100 : 0,
      debtToIncomeRatio: totalIncome > 0 ? (totalDebtPayments / totalIncome) * 100 : 0,
    });

    // Recommendations
    const recommendations = generateRecommendations({
      availableBalance,
      totalIncome,
      budgetByCategory,
      savingsProgress,
      totalObligations,
      healthScore,
    });

    return {
      totalIncome,
      totalExpenses,
      availableBalance,
      budgetByCategory,
      savingsProgress,
      upcomingPayments,
      totalDebtPayments,
      totalObligations,
      healthScore,
      recommendations,
    };
  }, [monthlyBudget, additionalIncomes, expenses, categories, savingsGoals, futurePayments, debts]);

  return calculations;
}

function calculateHealthScore(params: {
  availableBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  debtToIncomeRatio: number;
}): number {
  const { availableBalance, totalIncome, totalExpenses, savingsRate, debtToIncomeRatio } = params;

  let score = 100;

  // Penalty for negative balance
  if (availableBalance < 0) {
    score -= 30;
  }

  // Penalty for high expense ratio
  const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 100;
  if (expenseRatio > 90) score -= 20;
  else if (expenseRatio > 80) score -= 10;

  // Reward for savings
  if (savingsRate >= 20) score += 10;
  else if (savingsRate < 5) score -= 10;

  // Penalty for high debt
  if (debtToIncomeRatio > 40) score -= 20;
  else if (debtToIncomeRatio > 20) score -= 10;

  return Math.max(0, Math.min(100, score));
}

function generateRecommendations(params: {
  availableBalance: number;
  totalIncome: number;
  budgetByCategory: any[];
  savingsProgress: any;
  totalObligations: number;
  healthScore: number;
}): string[] {
  const recommendations: string[] = [];

  if (params.availableBalance < 0) {
    recommendations.push('⚠️ Your expenses exceed your income. Review your budget and reduce spending.');
  }

  const overBudgetCategories = params.budgetByCategory.filter(cat => cat.percentUsed > 100);
  if (overBudgetCategories.length > 0) {
    recommendations.push(
      `📊 ${overBudgetCategories.length} categor${overBudgetCategories.length > 1 ? 'ies are' : 'y is'} over budget: ${overBudgetCategories.map(c => c.name).join(', ')}`
    );
  }

  if (params.savingsProgress.percentage < 50) {
    recommendations.push('🎯 Increase your savings contributions to reach your goals faster.');
  }

  if (params.totalObligations > params.totalIncome * 0.5) {
    recommendations.push('💳 Your debt and upcoming payments are high. Consider a debt payoff strategy.');
  }

  if (params.healthScore < 50) {
    recommendations.push('🏥 Your financial health needs attention. Focus on reducing expenses and increasing savings.');
  } else if (params.healthScore >= 80) {
    recommendations.push('✅ Great job! Your financial health is strong. Keep it up!');
  }

  return recommendations;
}
