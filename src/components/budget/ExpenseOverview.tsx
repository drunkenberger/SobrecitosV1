import React from "react";
import ExpenseChart from "./ExpenseChart";
import ExpenseList from "./ExpenseList";

interface ExpenseOverviewProps {
  chartData?: {
    category: string;
    amount: number;
  }[];
  selectedView?: "pie" | "bar";
  selectedTimeframe?: "week" | "month" | "year";
  expenses?: {
    id: string;
    amount: number;
    category: string;
    description: string;
    date: Date;
  }[];
  onDeleteExpense?: (id: string) => void;
}

const defaultChartData = [
  { category: "Groceries", amount: 500 },
  { category: "Utilities", amount: 300 },
  { category: "Entertainment", amount: 200 },
  { category: "Transportation", amount: 150 },
  { category: "Shopping", amount: 250 },
];

const defaultExpenses = [
  {
    id: "1",
    amount: 85.5,
    category: "Groceries",
    description: "Weekly groceries from Walmart",
    date: new Date("2024-03-15"),
  },
  {
    id: "2",
    amount: 120.0,
    category: "Utilities",
    description: "Electricity bill",
    date: new Date("2024-03-14"),
  },
  {
    id: "3",
    amount: 45.0,
    category: "Kids' Activities",
    description: "Swimming lessons",
    date: new Date("2024-03-13"),
  },
];

const ExpenseOverview: React.FC<ExpenseOverviewProps> = ({
  chartData = defaultChartData,
  selectedView = "pie",
  selectedTimeframe = "month",
  expenses = defaultExpenses,
  onDeleteExpense,
}) => {
  return (
    <div className="w-full h-[400px] bg-gray-50 p-4">
      <ExpenseChart
        data={chartData}
        selectedView={selectedView}
        selectedTimeframe={selectedTimeframe}
      />
    </div>
  );
};

export default ExpenseOverview;
