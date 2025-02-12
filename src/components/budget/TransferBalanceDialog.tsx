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

interface Category {
  id: string;
  name: string;
  budget: number;
  color: string;
}

interface TransferBalanceDialogProps {
  categories: Category[];
  onTransfer: (fromId: string, toId: string, amount: number) => void;
}

export function TransferBalanceDialog({
  categories,
  onTransfer,
}: TransferBalanceDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [fromCategory, setFromCategory] = React.useState("");
  const [toCategory, setToCategory] = React.useState("");
  const [amount, setAmount] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromCategory || !toCategory || !amount) return;

    onTransfer(fromCategory, toCategory, Number(amount));
    setOpen(false);
    setFromCategory("");
    setToCategory("");
    setAmount("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#556B2F] font-semibold">
          Transfer Balance
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Category Balance</DialogTitle>
        </DialogHeader>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Transferring balances between categories should be used sparingly as
            it can affect your budget planning. Consider reviewing your budget
            allocations instead.
          </AlertDescription>
        </Alert>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>From Category</Label>
            <Select value={fromCategory} onValueChange={setFromCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select source category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name} (${cat.budget})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>To Category</Label>
            <Select value={toCategory} onValueChange={setToCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination category" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((cat) => cat.id !== fromCategory)
                  .map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name} (${cat.budget})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Amount ($)</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Transfer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
