import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CreditCard, Plus, DollarSign, Calendar, Percent } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import type { Debt } from "../../lib/store";

interface AddDebtDialogProps {
  onAddDebt: (debt: Omit<Debt, "id" | "createdDate">) => Promise<void>;
  trigger?: React.ReactNode;
}

const debtColors = [
  "#EF4444", // Red
  "#F97316", // Orange  
  "#EAB308", // Yellow
  "#22C55E", // Green
  "#3B82F6", // Blue
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#6B7280", // Gray
];

const debtTypes = [
  { value: "credit_card", label: "Credit Card", icon: CreditCard },
  { value: "loan", label: "Personal Loan", icon: DollarSign },
  { value: "mortgage", label: "Mortgage", icon: Calendar },
  { value: "student_loan", label: "Student Loan", icon: DollarSign },
  { value: "personal", label: "Personal Debt", icon: DollarSign },
  { value: "other", label: "Other", icon: DollarSign },
];

export function AddDebtDialog({ onAddDebt, trigger }: AddDebtDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    creditor: "",
    totalAmount: "",
    remainingAmount: "",
    interestRate: "",
    minimumPayment: "",
    dueDate: format(new Date(), "yyyy-MM-dd"),
    type: "credit_card" as const,
    color: debtColors[0],
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Debt name is required";
    }

    if (!formData.creditor.trim()) {
      newErrors.creditor = "Creditor is required";
    }

    const totalAmount = parseFloat(formData.totalAmount);
    if (!formData.totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      newErrors.totalAmount = "Valid total amount is required";
    }

    const remainingAmount = parseFloat(formData.remainingAmount);
    if (!formData.remainingAmount || isNaN(remainingAmount) || remainingAmount < 0) {
      newErrors.remainingAmount = "Valid remaining amount is required";
    }

    if (totalAmount && remainingAmount && remainingAmount > totalAmount) {
      newErrors.remainingAmount = "Remaining amount cannot exceed total amount";
    }

    const minimumPayment = parseFloat(formData.minimumPayment);
    if (!formData.minimumPayment || isNaN(minimumPayment) || minimumPayment <= 0) {
      newErrors.minimumPayment = "Valid minimum payment is required";
    }

    const interestRate = parseFloat(formData.interestRate);
    if (formData.interestRate && (isNaN(interestRate) || interestRate < 0 || interestRate > 100)) {
      newErrors.interestRate = "Interest rate must be between 0 and 100";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      const debtData = {
        name: formData.name.trim(),
        creditor: formData.creditor.trim(),
        totalAmount: parseFloat(formData.totalAmount),
        remainingAmount: parseFloat(formData.remainingAmount),
        interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
        minimumPayment: parseFloat(formData.minimumPayment),
        dueDate: new Date(formData.dueDate).toISOString(),
        type: formData.type,
        color: formData.color,
        description: formData.description.trim() || undefined,
      };

      await onAddDebt(debtData);
      
      // Reset form
      setFormData({
        name: "",
        creditor: "",
        totalAmount: "",
        remainingAmount: "",
        interestRate: "",
        minimumPayment: "",
        dueDate: format(new Date(), "yyyy-MM-dd"),
        type: "credit_card",
        color: debtColors[0],
        description: "",
      });
      setErrors({});
      setOpen(false);
    } catch (error) {
      console.error("Error adding debt:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (field: string, value: string) => {
    // Only allow numbers and decimal point
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 bg-red-600 hover:bg-red-700 text-white">
            <CreditCard className="w-4 h-4" />
            Add Debt
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-red-600" />
            Add New Debt
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Debt Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Chase Freedom Card"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditor">Creditor *</Label>
              <Input
                id="creditor"
                value={formData.creditor}
                onChange={(e) => handleInputChange("creditor", e.target.value)}
                placeholder="e.g., Chase Bank"
                className={errors.creditor ? "border-red-500" : ""}
              />
              {errors.creditor && <p className="text-sm text-red-600">{errors.creditor}</p>}
            </div>
          </div>

          {/* Debt Type and Color */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Debt Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select debt type" />
                </SelectTrigger>
                <SelectContent>
                  {debtTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2 pt-1">
                {debtColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleInputChange("color", color)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      formData.color === color
                        ? "border-gray-800 scale-110"
                        : "border-gray-300 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="totalAmount"
                  type="text"
                  value={formData.totalAmount}
                  onChange={(e) => handleAmountChange("totalAmount", e.target.value)}
                  placeholder="0.00"
                  className={`pl-9 ${errors.totalAmount ? "border-red-500" : ""}`}
                />
              </div>
              {errors.totalAmount && <p className="text-sm text-red-600">{errors.totalAmount}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="remainingAmount">Current Balance *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="remainingAmount"
                  type="text"
                  value={formData.remainingAmount}
                  onChange={(e) => handleAmountChange("remainingAmount", e.target.value)}
                  placeholder="0.00"
                  className={`pl-9 ${errors.remainingAmount ? "border-red-500" : ""}`}
                />
              </div>
              {errors.remainingAmount && <p className="text-sm text-red-600">{errors.remainingAmount}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minimumPayment">Minimum Payment *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="minimumPayment"
                  type="text"
                  value={formData.minimumPayment}
                  onChange={(e) => handleAmountChange("minimumPayment", e.target.value)}
                  placeholder="0.00"
                  className={`pl-9 ${errors.minimumPayment ? "border-red-500" : ""}`}
                />
              </div>
              {errors.minimumPayment && <p className="text-sm text-red-600">{errors.minimumPayment}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (% APR)</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="interestRate"
                  type="text"
                  value={formData.interestRate}
                  onChange={(e) => handleAmountChange("interestRate", e.target.value)}
                  placeholder="0.00"
                  className={`pl-9 ${errors.interestRate ? "border-red-500" : ""}`}
                />
              </div>
              {errors.interestRate && <p className="text-sm text-red-600">{errors.interestRate}</p>}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Next Payment Due *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                className={`pl-9 ${errors.dueDate ? "border-red-500" : ""}`}
              />
            </div>
            {errors.dueDate && <p className="text-sm text-red-600">{errors.dueDate}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Additional notes about this debt..."
              rows={3}
            />
          </div>

          {/* Preview */}
          {formData.name && formData.totalAmount && formData.remainingAmount && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${formData.color}20`, color: formData.color }}
                >
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{formData.name}</p>
                  <p className="text-sm text-gray-600">
                    ${formData.remainingAmount} of ${formData.totalAmount} remaining
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                "Adding..."
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Debt
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}