import React from "react";
import ExpenseChart from "./ExpenseChart";

interface ExpenseOverviewProps {
  chartData?: {
    category: string;
    amount: number;
  }[];
  selectedView?: "pie" | "bar";
  selectedTimeframe?: "week" | "month" | "year";
}

const defaultChartData = [
  { category: "Groceries", amount: 500 },
  { category: "Utilities", amount: 300 },
  { category: "Entertainment", amount: 200 },
];

const ExpenseOverview: React.FC<ExpenseOverviewProps> = ({
  chartData = defaultChartData,
  selectedView = "pie",
  selectedTimeframe = "month",
}) => {
  return (
    <div className="space-y-6">
      <ExpenseChart
        data={chartData}
        selectedView={selectedView}
        selectedTimeframe={selectedTimeframe}
      />
    </div>
  );
};

export default ExpenseOverview;
