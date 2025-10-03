import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Plus, X, Edit2, Save, RepeatIcon, ArrowLeftRight } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { TransferBalanceDialog } from "./TransferBalanceDialog";
import { useTranslation } from "react-i18next";

interface Category {
  id: string;
  name: string;
  color: string;
  budget: number;
  isRecurring?: boolean;
}

interface CategoryManagerProps {
  categories?: Category[];
  onAddCategory?: (category: Omit<Category, "id">) => Promise<void>;
  onUpdateCategory?: (id: string, updates: Partial<Category>) => Promise<void>;
  onDeleteCategory?: (id: string) => Promise<void>;
}

const CategoryManager = ({
  categories = [],
  onAddCategory = async () => {},
  onUpdateCategory = async () => {},
  onDeleteCategory = async () => {},
}: CategoryManagerProps) => {
  const { t } = useTranslation();
  const [editingCategory, setEditingCategory] = React.useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [newCategoryBudget, setNewCategoryBudget] = React.useState("");
  const [newCategoryColor, setNewCategoryColor] = React.useState("#3b82f6");
  const [newCategoryRecurring, setNewCategoryRecurring] = React.useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false);

  // Function to get the display name for a category
  const getCategoryDisplayName = (categoryName: string) => {
    return t(`dashboard.categories.${categoryName.toLowerCase()}`);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName || !newCategoryBudget) return;
    
    await onAddCategory({
      name: newCategoryName.toLowerCase().replace(/\s+/g, ''),
      budget: Number(newCategoryBudget),
      color: newCategoryColor,
      isRecurring: newCategoryRecurring,
    });
    
    setNewCategoryName("");
    setNewCategoryBudget("");
    setNewCategoryColor("#3b82f6");
    setNewCategoryRecurring(false);
    setIsCategoryDialogOpen(false);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Action Buttons - Properly contained within the card */}
      <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-100">
        <TransferBalanceDialog
          categories={categories}
          onTransfer={async (fromId, toId, amount) => {
            const fromCategory = categories.find((c) => c.id === fromId);
            const toCategory = categories.find((c) => c.id === toId);
            if (fromCategory && toCategory) {
              await onUpdateCategory(fromId, {
                budget: fromCategory.budget - amount,
              });
              await onUpdateCategory(toId, { budget: toCategory.budget + amount });
            }
          }}
          trigger={
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 hover:bg-blue-50 border-blue-200"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Transfer
            </Button>
          }
        />
        
        <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Create New Category
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category Name</label>
                <Input
                  placeholder="e.g., Groceries, Transportation"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="transition-all focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Monthly Budget</label>
                <Input
                  type="number"
                  placeholder="Enter budget amount"
                  value={newCategoryBudget}
                  onChange={(e) => setNewCategoryBudget(e.target.value)}
                  className="transition-all focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category Color</label>
                <Input
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="h-12 w-full cursor-pointer"
                />
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Checkbox
                  id="recurring"
                  checked={newCategoryRecurring}
                  onCheckedChange={(checked) =>
                    setNewCategoryRecurring(checked as boolean)
                  }
                />
                <div>
                  <label htmlFor="recurring" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Recurring Budget
                  </label>
                  <p className="text-xs text-gray-500">Budget resets automatically each month</p>
                </div>
              </div>
              <Button
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                onClick={handleAddCategory}
                disabled={!newCategoryName || !newCategoryBudget}
              >
                Create Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List - Contained with proper scrolling */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-2">
          <div className="space-y-3">
            {categories.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">No categories yet</h3>
                <p className="text-sm">Create your first category to start organizing expenses</p>
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="group p-4 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all duration-200"
                >
                  {editingCategory === category.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-600 block mb-1">Name</label>
                          <Input
                            value={category.name}
                            onChange={(e) =>
                              onUpdateCategory(category.id, { name: e.target.value.toLowerCase().replace(/\s+/g, '') })
                            }
                            className="text-sm h-8"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 block mb-1">Budget</label>
                          <Input
                            type="number"
                            value={category.budget.toString()}
                            onChange={(e) =>
                              onUpdateCategory(category.id, {
                                budget: Number(e.target.value),
                              })
                            }
                            className="text-sm h-8"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Input
                            type="color"
                            value={category.color}
                            onChange={(e) =>
                              onUpdateCategory(category.id, { color: e.target.value })
                            }
                            className="w-12 h-8 p-0 border-0"
                          />
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`recurring-${category.id}`}
                              checked={category.isRecurring}
                              onCheckedChange={(checked) =>
                                onUpdateCategory(category.id, {
                                  isRecurring: checked as boolean,
                                })
                              }
                            />
                            <label
                              htmlFor={`recurring-${category.id}`}
                              className="text-xs text-gray-600 cursor-pointer"
                            >
                              Recurring
                            </label>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setEditingCategory(null)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: category.color }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="secondary"
                              className="text-xs font-medium px-2 py-1"
                              style={{ 
                                backgroundColor: `${category.color}15`,
                                color: category.color,
                                border: `1px solid ${category.color}30`
                              }}
                            >
                              {getCategoryDisplayName(category.name)}
                            </Badge>
                            {category.isRecurring && (
                              <RepeatIcon className="w-3 h-3 text-blue-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Budget: <span className="font-semibold text-gray-900">${category.budget.toLocaleString()}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingCategory(category.id)}
                          className="text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteCategory(category.id)}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CategoryManager;
