import React from "react";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Receipt, Clock, X, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { formatDistanceToNow } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  currency?: {
    code: string;
    symbol: string;
    name: string;
  };
}

interface ExpenseListProps {
  expenses?: Expense[];
  onDeleteExpense?: (id: string) => void;
  categories?: Array<{ id: string; name: string; color: string }>;
}

const defaultExpenses: Expense[] = [
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

const ExpenseList = ({
  expenses = defaultExpenses,
  onDeleteExpense,
  categories = [],
}: ExpenseListProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<"date" | "amount">("date");
  const [minAmount, setMinAmount] = React.useState("");
  const [maxAmount, setMaxAmount] = React.useState("");

  const filteredExpenses = expenses
    .filter((expense) => {
      const matchesSearch = expense.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || expense.category === selectedCategory;
      const matchesAmount =
        (!minAmount || expense.amount >= Number(minAmount)) &&
        (!maxAmount || expense.amount <= Number(maxAmount));
      return matchesSearch && matchesCategory && matchesAmount;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return b.date.getTime() - a.date.getTime();
      } else {
        return b.amount - a.amount;
      }
    });

  return (
    <Card className="w-full h-[600px] p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground">
            <Receipt className="w-5 h-5" /> Recent Expenses
          </h2>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as "date" | "amount")}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="amount">Sort by Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min $"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="w-24"
          />
          <Input
            type="number"
            placeholder="Max $"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="w-24"
          />
          {(minAmount ||
            maxAmount ||
            selectedCategory !== "all" ||
            searchTerm) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setMinAmount("");
                setMaxAmount("");
                setSelectedCategory("all");
                setSearchTerm("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <ScrollArea className="h-[420px] w-full">
          <div className="space-y-4">
            {filteredExpenses.map((expense) => {
              const category = categories.find(
                (cat) => cat.name === expense.category,
              );

              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {expense.description}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(expense.date, { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      style={{
                        backgroundColor: category?.color || "#666",
                        color: "white",
                      }}
                    >
                      {expense.category}
                    </Badge>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground">
                        {expense.currency?.symbol || "$"}
                        {expense.amount.toFixed(2)}{" "}
                        {expense.currency?.code !== "USD"
                          ? expense.currency?.code
                          : ""}
                      </span>
                      {onDeleteExpense && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDeleteExpense(expense.id)}
                        >
                          <X size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredExpenses.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No expenses found matching your filters
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default ExpenseList;
