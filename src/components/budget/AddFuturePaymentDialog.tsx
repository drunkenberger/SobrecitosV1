import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Plus } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useTranslation } from "react-i18next";

interface AddFuturePaymentDialogProps {
  onAddPayment: (payment: {
    description: string;
    amount: number;
    dueDate: Date;
    category: string;
  }) => Promise<void>;
  categories: string[];
  trigger?: React.ReactNode;
}

export function AddFuturePaymentDialog({
  onAddPayment,
  categories,
  trigger,
}: AddFuturePaymentDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addCategory = useStore((state) => state.addCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!description || !amount || !dueDate || !category) return;

    try {
      setIsSubmitting(true);
      await onAddPayment({
        description,
        amount: Number(amount),
        dueDate: new Date(dueDate),
        category,
      });

      // Reset form
      setDescription("");
      setAmount("");
      setDueDate("");
      setCategory("");
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#556B2F] font-semibold">
            <PlusCircle className="w-4 h-4" />
            {t('dashboard.payments.calendar.addButton')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dashboard.payments.calendar.schedulePayment')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">{t('dashboard.payments.calendar.description')}</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('dashboard.payments.calendar.descriptionPlaceholder')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">{t('dashboard.payments.calendar.amount')}</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">{t('dashboard.payments.calendar.dueDate')}</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">{t('dashboard.payments.calendar.category')}</Label>
            <div className="flex gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={t('dashboard.payments.calendar.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {t(`dashboard.categories.${cat.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={async () => {
                  const name = prompt(t('dashboard.payments.calendar.addCategory'));
                  if (name) {
                    await addCategory({
                      name,
                      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                      budget: 0,
                    });
                    setCategory(name);
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('common.save') : t('dashboard.payments.calendar.addPayment')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
