import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { getBudgetAlerts } from "@/lib/store";

const BudgetAlerts = () => {
  const alerts = getBudgetAlerts();

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert, index) => (
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
            {alert.type === "overall"
              ? "Budget Alert"
              : `${alert.category} Alert`}
          </AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default BudgetAlerts;
