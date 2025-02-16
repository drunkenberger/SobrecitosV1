import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { getBudgetAlerts } from "@/lib/store";
import { useTranslation } from 'react-i18next';
import type { BudgetAlert } from "@/lib/store";

const BudgetAlerts = () => {
  const { t } = useTranslation();
  const alerts: BudgetAlert[] = getBudgetAlerts();

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert: BudgetAlert, index: number) => {
        const isOverall = alert.type === 'overall';
        const rawCategory = isOverall ? 'overall' : alert.category?.toLowerCase() || 'unknown';
        
        // Ensure we have a valid category key
        const categoryKey = rawCategory === 'unknown' ? 'overall' : rawCategory;

        // Get translations with fallbacks
        const title = t(`dashboard.alerts.${categoryKey}.title`, {
          defaultValue: isOverall ? 'Budget Alert' : `${categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)} Alert`
        });
        
        const message = t(`dashboard.alerts.${categoryKey}.message`, {
          percent: Math.round(alert.percentage),
          defaultValue: `You've spent ${Math.round(alert.percentage)}% of your ${isOverall ? 'total' : categoryKey} budget`
        });

        return (
          <Alert
            key={index}
            variant={alert.severity === "danger" ? "destructive" : "default"}
            className={`flex items-center ${alert.severity === "warning" ? "border-yellow-500" : ""}`}
          >
            {alert.severity === "danger" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <div className="ml-3">
              <AlertTitle className="text-sm font-medium">
                {title}
              </AlertTitle>
              <AlertDescription className="text-sm mt-1">
                {message}
              </AlertDescription>
            </div>
          </Alert>
        );
      })}
    </div>
  );
};

export default BudgetAlerts;
