import React from "react";
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { PlusCircle, Upload, RepeatIcon, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface ExpenseFormProps {
  open?: boolean;
  onSubmit?: (data: ExpenseData) => void;
  categories?: Array<{
    id: string;
    name: string;
    isRecurring?: boolean;
  }>;
}

interface ExpenseData {
  amount: number;
  category: string;
  description: string;
  receipt?: string;
  isRecurring?: boolean;
  recurringType?: "weekly" | "monthly";
}

const defaultCategories = [
  { id: "1", name: "Groceries", isRecurring: false },
  { id: "2", name: "Utilities", isRecurring: true },
  { id: "3", name: "Kids's Activities", isRecurring: false },
  { id: "4", name: "Transportation", isRecurring: true },
  { id: "5", name: "Entertainment", isRecurring: false },
  { id: "6", name: "Shopping", isRecurring: false },
];

const ExpenseForm = ({
  open: controlledOpen,
  onSubmit = () => {},
  categories = defaultCategories,
}: ExpenseFormProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(controlledOpen ?? false);
  const [amount, setAmount] = React.useState("");
  const [category, setCategory] = React.useState(categories[0]?.name || "");
  const [description, setDescription] = React.useState("");
  const [isRecurring, setIsRecurring] = React.useState(false);
  const [recurringType, setRecurringType] = React.useState<
    "weekly" | "monthly"
  >("monthly");
  const [receipt, setReceipt] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const selectedCategory = categories.find((cat) => cat.name === category);

  React.useEffect(() => {
    if (selectedCategory) {
      setIsRecurring(selectedCategory.isRecurring || false);
    }
  }, [category, selectedCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !description) return;

    let receiptData = null;
    if (receipt) {
      receiptData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(receipt);
      });
    }

    onSubmit({
      amount: Number(amount),
      category,
      description,
      receipt: receiptData as string,
      isRecurring,
      recurringType: isRecurring ? recurringType : undefined,
    });

    // Reset form
    setAmount("");
    setCategory(categories[0]?.name || "");
    setDescription("");
    setIsRecurring(false);
    setRecurringType("monthly");
    setReceipt(null);
    setPreviewUrl(null);
    setOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size must be less than 5MB");
        return;
      }
      setReceipt(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveReceipt = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setReceipt(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#556B2F] font-semibold">
          <PlusCircle className="w-4 h-4" />
          {t('dashboard.header.buttons.addExpense')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category">
                  {category}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    <span className="flex items-center gap-2">
                      {cat.name}
                      {cat.isRecurring && (
                        <RepeatIcon className="w-4 h-4 text-blue-500" />
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter expense description"
              className="resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={isRecurring}
                onCheckedChange={(checked) =>
                  setIsRecurring(checked as boolean)
                }
              />
              <label
                htmlFor="recurring"
                className="text-sm font-medium leading-none"
              >
                Recurring Expense
              </label>
            </div>

            {isRecurring && (
              <RadioGroup
                value={recurringType}
                onValueChange={(value) =>
                  setRecurringType(value as "weekly" | "monthly")
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Weekly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Monthly</Label>
                </div>
              </RadioGroup>
            )}
          </div>

          <div className="space-y-2">
            <Label>Receipt (Optional)</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="receipt-upload"
                onChange={handleFileChange}
              />
              <label
                htmlFor="receipt-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                {previewUrl ? (
                  <div className="relative w-full">
                    <img
                      src={previewUrl}
                      alt="Receipt preview"
                      className="max-h-32 rounded-lg mx-auto"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleRemoveReceipt}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload receipt image (max 5MB)
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Expense</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseForm;
