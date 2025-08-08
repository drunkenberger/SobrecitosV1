import React from "react";
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
import { AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";
import { useTranslation } from "react-i18next";

interface Category {
  id: string;
  name: string;
  color: string;
  budget: number;
  isRecurring?: boolean;
}

interface TransferBalanceDialogProps {
  categories: Category[];
  onTransfer: (fromId: string, toId: string, amount: number) => void;
  trigger?: React.ReactNode;
}

export function TransferBalanceDialog({
  categories,
  onTransfer,
  trigger,
}: TransferBalanceDialogProps) {
  const { t } = useTranslation();
  const [fromCategory, setFromCategory] = React.useState<string>("");
  const [toCategory, setToCategory] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  // Function to get the display name for a category
  const getCategoryDisplayName = (categoryName: string) => {
    return t(`dashboard.categories.${categoryName.toLowerCase()}`);
  };

  const handleTransfer = () => {
    if (!fromCategory || !toCategory || !amount) {
      setError(t('common.error.fillAllFields'));
      return;
    }

    const fromCat = categories.find((c) => c.id === fromCategory);
    if (!fromCat || fromCat.budget < Number(amount)) {
      setError(t('common.error.insufficientBalance'));
      return;
    }

    onTransfer(fromCategory, toCategory, Number(amount));
    setFromCategory("");
    setToCategory("");
    setAmount("");
    setError("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="flex items-center gap-2">
            {t('dashboard.categoryManagement.transferBalance')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dashboard.categoryManagement.transfer.title')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>{t('dashboard.categoryManagement.transfer.from')}</Label>
            <Select value={fromCategory} onValueChange={setFromCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t('dashboard.categoryManagement.transfer.from')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {getCategoryDisplayName(category.name)} (${category.budget.toFixed(2)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('dashboard.categoryManagement.transfer.to')}</Label>
            <Select value={toCategory} onValueChange={setToCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t('dashboard.categoryManagement.transfer.to')} />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((c) => c.id !== fromCategory)
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {getCategoryDisplayName(category.name)} (${category.budget.toFixed(2)})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('dashboard.categoryManagement.transfer.amount')}</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button onClick={handleTransfer} className="w-full">
            {t('dashboard.categoryManagement.transfer.button')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
