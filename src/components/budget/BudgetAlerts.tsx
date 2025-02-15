import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { getBudgetAlerts } from "@/lib/store";
import { useTranslation } from 'react-i18next';

const BudgetAlerts = () => {
  const { t } = useTranslation();
  const alerts = getBudgetAlerts();

  if (alerts.length === 0) return null;

  // Helper function to get the translation key for a category
  const getCategoryTranslationKey = (category: string) => {
    // Map English category names to their translation keys
    const categoryMap: Record<string, string> = {
      'Utilities': 'utilities',
      'Health': 'salud',
      'Healthcare': 'salud',
      'Medical': 'salud',
      'Salad': 'salad',
      'Groceries': 'groceries',
      'Entertainment': 'entertainment',
      'Housing': 'housing',
      'Transportation': 'transportation',
      'Education': 'education',
      'Savings': 'savings',
      'Other': 'other'
    };
    
    // Convert to lowercase for case-insensitive matching
    const normalizedCategory = category.toLowerCase();
    const key = Object.entries(categoryMap).find(
      ([eng]) => eng.toLowerCase() === normalizedCategory
    )?.[1];
    
    return key || normalizedCategory;
  };

  return (
    <div className="space-y-2">
      {alerts.map((alert, index) => {
        const categoryKey = alert.type === 'category' ? getCategoryTranslationKey(alert.category) : 'overall';
        
        // Get the percentage from the alert data
        const percentage = alert.percentage;
        
        // Create the message by replacing the placeholder directly
        const message = t(`dashboard.alerts.${categoryKey}.message`).replace('{percent}', percentage.toString());
        
        return (
          <Alert
            key={index}
            variant={alert.severity === "high" ? "destructive" : "default"}
            className={alert.severity === "medium" ? "border-yellow-500" : ""}
          >
            {alert.severity === "high" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertTitle>
              {t(`dashboard.alerts.${categoryKey}.title`)}
            </AlertTitle>
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
        );
      })}
    </div>
  );
};

export default BudgetAlerts;
