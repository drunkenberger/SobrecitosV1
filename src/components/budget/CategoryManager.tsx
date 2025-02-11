import React from "react";
import { Card } from "../ui/card";
import { Tags } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Plus, X, Edit2, Save, RepeatIcon } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface Category {
  id: string;
  name: string;
  color: string;
  budget: number;
  isRecurring?: boolean;
}

interface CategoryManagerProps {
  categories?: Category[];
  onAddCategory?: (category: Omit<Category, "id">) => void;
  onEditCategory?: (id: string, category: Partial<Category>) => void;
  onDeleteCategory?: (id: string) => void;
}

const defaultCategories: Category[] = [
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
];

const CategoryManager = ({
  categories = defaultCategories,
  onAddCategory = () => {},
  onEditCategory = () => {},
  onDeleteCategory = () => {},
}: CategoryManagerProps) => {
  const [editingCategory, setEditingCategory] = React.useState<string | null>(
    null,
  );
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [newCategoryBudget, setNewCategoryBudget] = React.useState("");
  const [newCategoryColor, setNewCategoryColor] = React.useState("#000000");
  const [newCategoryRecurring, setNewCategoryRecurring] = React.useState(false);

  return (
    <Card className="w-full h-[400px] p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
          <Tags className="w-6 h-6" /> Category Management
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#556B2F] font-semibold">
              <Plus size={16} />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Input
                  placeholder="Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Budget Amount"
                  value={newCategoryBudget}
                  onChange={(e) => setNewCategoryBudget(e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="h-10 w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recurring"
                  checked={newCategoryRecurring}
                  onCheckedChange={(checked) =>
                    setNewCategoryRecurring(checked as boolean)
                  }
                />
                <label
                  htmlFor="recurring"
                  className="text-sm font-medium leading-none text-foreground"
                >
                  Recurring Monthly Expense
                </label>
              </div>
              <Button
                className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#556B2F] font-semibold"
                onClick={() => {
                  onAddCategory({
                    name: newCategoryName,
                    budget: Number(newCategoryBudget),
                    color: newCategoryColor,
                    isRecurring: newCategoryRecurring,
                  });
                  setNewCategoryName("");
                  setNewCategoryBudget("");
                  setNewCategoryColor("#000000");
                  setNewCategoryRecurring(false);
                }}
              >
                Add Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 border rounded-lg border-border bg-card"
            >
              {editingCategory === category.id ? (
                <div className="flex items-center gap-4 flex-1">
                  <Input
                    value={category.name}
                    onChange={(e) =>
                      onEditCategory(category.id, { name: e.target.value })
                    }
                    className="w-1/3"
                  />
                  <Input
                    type="number"
                    value={category.budget}
                    onChange={(e) =>
                      onEditCategory(category.id, {
                        budget: Number(e.target.value),
                      })
                    }
                    className="w-1/3"
                  />
                  <Input
                    type="color"
                    value={category.color}
                    onChange={(e) =>
                      onEditCategory(category.id, { color: e.target.value })
                    }
                    className="w-20"
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`recurring-${category.id}`}
                      checked={category.isRecurring}
                      onCheckedChange={(checked) =>
                        onEditCategory(category.id, {
                          isRecurring: checked as boolean,
                        })
                      }
                    />
                    <label
                      htmlFor={`recurring-${category.id}`}
                      className="text-sm font-medium leading-none text-foreground"
                    >
                      Recurring
                    </label>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditingCategory(null)}
                  >
                    <Save size={16} />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Badge
                      style={{ backgroundColor: category.color }}
                      className="text-white dark:text-black font-semibold"
                    >
                      {category.name}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ${category.budget.toFixed(2)}
                    </span>
                    {category.isRecurring && (
                      <RepeatIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingCategory(category.id)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDeleteCategory(category.id)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default CategoryManager;
